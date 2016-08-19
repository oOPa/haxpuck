var addActions = function()
{
   document.addEventListener('keydown', (e) => {
        if (e.keyCode > 36 && e.keyCode < 41) {
            this.player.physics.keys[Directions[e.keyCode]] = true;
        }
    });
    document.addEventListener('keyup', (e) => {
            this.player.physics.keys[Directions[e.keyCode]] = false;

    });
    
    

}
Directions = {
    39:0,
    40:3,
    37:2,
    38:1
};