var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
class Physics
{
    constructor(){
	var that  = this;
	this.world = new b2World(new b2Vec2(0, 0), false);
}
    
    
update()
{
    this.world.Step(1 / 60, 10, 10);
    this.world.ClearForces();
}


}

class PhysicsPlayer {
    
    constructor (physics,stadium) {
        var world = physics.world;
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
	//this.keys = [false,false,false,false];

var constants ={}
constants.Player = {
    DENSITY:1,
    FRICTION:10,
    RESTITUTION:1,
    AD:2,
    LD:2,
    MAG:12,
    RADIUS:0.5
};

constants.Player = {
    DENSITY:1,
    FRICTION:0.5,
    RESTITUTION:0.2,
    AD:2,
    LD:2,
    MAG:12,
    RADIUS:0.5
};

    var fixDef = new b2FixtureDef();
    //fixDef.density = constants.Player.DENSITY;
    fixDef.friction = constants.Player.FRICTION;
    fixDef.restitution = constants.Player.RESTITUTION;
    fixDef.shape = new b2CircleShape(30*constants.Player.RADIUS);
	//bodyDef.position.x = -stadium.spawnDistance;
	bodyDef.position.x = 30*constants.Player.RADIUS;
    bodyDef.position.y = 30*constants.Player.RADIUS;
    bodyDef.linearDamping = constants.Player.LD;
    bodyDef.angularDamping = constants.Player.AD;
   // debugger;
    this.bdef = bodyDef;
    this.fixdef = fixDef;
    this.body = world.CreateBody(bodyDef);
    this.fix = this.body.CreateFixture(fixDef);
}
update (keys)
{
		var vec = new b2Vec2();
        keys.forEach(function (key, i) {
        if (key) {
                var vec2 = new Vec(i * -90,200);
                vec.Add(vec2.vec);
        }
        });
        if (vec.Length() > 0)
        {
            this.body.ApplyForce(vec, this.body.GetWorldCenter());
            //console.log(this.body)
            
        }
       
           return this.body.GetPosition();
           
}

}

var Vec = function (deg, mag) {
    var deg = deg2rad(deg);
    this.vec = new b2Vec2(Math.cos(deg) * mag, Math.sin(deg) * mag);
    //return this.vec;
    }

var deg2rad = function (deg) {
        return deg * Math.PI / 180;
}
