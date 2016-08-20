var Ball = function (world,stadium) {
    this.renderable = true;
    this.keys = [false,false,false,false];
    this.physics = new PhysicsPlayer(world,stadium);
    this.x = 0;
    this.y = 0;
    this.color = 0xFFFFFF;
    this.radius = 15;
    this.lineWidth = 3;
}
Ball.prototype.draw = function(ctx)
{
    ctx.beginPath();
    //ctx.arc(-st.spawnDistance, 0, 15, 0, Math.PI*2, true);
    ctx.arc(this.x,this.y,this.radius, 0, Math.PI*2, true);
    ctx.fillStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.fill(); 
    ctx.stroke();

}
Ball.prototype.moveTo = function(x,y)
{
    this.body.SetPosition(new b2Vec2(x,y));
    this.update();
}

Ball.prototype.update = function()
{
    var v = this.physics.update(this.keys);
    this.x = v.x;
    this.y = v.y;
}