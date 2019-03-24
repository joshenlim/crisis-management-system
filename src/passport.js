import bcrypt from 'bcrypt-nodejs';
import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';

import config from './config';
import MySQLDB from './database';

const database = new MySQLDB(config.mysql_config);
database.connect();

passport.serializeUser((data, cb) => {
  cb(null, data);
});

passport.deserializeUser(async(data, cb) => {
  const policies = await database.getPolicies(data.role_id);
  const userPolicies = policies.map(policy => policy.name);
  const userProfile = {
    ...data,
    policies: userPolicies
  }
  cb(null, userProfile)
});

passport.use('local-login', new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, username, password, done) => {
    const user = await database.getStaff(username);
    if (!user.length) {
      return done(null, false, 'User not found, try another set of credentials!');
    }
    if (!bcrypt.compareSync(password, user[0].password)) {
      return done(null, false, 'You\'ve entered a wrong password!');
    }
    return done(null, {
      id: user[0].id,
      name: user[0].name,
      rank: user[0].s_rank,
      role_id: user[0].role_id,
      role: user[0].role
    });
  })
);

export default passport;
