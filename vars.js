const apiUrl = `https://motionbox.pythonanywhere.com/api/tabo/statistics`;

function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

function generateRandomHash(count) {
    const array = new Uint8Array(count);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function stats() {
    const data = { 
        ui_version: ver, 
        platform: platform,
        app: 'root',
        device_hash: dHash,
        referrer_link: referrerLink
    };
    return fetch(apiUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Session-Id': session,
            'X-User-Loc': loc
        }, 
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            alert("Something went wrong! Please refresh the page or contact site owner!");
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        // You can handle errors here or rethrow them if needed
        throw error;
    });
}

function askPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      console.log('Location denied!');
    }
}

function getPosition(position) {
    loc = `${position.coords.latitude}, ${position.coords.longitude}`;
}


const ver = '1.0.1';
const referrerLink = document.referrer;
var platform = 'desktop';
var loc = '';
let dHash = null;
let session = generateRandomHash(8);
if (localStorage.getItem("dsx_hash")) {
    dHash = localStorage.getItem("dsx_hash");
} else {
    let gHash = generateRandomHash(20)
    localStorage.setItem("dsx_hash", gHash);
    dHash = gHash;
}
console.log(`Version: ${ver}`);

connect();
getPosition();

const urlParams = new URLSearchParams(window.location.search);
const hitApi = urlParams.get('hitApi');

// Initialize URL Parameters

if (hitApi === 'true' || !hitApi) {
    stats()
    .then(data => {
        console.debug(data);
    })
    .catch(err => {
        console.error('Error fetching data:', err);
        // Handle errors as needed
    });
}