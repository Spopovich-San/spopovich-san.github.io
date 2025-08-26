(function($){
  $.fn.lunaradio = function(options) {

    let settings = $.extend({
      streamurl: "",
      streamtype: "shoutcast2",
      shoutcastpath: "/stream",
      shoutcastid: "1",
      itunestoken: "1000lIPN",
      metadatainterval: 5000,
    }, options);

    let lastTrack = "";

    function updateMetadata(title, artist, coverUrl) {
      const newTrack = title + " - " + artist;

      if (newTrack !== lastTrack) {
        lastTrack = newTrack;

        // Texto
        $("#luna-track").text(newTrack);

        // Imagen
        if (!coverUrl || coverUrl === "") {
          coverUrl = "js/brlogo.png"; // logo por defecto
        }
        if (typeof updateCover === "function") {
          updateCover(coverUrl);
        }
      }
    }

    function fetchMetadata() {
      let url = settings.streamurl + "/stats?sid=" + settings.shoutcastid + "&json=1";

      fetch(url)
        .then(r => r.json())
        .then(data => {
          let title = "Desconocido";
          let artist = "";
          if (data.songtitle) {
            let parts = data.songtitle.split(" - ");
            artist = parts[0] || "";
            title  = parts[1] || parts[0] || "Desconocido";
          }

          // Buscar carátula en iTunes
          let cover = "";
          if (artist && title) {
            fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist + " " + title)}&entity=musicTrack&limit=1&token=${settings.itunestoken}`)
              .then(r => r.json())
              .then(itunes => {
                if (itunes.results && itunes.results.length > 0) {
                  cover = itunes.results[0].artworkUrl100.replace("100x100", "300x300");
                }
                updateMetadata(title, artist, cover);
              });
          } else {
            updateMetadata(title, artist, "");
          }
        })
        .catch(err => console.error("Error metadata:", err));
    }

    // Inicia interval
    setInterval(fetchMetadata, settings.metadatainterval);
    fetchMetadata();

    return this;
  };
})(jQuery);