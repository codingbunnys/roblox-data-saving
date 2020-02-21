// Config
const port = 3000



// Code
var deps = {}
try {
  deps.chalk = require('chalk')
  deps.express = require('express')
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
app.get('/setdat/', function (req, res) {
  res.send({"error":false,"text":"Not Implemented"})
})

app.get('/', function (req, res) {
  res.send({"error":true,"text":"Error: Invalid Path"})
})

function getTime() {
  var time = new Date()
  return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}
const chalk = deps.chalk
var ctrlc = false
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    if (ctrlc == true) {
      process.stderr.cursorTo(0)
      process.stderr.clearLine()
      process.stderr.write(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + chalk.rgb(255,0,0)("Exited without saving data!\n"))
      process.exit(1)
    }
    ctrlc=true
    process.stderr.write(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + chalk.rgb(255,255,0)("WARN: Ctrl+C will not exit cleanly. Enter the keybind again if you must terminate the program. (3s) - Use " + chalk.red("Q") + " to save data and exit."))
    setTimeout(function () {
      process.stderr.cursorTo(0)
      process.stderr.clearLine()
      process.stderr.write(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + chalk.rgb(255,255,0)("WARN: Ctrl+C will not exit cleanly. Enter the keybind again if you must terminate the program. (2s) - Use " + chalk.red("Q") + " to save data and exit."))
      setTimeout(function () {
        process.stderr.cursorTo(0)
        process.stderr.clearLine()
        process.stderr.write(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + chalk.rgb(255,255,0)("WARN: Ctrl+C will not exit cleanly. Enter the keybind again if you must terminate the program. (1s) - Use " + chalk.red("Q") + " to save data and exit."))
        setTimeout(function () {
          process.stderr.cursorTo(0)
          process.stderr.clearLine()
          process.stderr.write(chalk.rgb(122,255,122)(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + "Canceled CTRL+C event"))
          setTimeout(function () {
            process.stderr.cursorTo(0)
            process.stderr.clearLine()
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
    setTimeout(function () {
      ctrlc=false
    }, 3000);
  } else if (key.name == "Q" || key.name == "q") {
    async function(run) {
      await save()
      process.exit()
    }
  } else if (key.name == "S" || key.name == "s") {
    save()
  }
});

// process.stdin.resume()
// process.stdin.setRawMode( true );
// process.stdin.on('keypress', function (key) {
//   if (key && key.ctrl) {
//     process.exit()
//   }
//   if (key && key.name == "q") {
//     process.exit()
//   }
//   if ( key === '\u0003' ) {
//     process.exit();
//   }
//   console.log(key)
//   return process.exit()
// });
// require('readline').emitKeypressEvents(process.stdin);

console.log(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] Press ${deps.chalk.red("'Q'")} to exit!`)
app.listen(port, () => console.log(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] Listening on port ${port}!`))
