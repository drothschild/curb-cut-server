function getLocation() {
  if (navigator.geolocation){
  var timeoutVal = 10 * 1000 * 1000;
  navigator.geolocation.getCurrentPosition (
    setMapCenter,
    displayError,
    { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
    );
  }
}

function setMapCenter(position){
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var pos = new google.maps.LatLng(lat, lng);
    handler.map.centerOn(pos);
 }



function displayError(error) {
  var errors = { 
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
}


function getCurbsinBounds() {
  var bounds = hanlder.getBounds();
  var NorthEastCorner = [bounds.getNorthEast.lat(),bounds.getNorthEast.lng()] ;
  var SouthWestCorner = bounds.getSouthWest();
  var center = bounds.getCenter();
}


function curbsNew(geocode_information) {
    
      
    curbsNewMarker = new google.maps.Marker({
        position: new google.maps.LatLng(geocode_information.lat,geocode_information.lng), 
        map: handler.map.serviceObject,
        icon: 'http://www.google.com/mapfiles/marker_green.png',
    });
    
    // Invoke rails app to get the create form
    $.ajax({
        url: '/curbs/new?' + jQuery.param({curb:geocode_information}) + '#chunked=true',
        type: 'GET',
        success: function(html) { 
            
            // Add on close behavior to clear this marker
            var createFormOpen = function() {
                
                // Open new form                    
                openInfowindow(html, curbsNewMarker);
                $(document).bind("ajax:success", function(e, data, status, xhr){
                    console.log("Hey");
                    console.log(data);
                  }); 
                // Add close infowindow behavior
                google.maps.event.addListener(handler.map.visibleInfoWindow,'closeclick', function(){
                   clearMarker(curbsNewMarker);
                });   
            }
            
            // Invoke now
            createFormOpen();
            
            // Clicking "again" on the new marker will reproduce behavior 
            google.maps.event.addListener(curbsNewMarker, "click", function() {
                createFormOpen();
            });
        }
    });
}

var saveCurb = function(event) {
  // console.log (this);
  // $(form).bind("ajax:success", function(){
  //   if ( $(this).data('remotipartSubmitted')){
  //    var curb = $(this).data;
  //    console.log(curb);
  //   }
  // });

  // event.preventDefault();
  // console.log(event);
  // var data = $('form').serialize();
  // var uri = event.target.form.action;
  // console.log (uri);
  // $.ajax({
  //   url: uri,
  //   method: "POST",
  //   dataType: "json",
  //   data: data
  // }).done(function(response){
  //   clearMarker(curbsNewMarker);
  //   closeInfowindow();
  //   var marker = handler.addMarkers([
  //     {
  //       "lat": response.lat,
  //       "lng": response.lng,
  //       "picture": {
  //         "url": response.imgUrl,
  //         "width":  16,
  //         "height": 16
  //       },
  //       "infowindow": response.infowindow
  //     }
  //   ]);
  //   marker.serviceObject.set('id', response.id);
  //   markers.push(marker);
    
  // });
}

function deleteCurb(event) {
  event.preventDefault();
  var uri = event.currentTarget.href;
  var data = ""; 
  var ajaxRequest = $.ajax({
    url: uri,
    type: 'delete',
    data: data
  });
  ajaxRequest.done(function(serverResponse, status, jqXHR)
  {
    closeInfowindow();
    clearMarker(filterMarker(serverResponse.id));
    handler.markers= handler.markers.filter(function(m){
      return m.serviceObject.id != serverResponse.id;
    });
  })
}

function editCurb(event) {
  event.preventDefault();
  closeInfowindow();
  var uri = event.currentTarget.href + "/edit";
  var id = event.currentTarget.id;
  var data = ""; 
  var ajaxRequest = $.ajax({
    url: uri,
    type: 'get',
    data: data
  });
  ajaxRequest.done(function(serverResponse, status, jqXHR)
  {
    var marker = filterMarker(id);
    console.log (marker);

    handler.map.visibleInfoWindow = new google.maps.InfoWindow({content: serverResponse});
    handler.map.visibleInfoWindow.open(handler.map.serviceObject, marker);

    });
}


function filterMarker(id) {
 return handler.markers.filter(function(m){
    return m.serviceObject.id == id;
  })[0];
}


function openInfowindow(html, marker)  {
    
    // Close previous infowindow if exists
    closeInfowindow();
    
    // Set the content and open
    handler.map.visibleInfoWindow = new google.maps.InfoWindow({content: html});
    handler.map.visibleInfoWindow.open(handler.map.serviceObject, marker);
}

function closeInfowindow() {
    if (handler.visibleInfoWindow) 
        handler.visibleInfoWindow.close();
}    


function clearMarker(marker) {
    try {
        marker.setMap(null); 
    }
    catch (err){
    }
}



function geocodePoint(latLng, callback) {
    var street_number = ''; 
    var street = ''; 
    var country = ''; 
    var zip = ''; 
    var city = ''; 
    var name = '';
    var state = '';
    var lat = latLng.lat();
    var lng = latLng.lng();
      
    geocoder.geocode({'latLng': latLng }, function(responses) {  
        if (responses && responses.length > 0) {
          name = 'Curb at ' + responses[0].formatted_address;
              // Extract address parts
              responses[0].address_components.forEach(function(el) { 
                  
                  el.types.forEach(function(type) { 
                      if(type == 'street_number') street_number = el.long_name;  
                      if(type == 'route') street = el.long_name; 
                      if(type == 'country') country = el.long_name;
                      if(type == 'postal_code') zip = el.long_name; 
                      if(type == 'locality' && el.long_name) city = el.long_name;
                      if(type == 'city' && el.long_name) city = el.long_name;
                      if(type == 'administrative_area_level_1' && el.short_name) state = el.short_name;
                  }) 
              }); 
              
              // Export data by callback on success
              callback({
                  street_number: street_number,
                  street: street,
                  zip: zip,
                  city : city,
                  state: state,
                  country: country,
                  lat: lat,
                  lng: lng,
                  name:name
              }); 
              
        }
        else {
            // Inform user
            alert_user("Google Maps had some trouble finding the position, try somewhere else", "alert-error");
        }
    });  
}       

