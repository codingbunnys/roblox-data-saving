const fetch = require('node-fetch')
var URL = `https://discordapp.com/api/webhooks/667170146791587861/sDt7kAF_xR_tEYePRRDTj3YwPxTYxrEfkOT0UPhM8_tCYcoVuKmMET-3Flf-tf4pVk2E`;
function runfetch(text) {
	fetch(URL, {
	     "method":"POST",
	     "headers": {"Content-Type": "application/json"},
	     "body": JSON.stringify({
	        "content":text
	      })

	    })
	    .then(res=> console.log(res))
	    .catch(err => console.error(err));
}
runfetch("\`\`\`yml\nStarting NodeJs...\`\`\`")

process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) {
        console.log("Exiting...")
        runfetch("\`\`\`yml\nStopping NodeJs...\`\`\`")
    };
    if (options.exit) process.exit();
}

//do something when app is closing
//process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {cleanup:true,exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
