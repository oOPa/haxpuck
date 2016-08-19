var tool_select = {
    name: 'select',
    cursor: 'default',
    init: function(){
        this.drag_type = false;
    },
    down: function(pt, ev){
        var shape = under_point(stadium, pt);
        this.shape = shape;
        if(!shape){
            this.drag_type = 'select';
            if(!(ev.shiftKey || ev.ctrlKey)){
                clear_selection(stadium);
            }
        }else{
            if(shape.type == 'segments'){
                this.drag_type = 'segment';
            }else{
                this.drag_type = 'move';
            }
            this.keep_others = ev.shiftKey || ev.ctrlKey;
            if(!selected(shape.object)){
                this.shape_selected = false;
                if(!this.keep_others)
                    clear_selection(stadium);
                select_shape(stadium, shape);
            }else{
                this.shape_selected = true;
            }
        }
        queue_render();
    },
    click: function(pt, ev){
        if(this.shape){
            if(this.shape_selected){
                if(this.keep_others){
                    unselect_shape(stadium, this.shape);
                }else{
                    clear_selection(stadium);
                }
            }
        }
        update_savepoint();
    },
    end_drag: function(from, to, ev){
        this.transform = false;
        this.drag_type = false;
        var shape = this.shape;
        if(!shape){
            select_rect(stadium, from, to);
            update_savepoint();
        }else if(shape.type == 'segments'){
            curve_segment_to_point(stadium, shape.object, to);
            modified();
        }else{
            if(for_selected(stadium, move_obj, from, to)){
                update_mirrored_geometry_selected(stadium);
                resize_canvas();
                modified();
            }
        }
    },
    key: function(){},
    dragging: function(from, to, ev){
        this.drag_from = from;
        this.drag_to = to;

        this.transform = (
            this.drag_type == 'move' ? transform_drag_move :
                this.drag_type == 'segment' ? transform_drag_curve :
                false);
        queue_render();
        if(this.drag_type == 'select'){
            $('#mousepos').text(Math.abs(from[0]-to[0])+' x '+Math.abs(from[1]-to[1]));
            return false;
        }else if(this.drag_type == 'move'){
            // bad idea
            //$('#mousepos').text('V '+(to[0]-from[0])+', '+(to[1]-from[1]));
            //return false;
        }else if(this.drag_type == 'segment'){
            return false;
        }
    },
    render: function(ctx){
        if(mouse_dragging && this.drag_type == 'select'){
            var a = this.drag_from;
            var b = this.drag_to;
            ctx.fillStyle = 'rgba(213,243,56,0.5)';
            ctx.fillRect(a[0], a[1], b[0]-a[0], b[1]-a[1]);
        }
    }
};
var tool_rotate = {
    name: 'rotate',
    cursor: 'default',
    init: function(){
        queue_render();
    },
    down: function(pt, ev){
        this.drag_from = pt;
    },
    click: function(pt, ev){
        transformation_center = pt;
        queue_render();
    },
    end_drag: function(from, to, ev){
        var cs = angle_cs_three(transformation_center, from, to);
         if(for_selected(stadium, rotate_obj, transformation_center, cs[0], cs[1])){
             update_mirrored_geometry_selected(stadium);
            resize_canvas();
            modified();
        }
    },
    key: function(){},
    render: render_transformation_center,
    dragging: function(from, to, ev){
        this.drag_to = to;
        $('#mousepos').text(round(three_point_angle(from, transformation_center, to)*180/pi)+'°');
        queue_render();
        return false;
    },
    transform: function(st, ctx, shape, draw){
        if(mouse_dragging && shape_fully_selected(st, shape)){
            var o = transformation_center;
            ctx.translate(o[0], o[1]);
            var cs = angle_cs_three(transformation_center, this.drag_from, this.drag_to);
            ctx.rotate(angle_to([0,0], cs));
            ctx.translate(-o[0], -o[1]);
        }
        draw();
    }
};
function set_tool(t){
    var old_tool = current_tool;
    current_tool = t;
    $('#button_tool_'+t.name).siblings('button').removeClass('active');
    $('#button_tool_'+t.name).addClass('active');
    $(canvas).css('cursor', t.cursor);
    t.init();
    trigger('set_tool', t, old_tool);
    queue_render();
}
function handle_down(ev){
    $(document.activeElement).blur();
    if(ev.which != 1)
        return;
    mouse_left_down = true;
    mouse_dragging = false;
    var pt = translate_coords([ev.pageX, ev.pageY]);
    drag_start_pos = pt;
    current_tool.down(pt, ev);
    return false;
}
function handle_up(ev){
    var ret;
    if(ev.which != 1)
        return;
    mouse_left_down = false;
    var pt = translate_coords([ev.pageX, ev.pageY]);
    if(mouse_dragging){
        mouse_dragging = false;
        current_tool.end_drag(drag_start_pos, pt, ev);
    }else{
        current_tool.click(pt, ev);
    }
    drag_start_pos = false;
    return false;
}

