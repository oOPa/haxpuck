var gameKeyDown = function (e)
{
    console.log(e);
    if (e.keyCode > 36 && e.keyCode < 41) {
        this.keys[Directions[e.keyCode]] = true;
    }
    if(e.keyCode == 27)
    {
        toggleLobby();
    }
}    
var gameKeyUp = function (e,player)
{
    this.keys[Directions[e.keyCode]] = false;
} 
Directions = {
    39:0,
    40:3,
    37:2,
    38:1
};
