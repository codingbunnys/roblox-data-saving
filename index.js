/*
  Copyright (c) 2017-2020 TStudios.
  Licensed under the AGPL 3.0 only.
*/

/*
	Special Errors:
		299 - Deprecated
		499 - Deprecated + 400
		599 - Deprecated + 500
*/

// Config
const port  = "25565"; // Deal with it, yes I'm using the standard minecraft port since im too lazy to change the opened port on my server
const time  = 0.2 // Save Interval
const auth  = {
	"Default_Game": "Example*Token.",
	"Additional_Game": "Secondary*Token", // For the second game
} // Auth String - this gets compared with the one sent, and if equal, sets data
// const host = "localhost" // Hostname

























// DO NOT CHANGE
const version = "0.0.1"



// Code
const fs = require("fs")

// INIT SENTRY
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://e599daf252d3425493d20c4df93508a2@sentry.io/5174404' });


Date.prototype.toUnixTime = function() { return this.getTime() / 1000 | 0 };


console.log("RobloxData v" + version + " - External server software to replace datastores.\nCopyright (c) 2017-2020 TStudios.\nLicensed under the AGPL 3.0 only.\nNotice: This code is meant to run on a server.")

if (process.argv[2] === "-t") {
	console.log(">>> Debugger Info\n>>> -t Flag Detected (for testing/inspect mode) - use cont to continue past debugger breakpoints")
}

debugger;
let deps = {}
try {
	deps.chalk = require('chalk')
	deps.express = require('express')
} catch (e) {
	if (!deps.chalk) {
		deps.chalk = {
			"red": function(text) {
				return "ERROR" + text
			},
		}
	}
	console.log(deps.chalk.red("Failed to load dependencies.\n=======================\nError:\n\n" + e))
}
const express = deps.express
const app = express()
let changed = false
let dat = {}

try {
	dat = require('./data.json')
} catch (e) {

}

app.post('*', function(req, res) {
	res.send("***POST REQUESTS CANNOT BE MADE***\nWe do not support post requests. Even for setting data, we use GET requests")
})


// Set Data

app.get('/setdat/', function(req, res) {
	console.log("NetLog | SetDat 400");
	res.send({ "error":true, "text":"400 Invalid Request", "Info": "URL Format: /setdat/{Game}/Auth/Data" })
})

app.get('/setdat/:id', function(req, res) {
	console.log("NetLog | SetDat 400");
	res.send({ "error":true, "text":"400 Invalid Request", "Info": "URL Format: /setdat/" + req.params.id + "/{game}/Data" })
})


// 0.0.1

app.get('/setdat/:id/:game/:data', function(req, res) {
	if (!req.params.game) {
		console.log("NetLog | SetDat 400 | No Game");
		return res.send({ "error":true, "text":"No Game String." })
	}
	if (!auth[req.params.game]) {
		return res.send({ "error":true, "text":"ERROR: Invalid Game" })
	}
	if (req.params.id != auth[req.params.game]) {
		console.log("NetLog | SetDat 400 | Invalid Auth");
		return res.send({ "error":true, "text":"INVALID AUTHENTICATION TOKEN!" })
	}
	let string = JSON.parse(req.params.data)
	if (!string.userid) {
		console.log("NetLog | SetDat 400 | No UserID");
		return res.send({ "error":true, "text":"No User ID String." })
	}
	console.log("NetLog | SetDat Success - UserID: " + string.userid);
	if (!dat[req.params.game]) {
		dat[req.params.game] = { '0':{} }
	}
	dat[req.params.game][string.userid] = string
	changed = true
	res.send({ "error":false, "text":"Success" })
})


