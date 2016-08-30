var inputUp = function(player,e)
{
   // console.log("up");
    if (e.keyCode > 36 && e.keyCode < 41) {
        player.keys[Directions[e.keyCode]] = false;
    }       
}
var inputDown = function(player,e)
{
      //  console.log("down");
    if (e.keyCode > 36 && e.keyCode < 41) {
        player.keys[Directions[e.keyCode]] = true;
    }    
}
var gameKeyDown = function (e)
{
    inputDown(this,e);
}    
var gameKeyUp = function (e)
{
    inputUp(this,e);

} 
var gameKeyDownClient = function (client,e)
{
    inputDown(this,e);
    if(client.isOpen())
    {
        client.sendKeys();
    }
}    
var gameKeyUpClient = function (client,e)
{
    inputUp(this,e);
    if(client.isOpen())
    {
        client.sendKeys();
    }
} 



Directions = {
    39:0,
    40:3,
    37:2,
    38:1
};
