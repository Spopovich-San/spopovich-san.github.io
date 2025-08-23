/*
  LunaRadio Modificado: Solo interfaz visual (metadatos, logo y nombre)
*/

(function($) {
    $.fn.lunaradio = function(options) {
        var settings = $.extend({
            radioname: "Radio",
            streamurl: "https://whmsonic.playerfullhd.com:7034",
            streamtype: "shoutcast2",
            shoutcastpath: "/stream",
            shoutcastid: "1",
            itunestoken: "",
            coverimage: "",
            coverstyle: "square",
            fontcolor: "#ffffff",
            backgroundcolor: "#000000",
            hightlightcolor: "#FF6767",
            googlefont: "Bebas+Neue",
            fontname: "Bebas Neue",
            fontratio: "0.4",
            metadatainterval: 5000,
        }, options);

        var container = this;
        container.html(`
          <div style="text-align:center; padding-top:40px;">
            <div id="luna-cover">
              <img src="${settings.coverimage}" style="width:150px; height:150px; object-fit:cover; border-radius:5px;">
            </div>
            <h1 style="color:${settings.fontcolor}; font-size:28px; margin:10px 0;">${settings.radioname}</h1>
            <div id="luna-meta" style="color:${settings.hightlightcolor}; font-size:18px;">Conectando...</div>
          </div>
        `);

        function updateMetadata() {
            $.ajax({
                url: settings.streamurl + "/stats?sid=" + settings.shoutcastid + "&json=1",
                dataType: "json",
                success: function(data) {
                    if (data && data.songtitle) {
                        $("#luna-meta").text(data.songtitle);
                    }
                }
            });
        }

        setInterval(updateMetadata, settings.metadatainterval);
        updateMetadata();
    };
})(jQuery);
