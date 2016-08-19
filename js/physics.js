var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
class Physics
{
    constructor(){
	var that  = this;
	this.world = new b2World(new b2Vec2(0, 0), true);
}
    
    
update()
{
    this.world.Step(1 / 60, 10, 10);
    this.world.ClearForces();
}

clearForces()
{
    this.world.ClearForces();
}

}

class PhysicsPlayer {
    
    constructor (world,stadium) {
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
	this.keys = [false,false,false,false];

var constants ={}
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
    fixDef.friction = constants.Player.FRICTION;
    fixDef.restitution = constants.Player.RESTITUTION;
    fixDef.shape = new b2CircleShape(constants.Player.RADIUS);
	bodyDef.position.x = -stadium.spawnDistance;
    bodyDef.position.y = 0;
    bodyDef.linearDamping = constants.Player.LD;
    bodyDef.angularDamping = constants.Player.AD;

    this.body = world.CreateBody(bodyDef);
    this.fix = this.body.CreateFixture(fixDef);
}
update ()
{
		var vec = new Vector(0, 0);
        this.keys.forEach(function (key, i) {
        if (key) {
                var vec2 = new Vec(i * -90,200);
                vec.add(vec2.vec);
        }
        });
        
        if (vec.length() > 0)
        {
            this.body.ApplyForce(vec, this.body.GetWorldCenter());
        }
        
}

}

var Vec = function (deg, mag) {
    var deg = deg2rad(deg);
    this.vec = new Vector(Math.cos(deg) * mag, Math.sin(deg) * mag);
    }

var deg2rad = function (deg) {
        return deg * Math.PI / 180;
}
/*
 * @class Vector
 * @constructor 
 * @param x {Number} position of the point
 * @param y {Number} position of the point
 */
Vector = function(x, y)
{
    /**
     * @property x 
     * @type Number
     * @default 0
     */
    this.x = x || 0;

    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y || 0;
};

/**
 * Creates a clone of this point
 *
 * @method clone
 * @return {Vector} a copy of the point
 */
Vector.prototype.clone = function()
{
    return new Vector(this.x, this.y);
};
/** EDITOR **/
Vector.prototype.copy = function (p) {
    this.set(p.x, p.y);
};

Vector.prototype.add = function(v) {
	if(v instanceof Vector){
		this.x += v.x;
		this.y += v.y;
	}
	else
	{
		this.x += arguments[0];
		this.y += arguments[1];
	}
    return this;
};

Vector.prototype.sub = function(v) {
	if(v instanceof Vector){
		this.x -= v.x;
		this.y -= v.y;
	}
	else
	{
		this.x -= arguments[0];
		this.y -= arguments[1];
	}
    return this;
};

Vector.prototype.invert = function(v) {
    this.x *= -1;
    this.y *= -1;
    return this;
};

Vector.prototype.multiplyScalar = function(s) {
    this.x *= s;
    this.y *= s;
    return this;
};

Vector.prototype.divideScalar = function(s) {
    if(s === 0) {
        this.x = 0;
        this.y = 0;
    } else {
        var invScalar = 1 / s;
        this.x *= invScalar;
        this.y *= invScalar;
    }
    return this;
};

Vector.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
};

Vector.prototype.length = function(v) {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.lengthSq = function() {
    return this.x * this.x + this.y * this.y;
};

Vector.prototype.normalize = function() {
    return this.divideScalar(this.length());
};

Vector.prototype.distanceTo = function(v) {
    return Math.sqrt(this.distanceToSq(v));
};

Vector.prototype.distanceToSq = function(v) {
    var dx = this.x - v.x, dy = this.y - v.y;
    return dx * dx + dy * dy;
};

Vector.prototype.set = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
};

Vector.prototype.setX = function(x) {
    this.x = x;
    return this;
};

Vector.prototype.setY = function(y) {
    this.y = y;
    return this;
};

Vector.prototype.setLength = function(l) {
    var oldLength = this.length();
    if(oldLength !== 0 && l !== oldLength) {
        this.multiplyScalar(l / oldLength);
    }
    return this;
};

Vector.prototype.invert = function(v) {
    this.x *= -1;
    this.y *= -1;
    return this;
};

Vector.prototype.lerp = function(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    return this;
};

Vector.prototype.rad = function() {
    return Math.atan2(this.x, this.y);
};

Vector.prototype.deg = function() {
    return this.rad() * 180 / Math.PI;
};

Vector.prototype.equals = function(v) {
    return this.x === v.x && this.y === v.y;
};

Vector.prototype.rotate = function(theta) {
    var xtemp = this.x;
    this.x = this.x * Math.cos(theta) - this.y * Math.sin(theta);
    this.y = xtemp * Math.sin(theta) + this.y * Math.cos(theta);
    return this;
};
