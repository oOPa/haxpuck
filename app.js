var that = this;
const MONGO_ENABLED = true;
const DEBUG_MODE = false;

var DB_URL = "mongodb://localhost/haxball"
var ExpressPeerServer = require('peer').ExpressPeerServer;
var express = require("express")
var app = express();
var host = "";
const MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var options = {
    debug: true
};

/** Room management **/
var create_room = function (req,res)
{
	rooms = that.rooms;
	rooms.insert({
		name : req.body['name'],
		peer : req.body['peer'],
		players	: 1,
		max	:	req.body['max'],
		country	:	'gb',
		lat	: "0",
		longitude	: "0",
		version	: req.body['ver'],
		pass : 0
	});
	res.end();
}
var create_debug = function (req,res)
{
	that.peer = req.body['peer'];
	res.end();
}
var get_debug_room = function (req,res)
{
	res.write(that.peer);
	res.end();
}
var get_rooms = function(req,res)
{
	if(MONGO_ENABLED)
	{
	var cursor = that.rooms.find();
	res.contentType("application/json");
	var firstItem=true;
	cursor.each(function(err,item){
		if(item == null) {
		res.end(firstItem ? '[' : '' + ']');
        return;
    }
		res.write(firstItem ? (firstItem=false,'[') : ',');
		res.write(JSON.stringify(item));
	});
	}else
	{
		res.end();
	}
}
var remove_player = function(peer) {
	if(MONGO_ENABLED)
{
	x = that.rooms.remove({"peer":{"$eq":peer}});
}
}
/** routes **/
app.post("/create_room",create_room);
app.get("/get_rooms",get_rooms);
app.get("/", 							function(req,res){res.sendFile(__dirname+'/index.html')});

/** debugging only */
app.get("/host", 							function(req,res){res.sendFile(__dirname+'/debug/host.html')});
app.get("/client", 							function(req,res){res.sendFile(__dirname+'/debug/client.html')});
app.post("/create_debug",create_debug);
app.get("/get_debug_room",get_debug_room);

app.use('/js', express.static('js'));
app.use('/shared', express.static('shared'));
app.use('/css', express.static('css'));
app.use('/res', express.static('res'));

/** load servers **/
server = app.listen(process.env.port || 8888);
var epe = ExpressPeerServer(server, options)
epe.on('disconnect',remove_player)
app.use('/api',epe);
/**DATABASE connection**/
if(MONGO_ENABLED)
{
MongoClient.connect(DB_URL, (err, database) => {
  // ... start the server
	;
  if(err) {console.log(err)}
  else{that.rooms = database.collection('rooms');that.rooms.remove();}
});
}