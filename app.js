var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var ttsRouter = require('./routes/tts')
var judgeRouter = require('./routes/judge')

var app = express()

// view engine setup
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

app.use('/api/', indexRouter)
app.use('/api/users', usersRouter)
app.use('/api/tts', ttsRouter)

app.use(express.static(path.join(__dirname, '/dist/ripple-public')))
app.use('/*', express.static(path.join(__dirname, '/dist/ripple-public/index.html')))

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
