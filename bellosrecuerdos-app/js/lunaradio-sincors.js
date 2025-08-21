(function ($) {
  $.fn.lunaradio = function (options) {
    var settings = $.extend({
      streamurl: "",
      shoutcastid: "1",
      itunestoken: "",
      metadatainterval: 5000,
      coverimage: "brlogo.png",
      radioname: "Mi Radio"
    }, options);

    var $meta = $(this);

    function getMetadata() {
      $.ajax({
        url: settings.streamurl + "/stats?sid=" + settings.shoutcastid + "&json=1",
        dataType: "json",
        success: function (data) {
          if (data && data.songtitle) {
            $meta.text(data.songtitle);
            searchCover(data.songtitle);
          }
        }
      });
    }

    function searchCover(query) {
      if (!settings.itunestoken) return;
      $.ajax({
        url: "https://itunes.apple.com/search",
        dataType: "jsonp",
        data: { term: query, media: "music", limit: 1 },
        success: function (resp) {
          if (resp.results && resp.results[0]) {
            $("#cover").attr("src", resp.results[0].artworkUrl100.replace("100x100bb.jpg", "300x300bb.jpg"));
          }
        }
      });
    }

    setInterval(getMetadata, settings.metadatainterval);
    getMetadata();
    return this;
  };
}(jQuery));
