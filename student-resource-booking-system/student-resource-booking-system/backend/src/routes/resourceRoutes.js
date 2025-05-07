// backend/src/routes/resourceRoutes.js

const express = require('express');
const ResourceController = require('../controllers/resourceController');

const router = express.Router();
const resourceController = new ResourceController();

const setRoutes = () => {
    router.post('/resources', resourceController.createResource);
    router.get('/resources', resourceController.getResources);
    router.get('/resources/:id', resourceController.getResourceById);
    router.put('/resources/:id', resourceController.updateResource);
    router.delete('/resources/:id', resourceController.deleteResource);
};

setRoutes();

module.exports = router;