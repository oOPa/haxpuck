$(document).ready(function(){
//createGame();
//load game ui
loadGameUI();
createLobby();


$("#button_login").click(function()
{
    window.nickName = $("#login_name").val();
    if(window.nickName.length > 0)
    {
        console.log($("#login_name").val());
        //login();
        hide_box();
        show_rooms();
        //show_lobby();
    }
});

$("#btn_create_room").click(function(){
    show_box('make_room');
});

$("#button_make_room_close").click(function(){
    hide_box();
});
$("showGameButton").click(()=>{
    toggleLobby();
});
$("#button_room_register").click(function(){
    var roomName =$("#register_name").val();
    if(roomName.length > 0)
    {

    
    hide_box();
    $("#rooms").hide();
    show_lobby();
    makeRoom(roomName);

    }
});

    $("#chat_send").click(function(){
        $("#chat_log").append("NEW LIEN <br>");
    });
})



var createLobby = function()
{
     $( function() {
    $( "#red_lobby_list, #spec_lobby_list, #blue_lobby_list" ).sortable({
      connectWith: ".connectedSortable",dropOnEmpty :true
    }).disableSelection();
  } );
}
function toggleLobby(){
       var lob = $('#lobby');
    if(!lob.is(':visible')){
        $(canvas).hide();
        lob.show();
        //$('#button_properties').addClass('active');
        $('#bottomboxes').hide();
    }else{
        lob.hide();
        $(canvas).show();
        //$('#button_properties').removeClass('active');
        $('#bottomboxes').show();

    }
}

function show_rooms()
{
    $(canvas).hide();
    $("#room_table").DataTable();
    $("#rooms").show();
}
function show_lobby()
{
    $(canvas).hide();
    $("#lobby").show();
}



var loadGameUI = function()
{
    //this.client= new Client();
    this.host = new Host();
 show_box('login');
      // show_lobby();
          //show_box('make_room');
}
var joinRoom = function(host)
{
    this.client = new Client();
    client.joinRoom(host,function(){
        client.onrequestplayers = function(){
                //ready to load 
                showGameUI(client);
                client.onrequestplayers = 0
            }
        client.requestPlayers();
    });

}

var showGameUI = function(client)
{
    var render = new Renderer()
    window.renderer = render;
    render.setStadium(stadium);
   // render.start();





   // hide_box();
   // $(canvas).show();
    //$('#bottomboxes').show();
}
function attachPlayers()
{
    var player = client.me = new Player();
    window.player = player;
        //add action listeners
    document.addEventListener('keydown',gameKeyDown.bind(player));
    document.addEventListener('keyup',gameKeyUp.bind(player));
            
    /** add players */
    var keys = Object.keys(client.players)
    for(var i in keys)
    {
        console.log(client.players[keys[i]])
        renderer.addPlayer(client.players[keys[i]]);
    }
    renderer.addPlayer(client.me);
}

var makeRoom = function(room)
{
    var renderer = new Renderer();
    var host = new Host(window.nickName);
    renderer.setStadium(stadium);
    renderer.addPlayer(host.getPlayer())
    Game.Input.addController(host.getPlayer());
    renderer.start();
    host.on("brooker",(peer)=>{
        Game.Net.makeRoom(room,peer);
    });
    Game.UI.createPlayer(window.nickName);
    host.createRoom();
}