//because it's in openshift this needs to be over websocket

const mosca = require('mosca');

const server = new mosca.Server({
	http: {
    	port: 8080,
    	bundle: true,
    	static: './'
  	}
});

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

/*server.on('published', function(packet, client){
	console.log('Published', packet.payload);
});*/

server.on('ready', function(){
	console.log("ready");
});