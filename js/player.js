var Player = function (world) {
    //this.renderable = false;
    this.keys = [false,false,false,false];
    this.physics = new PhysicsPlayer(world,stadium);
}
Player.prototype.point = function(){
    var v = this.physics.body.GetPosition();
    var p = {x:v.x,y:v.y};
    return p;   
}
Player.prototype.update = function()
{
    this.physics.update();
}