const WRITE_KEY = "G4PC4DHVDQGE876Y";
const CHANNEL_ID = "3302262";

// TURN RELAY ON
function relayOn(){

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=ON`)
.then(response => response.text())
.then(data => {

console.log("Command sent: ON, entry:", data);

// wait a bit before reading status
setTimeout(updateStatus,2000);

});

}


// TURN RELAY OFF
function relayOff(){

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=OFF`)
.then(response => response.text())
.then(data => {

console.log("Command sent: OFF, entry:", data);

setTimeout(updateStatus,2000);

});

}


// READ CURRENT STATE
function updateStatus(){

fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.txt`)
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
el.className = "status";

}

})
.catch(error => {

console.log("Status error:", error);

});

}


// AUTO REFRESH EVERY 5 SEC
setInterval(updateStatus,5000);


// LOAD STATUS WHEN PAGE OPENS
window.onload = function(){

updateStatus();

};
