const express = require('express');
const usersController = require('../controllers/Users');
const taskController = require('../controllers/Task');
const MiddleWare = require('./Middleware');
const router = express.Router();

router.post("/login", usersController.login);
router.post("/signup", usersController.create);
router.post("/forgot-password", usersController.forgotPassword);
router.post("/task", MiddleWare.authorization, taskController.create);
router.get("/task", MiddleWare.authorization, taskController.getAll);
router.put("/task/:id", MiddleWare.authorization, taskController.update);
router.put("/update_token", MiddleWare.authorization, usersController.update_token);
router.delete("/task/:id", MiddleWare.authorization, taskController.delete);

module.exports = router;