// 0.0.0 Support
app.get('/setdat/:id/:data', function(req, res) {
	if (!auth.Default_Game) {
		res.status(599)
		return res.send({ "error":true, "text":"ERROR: v0.0.0 Is unsupported and default game not found (backwards compatability failed)" })
	}
	if (req.params.id != auth.Default_Game) {
		res.status(499)
		console.log("NetLog | SetDat 499 | Invalid Auth");
		return res.send({ "error":true, "text":"INVALID AUTHENTICATION TOKEN! (and v0.0.0 which is unsupported)" })
	}
	res.status(299)
	let string = JSON.parse(req.params.data)
	if (!string.userid) {
		res.status(499)
		console.log("NetLog | SetDat 499 | No UserID");
		return res.send({ "error":true, "text":"No User ID String." })
	}
	console.log("NetLog | SetDat Success from OUTDATED CLIENT - UserID: " + string.userid);
	if (!dat["Default_Game"]) {
		dat["Default_Game"] = { "0":{} }
	}
	dat["Default_Game"][string.userid] = string
	changed = true
	res.send({ "error":false, "text":"WARNING: Using Outdated Client", "url_used": "/" + req.params.id + "/Default_Game/" + req.params.data })
})

app.get('/', function(req, res) {
	res.status(400)
	res.send({ "error":true, "text":"Error: Invalid Path" })
})

// NO AUTH for getting data \\

// Version 0.0.0 Support
app.get('/getdat/:userid', function(req, res) {
	if (!dat["Default_Game"]) {
		res.status(499)
		return res.send({ "error":true, "exists":false, "game_exists":false, "errormsg":"NO_DATA_IN_DEFAULT", "text":"Client probs does not understand - version 0.0.0 detected - ERROR: NO DATA IN GAME" })
	}
	if (!dat["Default_Game"][req.params.userid]) {
		return res.send({ "error":false, "exists":false, "text":"DATA does not exist." })
	}
	res.status(299)
	res.send({ "error":false, "text":"Data in DATA variable | OUTDATED_CLIENT", "outdated":true, "exists":true, "data": dat["Default_Game"][req.params.userid] })
})

// Version 0.0.1
app.get('/getdat/:game/:userid', function(req, res) {
	let game = req.params.game
	let userid = req.params.userid
	if (!dat[game]) {
		return res.send({ "error":true, "game_exists":false, "text":"GAME does not exist." })
	}
	if (!dat[game][req.params.userid]) {
		return res.send({ "error":false, "game_exists": true, "data_exists":false, "text":"DATA does not exist." })
	}
	res.send({ "error":false, "text":"Data in DATA variable", "exists":true, "data": dat[game][userid] })
})


