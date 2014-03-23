jQuery(function ($) {
    
    var x = 100000000; 
    var count = Math.floor(Math.random()*x) + 1;

    var me = this;
    var conexion_selecionada = null;
    var objeto_selecionado = null;
    var windows;
    var arrow_style = "Straight";

	$( "#sortable-element li" ).draggable({
        appendTo: "body",
        helper: function() {
            return $("<ul class='sortable-element'></ul>").append( $(this).clone() );
        }
    });

    $( "#editor" ).droppable({
        accept: "#sortable-element li",
        drop: function(event,ui){
            
            var input;
            var type = $(ui.draggable).attr('attr-type');
            var clase = 'diagrama';
            count++;

            switch(type){
                case "actor":
                    clase = 'actor';
                break;

                default:
                    clase = 'diagrama';
                break;
            }

            input = "<span>Nueva Tarea</span>"+
                    "<div class='connect'></div>";
            
            $(" <div style='"+posicion_drop(ui)+"' id='"+count+"' class='objeto "+clase+"'></div> ").append(input).appendTo(this);
            workflow();
        }
    });


    $("body").on('dblclick','.objeto span',function(){
        var texto = prompt("Ingrese un texto");
        $(this).html(texto);
    });

    $("body").on('click','.objeto',function(){
        objeto_selecionado = this;
        console.log(windows.idOfCaller);
    });

    
    workflow = function(){
        
        jsPlumb.importDefaults({
            Endpoint : ["Dot", {radius:2}],
            HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:0 },
            ConnectionOverlays : [
                [ "Arrow", { 
                    location:1,
                    id:"arrow",
                    length:14,
                    foldback:0.8
                } ]
            ]
        });       

        windows = jsPlumb.getSelector('.objeto');
        
        jsPlumb.makeSource(windows, {

            filter:".connect",               
            anchor:"Continuous",
            connector:[ arrow_style, { curviness:63 } ],
            connectorStyle:{ 
                strokeStyle:"#5c96bc", 
                lineWidth:2, 
                outlineColor:"transparent", 
                outlineWidth:4
            },
            isTarget:true,
            dropOptions : targetDropOptions
            
        }); 

        jsPlumb.makeTarget(windows, {
            dropOptions:{ hoverClass:"dragHover" },
            anchor: "Continuous"             
        });


        var targetDropOptions = {
            tolerance:'touch',
            hoverClass:'dropHover',
            activeClass:'dragActive'
        };
        
        
        me.arrastrable();


        jsPlumb.bind("click", function(conn, originalEvent) {
            conexion_selecionada = conn;
            console.log(this);
            me.menu_arrow();
        });
    }


    posicion_drop = function(ui){
        var top = parseInt(ui.position['top'], 10) - 250;
        var left = parseInt(ui.position['left'], 10) - 560;
        var style = 'position:absolute;top:' + top + 'px;left:' + left + 'px;'
        return style;
    }

    
    //Eliminar conexión (flecha,unión) con el boton suprimir
    $(document).keyup(function(e){
        if(e.keyCode == 46){
            if(conexion_selecionada != null){
                jsPlumb.detach(conexion_selecionada);
                conexion_selecionada = null;
            }

            if(objeto_selecionado != null){
                jsPlumb.remove(objeto_selecionado);
                objeto_selecionado = null;
            }
        }

        console.log(jsPlumb.getSelector('.objeto'));
    }) 


    //Menu de opciones en la conexión (flecha,unión)
    me.menu_arrow = function(){
        $.contextMenu({
            selector: '._jsPlumb_connector ',
            trigger: 'left',
            callback: function(key, options) {
                var m = key;
                me.menu_accion(key);
            },
            items: {
                
                "fold1":{
                    "name": "Conector", 
                    "items": {
                        "flecha":   {"name": "Recto"},
                        "diagrama": {"name": "Diagrama"},
                        "ondular":  {"name": "Ondular"},
                        "cursiva":  {"name": "Cursiva"},
                    }
                },
                "fold1a": {
                    "name": "Estilo", 
                    "items": {
                        "solido":       {"name": "Solido"},
                        "discontinua":  {"name": "Discontinua"}
                    }
                },
                "sep1": "---------",
                "Eliminar":{"name": "Eliminar", "icon": "delete"},
            }
        });
    }


    me.menu_accion = function(accion){
        console.log(conexion_selecionada);
        if(accion == "Eliminar"){
            jsPlumb.detach(conexion_selecionada, {
                fireEvent: false, 
                forceDetach: false 
            })
        }

        if(accion == "flecha"){
            conexion_selecionada.setConnector("Straight");
        }

        if(accion == "diagrama"){
            conexion_selecionada.setConnector("Flowchart");
        }

        if(accion == "ondular"){
            conexion_selecionada.setConnector("Bezier");
        }

        if(accion == "cursiva"){
            conexion_selecionada.setConnector("StateMachine");
        }

        if(accion == "discontinua"){
            conexion_selecionada.setPaintStyle({ 
                strokeStyle:"#000", 
                lineWidth:2, 
                outlineColor:"transparent", 
                outlineWidth:4,
                dashstyle: "4 2"
            });
        }

        if(accion == "solido"){
            conexion_selecionada.setPaintStyle({ 
                strokeStyle:"#000", 
                lineWidth:2, 
                outlineColor:"transparent", 
                outlineWidth:4
            });
        }

    }
        
    me.arrastrable = function(){
        jsPlumb.draggable($(".objeto"), {
          containment:"editor"
        });
    }


});