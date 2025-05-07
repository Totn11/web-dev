const errorTypes = {
    ValidationError: 'VALIDATION_ERROR',
    AuthenticationError: 'AUTH_ERROR',
    NotFoundError: 'NOT_FOUND',
    DatabaseError: 'DB_ERROR',
    GeneralError: 'GENERAL_ERROR'
};

class AppError extends Error {
    constructor(message, type, statusCode, details = null) {
        super(message);
        this.type = type;
        this.statusCode = statusCode;
        this.details = details;
    }
}

const handleMongooseError = (err) => {
    if (err.name === 'ValidationError') {
        const details = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }));
        return new AppError(
            'Validation failed',
            errorTypes.ValidationError,
            400,
            details
        );
    }
    if (err.name === 'CastError') {
        return new AppError(
            'Invalid data format',
            errorTypes.ValidationError,
            400
        );
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return new AppError(
            `Duplicate ${field} value`,
            errorTypes.ValidationError,
            400
        );
    }
    return new AppError(
        'Database operation failed',
        errorTypes.DatabaseError,
        500
    );
};

const errorLogger = (err) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        type: err.type || 'UNKNOWN',
        message: err.message,
        stack: err.stack,
        details: err.details || null
    };
    
    // In production, you might want to use a proper logging service
    console.error(JSON.stringify(logEntry, null, 2));
};

const formatErrorResponse = (err) => {
    const response = {
        success: false,
        error: {
            type: err.type || errorTypes.GeneralError,
            message: err.message
        }
    };

    if (err.details) {
        response.error.details = err.details;
    }

    if (process.env.NODE_ENV === 'development') {
        response.error.stack = err.stack;
    }

    return response;
};

const globalErrorHandler = (err, req, res, next) => {
    let processedError = err;

    // Convert Mongoose errors to AppError format
    if (err.name && ['ValidationError', 'CastError'].includes(err.name)) {
        processedError = handleMongooseError(err);
    }

    // Log the error
    errorLogger(processedError);

    // Set default status code if not set
    const statusCode = processedError.statusCode || 500;

    // Format and send response
    const errorResponse = formatErrorResponse(processedError);
    res.status(statusCode).json(errorResponse);
};

const notFoundHandler = (req, res, next) => {
    const err = new AppError(
        `Cannot ${req.method} ${req.originalUrl}`,
        errorTypes.NotFoundError,
        404
    );
    next(err);
};

export {
    AppError,
    errorTypes,
    globalErrorHandler,
    notFoundHandler
};