const express = require("express");
// const verifyAccess = require("../middleware/authMiddleware");
// const { validateResource } = require("../middleware/validationMiddleware");
const {
  fetchAll,
  addNew,
  modifyExisting,
  removeItem
} = require("../controllers/resourceController");

const router = express.Router();

  // Get all resources
  router.get("/list", fetchAll);

  // Add new resource
  router.post("/create",addNew);

  // Update existing resource
  router.put("/update/:id", modifyExisting);

  // Remove resource
  router.delete("/remove/:id", removeItem);

module.exports = router;
