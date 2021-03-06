var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

var User = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },

  function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
    User.findOne({ 'googleId': profile.id }, function(err, user) {
      if (err) return cb(err);
      console.log('1.')
      if (user) {
        return cb(null, user);
      } else {
        var newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          imageUrl: profile.photos[0].value.slice(0, profile.photos[0].value.length-2)+'200'
        });
        console.log('2.')
        newUser.save(function(err) {
          console.log('2.5.')
          if (err) return cb(err);
          return cb(null, newUser);
        });
        console.log('3.')
      }
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

  passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
