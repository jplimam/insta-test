const express = require('express');
const user = require('./controllers/user');
const login = require('./controllers/login');
const verifyLogin = require('./middlewares/verifyLogin')

const router = express();

//signup
router.post('/signup', user.signUp);

//login
router.post('/login', login.login);

// verify middleware
router.use(verifyLogin);

//get and update user profile
router.get('/profile', user.getProfile);
router.put('/profile', user.updateProfile);

module.exports = router;