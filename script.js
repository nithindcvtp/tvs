const WRITE_KEY = "G4PC4DHVDQGE876Y";
const READ_KEY  = "UNH00NSYZ84WVY1E";
const CHANNEL_ID = "3302262";


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

const url =
`https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.txt?api_key=${READ_KEY}&t=${Date.now()}`;

fetch(url)
.then(r => r.text())
.then(state => {

state = state.trim();

console.log("ThingSpeak returned:", state);

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

})
.catch(err => {

console.log("ThingSpeak error:", err);

});

}


// AUTO UPDATE EVERY 5 SECONDS
setInterval(updateStatus,5000);


// RUN WHEN PAGE LOADS
window.onload = updateStatus;
