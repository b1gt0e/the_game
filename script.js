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
    const draggableMarker = new AdvancedMarkerElement({
        map: innerMap,
        position: {lat: lat, lng: lon},
        title: 'Current Position',
        gmpDraggable: true,
    });
    mapElement.append(draggableMarker);
    draggableMarker.addListener('dragend', (event) => {
        const position = draggableMarker.position;
        console.log(`Pin dropped at: ${position.lat}, ${position.lng}`);
    });
}


function getLocation() {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        console.log(position.coords);
        console.log(latitude, longitude);
        initMap(latitude, longitude);
    });
}

async function getDistanceFromLatLonInFt() {
    navigator.geolocation.getCurrentPosition(position => {
        var lat1 = position.coords.latitude;
        var lon1 = position.coords.longitude;
        //const { lat1, lon1 } = position.coords;
        var lat2 = document.querySelector('gmp-advanced-marker').position.lat;
        var lon2 = document.querySelector('gmp-advanced-marker').position.lng;
        //console.log(lat1, lon1);
        //console.log(lat2, lon2);
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1);
        var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        ft = d * 3280.84; // km to ft
        //console.log(R, dLat, dLon, a, c, d, ft);
        console.log(ft);

        calculateScore(ft).then((score) => {
            let p = document.createElement("p");
            p.innerText = score;
            document.body.append(p);
        });
        
    });
    
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}



async function calculateScore( dist ){
    var dif = 2;
    if (dist < 100) {
        return 1000;
    }
    else if (dist < 1000) {
        return Math.pow((1000-dist),dif)/Math.pow(1000, dif-1);
    }
    else {
        return 0;
    }
}


const delay = ms => new Promise(res => setTimeout(res, ms));
async function showScore() {
    /*getDistanceFromLatLonInFt().then((ft) => {
        console.log("this happens instantly");
        console.log(ft);
        var score = calculateScore(distInFt);
        let p = document.createElement("p");
        p.innerText = score;
        document.body.append(p);
    });*/

    getDistanceFromLatLonInFt();
    //getDistanceFromLatLonInFt().then(x => { console.log(x); } );
    //(async () => {console.log(await getDistanceFromLatLonInFt())})()

    await delay(7000);
    
}