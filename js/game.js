Game = {};
Game.Debug = {};
Game.Input = {};
Game.Rendering = {};
Game.Net = {};
Game.Debug.createDebugDraw = function(renderer)
{
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
    //debugDraw.SetDrawScale(20);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    renderer.physics.world.SetDebugDraw(debugDraw);

    function animate()
    {
        renderer.physics.world.Step(1/60,10,10);
        renderer.physics.update();
        renderer.updatePlayers();
        // renderer.physics.world.ClearForces();
        renderer.physics.world.DrawDebugData();
        requestAnimationFrame(animate);
    }
}

Game.Debug.ServerDebug = function()
{

}
Game.Debug.makeRoom = function(name,peer)
{
    $.post("/create_debug",encodeURI("name="+name+"&peer="+peer+"&max="+max+"&ver="+hx.version));
}

Game.Debug.getRoom = function(callback)
{
	$.get("/get_debug_room",callback);
}
Game.Input.addController = function(player,client)
{
    if(client)
    {
        document.addEventListener('keydown',gameKeyDownClient.bind(player,client));
        document.addEventListener('keyup',gameKeyUpClient.bind(player,client));
    }
    else
    {
        document.addEventListener('keydown',gameKeyDown.bind(player));
        document.addEventListener('keyup',gameKeyUp.bind(player));
    }
}
Game.Rendering.addPlayers = function(client,renderer)
{
    var it = client.getPlayersIterator();
    while(it.hasNext())
    {
        p = it.getNext();
        renderer.addPlayer(p)
    }
}
Game.Net.makeRoom = function(host,renderer)
{

}