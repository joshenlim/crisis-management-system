// if (process.env.BROWSER) {
//   throw new Error(
//     'Do not import `config.js` from inside the client-side code.',
//   );
// }

require('dotenv').config();

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // https://expressjs.com/en/guide/behind-proxies.html
  trustProxy: process.env.TRUST_PROXY || 'loopback',

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.PORT || 3000}`,
  },

  // Database
  databaseUrl: process.env.DATABASE_URL || 'sqlite:database.sqlite',

  // MYSQL Database
  mysql_config: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    multipleStatements: true,
  },

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

  session: {
    cookieKey: 'crisis',
    // jwtSecret: process.emitWarning.JWT_SESSION_KEY // make this to env var
  },

  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_KEY,
  },

  // Authentication
  auth: {
    jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },
  },
};
