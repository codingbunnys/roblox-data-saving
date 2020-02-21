// Config
const port = 3000



// Code
var deps = {}
try {
  deps.chalk = require('chalk')
  deps.chalk = require('express')
} catch (e) {
  if (!deps.chalk) {
    deps.chalk={
      "red": function(text) {
        return "ERROR" + text
      }
    }
  }
  console.log(deps.chalk.red("Failed to load dependencies.\n=======================\nError:\n\n" + e))
}
const app = deps.express()
app.get('/', function (req, res) {
  res.send('Hello World')
})
