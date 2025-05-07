import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext(null);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'SIGN_IN':
            return {
                ...state,
                isAuthenticated: true,
                userInfo: action.payload.user,
                accessToken: action.payload.token,
                userRole: action.payload.user.role
            };
        case 'REFRESH_SESSION':
            return {
                ...state,
                accessToken: action.payload.token
            };
        case 'SIGN_OUT':
            return {
                isAuthenticated: false,
                userInfo: null,
                accessToken: null,
                userRole: null
            };
        default:
            return state;
    }
};

export function AuthProvider({ children }) {
    const [authState, dispatch] = useReducer(authReducer, {
        isAuthenticated: false,
        userInfo: null,
        accessToken: null,
        userRole: null
    });

    useEffect(() => {
        const validateSession = async () => {
            const storedToken = localStorage.getItem('_authToken');
            const storedUser = localStorage.getItem('_userInfo');

            if (storedToken && storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    dispatch({
                        type: 'SIGN_IN',
                        payload: { token: storedToken, user }
                    });
                } catch (err) {
                    localStorage.removeItem('_authToken');
                    localStorage.removeItem('_userInfo');
                }
            }
        };

        validateSession();
    }, []);

    const authenticateUser = (userData, token) => {
        localStorage.setItem('_authToken', token);
        localStorage.setItem('_userInfo', JSON.stringify(userData));
        
        dispatch({
            type: 'SIGN_IN',
            payload: { user: userData, token }
        });
    };

    const updateSession = (newToken) => {
        localStorage.setItem('_authToken', newToken);
        
        dispatch({
            type: 'REFRESH_SESSION',
            payload: { token: newToken }
        });
    };

    const terminateSession = () => {
        localStorage.removeItem('_authToken');
        localStorage.removeItem('_userInfo');
        
        dispatch({ type: 'SIGN_OUT' });
    };

    const checkPermission = (requiredRole) => {
        return authState.userRole === requiredRole;
    };

    return (
        <AuthContext.Provider value={{
            authState,
            authenticateUser,
            updateSession,
            terminateSession,
            checkPermission
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};