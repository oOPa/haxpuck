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
function initPixi(){
    var renderer = new PIXI.autoDetectRenderer(800, 600,{backgroundColor : 0x1099bb});

    // The renderer will create a canvas element for you that you can then insert into the DOM.
    document.getElementById("canvas_div").appendChild(renderer.view);
    
    // You need to create a root container that will hold the scene you want to draw.
    var stage = new PIXI.Container();
    initPixiDraw(stage);
    //animate
    animatePixi();
    function animatePixi()
    {
        requestAnimationFrame(animatePixi);
        renderer.render(stage);
    }
}
function initPixiDraw(stage)
{
    var container = new PIXI.Graphics();
    var ctx = new PIXI.Graphics();
    container.addChild(ctx);
    stage.addChild(container);
    var st = stadium;
    var transform;
    transform = function(shape, draw){ draw(); };
    //var ctx = canvas.getContext('2d');
    //ctx.setTransform(1, 0, 0, 1, 0, 0);
   // ctx.clearRect(0, 0, canvas_rect[2] - canvas_rect[0], canvas_rect[3] - canvas_rect[1]);
   window.ctx = ctx;
    //ctx.translate(-canvas_rect[0], -canvas_rect[1]);
    container.position.x = -canvas_rect[0]-250;
    container.position.y = -canvas_rect[1];
   //container.position.x=0;
   //container.position.y=0;
    //draw lines? 
  /*
        ctx.beginPath();
        ctx.moveTo(-st.width, -st.height);
        ctx.lineTo(st.width, -st.height);
        ctx.lineTo(st.width, st.height);
        ctx.lineTo(-st.width, st.height);
        ctx.clip();
    
*/
    //background
    drawBg(st, ctx);


    //draw segemnts
    $.each(st.segments, function(i, segment){
        transform(Shape('segments', segment, i), function(){
            segment = complete(st, segment);
           // console.log(segment);
            render_segment_arc(ctx, segment, segment_arc(st, segment));
        });
    });

/*
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

    
*/

}

$(document).ready(function(){
    initPixi();
    window.physics = new Physics();
    window.player = new Player(physics.world,stadium);
    addActions();
})
function transformStart()
{

}
function getTransformPos()
{

}
function drawBg(st, ctx){
    var bg = st.bg;
    //ctx.save();

    if(bg.type == 'grass' || bg.type == 'hockey'){
        ctx.beginFill( haxball[bg.type].bg_color);
        ///ctx.fillStyle = haxball[bg.type].bg_color;
        ctx.beginFill(0x718C5A);
        //ctx.fillRect(-st.width, -st.height, 2 * st.width, 2 * st.height);
        ctx.drawRect(-st.width, -st.height, 2 * st.width, 2 * st.height);
        //ctx.beginPath();
        
        ctx.moveTo(-bg.width + bg.cornerRadius, -bg.height);
        // TODO: this border doesn't render well in iceweasel
        ctx.arcTo(bg.width, -bg.height, bg.width, -bg.height + bg.cornerRadius, bg.cornerRadius);
        ctx.arcTo(bg.width, bg.height, bg.width - bg.cornerRadius, bg.height, bg.cornerRadius);
        ctx.arcTo(-bg.width, bg.height, -bg.width, bg.height - bg.cornerRadius, bg.cornerRadius);
        ctx.arcTo(-bg.width, -bg.height, -bg.width + bg.cornerRadius, -bg.height, bg.cornerRadius);

        //ctx.save();
        //ctx.clip();
        //ctx.fillStyle = bg_patterns[bg.type];
        //ctx.fillRect(-st.width, -st.height, 2 * st.width, 2 * st.height);
        ctx.drawRect(-st.width, -st.height, 2 * st.width, 2 * st.height);
        //ctx.restore();

        ctx.moveTo(0, -bg.height);
        ctx.lineTo(0, -bg.kickOffRadius);
        ctx.moveTo(bg.kickOffRadius, 0);
        ctx.arc(0, 0, bg.kickOffRadius, 0, Math.PI*2, true);
        ctx.moveTo(0, bg.kickOffRadius);
        ctx.lineTo(0, bg.height);

        ctx.lineWidth = 3;
        ctx.strokeStyle = haxball[bg.type].border_color;
        //ctx.stroke();
    }else{
        ctx.fillStyle = haxball.grass.bg_color;
        ctx.fillRect(-st.width, -st.height, 2 * st.width, 2 * st.height);
    }

    //ctx.restore();
}

function render_segment_arc(ctx, segment, arc){
    //ctx.beginPath();
    //console.log(arguments)
    if(arc.curve){
        ctx.arc(arc.center[0], arc.center[1], arc.radius, arc.from, arc.to, false);
    }else{
        ctx.moveTo(arc.a[0], arc.a[1]);
        ctx.lineTo(arc.b[0], arc.b[1]);
    }

    if(segment.vis !== false){
        //ctx.lineWidth = 3;
        //ctx.strokeStyle = color_to_style(segment.color || haxball.segment_color);
        //ctx.stroke();
        //console.log(segment)
        ctx.lineStyle(3, 0x000000)
    }
}
