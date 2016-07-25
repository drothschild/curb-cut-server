$( window).load(
  function(){
  newMap();
  })

function setLocation() {
  if (navigator.geolocation){
  var timeoutVal = 10 * 1000 * 1000;
  navigator.geolocation.getCurrentPosition (
    setFormAndMap,
    displayError,
    { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
    );
  }
}

function newMap()
{
  // The Default coordinates are the center of Oakland

    var lat = 37.8044;
    var lng = 122.2711;

    var pos = new google.maps.LatLng(lat, lng);
  pos = 
  var options = {
        zoom: 10,
        center: pos,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    window.map = new google.maps.Map(document.getElementById("map"), options);
}


function setFormAndMap(position){
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    var pos = new google.maps.LatLng(lat, lng);
    window.map.setCenter(pos)

    var marker = new google.maps.Marker({
        position: pos,
        map: window.map,
        title: "User location"
      });


    $("#lat").val(lat);
    $("#lng").val(lng);


}



function displayError(error) {
  var errors = { 
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
}