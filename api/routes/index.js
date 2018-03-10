var express = require('express');
var router = express.Router();

var tasksCtrl = require('../controllers/tasks.controller.js')
var usersCtrl = require('../controllers/users.controller.js')

router
	.route('/login')
	.post(usersCtrl.userLogin);

router
	.route('/register')
	.post(usersCtrl.userRegister);

router
	.route('/todo/tasks')
	.get(usersCtrl.authenticate,tasksCtrl.getAllTasks)
	.post(usersCtrl.authenticate,tasksCtrl.addTask);

router
	.route('/todo/tasks/:taskid')
	.delete(usersCtrl.authenticate,tasksCtrl.deleteTask);


module.exports = router;