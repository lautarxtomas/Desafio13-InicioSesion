const router = require('express').Router()
const passport = require('passport')
const { getIndex, getLogin, getSignup, postLogin, postSignup, getFailLogin, getFailSignup, getLogout, failRoute } = require('../controllers/controller')
const checkAuthentication = require('../middlewares/auth')


// Index
router.get('/', checkAuthentication, getIndex)

// Login
router.get('/login', getLogin)
router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), postLogin)
router.get('/faillogin', getFailLogin)

// Signup
router.get('/signup', getSignup)
router.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), postSignup)
router.get('/failsignup', getFailSignup)

// Redirect to login & signup
router.post('/redirect-signup', (req, res) => res.redirect('/signup'))
router.post('/redirect-login', (req, res) => res.redirect('/login'))

// Logout
router.post('/logout', getLogout)

// Fail route
router.get('*', failRoute)


module.exports = router








// VIEJO

// const { form, home, destroy } = require('../controllers/controller')
// const login = require('../middlewares/auth')

// router.get('/', login, form)
// router.post('/home', home)
// router.post('/logout', destroy)

// module.exports = router