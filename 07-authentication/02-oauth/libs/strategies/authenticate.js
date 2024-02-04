const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  let user = await User.findOne({ email });
  if (user) {
    return done(null, user);
  }

  try {
    let user = new User({ email, displayName });
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};
