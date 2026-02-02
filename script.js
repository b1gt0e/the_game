document.querySelector("body").style.visibility = "hidden";
document.querySelector("#loader").style.visibility = "visible";

getLocation();

const scoreElement = document.createElement("h3");
document.getElementById("controls").append(scoreElement);

const distElement = document.createElement("h3");
document.getElementById("controls").append(distElement);

async function initMap(lat, lon) {
    //  Request the needed libraries.
    const [{ Map }, { AdvancedMarkerElement, PinElement }] = await Promise.all([
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
    const pinScaled = new PinElement({
        scale: 6,
    });
    // Add a marker positioned at the current location.
    const draggableMarker = new AdvancedMarkerElement({
        map: innerMap,
        position: {lat: lat, lng: lon},
        title: 'Current Position',
        gmpDraggable: true,
    });
    draggableMarker.append(pinScaled); // scale marker so it is more visible
    mapElement.append(draggableMarker);
    draggableMarker.addListener('dragend', (event) => {
        const position = draggableMarker.position;
        console.log(`Pin dropped at: ${position.lat}, ${position.lng}`);
    });

    const scoreButton = document.getElementById("show-score-button");
    scoreButton.addEventListener('click', () => {
        //all the code for after reveal score button is pressed
        getDistanceFromLatLonInFt();
    });

    // box around campus
    const northCampusPoints = [
        {lat: 35.78777151085619, lng: -78.67692705136247},
        {lat: 35.78892015839864, lng: -78.67615800833093},
        {lat: 35.78869241063715, lng: -78.67472978566926},
        {lat: 35.78901917896282, lng: -78.67455888722704},
        {lat: 35.787622977636815, lng: -78.66789384792357},
        {lat: 35.78612772773917, lng: -78.66242509797308},
        {lat: 35.785731630338056, lng: -78.66303544966657},
        {lat: 35.78544445848715, lng: -78.66334062555343},
        {lat: 35.78500874749073, lng: -78.66354814517727},
        {lat: 35.78458293670858, lng: -78.66415849682055},
        {lat: 35.78388975148703, lng: -78.66484209062355},
        {lat: 35.78323121995871, lng: -78.665244922679}
    ];

    const nCampus = new google.maps.Polygon({
        path: northCampusPoints,
        strokeColor: "#00FF00",
        strokeOpacity: 0.3,
        strokeWeight: 5,
        fillColor: "#00FF00",
        fillOpacity: 0.1,
    });
    nCampus.setMap(innerMap);

}


function getLocation() {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        console.log(position.coords);
        console.log(latitude, longitude);
        initMap(latitude, longitude).then( () => {
            document.querySelector("#loader").style.display = "none";
            document.querySelector("body").style.visibility = "visible";
        } );
    });
}

async function getDistanceFromLatLonInFt() {
    scoreElement.id = "score-display";
    scoreElement.innerText = "Loading...";
    distElement.id = "score-display";
    distElement.innerText = "Loading...";
    navigator.geolocation.getCurrentPosition(position => {

        var lat1 = position.coords.latitude;
        var lon1 = position.coords.longitude;
        var lat2 = document.querySelector('gmp-advanced-marker').position.lat;
        var lon2 = document.querySelector('gmp-advanced-marker').position.lng;
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
        console.log(ft);


        calculateScore(ft).then((score) => {
            scoreElement.innerText = "Score: " + score;
            distElement.innerText = Math.round(ft) + "ft away"
        });

        const toandfro = [
            {lat: lat1, lng: lon1},
            {lat: lat2, lng: lon2}
        ];
        console.log(toandfro);
        const distLine = new google.maps.Polyline({
            path: toandfro,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 10,
        });
        distLine.setMap(document.querySelector('gmp-map').innerMap);
        
    });
    
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}



async function calculateScore( dist ){
    var dif = 2;
    var score = 0;
    console.log("dist: ", dist)
    if (dist < 100) {
        score = 1000;
    }
    else if (dist < 1000) {
        score =  Math.pow((1000-dist),dif)/Math.pow(1000, dif-1);
    }

    return Math.round(score);
}


const delay = ms => new Promise(res => setTimeout(res, ms));
async function showScore() {
    getDistanceFromLatLonInFt();
}