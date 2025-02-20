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

const ver = '2.5.6';
const referrerLink = document.referrer;
var ms_points = 'https://rewards.bing.com/pointsbreakdown';
const uriStats = 'https://motionbox.pythonanywhere.com/api/tabo/statistics';
var words = [];
var word_count = 0;
var temp = [];
var counter = 0;
var intId = 0;
var platform = 'desktop';
let progress_prompt = document.getElementById("progress-prompt");
let progress_bar = document.getElementById("progress-bar");
let stringCount = 32
let startImmediately = false;
let autoClose = false;
let dHash = null;
let session = generateRandomHash(8);

if (localStorage.getItem("dsx_hash")) {
    dHash = localStorage.getItem("dsx_hash");
} else {
    let gHash = generateRandomHash(20)
    localStorage.setItem("dsx_hash", gHash);
    dHash = gHash;
}
$('#about-devicehash').text(dHash);