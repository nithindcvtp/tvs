const WRITE_KEY = "G4PC4DHVDQGE876Y";
const CHANNEL_ID = "3302262";

let lastState = "UNKNOWN";

// TURN RELAY ON
function updateStatus(){

fetch("https://api.thingspeak.com/channels/3302262/fields/1/last.txt?api_key=UNH00NSYZ84WVY1E")
.then(response => response.text())
.then(state => {

state = state.trim();

const el = document.getElementById("relayStatus");

if(state === "ON"){

el.textContent = "Relay is now ON";
el.className = "status on";

}
else if(state === "OFF"){

el.textContent = "Relay is now OFF";
el.className = "status off";

}
else{

el.textContent = "Relay status unknown";

}

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
