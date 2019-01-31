const app = require("express");
const router = app.Router();
const field_checkauth =  require('../middleware/field-check-auth');

const SignUp = require('../controllers/user/auth/signup');
const Login = require('../controllers/user/auth/login');
const FieldEngineerData = require('../controllers/user/fieldEngineer/fieldEngineer');

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/setfieldengdata", field_checkauth, FieldEngineerData.postFieldEngineerLocation);
module.exports = router;