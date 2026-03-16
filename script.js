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


// AUTO UPDATE STATUS
setInterval(updateStatus,5000);


// CREATE TIME SELECTORS
function populateTimeSelectors(){

const onHour = document.getElementById("schedOnHour");
const onMin = document.getElementById("schedOnMin");

const offHour = document.getElementById("schedOffHour");
const offMin = document.getElementById("schedOffMin");


// clear existing options
onHour.innerHTML = "";
onMin.innerHTML = "";
offHour.innerHTML = "";
offMin.innerHTML = "";


// HOURS (01–12)
for(let i=1;i<=12;i++){

let h = String(i).padStart(2,"0");

onHour.add(new Option(h,h));
offHour.add(new Option(h,h));

}


// MINUTES (00–59)
for(let i=0;i<60;i++){

let m = String(i).padStart(2,"0");

onMin.add(new Option(m,m));
offMin.add(new Option(m,m));

}

}


// ADD SCHEDULE FUNCTION
function addSchedule(){

const date = document.getElementById("schedDate").value;

const onHour = document.getElementById("schedOnHour").value;
const onMin = document.getElementById("schedOnMin").value;
const onAMPM = document.getElementById("schedOnAMPM").value;

const offHour = document.getElementById("schedOffHour").value;
const offMin = document.getElementById("schedOffMin").value;
const offAMPM = document.getElementById("schedOffAMPM").value;


if(!date){

alert("Please select a date");
return;

}


// convert 12h → 24h
function convertTo24(h,m,ampm){

h = parseInt(h);

if(ampm === "PM" && h < 12) h += 12;
if(ampm === "AM" && h === 12) h = 0;

h = String(h).padStart(2,'0');

return h + ":" + m;

}

const onTime = convertTo24(onHour,onMin,onAMPM);
const offTime = convertTo24(offHour,offMin,offAMPM);


alert(
"Schedule Added\n\n" +
"Date: " + date + "\n" +
"ON: " + onTime + "\n" +
"OFF: " + offTime
);

}


// INITIAL PAGE LOAD
window.onload = function(){

populateTimeSelectors();
updateStatus();

};
