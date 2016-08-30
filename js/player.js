var Player = function (name,id) {
    this.renderable = true;
    this.keys = [false,false,false,false];
    this.x = 0;
    this.y = 0;
    this.name = name;
    this.team = 0;
    this.id = id;
    this.priority = 1000;
    //this.color = isOnRedteam ? "rgb(240,0,0)" : "rgb(0,0,248)";
    this.color = 0xFFFFFF;
    this.radius = 15;
    this.lineWidth = 3;
}
Player.prototype.setStadium = function(stadium)
{
    this.stadium = stadium;
}
Player.prototype.createPhysics = function(physics)
{
    //this.physics = new PhysicsPlayer(physics,this.stadium);
    this.physics = new PhysicsPlayer(physics,this.stadium);
}
Player.prototype.draw = function(ctx)
{
    if(this.renderable)
    {
        ctx.beginPath();
        //ctx.arc(-st.spawnDistance, 0, 15, 0, Math.PI*2, true);
        ctx.arc(this.x,this.y,this.radius, 0, Math.PI*2, true);
        ctx.fillStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.fill(); 
        ctx.stroke();
    }
}
Player.prototype.moveTo = function(x,y)
{
    //Matter.Body.setPosition(this.physics.body,Matter.Vector.create(x, y));
    this.physics.body.SetPosition(new b2Vec2(x,y));
}

Player.prototype.update = function()
{
    //console.log(this);
    if(this.physics)
    {
        var v = this.physics.update(this.keys);
        this.x = v.x;
        this.y = v.y;
    }
}

Player.prototype.interpolate = function()
{
    //console.log(this);
    if(this.physics)
    {
        var v = this.physics.update(this.keys);
        this.x += (v.x - this.x) * 0.3;
        this.y += (v.y - this.y) * 0.3;
    }
}
Player.prototype.updateColor = function(teamColor)
{
    if(this.team)
    {
        this.color = teamColor[this.team-1];
    }
}