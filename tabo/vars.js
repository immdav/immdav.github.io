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

function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getTimeDifferenceInMinutes(dtString) {
    let parsedDate = new Date(dtString.replace(' ', 'T'));
    let currentDate = new Date();
    let differenceInMillis = currentDate - parsedDate;
    let differenceInMinutes = Math.floor(differenceInMillis / 1000 / 60);
    
    return differenceInMinutes;
}

function generateRandomHash(count) {
    const array = new Uint8Array(count);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

const ver = '2.5.7-1';
const referrerLink = document.referrer;
var ms_points = 'https://rewards.bing.com/pointsbreakdown';
const uriStats = 'https://motionbox.pythonanywhere.com/api/tabo/statistics';
var words = [];
var word_count = 0;
var temp = [];
var counter = 0;
var intId = 0;
var platform = 'desktop';
var apiStats = false;
var userLoc = "";
let progress_prompt = document.getElementById("progress-prompt");
let progress_bar = document.getElementById("progress-bar");
let stringCount = 32
let startImmediately = false;
let autoClose = false;
let dHash = null;
let session = generateRandomHash(8);
let skipGeo = false;

if (localStorage.getItem("dsx_hash")) {
    dHash = localStorage.getItem("dsx_hash");
} else {
    let gHash = generateRandomHash(20)
    localStorage.setItem("dsx_hash", gHash);
    dHash = gHash;
}

$('#about-devicehash').text(dHash);