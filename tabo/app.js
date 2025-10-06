console.log(`App version: ${ver}`);
$('#ui-version').text(ver);

async function stats() {
    const data = { 
        ui_version: ver, 
        platform: platform,
        app: 'tabo',
        device_hash: dHash,
        referrer_link: referrerLink
    };
    return fetch(uriStats, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Session-Id': session,
            'X-User-Loc': userLoc
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

function connect() {
    if(skipGeo){
        document.getElementById("loadButton").disabled = false;
    }else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition, this.positionError);
        } else {
            console.debug('Geolocation not supported!');
        }
    }
}

function retryGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLoc = `${position.coords.latitude}, ${position.coords.longitude}`;
                localStorage.setItem("dsx_geo", userLoc);
                now = formatDateTime(new Date());
                localStorage.setItem("dsx_geox", now);

                $("#loadButton").html(`Get words`);
                $("#myButton").html(`Start`);
                document.getElementById("loadButton").disabled = false;
                stats()
                .then(data => {
                    apiStats = true;
                })
                .catch(err => {
                    console.error('Error fetching data:', err);
                    // Handle errors as needed
                });
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    alert("Location access is blocked. Please enable it in your browser settings and refresh the page.");
                } else {
                    console.error("Error occurred while retrieving location: ", error);
                }
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

function positionError(error){
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            alert('Oops! You need to enable location to continue using this service.');
            retryGeolocation();
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
    stats()
    .then(data => {
        apiStats = true;
    })
    .catch(err => {
        console.error('Error fetching data:', err);
        // Handle errors as needed
    });
    $("#loadButton").html(`Get words`);
    $("#myButton").html(`Start`);
}
  
function showPosition(position) {
    userLoc = `${position.coords.latitude}, ${position.coords.longitude}`;
    localStorage.setItem("dsx_geo", userLoc);
    now = formatDateTime(new Date());
    localStorage.setItem("dsx_geox", now);

    $("#loadButton").html(`Get words`);
    $("#myButton").html(`Start`);
    document.getElementById("loadButton").disabled = false;
    stats()
    .then(data => {
        apiStats = true;
    })
    .catch(err => {
        console.error('Error fetching data:', err);
        // Handle errors as needed
    });
}

function updateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    };
    const formattedDate = now.toLocaleDateString(undefined, options);
    $('#ui-datetime').html(`<i class="bi bi-clock-fill"></i> ${formattedDate}`);
    // document.getElementById('ui-datetime').textContent = formattedDate;
}

function updateProgress() {
    completed = word_count - temp.length;
    quotient = ((completed / word_count) * 100).toFixed(2);
    remainder = 100 - quotient;
    progress_bar.setAttribute("value", quotient);
    progress_bar.innerText = quotient + `%`;
    progress_prompt.innerText = `${completed} word/s searched.`;
}

function openRandomLink() {
    const randomIndex = Math.floor(Math.random() * words.length);
    let searchURL = `https://www.bing.com/search?pglt=106&q=${temp[randomIndex]}&cvid=c0c6c94d30f${counter}4c1cbaa0766c58c9ba${counter}e&gs_lcrp=EgRlZGdlKgYIBRAAGEAyBggAEEUYOTIGCAEQABhAMgYIAhAAGE${counter}yBggDEAAYQDIGC${counter}QQABhAMgYIBRAAGEAyBggGEAAYQDIGCAcQABhAMgYICBBFGDzSAQkxMDI2MmowajGoAgCwAgA&FORM=ANNTA1&PC=U531`;
    const newTab = window.open(searchURL, '_blank');
    counter += 1;
    temp.splice(randomIndex, 1);

    // Update progress bar
    updateProgress();

    if(temp.length == 0){
        clearInterval(intId);
        setTimeout(() => {
            clearInterval(intId);
            progress_bar.classList.remove("is-info");
            progress_bar.classList.add("is-success");
            progress_prompt.innerText = `Search complete!`;
            window.open(ms_points, '_blank');
        }, 6000);
    }
    setTimeout(() => {
        newTab.close();
    }, 8000);
}

function startRandomLink() {
    document.getElementById("loadButton").disabled = true;
    document.getElementById("myButton").disabled = true;
    document.getElementById("progress-card").style.display = "block";
    word_count = words.length;
    temp = words;
    if(startImmediately){
        openRandomLink(); // Open a link immediately
    }
    intId = setInterval(openRandomLink, 10000); // Open a new link every n seconds
    updateProgress();
}

