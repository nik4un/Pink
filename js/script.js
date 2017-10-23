var navMain = document.querySelector(".main-nav");
var navSwitch = document.querySelector(".main-nav__trigger");
var pageHeader = document.querySelector(".page-header");
var pageIntro = document.querySelector(".intro");

navMain.classList.remove("main-nav_opened");
navMain.classList.add("main-nav_closed");
navMain.classList.remove("main-nav_nojs");
pageHeader.classList.remove("page-header_full");
pageIntro.classList.remove("intro_short");

navSwitch.addEventListener("click", function() {
  if (navMain.classList.contains("main-nav_closed")) {
    navMain.classList.remove("main-nav_closed");
    navMain.classList.add("main-nav_opened");
    if (pageHeader.classList.contains("page-header_full")) {
      pageHeader.classList.remove("page-header_full");
    } else {
      pageHeader.classList.add("page-header_full");
    };
    if (pageIntro.classList.contains("intro_short")) {
      pageIntro.classList.remove("intro_short");
    } else {
      pageIntro.classList.add("intro_short");
    };
  } else {
    navMain.classList.add("main-nav_closed");
    navMain.classList.remove("main-nav_opened");
    pageHeader.classList.remove("page-header_full");
    pageIntro.classList.remove("intro_short");
  }
});

var mapElement = document.getElementById("map");
if (mapElement) {
  var map = "";
  google.maps.event.addDomListener(window, "load", init);
  google.maps.event.addDomListener(window, "resize", m_res );
  function init() {
      var mapOptions = {
        zoom: 15,
        mapTypeControl: false,
        zoomControl: true,
        scrollwheel: false,
        zoomControlOptions: {position: google.maps.ControlPosition.LEFT_CENTER},
      streetViewControl: false,
      center: new google.maps.LatLng(59.936287, 30.321047),
    };

    mapElement.classList.add("contacts__map-box_map-loaded");
    map = new google.maps.Map(mapElement, mapOptions);
    var image = {
      url: "img/icon-map-marker.svg",
      size: new google.maps.Size(36, 36),
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 18)
    };

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(59.936287, 30.321047),
      map: map,
      optimized: false,
      icon: image
    });
    m_res();
  }

  function m_res(){
    google.maps.event.trigger(map, "resize");
    map.panTo(new google.maps.LatLng(59.936287, 30.321047));
  }
}
