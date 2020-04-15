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
const whitelist = ['http://localhost:4200', 'https://ripple-public.appspot.com']
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

app.get('/index.html', function (req, res) {
  res.redirect('/')
})
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
app.use('/assets', express.static(path.join(__dirname, '/views/assets')))
app.use('/api/', indexRouter)
app.use('/api/users', usersRouter)
app.use('/api/tts', ttsRouter)
app.use('/api/addAdminExec', addAdminRouter)

app.use('/*', express.static(path.join(__dirname, '/dist/angular-app/')))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
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

module.exports = app
