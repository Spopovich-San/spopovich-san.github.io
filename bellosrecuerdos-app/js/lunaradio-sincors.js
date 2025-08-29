/*
 * LunaRadio - versión modificada
 * Solo muestra: Nombre estación + carátula + metadatos
 * Audio manejado por <audio> nativo en index.html
 */

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
      radioname: "Radio Online",
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

    // estructura del contenedor
    var html = '';
    html += '<div class="lunaradio-container" style="font-family:' + settings.fontname + '; color:' + settings.fontcolor + '; background:' + settings.backgroundcolor + ';">';
    html += '  <div class="lunaradio-header">';
    html += '    <div class="lunaradio-title">' + settings.radioname + '</div>';
    html += '  </div>';
    html += '  <div class="lunaradio-cover">';
    html += '    <img id="lunaradio-coverart" src="' + settings.coverimage + '" class="cover-' + settings.coverstyle + '">';
    html += '  </div>';
    html += '  <div class="lunaradio-meta">';
    html += '    <div id="lunaradio-songtitle">Cargando...</div>';
    html += '  </div>';
    html += '</div>';

    $(this).html(html);

    // === METADATOS ===
    function updateMetadata() {
      $.ajax({
        url: settings.streamurl + "/stats?sid=" + settings.shoutcastid + "&json=1",
        dataType: "json",
        success: function (data) {
          if (data && data.songtitle) {
            $("#lunaradio-songtitle").text(data.songtitle);

            // búsqueda de portada en iTunes
            $.ajax({
              url: "https://itunes.apple.com/search",
              dataType: "jsonp",
              data: {
                term: data.songtitle,
                media: "music",
                limit: 1
              },
              success: function (res) {
                if (res.results && res.results.length > 0) {
                  $("#lunaradio-coverart").attr(
                    "src",
                    res.results[0].artworkUrl100.replace("100x100", "300x300")
                  );
                }
              }
            });
          }
        }
      });
    }

    // actualización periódica
    setInterval(updateMetadata, settings.metadatainterval);
    updateMetadata();
  };
}(jQuery));