function fetchDataWithApiKey(apiUrl) {
    return fetch(apiUrl, {
        method: 'GET',
        headers: { 
            'X-Device-Hash': dHash,
            'X-Session-Id': session,
            'X-User-Loc': userLoc
        }
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

function getStrings() {
    const apiUrl_strings = `https://api.visethr.xyz/api/random/string/get?count=${stringCount}`
    const badgeColors = ['is-success', 'is-primary', 'is-warning', 'is-secondary', 'is-info', 'is-danger', 'is-dark'];

    // Get random words from API
    fetchDataWithApiKey(apiUrl_strings)
        .then(data => {
            words = data['response']['strings'];
            document.getElementById("wordCount").innerHTML = `${stringCount} words to search`;
            for (let word of words) {
                let randomIndex = Math.floor(Math.random() * badgeColors.length);
                document.getElementById("word-list").innerHTML += `<span class="tag ${badgeColors[randomIndex]}">${word}</span>`;
            }
            document.getElementById("myButton").disabled = false;
        })
        .catch(err => {
            console.error('Error fetching data:', err);
            // Handle errors as needed
        });
    
}

// getWords();
function loadData() {
    document.getElementById("loadButton").disabled = true;
    getStrings();
}

const urlParams = new URLSearchParams(window.location.search);
const hitApi = urlParams.get('hitApi');
const URLautoClose = urlParams.get('autoClose');
const URLautoStart = urlParams.get('autoStart');
const URLstringCount = urlParams.get('stringCount');
let clickCount = 0;

// $("#loadButton").html(`<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&emsp;Get words`);
// $("#myButton").html(`<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&emsp;Start`);

// if(localStorage.getItem("dsx_geo") && (hitApi === 'true' || !hitApi)) {
//     let geoD = localStorage.getItem("dsx_geo");
//     let geoX = localStorage.getItem("dsx_geox");
//     let timeDifferenceInMinutes = getTimeDifferenceInMinutes(geoX);
//     if(timeDifferenceInMinutes < 100) {
//         userLoc = geoD;
//         skipGeo = true;
//         $("#loadButton").html(`Get words`);
//         $("#myButton").html(`Start`);
//         stats()
//         .then(data => {
//             apiStats = true;
//         })
//         .catch(err => {
//             console.error('Error fetching data:', err);
//             // Handle errors as needed
//         });
//     }    
// }

if(detectMob()) {
    stringCount = 22;
    startImmediately = true;
    platform = 'mobile';
    $("#platform").html(`<i class="bi bi-phone"></i>&ensp;Mobile`);
    
    // $("#device-type").html(`<span class="tag is-info"><i class="bi bi-phone"></i>&ensp;Mobile</span><span class="tag is-success"><i class="bi bi-stack"></i>&ensp;${stringCount} words</span>`);
}else {
    $("#platform").html(`<i class="bi bi-display"></i>&ensp;Desktop`);
}

if (hitApi === 'true' || !hitApi) {
    indexRemove = Math.floor(Math.random() * extUrls.length)
    window.open(extUrls[indexRemove], "_blank");
    extUrls.splice(indexRemove, 1);
    // connect();
    document.getElementById("loadButton").disabled = false;
    stats()
        .then(data => {
            apiStats = true;
        })
        .catch(err => {
            console.error('Error fetching data:', err);
            // Handle errors as needed
        });
}else {
    document.getElementById("loadButton").disabled = false;
    $("#loadButton").html(`Get words`);
    $("#myButton").html(`Start`);
}

// Initialize URL Parameters

if (URLstringCount) {
    stringCount = URLstringCount;
    console.log(`stringCount: ${stringCount}`);
    $("#string-count").html(`<i class="bi bi-stack"></i>&ensp;${stringCount} words`);
    // $("#device-type").html(`<span class="tag is-info"><i class="bi bi-phone"></i>&ensp;Mobile</span><span class="tag is-success"><i class="bi bi-stack"></i>&ensp;${stringCount} words</span>`);
}else {
    $("#string-count").html(`<i class="bi bi-stack"></i>&ensp;${stringCount} words`);
}

if (URLautoStart) {
    startImmediately = URLautoStart;
    console.log(`startImmediately: ${startImmediately}`);
}

if (URLautoClose) {
    autoClose = URLautoClose;
    console.log(`autoClose: ${autoClose}`);
}

document.getElementById("loadButton").addEventListener("click", function () {
    clickCount++;

    if (clickCount === 1 && (hitApi === 'true' || !hitApi)) {
        // First click: open URL in a new tab
        window.open(extUrls[Math.floor(Math.random() * extUrls.length)], "_blank");
    } else if (clickCount === 2 || hitApi === 'false') {
        loadData();
    }
});

updateTime();
// Update every second
setInterval(updateTime, 1000);

