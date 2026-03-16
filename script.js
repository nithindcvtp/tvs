const WRITE_KEY = "G4PC4DHVDQGE876Y";
const CHANNEL_ID = "3302262";

let lastState = "UNKNOWN";

// TURN RELAY ON
function relayOn(){

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=ON`)
.then(response => response.text())
.then(data => {

console.log("Write response:", data);

// wait before checking status
setTimeout(updateStatus,3000);

});

}

// TURN RELAY OFF
function relayOff(){

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=OFF`)
.then(response => response.text())
.then(data => {

console.log("Write response:", data);

setTimeout(updateStatus,3000);

});

}

// READ STATUS FROM THINGSPEAK
function updateStatus(){

fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.txt`)
.then(response => response.text())
.then(state => {

state = state.trim();

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

// AUTO UPDATE
setInterval(updateStatus,5000);

// INITIAL LOAD
window.onload = updateStatus;
