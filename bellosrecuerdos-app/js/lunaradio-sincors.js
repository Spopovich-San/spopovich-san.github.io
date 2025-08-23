(function ($) {
  $.fn.lunaradio = function (options) {
    var settings = $.extend({
      radioname: "Radio",
      streamurl: "",
      streamtype: "shoutcast2",
      shoutcastpath: "/stream",
      shoutcastid: "1",
      coverimage: "",
      coverstyle: "square",
      metadatainterval: 5000,
      autoplay: "true"
    }, options);

    // Audio nativo
    var audio = new Audio(settings.streamurl + settings.shoutcastpath);
    audio.autoplay = (settings.autoplay === "true");
    audio.volume = 0.8;

    // Portada inicial
    $("#luna-cover").attr("src", settings.coverimage);
    $("#luna-bg").css("background-image", `url(${settings.coverimage})`);

    // Refrescar metadatos
    function updateMetadata() {
      $.ajax({
        url: settings.streamurl + "/stats?sid=" + settings.shoutcastid + "&json=1",
        dataType: "json",
        success: function (data) {
          if (data.songtitle) {
            $("#luna-track").text(data.songtitle);
          }
          if (data.songurl) {
            $("#luna-cover").attr("src", data.songurl);
            $("#luna-bg").css("background-image", `url(${data.songurl})`);
          }
        }
      });
    }
    updateMetadata();
    setInterval(updateMetadata, settings.metadatainterval);
  };
}(jQuery));
