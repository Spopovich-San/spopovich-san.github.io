(function($){
    $.fn.lunaradio = function(options) {

        var settings = $.extend({
            userinterface: "big",
            backgroundcolor: "#000000",
            fontcolor: "#ffffff",
            hightlightcolor: "#FF6767",
            fontname: "Bebas Neue",
            googlefont: "Bebas+Neue&display=swap",
            fontratio: "0.4",
            radioname: "My Radio",
            scroll: "true",
            coverimage: "",
            onlycoverimage: "false",
            coverstyle: "square",
            streamurl: "",
            streamtype: "shoutcast2",
            shoutcastpath: "/stream",
            shoutcastid: "1",
            itunestoken: "1000lIPN",
            metadatainterval: "5000",
            autoplay: "false"
        }, options);

        return this.each(function(){
            var container = $(this);
            container.empty();
            container.css({
                "background-color": settings.backgroundcolor,
                "color": settings.fontcolor,
                "font-family": settings.fontname,
                "text-align": "center",
                "padding": "20px"
            });

            // Google Fonts
            if (settings.googlefont) {
                $("head").append("<link href='https://fonts.googleapis.com/css?family="+settings.googlefont+"' rel='stylesheet'>");
            }

            // Estructura principal (sin botones)
            var html = "";
            html += "<div class='lunaradio-info'>";
            html += "<div class='lunaradio-radioname' style='font-size:2em; margin-bottom:10px;'>" + settings.radioname + "</div>";
            html += "<div class='lunaradio-songtitle' style='font-size:1.2em; margin-bottom:15px;'>Cargando...</div>";
            if(settings.coverimage && settings.coverimage !== ""){
                html += "<div class='lunaradio-cover'><img id='lunaradio-coverimg' src='"+settings.coverimage+"' style='width:200px;height:200px;object-fit:cover;border-radius:"+(settings.coverstyle=="square"?"0":"50%")+";'></div>";
            }
            html += "</div>";

            container.append(html);

            // Función para obtener metadatos
            function getMetadata(){
                $.ajax({
                    url: settings.streamurl + "/stats?sid=" + settings.shoutcastid + "&json=1",
                    dataType: "json",
                    success: function(data){
                        if(data && data.songtitle){
                            container.find(".lunaradio-songtitle").text(data.songtitle);
                        }
                        if(data && data.songtitle){
                            fetchCover(data.songtitle);
                        }
                    }
                });
            }

            // Buscar portada en iTunes
            function fetchCover(title){
                $.ajax({
                    url: "https://itunes.apple.com/search",
                    dataType: "jsonp",
                    data: {
                        term: title,
                        media: "music",
                        entity: "musicTrack",
                        limit: 1
                    },
                    success: function(response){
                        if(response.results && response.results.length > 0){
                            var artwork = response.results[0].artworkUrl100.replace("100x100","300x300");
                            $("#lunaradio-coverimg").attr("src", artwork);
                        }
                    }
                });
            }

            // Cargar metadatos periódicamente
            getMetadata();
            setInterval(getMetadata, settings.metadatainterval);
        });
    };
})(jQuery);
