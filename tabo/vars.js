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

function generateRandomHash() {
    const array = new Uint8Array(20);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

const ver = '2.5.5';
var ms_points = 'https://rewards.bing.com/pointsbreakdown';
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

if (localStorage.getItem("dsx_hash")) {
    dHash = localStorage.getItem("dsx_hash");
} else {
    let gHash = generateRandomHash()
    localStorage.setItem("dsx_hash", gHash);
    dHash = gHash;
}
$('#about-devicehash').text(dHash);