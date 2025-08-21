(function ($) {

    $.fn.lunaradio = function (options) {

        var settings = $.extend({
            streamurl: "",
            streamtype: "shoutcast2",
            radioname: "Mi Radio",
            coverimage: "",
            onlycoverimage: "false",
            coverstyle: "square",
            scroll: "true",
            usevisualizer: "real",
            visualizertype: "0",
            metadatainterval: 5000,
            fontname: "Arial",
            googlefont: "",
            fontratio: "0.5",
            fontcolor: "#ffffff",
            hightlightcolor: "#ff0000",
            backgroundcolor: "#000000",
            itunestoken: ""
        }, options);

        var $player = $(this);

        // Construcción de la interfaz SIN botones
        $player.html(`
            <div class="lunaradio-player" style="font-family:${settings.fontname}, sans-serif; color:${settings.fontcolor}; background:${settings.backgroundcolor};">
                <div class="lunaradio-cover ${settings.coverstyle}">
                    <img id="lunaradio-cover" src="${settings.coverimage}" alt="cover">
                </div>
                <div class="lunaradio-info">
                    <div id="lunaradio-title" style="font-size:${settings.fontratio}em; color:${settings.hightlightcolor};">${settings.radioname}</div>
                    <div id="lunaradio-artist" style="font-size:${settings.fontratio * 0.7}em;">Cargando...</div>
                </div>
                <canvas id="lunaradio-visualizer" width="300" height="60"></canvas>
            </div>
        `);

        // Cargar Google Font si se usa
        if (settings.googlefont !== "") {
            var link = document.createElement("link");
            link.href = "https://fonts.googleapis.com/css?family=" + settings.googlefont;
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }

        // Función para obtener metadatos desde Shoutcast/Icecast
        function getMetadata() {
            $.ajax({
                url: settings.streamurl + "/stats?sid=" + settings.shoutcastid + "&json=1",
                dataType: "json",
                success: function (data) {
                    if (data && data.songtitle) {
                        $("#lunaradio-artist").text(data.songtitle);
                        // Buscar carátula en iTunes
                        searchCover(data.songtitle);
                    }
                },
                error: function () {
                    console.log("Error obteniendo metadatos");
                }
            });
        }

        // Buscar carátula usando iTunes API
        function searchCover(query) {
            if (!settings.itunestoken) return;
            $.ajax({
                url: "https://itunes.apple.com/search",
                dataType: "jsonp",
                data: {
                    term: query,
                    media: "music",
                    limit: 1
                },
                success: function (resp) {
                    if (resp.results && resp.results[0]) {
                        $("#lunaradio-cover").attr("src", resp.results[0].artworkUrl100.replace("100x100bb.jpg", "300x300bb.jpg"));
                    }
                }
            });
        }

        // Visualizador de ondas (canvas)
        if (settings.usevisualizer === "real") {
            const canvas = document.getElementById("lunaradio-visualizer");
            const ctx = canvas.getContext("2d");

            function drawVisualizer() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = settings.hightlightcolor;
                for (let i = 0; i < 20; i++) {
                    let barHeight = Math.random() * canvas.height;
                    ctx.fillRect(i * 15, canvas.height - barHeight, 10, barHeight);
                }
            }

            setInterval(drawVisualizer, 200);
        } else {
            $("#lunaradio-visualizer").remove();
        }

        // Lanzar metadatos
        setInterval(getMetadata, settings.metadatainterval);
        getMetadata();

        return this;
    };

}(jQuery));
