var express = require('express')
var router = express.Router()
var hljs = require('highlight.js')
var template =
  'import turtle\n' +
  '\n' +
  't = turtle.Turtle()\n' +
  '\n' +
  "for c in ['red', 'green', 'yellow', 'blue']:\n" +
  '    t.color(c)\n' +
  '    t.forward(75)\n' +
  '    t.left(90)\n'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message: 'success!!!' })
})

router.get('/highlight', function(req, res, next) {
  var highlightedCode = hljs.highlight('python', template, true).value
  res.send(highlightedCode)
})

module.exports = router
