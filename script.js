const WRITE_KEY = "G4PC4DHVDQGE876Y";
const READ_KEY  = "UNH00NSYZ84WVY1E";
const CHANNEL_ID = "3302262";

let countdown;


// TURN RELAY ON
function relayOn(){

document.getElementById("relayStatus").textContent = "Sending ON command...";

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=ON`);

startTimer("onTimer");

}


// TURN RELAY OFF
function relayOff(){

document.getElementById("relayStatus").textContent = "Sending OFF command...";

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=OFF`);

startTimer("offTimer");

}


// 15 SECOND TIMER
function startTimer(timerId){

let seconds = 15;

clearInterval(countdown);

const el = document.getElementById(timerId);

el.textContent = "Relay will update in 15 seconds";

countdown = setInterval(()=>{

seconds--;

el.textContent = "Relay will update in " + seconds + " seconds";

if(seconds <= 0){

clearInterval(countdown);

el.textContent = "";

updateStatus();

}

},1000);

}


// READ STATUS FROM THINGSPEAK
function updateStatus(){

const url =
`https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.txt?api_key=${READ_KEY}&t=${Date.now()}`;

fetch(url)
.then(r=>r.text())
.then(state=>{

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


// AUTO UPDATE EVERY 5 SECONDS
setInterval(updateStatus,5000);


// INITIAL PAGE LOAD
window.onload = function(){

populateTimeSelectors();
updateStatus();

};
