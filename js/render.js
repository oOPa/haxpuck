var Renderer = function()
{
    this.rendering = false;
    this.previousTime = 0;
    this.frameId = 0;
    this.dt = 0;
    this.gameObjects = [];
    this.ctx = 0;
    this.physics = new Physics();
}
/**  */
Renderer.prototype.resetPhysics = function ()
{

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
        /** update physics */
        self.physics.update();
        /** update game objects */
        self.updateObjects();
        /** draw stadium */
        self.drawStadium();
        /** draw game objects */
        self.drawObjects();
        self.frameId = requestAnimationFrame(animate);
    }   
}
Renderer.prototype.updateObjects = function()
{
    for(var i in this.gameObjects)
    {
        var obj = this.gameObjects[i];
        obj.update();
    }
}
Renderer.prototype.drawObjects = function()
{
    for(var i in this.gameObjects)
    {
        var obj = this.gameObjects[i];
        obj.draw(this.ctx);
    }
}
Renderer.prototype.createPlayer = function()
{
    var player = new Player(this.physics.world,this.stadium);
    this.gameObjects.push(player);
    return player;
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

var createGame = function()
{
    var game = new Renderer();
    game.setStadium(stadium);
    createLocalPlayer(game);
    //start rendering
    game.start();
}
var createLocalPlayer = function(game)
{
    var player = game.createPlayer();
    //add action listeners
    document.addEventListener('keydown',gameKeyDown.bind(player));
    document.addEventListener('keyup',gameKeyUp.bind(player));
}
var createNetPlayer = function()
{
    var player = game.createPlayer();
}

