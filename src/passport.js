import bcrypt from 'bcrypt-nodejs';
import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';

import config from './config';
import MySQLDB from './database';

// const MySQLDB = require('./database');

// import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { User, UserLogin, UserClaim, UserProfile } from './data/models';
// import config from './config';

const database = new MySQLDB(config.mysql_config);
database.connect();

passport.serializeUser((data, cb) => {
  cb(null, data);
});

passport.deserializeUser((data, cb) => {
  /**
   * TO-DO: Create a class to handle MYSQL access
   *        Implement bcrypt for password storage and reading
   */

  // const userId = data.user.id
  // const user = data.clientId
    // ? database.findUser(userId).filter(item => {
    //   return item.client_id == data.clientId;
    // })
    // : database.findUser(userId)
  // const policies = {}
  // for (const i in user) {
  //   policies[user[i].resource] = user[i].access
  // }
  // const clientId = data.clientId || user[0].client_id;
  // const clientName = data.clientName || user[0].client_name;
  // const role = data.clientId
  //   ? user.filter(item => {
  //     return item.client_id == clientId
  //   })[0].role
  //   : user[0].role
  // const userClientActive = data.userClientActive || user[0].userClientActivated;
  // const userProfile = {
  //   id: userId,
  //   email: user[0].email,
  //   name: user[0].name,
  //   role: role,
  //   clientId: clientId,
  //   clientName: clientName,
  //   userClientActivated: userClientActive,
  //   activated: user[0].activated,
  //   policies: policies
  // }
  console.log("Deserialize: ", data);
  const userProfile = {
    name: 'Joshen'
  }
  cb(null, userProfile)
});

/**
 * Sign in locally
 */
passport.use('local-login', new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, username, password, done) => {
    // const user = database.findUserByEmail(email);
    // if (!user.length) {
    //   return done(null, false, 'User not found, try another set of credentials!');
    // }
    // if (!authUtils.validPassword(password, user[0].password)) {
    //   return done(null, false, 'You\'ve entered a wrong password!');
    // }
    // const updateLoggedIn = database.updateLastLoggedIn(email, date.current());

    /**
     *  generateHash: function(password) {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        },

        validPassword: function(password, hash) {
          return bcrypt.compareSync(password, hash);
        }
     */

    if (username !== 'admin' && password !== 'password') {
      return done(null, false, 'User not found, try another set of credentials!');
    }

    console.log("Passport local login");
    console.log("Username:", username);
    console.log("Password:", password)
    console.log("Hashed:", bcrypt.hashSync(password, bcrypt.genSaltSync(8), null))

    return done(null, {
      user: {
        name: 'admin'
      }
      // user: user[0],
      // clientId: req.body.clientId,
      // clientName: req.body.clientName,
      // userClientActive: req.body.userClientActive,
    });
  })
);


/**
 * Sign in with Facebook.
 */
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: config.auth.facebook.id,
//       clientSecret: config.auth.facebook.secret,
//       callbackURL: '/login/facebook/return',
//       profileFields: [
//         'displayName',
//         'name',
//         'email',
//         'link',
//         'locale',
//         'timezone',
//       ],
//       passReqToCallback: true,
//     },
//     (req, accessToken, refreshToken, profile, done) => {
//       /* eslint-disable no-underscore-dangle */
//       const loginName = 'facebook';
//       const claimType = 'urn:facebook:access_token';
//       const fooBar = async () => {
//         if (req.user) {
//           const userLogin = await UserLogin.findOne({
//             attributes: ['name', 'key'],
//             where: { name: loginName, key: profile.id },
//           });
//           if (userLogin) {
//             // There is already a Facebook account that belongs to you.
//             // Sign in with that account or delete it, then link it with your current account.
//             done();
//           } else {
//             const user = await User.create(
//               {
//                 id: req.user.id,
//                 email: profile._json.email,
//                 logins: [{ name: loginName, key: profile.id }],
//                 claims: [{ type: claimType, value: profile.id }],
//                 profile: {
//                   displayName: profile.displayName,
//                   gender: profile._json.gender,
//                   picture: `https://graph.facebook.com/${
//                     profile.id
//                   }/picture?type=large`,
//                 },
//               },
//               {
//                 include: [
//                   { model: UserLogin, as: 'logins' },
//                   { model: UserClaim, as: 'claims' },
//                   { model: UserProfile, as: 'profile' },
//                 ],
//               },
//             );
//             done(null, {
//               id: user.id,
//               email: user.email,
//             });
//           }
//         } else {
//           const users = await User.findAll({
//             attributes: ['id', 'email'],
//             where: { '$logins.name$': loginName, '$logins.key$': profile.id },
//             include: [
//               {
//                 attributes: ['name', 'key'],
//                 model: UserLogin,
//                 as: 'logins',
//                 required: true,
//               },
//             ],
//           });
//           if (users.length) {
//             const user = users[0].get({ plain: true });
//             done(null, user);
//           } else {
//             let user = await User.findOne({
//               where: { email: profile._json.email },
//             });
//             if (user) {
//               // There is already an account using this email address. Sign in to
//               // that account and link it with Facebook manually from Account Settings.
//               done(null);
//             } else {
//               user = await User.create(
//                 {
//                   email: profile._json.email,
//                   emailConfirmed: true,
//                   logins: [{ name: loginName, key: profile.id }],
//                   claims: [{ type: claimType, value: accessToken }],
//                   profile: {
//                     displayName: profile.displayName,
//                     gender: profile._json.gender,
//                     picture: `https://graph.facebook.com/${
//                       profile.id
//                     }/picture?type=large`,
//                   },
//                 },
//                 {
//                   include: [
//                     { model: UserLogin, as: 'logins' },
//                     { model: UserClaim, as: 'claims' },
//                     { model: UserProfile, as: 'profile' },
//                   ],
//                 },
//               );
//               done(null, {
//                 id: user.id,
//                 email: user.email,
//               });
//             }
//           }
//         }
//       };

//       fooBar().catch(done);
//     },
//   ),
// );

export default passport;
