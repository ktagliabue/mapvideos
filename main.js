function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}
//marker drops then zoom then slider 
//change marker with thumbnail of next video

function initMap() {
  var listofVideos=[];
  var nextVideo=0;
  function playNextVideo(){
    window.randomMarker = listofVideos[nextVideo];
    drawMap();
    nextVideo++;
    if(nextVideo==listofVideos.length){
      nextVideo=0;
    }
  }

  function getRandomLocation() {
    $.ajax({
      dataType: "json",
      url: "https://videos-5a2ff.firebaseio.com/locations.json",
      success: function(data){
        listofVideos = shuffle(data);
        //drawMap(data[Math.floor(Math.random()*data.length)])
        playNextVideo();
      }
    });
  }

  function loadInfoBubble() {
    window.myInfoBubble.open(window.myMap, window.myMarker);
    google.maps.event.addListener(window.myInfoBubble, 'domready', function() {
      setTimeout(function() {
        var ib = $('#infobubble-container-' + window.randomMarker.name.replace(/\s+/g, ''))
        sliderLoad();
        ib.addClass('animated zoomIn');
        var videos = $(ib).find('#ul-slider li video');
        var current = {
          video: 2
        };
        hookVideo(videos, current.video, window.myInfoBubble, window.randomMarker.name);
      }, 2000);
    });
  }


  function hookVideo(videos, index /* expects 1 based int */, infoBubble, markerName) {
    $(videos[index-1]).trigger('play');
    videos[index-1].addEventListener('ended', function(e) {
      if(index < videos.length) {
        window.moveRight();
        index++;
        $(videos[index-1]).trigger('play');
        return hookVideo(videos, index, infoBubble, markerName);
      } else {
        index = 2;
        var ib = $('#infobubble-container-' + window.randomMarker.name.replace(/\s+/g, ''))
        ib.addClass('animated zoomOut');
        setTimeout(function(){
          infoBubble.close()
          $('#infobubble-container-' + markerName.replace(/\s+/g, '')).remove();
        }, 1000);
        return setTimeout( playNextVideo, 2000);
      }
    });
  }

  function drawMap() {
    var point = window.myMap.getCenter();
                
                
    // window.myMap.panTo(new google.maps.LatLng(randomMarker.lat, randomMarker.lng));
    window.easingAnimator.easeProp(
      { // from
        lat: point.lat(),
        lng: point.lng()
      },
      { // to
        lat: window.randomMarker.lat,
        lng: window.randomMarker.lng
      }
    );
    // var infowindow = new google.maps.InfoWindow({
    //   content: randomMarker.content,
    //   //pixelOffset: new google.maps.Size(100,100)
    // });
    window.myInfoBubble = new InfoBubble({
      maxHeight: 600,
      maxWidth: 600,
      content: window.randomMarker.content,
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
        animation: google.maps.Animation.DROP,
        position: {lat:window.randomMarker.lat, lng:window.randomMarker.lng},
        //zoom: 20,
        map: window.myMap,
        title: window.randomMarker.name
      });
      //never start on au
      //never replay same area x2
      
    });
  }

  window.myMap = window.myMap || new google.maps.Map(document.getElementById('map'), {
    center: {lat: -25.363, lng: 131.044},
    zoom: 4
  });

  window.easingAnimator = EasingAnimator.makeFromCallback(function(latLng, done){
    window.myMap.setCenter(latLng);
    if(done) {
      loadInfoBubble();
    }
  });

  //setTimeout(drawMap, 1000);
  getRandomLocation();


  //var intervalID = window.setInterval(drawMap, 5000);

}