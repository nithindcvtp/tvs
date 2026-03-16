const WRITE_KEY = "G4PC4DHVDQGE876Y";

const CHANNEL_ID = "3302262";

function relayOn(){

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=ON`)
.then(()=>updateStatus())

}

function relayOff(){

fetch(`https://api.thingspeak.com/update?api_key=${WRITE_KEY}&field1=OFF`)
.then(()=>updateStatus())

}

function updateStatus(){

fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.txt`)
.then(r=>r.text())
.then(state=>{

const el = document.getElementById("relayStatus");

el.textContent = `Relay is now ${state}`;

el.className = "status " + state.toLowerCase();

})

}