// Time server functionality (bonus to using RDS)
app.get('/utctime', function(req, res) {
	console.log("Sending UTC time");
	let d = new Date();
	let unixtime = new Date(d.toUTCString()).toUnixTime()
	let t = d.getUTCHours() + ":" + `${d.getUTCMinutes()}:${d.getUTCSeconds()}`
	res.send({ "time":t, "unix":unixtime })
})
debugger;
function help() {
	if (saving == true || ctrlc == true) {
		setTimeout(function() {
			help()
		}, 100);
	} else {
		process.stdout.cursorTo(0)
		process.stdout.clearLine()
		process.stdout.write(`\n[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + "> User Requested Help <\n")
		process.stdout.write(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + chalk.rgb(122, 122, 255)("Help:" + `
${chalk.white(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}]`)}   Port: ${port}
${chalk.white(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}]`)}
${chalk.white(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}]`)}   Keybinds:
${chalk.white(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}]`)}   |- Q = Quit and save data
${chalk.white(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}]`)}   |- S = Save Data
${chalk.white(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}]`)}   |- V = View Data
${chalk.white(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}]`)}   |- H = Help`) + chalk.rgb(255, 122, 160)(`
${chalk.white(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}]`)}   |`) + chalk.rgb(255, 0, 0)(`
${chalk.white(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}]`)}   |- CTRL+C = Exit WITHOUT SAVING DATA!\n\n`))
	}
}
let saving = false
let savingexit = false
function save(exit, force) {
	if (exit == true) {
		savingexit = true
	}
	if (ctrlc == true) {
		return setTimeout(function() {
			save(exit, false)
		}, 100);
	}
	if (saving == true) {
		return
	}
	if (force != true && changed == false) {
		return
	}
	saving = true
	process.stdout.cursorTo(0)
	process.stdout.clearLine()
	process.stdout.write(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + chalk.rgb(50, 150, 250)("Saving data..."))
	let jsonContent = JSON.stringify(dat);
	fs.writeFile("data.json", jsonContent, 'utf8', function(err) {
		if (err) {
			console.log("An error occured while writing JSON Object to File.\nInfo:\n  " + err + "\n  Data:\n" + chalk.red(JSON.stringify(dat)) + "\n\nPlease write this data to the data.json file!");
			process.exit(200)
		}
	});
	setTimeout(function() {
		process.stdout.cursorTo(0)
		process.stdout.clearLine()
		process.stdout.write(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + chalk.rgb(0, 255, 0)("Saved Data!\n"))
		changed = false
		if (savingexit == true) {
			process.stdout.write(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + chalk.rgb(0, 255, 0)("Exiting Safely!\n"))
			process.exit(0)
		}
		saving = false
		savingexit = false // why? idk
	}, 100);
}
let x = ""
function getTime() {
	let thistime = new Date()
	return `${thistime.getHours()}:${thistime.getMinutes()}:${thistime.getSeconds()}`
}
const chalk = deps.chalk
let ctrlc = false
if (process.argv[2] !== "-t") {
	const readline = require('readline');
	readline.emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);
	process.stdin.on('keypress', (str, key) => {
		if (key.ctrl && key.name === 'c') {
			if (ctrlc == true) {
				process.stderr.cursorTo(0)
				process.stderr.clearLine()
				process.stderr.write(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + chalk.rgb(255, 0, 0)("Exited without saving data!\n"))
				process.exit(1)
			}
			ctrlc = true
			process.stderr.write(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + chalk.rgb(255, 255, 0)("WARN: Ctrl+C will not save. Press it again to terminate RDS. (3s) - Use " + chalk.red("Q") + " to save data and exit."))
			setTimeout(function() {
				process.stderr.cursorTo(0)
				process.stderr.clearLine()
				process.stderr.write(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + chalk.rgb(255, 255, 0)("WARN: Ctrl+C will not save. Press it again to terminate RDS. (2s) - Use " + chalk.red("Q") + " to save data and exit."))
				setTimeout(function() {
					process.stderr.cursorTo(0)
					process.stderr.clearLine()
					process.stderr.write(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + chalk.rgb(255, 255, 0)("WARN: Ctrl+C will not save. Press it again to terminate RDS. (1s) - Use " + chalk.red("Q") + " to save data and exit."))
					setTimeout(function() {
						process.stderr.cursorTo(0)
						process.stderr.clearLine()
						process.stderr.write(chalk.rgb(122, 255, 122)(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + "Canceled CTRL+C event"))
						setTimeout(function() {
							process.stderr.cursorTo(0)
							process.stderr.clearLine()
						}, 1000);
					}, 1000);
				}, 1000);
			}, 1000);
			setTimeout(function() {
				ctrlc = false
			}, 3000);
		} else if (key.name == "Q" || key.name == "q") {
			save(true, true)
		} else if (key.name == "S" || key.name == "s") {
			save(false, true)
		} else if (key.name == "H" || key.name == "h") {
			help()
		} else if (key.ctrl && key.name === 'z') {
			let i = 0
			x = setInterval(function() {
				i = i + 1
				process.stderr.cursorTo(0)
				process.stderr.clearLine()
				process.stderr.write(chalk.bgRed("~~ Unsupported Error ~~"))
				if (i == 50) {
					process.stderr.cursorTo(0)
					process.stderr.clearLine()
					clearInterval(x)
				}
			}, 50);
		} else if (key.name == "v") {
			console.log(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + "[[[ - View Data - ]]]\n" + `[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] ` + "Data in MEMORY:")
			process.stdout.write(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] `)
			console.log(dat)
		}
	});
	console.log(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] Press ${deps.chalk.red("'Q'")} to exit - ${chalk.blue("'H'")} for other keybinds!`)
} else {
	console.log(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] Disabling Keybinds to ensure debugger doesn't break.`)
}

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

// Auto Save
setInterval(function() {
	save(false)
}, time * 1000 * 60);

app.listen(port, () => console.log(`[${deps.chalk.green("RDS")}@${deps.chalk.blue(getTime())}] Listening on port ${chalk.red(port)}!`))
