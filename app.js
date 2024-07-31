const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanatize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const errHandler = require('./controllers/errorController');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
//GLOBAL MIDDLEWARE ///////////////////////////////
//http security

const scriptSrcUrls = ['https://unpkg.com/', 'https://tile.openstreetmap.org'];
const styleSrcUrls = ['https://unpkg.com/', 'https://tile.openstreetmap.org', 'https://fonts.googleapis.com/'];
const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org'];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(
  helmet({
    contentSecurityPolicy: false,
    defaultSrc: [],
    connectSrc: ["'self'", ...connectSrcUrls],
    scriptSrc: ["'self'", ...scriptSrcUrls],
    styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
    workerSrc: ["'self'", 'blob:'],
    objectSrc: [],
    imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
    fontSrc: ["'self'", ...fontSrcUrls],
  }),
);

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' })); //body parser
app.use(express.urlencoded({ extended: true, limit: '10kb' })); //body parser
app.use(cookieParser());

//data sanitization against NoSQL query injection
app.use(mongoSanatize());
//data sanitization against XSS

app.use(xss());

//data sanitization against parameter pollution

app.use(
  hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'],
  }),
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

///error handling middleware ////

app.use(compression());

//////////////// ROUTES////////////////////////
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//hello there

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errHandler);

/////////////sERVERSTART

module.exports = app;
