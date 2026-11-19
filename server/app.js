require('dotenv').config();
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const express = require('express');
const app = express();

app.enable('trust proxy');
const { clientUrl } = require('./constants');
require('./middleware/auth');

const allowedOrigins = [
  clientUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  }
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 100 * process.env.SESSION_AGE,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_SESSION_URL })
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/v1/status', (req, res) => {
  res.status(200).json({ status: 'success' });
});
app.get('/v1/status', (req, res) => {
  res.status(200).json({ status: 'success' });
});

const usersRoutes = require('./routes/usersRoutes');
const artifactsRoutes = require('./routes/artifactsRoutes');
const globalErrorHandler = require('./middleware/error');

app.use('/api/v1/users', usersRoutes);
app.use('/v1/users', usersRoutes);
app.use('/api/v1/artifacts', artifactsRoutes);
app.use('/v1/artifacts', artifactsRoutes);
app.use(globalErrorHandler);

module.exports = app;
