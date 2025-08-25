(function ($) {
    $.fn.lunaradio = function (options) {
        var settings = $.extend({
            radioname: "Mi Radio",
            streamurl: "",
            streamtype: "shoutcast2",
            shoutcastpath: "/stream",
            shoutcastid: "1",
            itunestoken: "1000lIPN",
            coverimage: "js/brlogo.png"
        }, options);

        var $container = $(this);
        var lastSong = ""; // guarda la última canción mostrada

        $("#luna-track").text("Cargando canción...");

        function updateMetadata(title, artist, coverUrl) {
            var fullTitle = title;
            if (artist) fullTitle = artist + " - " + title;

            // Solo actualizar si la canción cambió
            if (fullTitle === lastSong) return;
            lastSong = fullTitle;

            $("#luna-track").text(fullTitle);

            if (!coverUrl || coverUrl === "") coverUrl = settings.coverimage;

            if (typeof updateCover === "function") {
                updateCover(coverUrl);
            }
        }

        function fetchMetadata() {
            if (!settings.streamurl) return;

            var url = settings.streamurl + "/stats?sid=" + settings.shoutcastid + "&json=1";

            $.ajax({
                url: url,
                dataType: "json",
                success: function (data) {
                    if (data && data.songtitle) {
                        var parts = data.songtitle.split(" - ");
                        var artist = parts.length > 1 ? parts[0] : "";
                        var title = parts.length > 1 ? parts[1] : data.songtitle;

                        $.ajax({
                            url: "https://itunes.apple.com/search",
                            dataType: "jsonp",
                            data: {
                                term: artist + " " + title,
                                media: "music",
                                entity: "song",
                                limit: 1
                            },
                            success: function (res) {
                                var cover = "";
                                if (res.results && res.results.length > 0) {
                                    cover = res.results[0].artworkUrl100.replace("100x100", "600x600");
                                }
                                updateMetadata(title, artist, cover);
                            },
                            error: function () {
                                updateMetadata(title, artist, "");
                            }
                        });
                    }
                },
                error: function () {
                    console.log("No se pudieron obtener metadatos.");
                }
            });
        }

        // Ejecutar la primera vez
        fetchMetadata();

        // Retornar función para actualizar cuando tu stream detecte cambio
        return {
            refresh: fetchMetadata
        };
    };
})(jQuery);
