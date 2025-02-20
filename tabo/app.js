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
            'X-Session-Id': session
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
    const newTab = window.open(`https://www.bing.com/search?pglt=171&q=${temp[randomIndex]}&cvid=4f3824c6c7b7447ab4c8dc5c82eff4d7&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQABhAMgYIAhAuGEAyBggDEAAYQDIGCAQQLhhAMgYIBRAuGEAyBggGEC${counter}YQDIGCAcQRRhBMgYICBBFGEHSAQc${counter}NDBqMGoxqAIAsAIA&FORM=ANNTA1&PC=U531`, '_blank');
    counter += 1;
    temp.splice(randomIndex, 1);
    // console.log(temp);

    // Update progress bar
    updateProgress();

    if(temp.length == 0){
        console.log(intId)
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
    }, 6000);
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
    intId = setInterval(openRandomLink, 8000); // Open a new link every n seconds
    updateProgress();
}

function fetchDataWithApiKey(apiUrl) {
    return fetch(apiUrl, {
        method: 'GET',
        headers: { 
            'X-Device-Hash': dHash,
            'X-Session-Id': session
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
    const apiUrl_strings = `https://motionbox.pythonanywhere.com/api/random/string/get?count=${stringCount}`
    const badgeColors = ['is-success', 'is-primary', 'is-warning', 'is-secondary', 'is-info', 'is-danger', 'is-dark'];

    // if(detectMob()) {
    //     wordMaxCount = 11;
    //     personMaxCount = 11;
    //     maxTotal = wordMaxCount + personMaxCount;
    // }

    // Get random words from API

    fetchDataWithApiKey(apiUrl_strings)
        .then(data => {
            words = data['response']['strings'];
            document.getElementById("wordCount").innerHTML = `${stringCount} words to search`;
            for (let word of words) {
                let randomIndex = Math.floor(Math.random() * badgeColors.length);
                console.log(word);
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

if(detectMob()) {
    stringCount = 22;
    startImmediately = true;
    platform = 'mobile';
    $("#platform").html(`<i class="bi bi-phone"></i>&ensp;Mobile`);
    
    // $("#device-type").html(`<span class="tag is-info"><i class="bi bi-phone"></i>&ensp;Mobile</span><span class="tag is-success"><i class="bi bi-stack"></i>&ensp;${stringCount} words</span>`);
}else {
    $("#platform").html(`<i class="bi bi-display"></i>&ensp;Desktop`);
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

if (hitApi === 'true' || !hitApi) {
    stats()
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error('Error fetching data:', err);
        // Handle errors as needed
    });
}

if (URLautoClose) {
    autoClose = URLautoClose;
    console.log(`autoClose: ${autoClose}`);
}

updateTime();
// Update every second
setInterval(updateTime, 1000);

