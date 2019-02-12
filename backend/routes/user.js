const app = require("express");
const router = app.Router();
const field_checkauth = require('../middleware/field-check-auth');
const support_checkauth = require('../middleware/support-check-auth');

const SignUp = require('../controllers/user/auth/signup');
const Login = require('../controllers/user/auth/login');
const FieldEngineerData = require('../controllers/user/fieldEngineer/fieldEngineer');
const Task = require('../controllers/task.js');

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/setfieldengdata", field_checkauth, FieldEngineerData.postFieldEngineerLocation);

//customer 

router.post("/set-task", support_checkauth, Task.postNewTask);
router.get("/get-task", support_checkauth, Task.getTaskWithAssignedEngineer);
module.exports = router;