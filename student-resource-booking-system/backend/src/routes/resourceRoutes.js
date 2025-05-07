// backend/src/routes/resourceRoutes.js

import express from 'express';
import verifyAccess from '../middleware/authMiddleware.js';
import manageResources from '../controllers/resourceController.js';

const router = express.Router();

// Initialize routes with custom naming
const setupResourceRoutes = () => {
    // Get all resources
    router.get(
        '/list', 
        verifyAccess.validateSession,
        manageResources.fetchAll
    );

    // Add new resource
    router.post(
        '/create',
        verifyAccess.validateSession,
        verifyAccess.checkAdminRights,
        manageResources.addNew
    );

    // Update existing resource
    router.put(
        '/update/:id',
        verifyAccess.validateSession,
        verifyAccess.checkAdminRights,
        manageResources.modifyExisting
    );

    // Remove resource
    router.delete(
        '/remove/:id',
        verifyAccess.validateSession,
        verifyAccess.checkAdminRights,
        manageResources.removeItem
    );
};

setupResourceRoutes();

export default router;