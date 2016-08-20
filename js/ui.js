$(document).ready(function(){
//createGame();
//load game ui
loadGameUI();
createLobby();

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

$('#button_login_login').click(function(){
    //login();
    hide_box();
    //show_rooms();
    show_lobby();
    
});
var loadGameUI = function()
{
    show_rooms();
}