$( window).load(
  function(){
  setLocation();
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



function setFormAndMap(position){
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    console.log (lat);
    var pos = new google.maps.LatLng(lat, lng);
    var options = {
        zoom: 15,
        center: pos,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    var map = new google.maps.Map(document.getElementById("map"), options);

    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: "User location"
      });


    $("#lat").val(lat);
    $("#longit").val(lng);


}

function displayError(error) {
  var errors = { 
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
}