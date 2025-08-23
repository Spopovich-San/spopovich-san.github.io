(function ($) {
    $.fn.lunaradio = function (options) {
        var settings = $.extend({
            userinterface: "big",
            backgroundcolor: "#000000",
            fontcolor: "#ffffff",
            hightlightcolor: "#FF6767",
            fontname: "Bebas Neue",
            googlefont: "Bebas+Neue&display=swap",
            fontratio: "0.4",
            radioname: "BELLOS RECUERDOS",
            scroll: "true",
            coverimage: "",
            onlycoverimage: "false",
            coverstyle: "square",
            streamurl: "",
            streamtype: "shoutcast2",
            shoutcastpath: "/stream",
            shoutcastid: "1",
            itunestoken: "1000lIPN",
            metadatainterval: "5000"
        }, options);

        // Crear contenedor
        var container = $(this);
        container.css({
            "background": settings.backgroundcolor,
            "color": settings.fontcolor,
            "font-family": settings.fontname,
            "text-align": "center",
            "padding": "20px"
        });

        // Logo / carátula
        var cover = $('<img>', {
            id: 'luna-cover',
            src: settings.coverimage,
            css: {
                "width": "200px",
                "height": "200px",
                "border-radius": (settings.coverstyle === "square" ? "0%" : "50%"),
                "margin-bottom": "15px"
            }
        });
        container.append(cover);

        // Nombre de la emisora
        var radioname = $('<h2>', {
            text: settings.radioname,
            css: {
                "font-size": "28px",
                "margin": "10px 0",
                "color": settings.hightlightcolor
            }
        });
        container.append(radioname);

        // Metadatos: artista + canción
        var trackInfo = $('<div>', {
            id: 'luna-track',
            text: 'Cargando canción...',
            css: {
                "font-size": "18px",
                "margin-top": "10px"
            }
        });
        container.append(trackInfo);

        // === ACTUALIZACIÓN DE METADATOS ===
        function updateMetadata() {
            $.ajax({
                url: settings.streamurl + "/stats?sid=" + settings.shoutcastid + "&json=1",
                dataType: "json",
                success: function (data) {
                    if (data && data.songtitle) {
                        $('#luna-track').text(data.songtitle);

                        // Buscar portada en iTunes
                        $.ajax({
                            url: "https://itunes.apple.com/search",
                            data: {
                                term: data.songtitle,
                                media: "music",
                                limit: 1
                            },
                            dataType: "jsonp",
                            success: function (json) {
                                if (json.results && json.results[0] && json.results[0].artworkUrl100) {
                                    $('#luna-cover').attr('src', json.results[0].artworkUrl100.replace("100x100", "300x300"));
                                }
                            }
                        });
                    }
                }
            });
        }

        // Primera carga y refresco periódico
        updateMetadata();
        setInterval(updateMetadata, settings.metadatainterval);
    };
}(jQuery));
