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
      // if (window.myMarker==randomMarker.last){
      //   mapLocations[Math.floor(Math.random()*mapLocations.length)]; 
      // }
        //never start on au
        //never replay same area x2
      // if (mapLocations.name=="Uluru"){
      //   mapLocations[Math.floor(Math.random()*mapLocations.length)]; 
      // }
     // infowindow.open(window.myMap, window.myMarker);
      infoBubble.open(window.myMap, window.myMarker);
      google.maps.event.addListener(infoBubble, 'domready', function() {
        console.log('dropped one');
        setTimeout(function() {
          console.log('i am in timeout');
          sliderLoad();
          $('#infobubble-container').css({ visibility: 'visible' });
          var videos = $('#ul-slider li video');
          var currentVideo = 2;
          function hookVideo() {
            $(videos[currentVideo-1]).trigger('play');
            // console.log('video ' + currentVideo + '/' + videos.length + ' is playing')
            videos[currentVideo-1].addEventListener('ended', function(e) {
              if(currentVideo < videos.length) {
                window.moveRight();
                currentVideo++;
                $(videos[currentVideo-1]).trigger('play');
                return hookVideo();
              } else {
                currentVideo = 2;
                infoBubble.close();
                return setTimeout( getRandomLocation, 1000);
              }
            });
          }
          hookVideo();
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