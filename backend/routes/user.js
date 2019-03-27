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
router.post("/set-task", support_checkauth, Task.postNewTask);
router.get("/assign-eng/:taskId",support_checkauth, Task.assignEng);
router.get("/getfieldengdata", field_checkauth, FieldEngineerData.getfieldengdata);
router.get("/check-out/:taskId", field_checkauth, Task.checkout);
//customer 


//router.get("/assign-eng", support_checkauth, Task.getAssignedEngineer)
module.exports = router;