//Set default position (Center of Oakland) and build the map
function buildMap() {
  var lat = 37.8044;
  var lng = -122.2711;
  var pos = new google.maps.LatLng(lat, lng);
  geocoder = new google.maps.Geocoder();
  curbsNewMarker = null;
  handler = Gmaps.build('Google');
  handler.buildMap( {
    provider: {
      zoom: 15,
      do_clustering: false, 
      disableDoubleClickZoom: true,
      scrollwheel: false,
      center: pos
    },
    internal: {
      id: 'map'
    }
  });

}

// Add markers to array in handler object and add it to the map. 
function addMarkerstoMap(markers){
  handler.markers = markers.map (function(m) {
    var marker = handler.addMarker(m);
    // Set the id of the marker for filtering
    marker.serviceObject.set('id', m.id);
    return marker;
    })
}

// Get current user location
function getLocation() {
  if (navigator.geolocation){
  var timeoutVal = 10 * 1000 * 1000;
  navigator.geolocation.getCurrentPosition (
    // Upon success set the map center
    setMapCenter,
    displayError,
    { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
    );
  }
}
// Convert a geolocation position to google maps LatLng, and center the google map on it.  
function setMapCenter(position){
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var pos = new google.maps.LatLng(lat, lng);
    handler.map.centerOn(pos);
 }


// Display error on failure of geo location.
function displayError(error) {
  var errors = { 
    1: 'Geolocation Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
}

// Find the bounds the current map
// Currently unused
function getCurbsinBounds() {
  var bounds = hanlder.getBounds();
  var NorthEastCorner = bounds.getNorthEast() ;
  var SouthWestCorner = bounds.getSouthWest();
  var center = bounds.getCenter();
}
// Display  marker and new form for new curb
// Note: this does not create a new curb. 
//  The Create Curb script is called by the Rails controller- it's in the views/curbs/create.js.erb
function curbsNew(geocode_information) {
    // Get position of double click
    position = new google.maps.LatLng(geocode_information.lat,geocode_information.lng);
    // put "New" marker on map
    curbsNewMarker = new google.maps.Marker({
        position: position, 
        map: handler.map.serviceObject,
        icon: 'https://www.google.com/mapfiles/marker_green.png',
    });
    // request new curb form from rails controller
    $.ajax({
        url: '/curbs/new?' + jQuery.param({curb:geocode_information}) + '#chunked=true',
        type: 'GET',
        success: function(html) {            
            var createFormOpen = function() {
                
                // Open new form                    
                openInfowindow(html, curbsNewMarker);
                // Add close infowindow behavior to remove the new marker.
                google.maps.event.addListener(handler.map.visibleInfoWindow,'closeclick', function(){
                   clearMarker(curbsNewMarker);
                });   
            }            
            // Invoke now
            createFormOpen();            
            // Clicking again on the new marker will reproduce behavior 
            google.maps.event.addListener(curbsNewMarker, "click", function() {
                createFormOpen();
            });
        }
    });
}

var saveCurb = function(event) {
  // runs on clicking the save button in the New Curb form. 
  // Unused because attachments don't work with ajax requests
  //  The Create Curb script is called by the Rails controller- in the views/curbs/create.js.erb
}

// Deletes a curb from the server and removes it from the map
function deleteCurb(event) {
  event.preventDefault();
  // Create ajax request
  var uri = event.currentTarget.href;
  var data = ""; 
  var ajaxRequest = $.ajax({
    url: uri,
    type: 'delete',
    data: data
  });

  ajaxRequest.done(function(serverResponse, status, jqXHR)
  {
    // Remove the marker from the map
    clearMarker(filterMarker(serverResponse.id));
    // Filter out the marker from the array stored in handler. 
    handler.markers= handler.markers.filter(function(m){
      return m.serviceObject.id != serverResponse.id;
    });
  })
}


// Loads the edit curb form 
// Note: The Update Curb script is called by the Rails controller- it's in the views/curbs/update.js.erb
function editCurb(event) {
  event.preventDefault();
  // Create the ajax request for the edit form
  var uri = event.currentTarget.href + "/edit";
  var id = event.currentTarget.id;
  var marker = filterMarker(id);
  var data = ""; 
  // Store the current content in case the user cancels the update
  var oldContent = handler.currentInfowindow().getContent();
  var ajaxRequest = $.ajax({
    url: uri,
    type: 'get',
    data: data
  });
  ajaxRequest.done(function(serverResponse, status, jqXHR)
  {
    // set the currently open infowindow to the edit form   
    handler.currentInfowindow().setContent(serverResponse);
    // If the user clicks the close button on the info window, revert to the old data
    google.maps.event.addListener(handler.currentInfowindow(),'closeclick', function(){
        handler.currentInfowindow().setContent(oldContent);
    });
  });
}

// Return the marker with the matching id
function filterMarker(id) {
 return handler.markers.filter(function(m){
    return m.serviceObject.id == id;
  })[0];
}

// Opens an info window
// (Note: this is not for the windows associated with markers created by gmaps4rails- those are handled by the gem's javascript )
function openInfowindow(html, marker)  {
  // Close previous infowindow if exists
  closeInfowindow();
  // Set the content and open
  handler.map.visibleInfoWindow = new google.maps.InfoWindow({content: html});
  handler.map.visibleInfoWindow.open(handler.map.serviceObject, marker);

}

// Close current infowindow on the screen.
function closeInfowindow() {
   if (handler.currentInfowindow()){
        handler.currentInfowindow().close();
      }

}    

// Clears the a marker from the map
function clearMarker(marker) {
    try {
        marker.setMap(null); 
    }
    catch (err){
    }
}

// Uses the geocoder gem to get the address information based on the latlng 
// Then exports it in a callback
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
          // Extract the full address
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
            // Inform user on failure
            alert_user("Google Maps had some trouble finding the position, try somewhere else", "alert-error");
        }
    });  
}       

