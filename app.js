var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(1337);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.write(data);
    res.end();
  })
}

var results = [];
var names = [];
var sum = 0;
var ave = 0;
io.sockets.on('connection', function(socket){
	socket.on('emit_from_client', function(data){
		if(names.indexOf(data.name) == -1){
			names.push(data.name);
			results.push(data.msg);
			console.log('pushed:' + results + ' and ' + names);
			//データベースに投げる
			if(results.length > 3){
				for (var i = 0; i < results.length; i++){
					results[i] = Number(results[i]);
					sum += results[i];
				};
				ave = sum / 4;
				ave = Math.floor(ave);
				io.sockets.emit('emit_from_server', ave);
				results = [];
				names = [];
				sum = "";
			} else {
				socket.emit('emit_from_server','Please wait...');
			}
		} else {
				socket.emit('emit_from_server','Please wait...');
		} 
	});
});
