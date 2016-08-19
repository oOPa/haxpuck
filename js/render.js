var previousTime = 0;
function animate(time) {
    dt = time - previousTime;
    previousTime = time;
    physics.update();
    player.update();
    render(stadium);
    // /console.log(1000 /dt)
    requestAnimationFrame(animate);
}

function render(st){

    var transform;
    transform = function(shape, draw){ draw(); };
    var ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas_rect[2] - canvas_rect[0], canvas_rect[3] - canvas_rect[1]);
    ctx.translate(-canvas_rect[0], -canvas_rect[1]);
    //draw lines? 
  
        ctx.beginPath();
        ctx.moveTo(-st.width, -st.height);
        ctx.lineTo(st.width, -st.height);
        ctx.lineTo(st.width, st.height);
        ctx.lineTo(-st.width, st.height);
        ctx.clip();
    

    //background
    renderbg(st, ctx);


    //draw segemnts
    $.each(st.segments, function(i, segment){
        transform(Shape('segments', segment, i), function(){
            segment = complete(st, segment);
            render_segment_arc(ctx, segment, segment_arc(st, segment));
        });
    });

    //draw discs
    $.each(st.discs, function(i, disc){
        transform(Shape('discs', disc, i), function(){
            disc = complete(st, disc);
            ctx.beginPath();
            var radius = disc.radius !== undefined ? disc.radius : haxball.default_disc_radius;
            ctx.arc(disc.pos[0], disc.pos[1], radius, 0, Math.PI*2, true);

            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.lineWidth = 2;
            ctx.fillStyle = color_to_style(disc.color, haxball.disc_color);
            ctx.fill();
            ctx.stroke();
        });
    });

    $.each(debug_render, function(i, f){ f(ctx); });



    // draw puck
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI*2, true);
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // draw red
    ctx.beginPath();
    //ctx.arc(-st.spawnDistance, 0, 15, 0, Math.PI*2, true);
    var point = player.point();
    ctx.arc(point.x,point.y,15, 0, Math.PI*2, true);
    ctx.fillStyle = 'rgb(240,0,0)';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    // draw blue
    ctx.beginPath();
    ctx.arc(st.spawnDistance, 0, 15, 0, Math.PI*2, true);
    ctx.fillStyle = 'rgb(0,0,248)';
    ctx.fill();
    ctx.stroke();

    


}
//animate();

$(document).ready(function(){
    window.physics = new Physics();
    window.player = new Player(physics.world,stadium);
    addActions();
})