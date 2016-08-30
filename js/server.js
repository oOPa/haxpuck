var Host = function()
{
	this.clients = [];
	this.methods = [];
	this._createNetworkMethods();
	this.me = new Player("host",0);
	this.ee = new EventEmitter();
	this.count = 0;
}
Host.prototype.getPlayer = function()
{
	return this.me
}
Host.prototype.stopUpdates =function ()
{
	if(typeof this.timer != 'undefined')
	{
		clearInterval(this.timer);
		this.updating = false;
	}
}

//event handling
Host.prototype.on = function()
{
	this.ee.on.apply(this.ee,arguments);
}
Host.prototype.off = function()
{
	this.ee.off.apply(this.ee,arguments);
}
Host.prototype._createNetworkMethods = function()
{
	/** Send information about players in the room*/
	this.methods[0] = "sendPlayers";
	/** Update player inputs*/
	this.methods[2] = "setKeys";
	/** Send chat messages */
	this.methods[3] = "receiveChatMessage"
}
Host.prototype.receiveChatMessage = function(peer,data)
{
	console.log(this.getPlayerFromId(peer).name +data.val+"\"");
	//broadcast to everyone
	this.broadcast({response:3,val: data.val,peer:peer});
}
Host.prototype.setKeys = function(peer,data)
{
	this.getPlayerFromId(peer).keys = data.val;
}

Host.prototype.getPlayerFromId = function (peer) {
	return this.clients[peer];
}
Host.prototype.sendGameState = function (state)
{
	this.broadcast({response : 1, val : state});
}
Host.prototype.getNewId = function()
{
	return ++this.count;
}
Host.prototype.removePlayer = function(player)
{
	
}
Host.prototype.initPlayer = function(data)
{
    console.log("new peer " + data.peer + " connected");
    this.clients[data.peer] = new Player(data.metadata,this.getNewId());
    data.on('close',this.removePlayer.bind(this,this.clients[data.peer] ));
    data.on('data',this.onReceiveData.bind(this,data));
	this.ee.emit("player_join" ,this.clients[data.peer]);
}
Host.prototype.createRoom = function()
{
	this.peer = new Peer({host : hx.network.host,path:"/api",port:hx.network.port,key:hx.network.key});
	this.peer.on('open', (id) =>
	{
		console.log('My id is: ' + id);
		console.log('waiting for players to join');
		this.peer.on('connection',this.initPlayer.bind(this));
	}); 

	this.peer.on('error',function(err){
		console.log(err);
	});
	
};

/** send data to every single client*/
Host.prototype.broadcast = function (data,ignorePeers) {
	var keys = Object.keys(this.peer.connections);
	for(i in keys)
	{
		var item = this.peer.connections[keys[i]][0];
		item.send(data);
	}
}
Host.prototype.broadcastState = function(gData)
{
	this.broadcast({response : 1, val : gData});
}
Host.prototype.onReceiveData= function(connection,data)
{

	var peer = connection.peer;
	this[this.methods[data.request]].call(this,peer,data,connection);
}
Host.prototype.setInput = function (peer,keys)
{
	var player = this.getPlayerFromId(peer);
	player.keys = keys.val;
}
Host.prototype.sendPlayers = function(peer,data,connection)
{
	connection.send({response: 0, val: this.getPlayers()});
}
Host.prototype.getPlayers = function()
{
	var players = [];
	//add host
	players.push({peer : this.peer.id, name:this.nickname,avatar : this.me.avatar,team:this.me.team,id:this.me.id});
	//add other players
	var keys = Object.keys(this.clients);
	for(i in keys)
	{
		var peer = keys[i];
		var player = this.clients[peer];
		players.push({peer : peer,name:player.name,avatar : player.avatar,id : player.id});
	}	
	return players;
}
