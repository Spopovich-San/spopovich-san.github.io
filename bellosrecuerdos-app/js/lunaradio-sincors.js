/*
 * Lunaradio modificado - solo metadatos y carátula, con Media Session
 */
(function ($) {
  $.fn.lunaradio = function (options) {
    var settings = $.extend({
      radioname: "Mi Radio",
      streamurl: "",
      streamtype: "shoutcast2",
      shoutcastpath: "/stream",
      shoutcastid: "1",
      itunestoken: "1000lIPN",
      coverimage: "js/brlogo.png",
      metadatainterval: 5000
    }, options);

    var lastSong = "";
    var lastCover = "";

    if (window._brTrackText) window._brTrackText.textContent = "Cargando canción...";

    function applyUI(title, artist, coverUrl) {
      var fullTitle = artist ? (artist + " - " + title) : title;

      // no cambió nada -> no toques UI (evita parpadeos)
      if (fullTitle === lastSong && coverUrl === lastCover) return;

      // título
      lastSong = fullTitle;
      if (window._brTrackText) window._brTrackText.textContent = fullTitle;

      // portada + blur
      var finalCover = coverUrl && coverUrl !== "" ? coverUrl : settings.coverimage;
      if (finalCover !== lastCover) {
        lastCover = finalCover;
        if (typeof window._brUpdateCover === "function") {
          window._brUpdateCover(finalCover);
        }
      }

      // Media Session (lockscreen / notificaciones)
      if (typeof window._brUpdateMediaSession === "function") {
        window._brUpdateMediaSession({ title: title, artist: artist, cover: finalCover });
      }
    }

    function fetchMetadata() {
      if (!settings.streamurl) return;
      var url = settings.streamurl + "/stats?sid=" + settings.shoutcastid + "&json=1";

      $.ajax({
        url: url, dataType: "json",
        success: function (data) {
          if (data && data.songtitle) {
            var parts = data.songtitle.split(" - ");
            var artist = parts.length > 1 ? parts[0] : "";
            var title  = parts.length > 1 ? parts[1] : data.songtitle;

            // Buscar portada en iTunes
            $.ajax({
              url: "https://itunes.apple.com/search",
              dataType: "jsonp",
              data: { term: artist + " " + title, media: "music", entity: "song", limit: 1 },
              success: function (res) {
                var cover = "";
                if (res.results && res.results.length > 0) {
                  cover = res.results[0].artworkUrl100.replace("100x100", "600x600");
                }
                applyUI(title, artist, cover);
              },
              error: function () {
                applyUI(title, artist, "");
              }
            });
          }
        },
        error: function () {
          console.log("No se pudieron obtener metadatos.");
        }
      });
    }

    // primera carga y luego cada X segundos
    fetchMetadata();
    setInterval(fetchMetadata, settings.metadatainterval);
  };
})(jQuery);
