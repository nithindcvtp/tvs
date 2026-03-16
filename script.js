const WRITE_KEY = "G4PC4DHVDQGE876Y";
const READ_KEY  = "UNH00NSYZ84WVY1E";
const CHANNEL_ID = "3302262";

let lastState = "UNKNOWN";


// TURN RELAY ON
function relayOn(){

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=ON`)
.then(response => response.text())
.then(data => {

console.log("Write response:", data);

// wait before checking status
setTimeout(updateStatus,2000);

});

}


// TURN RELAY OFF
function relayOff(){

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=OFF`)
.then(response => response.text())
.then(data => {

console.log("Write response:", data);

setTimeout(updateStatus,2000);

});

}


// READ STATUS FROM THINGSPEAK
function updateStatus(){

fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.txt?api_key=${READ_KEY}`)
.then(response => response.text())
.then(state => {

state = state.trim().toUpperCase();

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


// AUTO UPDATE STATUS EVERY 5 SECONDS
setInterval(updateStatus,5000);


// LOAD STATUS WHEN PAGE OPENS
window.onload = function(){
updateStatus();
};
