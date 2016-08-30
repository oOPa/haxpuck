
function debugRen(key)
{
    window.client = new Client();   
  window.ren = window.renderer = new RendererClient();
  ren.setStadium(stadium);
  ren.start();
  window.player = client.getPlayer(); 

  document.addEventListener('keydown',gameKeyDownClient.bind(player,client));
  document.addEventListener('keyup',gameKeyUpClient.bind(player,client));
  client.joinRoom(key,function(){
      //console.log("?");
      client.on('requestplayers',()=>
      {
          var it = client.getPlayersIterator();
          while(it.hasNext())
          {
              p = it.getNext();
              ren.addPlayer(p)
          }
          client.on('state_update',(data)=>{
              ren.applyGameState(data.val);
          })
          //need better solution
          client.off('requestplayers');
          client.on("chat_message",(message,caller) =>{
              console.log(caller + ":" + message);
          });
      });
      client.requestPlayers();
  });
 // db();
 // animate();
}



$(document).ready(()=>

{

    //debugRen();

});

function serverDebug()
{
    window.host = new Host();


  window.ren = window.renderer = new Renderer();
  ren.setStadium(stadium);
  ren.start();
  window.player = host.getPlayer(); 
  document.addEventListener('keydown',gameKeyDown.bind(player));
  document.addEventListener('keyup',gameKeyUp.bind(player));
  ren.addPlayer(player);
  host.on("player_join",(player_from_network)=>{
      ren.addPlayer(player_from_network);
  });
      host.createRoom();
      //send periodic state updates
      var interval = setInterval(()=>{
          host.broadcastState(ren.getState().getData());
          
      },hx.network.interval);
}