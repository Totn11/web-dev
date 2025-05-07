import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const verifyAccess = {
    validateSession: async (req, res, next) => {
        const authHeader = req.headers?.authorization;
        let accessKey;

        if (authHeader?.startsWith('Bearer')) {
            try {
                accessKey = authHeader.split(' ')[1];
                const decodedData = jwt.verify(accessKey, process.env.JWT_SECRET);
                
                const userDetails = await User
                    .findById(decodedData.id)
                    .select('-password -__v');
                
                if (!userDetails) {
                    return res.status(401).json({ 
                        status: 'error',
                        message: 'Session expired' 
                    });
                }

                req.currentUser = userDetails;
                next();
            } catch (error) {
                console.log('Auth validation error:', error?.message);
                return res.status(401).json({ 
                    status: 'error',
                    message: 'Invalid session' 
                });
            }
        } else {
            res.status(401).json({ 
                status: 'error',
                message: 'Access denied' 
            });
        }
    },

    checkAdminRights: (req, res, next) => {
        if (req.currentUser?.role !== 'admin') {
            return res.status(403).json({ 
                status: 'error',
                message: 'Insufficient privileges' 
            });
        }
        next();
    }
};

export default verifyAccess;