const WRITE_KEY = "G4PC4DHVDQGE876Y";
const CHANNEL_ID = "3302262";

// TURN RELAY ON
function relayOn(){

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=ON`)
.then(response => response.text())
.then(data => {

console.log("Command sent: ON, Entry:", data);

updateStatus();

});

}

// TURN RELAY OFF
function relayOff(){

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=OFF`)
.then(response => response.text())
.then(data => {

console.log("Command sent: OFF, Entry:", data);

updateStatus();

});

}


// UPDATE RELAY STATUS FROM THINGSPEAK
function updateStatus(){

fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.txt`)
.then(response => response.text())
.then(state => {

state = state.trim();   // remove newline characters

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
.catch(err => {

console.log("Status fetch error:", err);

});

}


// AUTO UPDATE STATUS EVERY 5 SECONDS
setInterval(updateStatus,5000);


// RUN ON PAGE LOAD
window.onload = function(){

updateStatus();

};
