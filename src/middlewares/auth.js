const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/User')

const login = (req, res, next) => {
	if (req.session?.name) {
		next();
	} else {
		res.render('../views/login.handlebars');
	}
}

module.exports = login;


// ---- NUEVO ----