function handle_key(ev){
    //console.log('key', ev.which);

    if(ev.ctrlKey){
        return;
    }else if($(ev.target).is('textarea')){
        return;
    }else if($(ev.target).is('input')){
        if(ev.which == 13){ // RET
            $(document.activeElement).blur();
            return false;
        }
        return;
    }

    switch(ev.which){
    case 90: // Z
    case 85:// U
        undo();
        return false;
    case 82: // R
        redo();
        return false;
    case 46: // DEL
        if(delete_selected(stadium))
            modified();
        return false;
    case 65: // A
        select_all();
        return false;
    case 67: // C
        copy();
        return false;
    case 88: // X
        cut();
        modified();
        return false;
    case 86: // V
        paste();
        modified();
        return false;
    case 68: // D
        duplicate();
        modified();
        return false;
    case 49: // 1
    case 50: // 2
    case 51: // 3
    case 52: // 4
    case 53: // 5
    case 54: // 6
    case 55: // 7
    case 56: // 8
        set_tool([tool_select, tool_rotate, tool_scale, tool_segment,
                  tool_vertex, tool_disc, tool_goal, tool_plane]
                 [ev.which - 49]);
        return false;
    default:
        return current_tool.key(ev.which, ev);
    }
}

function handle_move(ev){
    var div_mousepos = $('#mousepos');
    var pt = translate_coords([ev.pageX, ev.pageY]);
    current_mouse_position = pt;
    if(window_width < ev.pageX * 2){
        div_mousepos.removeClass('left').addClass('right');
    }else{
        div_mousepos.removeClass('right').addClass('left');
    }
    var update_pos = true;
    if(mouse_left_down){
        if(!mouse_dragging && dist(pt, drag_start_pos) >= minimum_drag_distance){
            mouse_dragging = true;
        }
        if(mouse_dragging &&
           current_tool.dragging &&
           current_tool.dragging(drag_start_pos, pt, ev) === false){
            update_pos = false;
        }
    }else{
        if(current_tool.moving && current_tool.moving(pt, ev) === false)
            update_pos = false;
    }
    if(update_pos)
        div_mousepos.text(pt[0] + ', ' + pt[1]);
}

