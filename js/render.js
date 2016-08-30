var Renderer = function()
{
    this.rendering = false;
    this.previousTime = 0;
    this.frameId = 0;
    this.dt = 0;
    this.players = [];
    this.ctx = 0;
    this.frameNumber = 0;
    this.physics = new Physics();
    this.state = [];
    this.queue = new PlaybackQueue();
}
Renderer.prototype.getState = function()
{
    return this.state;
}
Renderer.prototype.start = function()
{
    if(!this.rendering)
    {
        this.ctx = canvas.getContext('2d');
        this.draw();
        this.rendering = true;
    }
}
Renderer.prototype.stop = function()
{
    if(this.rendering)
    {
        cancelAnimationFrame(this.frameId);
        this.rendering = false;
    }
}
Renderer.prototype.setStadium = function(stadium)
{
    this.stadium = stadium;
}
Renderer.prototype.transform =  function(shape, draw){
    draw(); 
};
Renderer.prototype.draw = function(){
    var self = this;

    animate();
    function animate(time)
    {
        this.dt = time - this.previousTime;
        this.previousTime = time;
        self.frameNumber++;
        /** update physics */
        self.physics.update();
        /** update game objects */
        self.updatePlayers();
        /** draw stadium */
        self.drawStadium();
        /** draw game objects */
        self.drawPlayers();
        self.frameId = requestAnimationFrame(animate);
    }   
}
Renderer.prototype.updatePlayers = function()
{
    let temp = new GameState();
    temp.setFrameNumber(this.frameNumber);
    this.state = temp;
    
    var keys = Object.keys(this.players);
    for(var i in keys)
    {
        var obj = this.players[keys[i]];
        obj.update(this.ctx);
        temp.addGameObject(obj,[obj.x,obj.y])
    }
    this.state = temp;
}
Renderer.prototype.drawPlayers = function()
{
    var keys = Object.keys(this.players);
    for(var i in keys)
    {
        var obj = this.players[keys[i]];
        obj.draw(this.ctx);
    }
}
Renderer.prototype.addPlayer = function(player)
{
    if(player)
    {
        var index = this.players[player.id];
        if (!index){
            //debugger;
            player.createPhysics(this.physics);
            player.moveTo(20,20);
            this.players[player.id] = player;
        }
    }
}
Renderer.prototype.removePlayer = function(player)
{
    var index = this.players.indexOf(player);
    if (index > -1){
        //delete player completely
        this.players.splice(index, 1);
    }
}
Renderer.prototype.resetPlayers = function(player)
{

}
Renderer.prototype.applyGameState = function(state_array)
{
    var state = GameState.fromArray(state_array);
    var it = state.getIterator();
    while(it.hasNext())
    {
    	//console.log(it.getNext())
        let gameObject = it.getNext();
        //console.log(gameObject);
        let player = this.players[gameObject.id];
        if(player)
        {
            player.moveTo(gameObject.data[0],gameObject.data[1])
        }
        else
        {
            console.log("not found id "+gameObject);
        }
    }
}
Renderer.prototype.drawStadium = function (){
    var ctx =  this.ctx;
    var st = this.stadium;
    var transform = this.transform;
    /** reset canvas */
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas_rect[2] - canvas_rect[0], canvas_rect[3] - canvas_rect[1]);
    ctx.translate(-canvas_rect[0], -canvas_rect[1]);

    /** ???? */
    ctx.beginPath();
    ctx.moveTo(-st.width, -st.height);
    ctx.lineTo(st.width, -st.height);
    ctx.lineTo(st.width, st.height);
    ctx.lineTo(-st.width, st.height);
    ctx.clip();
    
    /** draw background */
    renderbg(st, ctx);


    /** draw segments */
    $.each(st.segments, function(i, segment){
        transform(Shape('segments', segment, i), function(){
            segment = complete(st, segment);
            render_segment_arc(ctx, segment, segment_arc(st, segment));
        });
    });

    /** draw discs */
    $.each(st.discs, function(i, disc){
        transform(Shape('discs', disc, i), function(){
            disc = complete(st, disc);
            ctx.beginPath();
            var radius = disc.radius !== undefined ? disc.radius : haxball.default_disc_radius;
            ctx.arc(disc.pos[0], disc.pos[1], radius, 0, Math.PI*2, true);

            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.lineWidth = 2;
            ctx.fillStyle = color_to_style(disc.color, haxball.disc_color);
            ctx.fill();
            ctx.stroke();
        });
    });

    $.each(debug_render, function(i, f){ f(ctx); });


    /** ????? */
    function drawPuck (){
        ctx.beginPath();
        // /ctx.arc(0, 0, 10, 0, Math.PI*2, true);
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
    }

}

var GameState = function()
{
    this.data = new Array();
    this.index = 0;
}
GameState.prototype.setFrameNumber = function(frameNumber)
{
    this.data[0] = frameNumber;
}
GameState.prototype.getFrameNumber = function()
{
    return this.data[0];
}
GameState.prototype.addGameObject = function(gameObject,data)
{
    this.data.push(gameObject.id,data);
}
GameState.prototype.get = function(index)
{
    return {id : this.data[2*index+1], data : this.data[2*(index+1)]};
}
GameState.prototype.size = function(index)
{
    return (this.data.length - 1) / 2;
}
GameState.prototype.getData = function()
{
    return this.data;
}
GameState.prototype.getIterator = function()
{
    var index = 0;
    var len = this.size();
	var it = {
		getNext : () => {
			return this.get(index++);
		},
		hasNext : function (){
			return index < len;
		},
		reset : function()
		{
			index = 0;
		}
	}
    return it;
}
GameState.fromArray = function(data)
{
    var state = new GameState();
    state.data = data;
    return state;
}


var PlaybackQueue = function(max,arr)
{
    this.len = 20;
    this.arr = new Array();
    this.access_pointer = -1;
    this.insert_pointer = -1;
}
PlaybackQueue.prototype.add = function (frame)
{
	this.arr[this.getNextInsertPointer()] = frame;
}
PlaybackQueue.prototype.hasNext = function()
{
    return (this.access_pointer != this.insert_pointer);
}
PlaybackQueue.prototype.getNext = function()
{
	return this.arr[ this.access_pointer = ((this.access_pointer+1)%this.len)];
}
PlaybackQueue.prototype.getNextInsertPointer = function()
{
	return (this.insert_pointer = (this.insert_pointer +1)%this.len);
}
PlaybackQueue.prototype.getQueue = function ()
{
	return this.arr;
}
PlaybackQueue.prototype.copyTo = function (queue)
{
    while(this.hasNext())
    {
        queue.add(this.getNext());
    }
}
class RendererClient extends Renderer
{
    updatePlayers()
    {
        let temp = new GameState();
        temp.setFrameNumber(this.frameNumber);
        this.state = temp;
        var keys = Object.keys(this.players);
        for(var i in keys)
        {
            var obj = this.players[keys[i]];
            obj.interpolate(this.ctx);
            temp.addGameObject(obj,[obj.x,obj.y])
        }
        this.state = temp;
    }
}









