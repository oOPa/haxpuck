var Player = function (world,stadium,isOnRedteam) {
    this.renderable = true;
    this.keys = [false,false,false,false];
    this.physics = new PhysicsPlayer(world,stadium);
    this.x = 0;
    this.y = 0;
    this.color = isOnRedteam ? "rgb(240,0,0)" : "rgb(0,0,248)";
    this.radius = 15;
    this.lineWidth = 3;
}
Player.prototype.draw = function(ctx)
{
    ctx.beginPath();
    //ctx.arc(-st.spawnDistance, 0, 15, 0, Math.PI*2, true);
    ctx.arc(this.x,this.y,this.radius, 0, Math.PI*2, true);
    ctx.fillStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.fill(); 
    ctx.stroke();

}
Player.prototype.moveTo = function(x,y)
{
    this.body.SetPosition(new b2Vec2(x,y));
    this.update();
}

Player.prototype.update = function()
{
    var v = this.physics.update(this.keys);
    this.x = v.x;
    this.y = v.y;
}