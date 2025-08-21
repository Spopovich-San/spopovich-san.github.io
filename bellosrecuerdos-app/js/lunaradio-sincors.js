// lunaradio-sincors.js modificado
alert("✅ Cargando sincors modificado!"); // Para comprobar que es este

(function($) {
  $.fn.lunaradio = function(options) {
    const settings = $.extend({
      streamurl: "",
      streamtype: "shoutcast2",
      shoutcastpath: "/stream",
      shoutcastid: "1",
      itunestoken: "1000lIPN",
      metadatainterval: 5000
    }, options);

    const container = this;

    function updateMetadata() {
      $.ajax({
        url: settings.streamurl + "/stats?sid=" + settings.shoutcastid + "&json=1",
        dataType: "jsonp",
        success: function(data) {
          if (data && data.songtitle) {
            $("#song").text(data.songtitle);
          }
        }
      });
    }

    // Primera carga
    updateMetadata();
    // Intervalo
    setInterval(updateMetadata, settings.metadatainterval);

    return this;
  };
})(jQuery);
