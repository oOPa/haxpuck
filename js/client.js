var Client = function()
{
	this.methods = [];
	this.createNetworkMethods();
	this.requestedPlayers =false;
	//event handling
	this.ee = new EventEmitter();
	this.me = new Player();
	this.lastSnapshotSeq = 0;
	this.open = false; 
	//this.prototype.on = this.ee.on;
}
Client.prototype.getPlayer = function()
{
	return this.me;
}
/** initialisation code */
Client.prototype.createNetworkMethods = function()
{
	/** Request information about players in the room*/
	this.methods[0] = "receivePlayers";
	/** Receive information the game world*/
	this.methods[1] = "receiveSynchronization";
	this.methods[3] = "receiveChatMessage"
}
//event handling
Client.prototype.on = function()
{
	this.ee.on.apply(this.ee,arguments);
}
Client.prototype.off = function()
{
	this.ee.off.apply(this.ee,arguments);
}
Client.prototype.trigger = function()
{
	this.ee.trigger.apply(this.ee,arguments);
}
Client.prototype.getNickname = function()
{
	return this.nickname;
}
Client.prototype.setNickname = function(nickname)
{
	this.nickname = nickname;
}
Client.prototype.receiveChatMessage = function(data,peer)
{
	this.ee.emit("chat_message",data.val,peer);
}
Client.prototype.sendChatMessage = function(message)
{
	this.connection.send({sequence:0,request: 3,val : message});
}
Client.prototype.openConnection = function(callback,peer)
{
	this.peer = peer;
	console.log('My peer ID is: ' + peer);
	this.connection = this.peerBrooker.connect(this.host,{metadata:this.getNickname()});
		
	this.connection.on('open', () => {
		console.log("connected to "+this.host);
		this.open = true;
		if(callback)
		{
			callback();
		}

	});
	
	this.connection.on('data',this.onHostData.bind(this));

	this.connection.on('error',function(err){
		console.log("unable to create room");
		console.log(err)
	});
	
	this.connection.on('close',function(){
		this.stopUpdates();
		console.log("lost connection to host");
	});
}
Client.prototype.isOpen = function()
{
	return this.open;
}
Client.prototype.joinRoom = function(hostPeerId,callback)
{
	this.peer = new Peer({host : hx.network.host,path:"/api",port:hx.network.port,key:hx.network.key});
	this.host = hostPeerId;
	this.peerBrooker = this.peer.on('open',this.openConnection.bind(this,callback));
}

Client.prototype.sendKeys = function ()
{
	this.connection.send({sequence:0,request: 2,val : this.me.keys});
}

Client.prototype.onHostData = function (data)
{
	//console.log(data);
	var peer = data.peer || this.host
	//console.log(this);
	this[this.methods[data.response]].call(this,data,peer);
}

Client.prototype.requestPlayers = function()
{
	console.log("requesting players ... ");
	this.requestedPlayers = true ;
	this.connection.send({request: 0});
}

Client.prototype.receiveSynchronization = function(data)
{
	//drop out of order packets
	if(data.val[0] > this.lastSnapshotSeq)
	{
		this.lastSnapshotSeq = data.val[0];
		this.ee.emit("state_update",data);
	}
}

Client.prototype.receivePlayers = function(data)
{
	if(!this.requestedPlayers)
	{
		return;
	}
	this.players = [];
	this.players[this.peer] = this.me;
	//debugger;
	//var keys = Object.keys(da)
	for(var i in data.val)
	{
		var netPlayer = data.val[i];
		//console.log(netPlayer)
		if(netPlayer.peer != this.peer)
		{
			this.players[netPlayer.peer] = new Player(netPlayer.name,netPlayer.id);
			//console.log(this.players);
		}
		else
		{
			this.me.id = netPlayer.id
		}
	}
	console.log("received players from server");
	//check typeof
	this.trigger('requestplayers');
}
Client.prototype.getPlayersIterator = function ()
{
	var self = this;
	var keys = Object.keys(this.players);
	var len = keys.length;
	var index = 0;

	var it = {
		getNext : function(){
			return self.players[keys[index++]];
		},
		hasNext : function (){
			return index < len;
		},
		reset : function()
		{
			keys = Object.keys(self.players);
			len = keys.length;
			index = 0;
		}
	}

	return it;
}