function check_logged_in(){
    $.ajax({
        type: 'GET',
        url: 'http://haxpuck.com/action/session', 
        dataType: 'jsonp',
        success: function(session){
            session_id = session.sessionid;
            if(session && session.username !== null && session.userid !== null){
                set_logged_in(session.userid, session.username);
            }
        },
    });
}
var tool_disc = {
    name: 'disc',
    cursor: 'default',
    init: function(){},
    down: function(pt, ev){
        this.drag_from = pt;
    },
    click: function(pt){
        var shape = add_disc(stadium, pt);
        select_shape(stadium, shape);
        resize_canvas();
        modified();
    },
    end_drag: function(from, to, ev){
        var shape = add_disc(stadium, from, dist(from, to));
        select_shape(stadium, shape);
        modified();
    },
    key: function(){},
    dragging: function(from, to, ev){
        this.drag_to = to;
        queue_render();
    },
    render: function(ctx){
        if(mouse_dragging){
            ctx.fillStyle = color_to_style(get_prop_val('color', 'FFFFFF'));
            ctx.beginPath();
            ctx.arc(this.drag_from[0], this.drag_from[1],
                    dist(this.drag_from, this.drag_to),
                    0, Math.PI*2, false);
            ctx.fill();
        }
    }
};
var tool_segment = {
    name: 'segment',
    cursor: 'default',
    init: function(){},
    click: function(){},
    end_drag: function(from, to, ev){
        var shape = add_segment(stadium, from, to);
        select_shape(stadium, shape);
        var v = segment_vertices(stadium, shape);
        select_shape(stadium, v[0]);
        select_shape(stadium, v[1]);
        modified();
    },
    key: function(){},
    down: function(pt, ev){
        this.drag_from = pt;
        this.curve = get_prop_val('curve', 0);
    },
    dragging: function(from, to, ev){
        this.drag_to = to;
        $('#mousepos').text(Math.round(dist(from,to))+'; '+Math.round(angle_to(from, to)/Math.PI*180)+'°');
        queue_render();
        return false;
    },
    render: function(ctx){
        if(mouse_dragging){
            ctx.lineWidth = 3;
            ctx.strokeStyle = color_to_style(get_prop_val('color', '000000')); 
            var arc = calculate_arc(this.drag_from, this.drag_to, this.curve);
            ctx.beginPath();
            if(arc.radius){
                ctx.arc(arc.center[0], arc.center[1], arc.radius, arc.from, arc.to, false);
            }else{
                ctx.moveTo(this.drag_from[0], this.drag_from[1]);
                ctx.lineTo(this.drag_to[0], this.drag_to[1]);
            }
            ctx.stroke(); 
        }
    }
};
function add_segment(st, from, to, no_mirror){
    var sa = under_point(st, from, 'vertexes');
    var sb = under_point(st, to, 'vertexes');

    var a = sa || add_vertex(st, from, true);
    var b = sb || add_vertex(st, to, true);

    var obj = {
        v0: a.index,
        v1: b.index
    };

    obj = $.extend({}, get_props_for_type('segments'), obj);

    st.segments.push(obj);
    
    var shape = Shape('segments', obj, st.segments.length - 1);

    if(mirror_mode && !no_mirror){
        $.each(mirror_directions, function(i, dir){
            if(!mirroring_disabled[dir] && can_mirror_segment(from, to, dir, obj.curve)){
                var seg = add_segment(st, mirror_point(from, dir), mirror_point(to, dir), true);
                if(shape.object.curve && (dir == 'horizontal' || dir == 'vertical'))
                    seg.object.curve = -shape.object.curve;
                link_shapes(shape, seg, dir);
                var v = segment_vertices(st, seg);
                link_shapes(a, v[0], dir);
                link_shapes(b, v[1], dir);
            }
        });
    }
    
    return shape;
}

var tool_vertex = {
    name: 'vertex',
    cursor: 'default',
    init: function(){},
    click: function(pt){
        var shape = add_vertex(stadium, pt);
        select_shape(stadium, shape);
        modified();
    },
    end_drag: function(){},
    key: function(){},
    down: function(pt, ev){}
};

var tool_goal = {
    name: 'goal',
    cursor: 'default',
    init: function(){},
    click: function(){},
    end_drag: function(from, to, ev){
        var shape = add_goal(stadium, from, to);
        select_shape(stadium, shape);
        modified();
    },
    key: function(){},
    down: function(pt, ev){
        this.drag_from = pt;
    },
    dragging: function(from, to, ev){
        this.drag_to = to;
        $('#mousepos').text(Math.round(dist(from,to))+'; '+Math.round(angle_to(from, to)/Math.PI*180)+'°');
        queue_render();
        return false;
    },
    render: function(ctx){
        if(mouse_dragging){
            ctx.lineWidth = 1;
            if(this.drag_from[0] < 0 || get_prop_val('team', 'blue') == 'red'){
                ctx.strokeStyle = 'rgb(255,0,0)';
            }else{
                ctx.strokeStyle = 'rgb(0,0,255)';
            }
            ctx.beginPath();
            ctx.moveTo(this.drag_from[0], this.drag_from[1]);
            ctx.lineTo(this.drag_to[0], this.drag_to[1]);
            ctx.stroke();
        }
    }
};

var tool_plane = {
    name: 'plane',
    cursor: 'default',
    init: function(){},
    down: function(){},
    click: function(pt){
        // TODO: proper snapping
        snap_point_for_plane(pt);
        var shape = add_plane(stadium, pt);
        select_shape(stadium, shape);
        modified();
    },
    end_drag: function(){},
    key: function(){},
    dragging: function(from, to, ev){},
    render: function(ctx){
        var pt = this.mouse_pos;
        if(pt){
            // TODO: proper snapping
            snap_point_for_plane(pt);
            var ext = plane_extremes_at_point(stadium, pt);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgb(255,255,255)';
            ctx.beginPath();
            ctx.moveTo(ext.a[0], ext.a[1]);
            ctx.lineTo(ext.b[0], ext.b[1]);
            ctx.stroke();
        }
    },
    moving: function(pt, ev){
        this.mouse_pos = pt;
        $('#mousepos').text(pt[0] + ', ' + pt[1] + '; ' + Math.round(angle_to(pt, [0,0])/Math.PI*180)+'°');
        queue_render();
        return false;
    }
};