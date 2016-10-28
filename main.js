function initMap() {
  function getRandomLocation() {
    $.ajax({
      dataType: "json",
      url: "https://videos-5a2ff.firebaseio.com/locations.json",
      success: function(data){
        drawMap(data[Math.floor(Math.random()*data.length)])
      }
    });
  }

  function hookVideo(videos, index /* expects 1 based int */, infoBubble, markerName) {
    console.log(videos);
    $(videos[index-1]).trigger('play');
    $(videos[index-1]).css( "border", "1px solid red" );
    videos[index-1].addEventListener('ended', function(e) {
      if(index < videos.length) {
        window.moveRight();
        index++;
        $(videos[index-1]).trigger('play');
        return hookVideo(videos, index, infoBubble, markerName);
      } else {
        index = 2;
        infoBubble.close();
        $('#infobubble-container-' + markerName.replace(/\s+/g, '')).remove();
        return setTimeout( getRandomLocation, 1000);
      }
    });
  }

  function drawMap(randomMarker) {
    window.myMap.panTo(new google.maps.LatLng(randomMarker.lat, randomMarker.lng));
    // var infowindow = new google.maps.InfoWindow({
    //   content: randomMarker.content,
    //   //pixelOffset: new google.maps.Size(100,100)
    // });
    var infoBubble = new InfoBubble({
      maxHeight: 600,
      maxWidth: 600,
      content: randomMarker.content,
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: 'transparent',
      borderRadius: 0,
      shadowStyle: 0,
    });

    if(window.myMarker){
      window.myMarker.setMap(null);
    }
    //hack fix later 
    $(document).ready(function(){
      window.myMarker = new google.maps.Marker({
        position: {lat:randomMarker.lat, lng:randomMarker.lng},
        map: window.myMap,
        title: randomMarker.name
      });
      //never start on au
      //never replay same area x2
      infoBubble.open(window.myMap, window.myMarker);
      google.maps.event.addListener(infoBubble, 'domready', function() {
        setTimeout(function() {
          sliderLoad();
          var ib = $('#infobubble-container-' + randomMarker.name.replace(/\s+/g, ''))
          ib.css({ visibility: 'visible' });
          var videos = $(ib).find('#ul-slider li video');
          var current = {
            video: 2
          };
          hookVideo(videos, current.video, infoBubble, randomMarker.name);
        }, 2000);
      });
    });
  }

  window.myMap = window.myMap || new google.maps.Map(document.getElementById('map'), {
    center: {lat: -25.363, lng: 131.044},
    zoom: 4
  });

  //setTimeout(drawMap, 1000);
  getRandomLocation();

  //var intervalID = window.setInterval(drawMap, 5000);

}