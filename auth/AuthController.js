const passport = require('passport');
const bcrypt   = require('bcrypt');
const models   = require('../models');

module.exports.create = function(request, response) {

  let user;
  let email = request.body.email;
  let password  = request.body.password;

  request.checkBody('email', 'email is not valid').isEmail();
  request.checkBody('password', 'password length must be minimum 8 characters').isLength(8, 20);
  request.checkBody('password', 'password is required').notEmpty();

  let errors = request.validationErrors();

  if (errors) {
    response.render('/sign-up', {
      errors: errors
    });
  } else {
    user = new models.User({
      email: email,
      password: password
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return response.send(err);
        }
        user.password = hash;
        user.save((err) => {
          if (err) {
            return response.send(err);
          } else {

          }
        });
        return response.redirect('/');
      });
    });
   }
};

module.exports.login = function(request, response, next) {
  passport.authenticate('local', {
    successRedirect: '/lobby',
    failureRedirect: '/login'
  })(request, response, next);
};

module.exports.logout = function(request, response, next) {
  request.logout();
  response.redirect('/');
};

module.exports.isAuthenticated = function(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect('/');
}