(function ($) {
    $.fn.lunaradio = function (options) {
        var settings = $.extend({
            radioname: "Radio",
            streamurl: "",
            streamtype: "shoutcast2",
            shoutcastpath: "/stream",
            shoutcastid: "1",
            itunestoken: "1000lIPN",
            metadatainterval: 5000,
            coverimage: "js/brlogo.png", // fallback
        }, options);

        var $cover = $("#luna-cover");
        var $track = $("#luna-track");

        function sanitizeTitle(title) {
            return title
                .replace(/\[.*?\]/g, "")  // quita [En Vivo]
                .replace(/\(.*?\)/g, "")  // quita (Live)
                .replace(/feat\..*/gi, "") // quita "feat."
                .trim();
        }

        function updateMetadata() {
            $.getJSON(settings.streamurl + "/stats?sid=" + settings.shoutcastid + "&json=1", function (data) {
                if (data && data.songtitle) {
                    var rawTitle = data.songtitle;
                    var cleanTitle = sanitizeTitle(rawTitle);

                    $track.text(rawTitle);

                    // Buscar en iTunes
                    $.ajax({
                        url: "https://itunes.apple.com/search",
                        data: {
                            term: cleanTitle,
                            entity: "song",
                            limit: 1
                        },
                        dataType: "jsonp",
                        success: function (res) {
                            if (res.results && res.results.length > 0) {
                                $cover.attr("src", res.results[0].artworkUrl100.replace("100x100", "300x300"));
                                $("#luna-bg").css("background-image", "url('" + res.results[0].artworkUrl100.replace("100x100", "600x600") + "')");
                            } else {
                                // fallback
                                $cover.attr("src", settings.coverimage);
                                $("#luna-bg").css("background-image", "url('" + settings.coverimage + "')");
                            }
                        },
                        error: function () {
                            $cover.attr("src", settings.coverimage);
                            $("#luna-bg").css("background-image", "url('" + settings.coverimage + "')");
                        }
                    });
                }
            });
        }

        // Actualizar cada intervalo
        setInterval(updateMetadata, settings.metadatainterval);
        updateMetadata();
    };
})(jQuery);
