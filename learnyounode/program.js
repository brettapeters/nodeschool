// 1: HELLO WORLD
// console.log("HELLO WORLD");


// 2: BABY STEPS
// var sum = process.argv.slice(2)
// 					  .map((n) => +n)
// 					  .reduce((pv, cv) => pv + cv, 0);

// console.log(sum);

// 3: MY FIRST I/O! 
// var fs = require('fs');

// var fd = process.argv[2];
// var contents = fs.readFileSync(fd, 'utf8');
// var newlines = contents.trim().split("\n").length - 1;

// console.log(newlines);

// 4: MY FIRST ASYNC I/O!
// var fs = require('fs');

// var fd = process.argv[2];

// fs.readFile(fd, 'utf8', function(err, data) {
// 	console.log(data.trim().split("\n").length - 1);
// });

// 5: FILTERED LS
// var fs = require('fs');
// var path = require('path');

// var dir = process.argv[2];
// var ext = "." + process.argv[3];

// fs.readdir(dir, function(err, files) {
// 	files.filter((file) => path.extname(file) == ext)
// 		 .forEach((name) => console.log(name));
// });

// 6: MAKE IT MODULAR
// var filterByExt = require("./filterByExt");

// var dir = process.argv[2];
// var ext = process.argv[3];

// filterByExt(dir, ext, function(err, data) {
// 	if (err) { return; }
// 	data.forEach((name) => console.log(name))
// });

// 7: HTTP CLIENT
// var http = require('http');

// var url = process.argv[2];
// http.get(url, function(response) {
// 	response.setEncoding('utf8');
// 	response.on('data', console.log);
// 	response.on('error', console.error);
// }).on('error', console.error);

// 8: HTTP COLLECT
// var http = require('http');

// var url = process.argv[2];
// http.get(url, function(response) {
// 	response.setEncoding('utf8');
// 	var data = '';
// 	response.on('data', function(chunk) {
// 		data += chunk;
// 	});
// 	response.on('end', function() {
// 		console.log(data.length);
// 		console.log(data);
// 	});
// });

// 9: JUGGLING ASYNC
// var http = require('http');

// var count = 0;
// var results = [];

// function printResults() {
// 	results.forEach((result) => console.log(result));
// }

// function httpGet(url, i) {
// 	http.get(url, function(res) {
// 		res.setEncoding('utf8');
// 		var contents = '';
// 		res.on('data', function(chunk) {
// 			contents += chunk;
// 		});
// 		res.on('end', function() {
// 			results[i] = contents;
// 			count++;

// 			if (count == 3) { printResults(); }
// 		});
// 	});
// }

// var urls = process.argv.slice(2);
// urls.forEach(httpGet);

// 10: TIME SERVER
// var net = require('net');
// var strftime = require('strftime');

// var server = net.createServer(function(socket) {
// 	socket.end(strftime('%F %H:%M', new Date()) + "\n");
// });
// server.listen(process.argv[2]);

// 11: HTTP FILE SERVER
// var http = require('http');
// var fs = require('fs');
// var [port, fd] = process.argv.slice(2);

// var server = http.createServer(function(req, res) {
// 	res.writeHead(200, { 'content-type': 'text/plain' });
// 	fs.createReadStream(fd).pipe(res);
// })
// server.listen(port);

// 12: HTTP UPPERCASERER
// var http = require('http');

// var port = process.argv[2];
// var server = http.createServer(function(req, res) {
// 	if (req.method !== 'POST') {
// 		return res.end('send me a POST\n');
// 	}
// 	req.setEncoding('utf8');
// 	req.on('data', (chunk) => res.write(chunk.toUpperCase()));
// });
// server.listen(port);

// 13: HTTP JSON API SERVER
var http = require('http');
var url = require('url');

function TimeObj(date) {
	this.hour = date.getHours();
	this.minute = date.getMinutes();
	this.second = date.getSeconds();
	this.unixtime = date.getTime();
	this.pick = function(...properties) {
		return properties.reduce((subset, prop) => {
				subset[prop] = this[prop];
				return subset;
			}, {});
	};
	this.formatJSON = function(...properties) {
		return JSON.stringify(this.pick(...properties));
	};
}

var port = process.argv[2] || process.env.PORT;
var host = process.argv[3] || process.env.IP;

var server = http.createServer(function(req, res) {
	if (req.method !== 'GET') { return res.end('Send a GET request\n'); }
	var { pathname, query } = url.parse(req.url, true);
	var time = new TimeObj(new Date(query.iso));
	var result;

	switch (pathname) {
		case '/api/parsetime':
			result = time.formatJSON('hour', 'minute', 'second');
			break;
		case '/api/unixtime':
			result = time.formatJSON('unixtime');
			break;
	}

	if (result) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(result);
	} else {
		res.writeHead(404);
		res.end();
	}
});

server.listen(port, host, () => {
	console.log(`App listening at https://${process.env.C9_HOSTNAME}:${port}`);
});

server.on('error', (e) => {
	if (e.code == 'EADDRINUSE') {
    	console.log('Address in use, retrying...');
    	setTimeout(() => {
    		server.close();
    		server.listen(port, host);
    	}, 1000);
	}
});