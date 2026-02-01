console.log("Test");

getLocation();

async function initMap(lat, lon) {
    //  Request the needed libraries.
    const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
    ]);
    // Get the gmp-map element.
    const mapElement = document.querySelector('gmp-map');
    // Get the inner map.
    const innerMap = mapElement.innerMap;
    // Set map options.
    innerMap.setOptions({
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
    });
    // Add a marker positioned at the current location.
    const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: {lat: lat, lng: lon},
        title: 'Current Position',
        gmpDraggable: true,
    });
}
//initMap();





function getLocation() {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        console.log(position.coords);
        console.log(latitude, longitude);
        showPosition(latitude, longitude);
        //getDistanceFromLatLonInFt(position)
        // Show a map centered at latitude / longitude.
    }); 
}



function showPosition(lat, lon) {
    let latlon = lat + "," + lon;
    initMap(lat, lon);

    //let img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false&markers=color:blue%7Clabel:S%7C"+latlon+"&key=AIzaSyAFvqraMHzsOODo2TnGG_OIJYC9OTrUepI";
    //console.log(img_url);
    //document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
}


function getDistanceFromLatLonInFt(pos1, pos2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(pos2.coords.latitude-pos1.coords.latitude);  // deg2rad below
  var dLon = deg2rad(pos2.coords.longitude-pos1.coords.longitude);
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  var ft = d * 3280.84; // km to ft
  return ft;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}



function calculateScore( dist ){
    var dif = 2;
    if (dist < 20) {
        return 1000;
    }
    else if (dist < 1000) {
        return Math.pow((1000-dist),dif-1)/Math.pow(1000, dif-1);
    }
    else {
        return 0;
    }
}