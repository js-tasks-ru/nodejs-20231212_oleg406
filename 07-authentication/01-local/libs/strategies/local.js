const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
      User.findOne({ email }, async (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          done(null, false, 'Нет такого пользователя');
        } else {
          const result = await user.checkPassword(password);
          if (!result) {
            return done(null, false, 'Неверный пароль');
          }
        }
      
        return done(null, user);
      });
    },
);
