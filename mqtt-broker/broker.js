const mosca = require('mosca');

const settings = {
	port:1883
}

const server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

/*server.on('published', function(packet, client){
	console.log('Published', packet.payload);
});*/

server.on('ready', function(){
	console.log("ready");
});