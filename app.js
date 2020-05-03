var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
var fs = require('fs')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var ttsRouter = require('./routes/tts')
var judgeRouter = require('./routes/judge')
var addAdminRouter = require('./routes/addAdmin')

var app = express()

// view engine setup
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// redirect https
app.use(function (req, res, next) {
  var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase()
  if (schema === 'https' || isLocalhost(req)) {
    next()
  } else {
    res.redirect(301, 'https://' + req.headers.host + req.url)
  }
})

// cors
const whitelist = [
  'http://localhost:4200',
  'http://localhost:3000',
  'https://ripple-public.appspot.com',
  'https://ripple.uec-programming.com',
  'https://www.ripple.uec-programming.com',
]
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin)) {
        return callback(null, true)
      }
      const message = "The CORS policy for this origin doesn't allow access from the particular origin."
      return callback(new Error(message), false)
    },
  })
)
// remove trailing slash
app.use((req, res, next) => {
  if (req.path.substr(-1) === '/' && req.path.length > 1) {
    const query = req.url.slice(req.path.length)
    res.redirect(301, req.path.slice(0, -1) + query)
  } else {
    next()
  }
})

// static pages
app.get('/', function (req, res) {
  res.render('./index.ejs')
})
app.get('/tos', function (req, res) {
  res.render('./tos.ejs')
})
app.get('/privacy', function (req, res) {
  res.render('./privacy.ejs')
})
app.get('/contact', function (req, res) {
  res.render('./contact.ejs')
})
app.get('/api/terms', function (req, res) {
  res.render('./includes/terms.ejs')
})
app.get('/api/privacy', function (req, res) {
  res.render('./includes/privacy.ejs')
})
app.use('/assets', express.static(path.join(__dirname, '/views/assets')))

// api
app.use('/api/', indexRouter)
app.use('/api/users', usersRouter)
app.use('/api/tts', ttsRouter)
app.use('/api/addAdminExec', addAdminRouter)

// app
app.use(express.static(path.join(__dirname, '/dist/angular-app')))
app.use('/*', express.static(path.join(__dirname, '/dist/angular-app/index.html')))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.redirect(404, '/404')
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  console.error(err)

  // render the error page
  res.status(err.status || 500)
  res.send('error')
})

function isLocalhost(req) {
  return req.headers.host.includes('localhost')
}

module.exports = app
