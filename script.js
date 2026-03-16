const WRITE_KEY = "G4PC4DHVDQGE876Y";
const READ_KEY  = "UNH00NSYZ84WVY1E";
const CHANNEL_ID = "3302262";

let lastState = "UNKNOWN";


// TURN RELAY ON
function relayOn(){

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=ON`)
.then(r => r.text())
.then(data => {

console.log("Write response:", data);

setTimeout(updateStatus,2000);

});

}


// TURN RELAY OFF
function relayOff(){

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=OFF`)
.then(r => r.text())
.then(data => {

console.log("Write response:", data);

setTimeout(updateStatus,2000);

});

}


// READ STATUS FROM THINGSPEAK
function updateStatus(){

// prevent browser caching
const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.txt?api_key=${READ_KEY}&t=${Date.now()}`;

fetch(url)
.then(r => r.text())
.then(state => {

state = state.trim().toUpperCase();

console.log("ThingSpeak returned:", state);

if(state === "ON" || state === "OFF"){
lastState = state;
}

const el = document.getElementById("relayStatus");

el.textContent = "Relay is now " + lastState;

el.className = "status " + lastState.toLowerCase();

})
.catch(err => {

console.log("Status error:", err);

});

}


// AUTO UPDATE EVERY 5 SEC
setInterval(updateStatus,5000);


// INITIAL PAGE LOAD
window.onload = updateStatus;
