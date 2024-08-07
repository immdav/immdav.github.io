const ver = '2.4.6';
var ms_points = 'https://rewards.bing.com/pointsbreakdown';
var words = [];
var word_count = 0;
var temp = [];
var counter = 0;
var intId = 0;
let progress_prompt = document.getElementById("progress-prompt");
let progress_bar = document.getElementById("progress-bar");
let wordMaxCount = 16;
let personMaxCount = 16;
let maxTotal = wordMaxCount + personMaxCount;
let startImmediately = false;

console.log(`App version: ${ver}`);
$('#ui-version').text(ver);


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

function stats() {
    const uri = 'https://immd4v.pythonanywhere.com/api/statistics';
    return fetch(uri, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
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

function fetchDataWithApiKey(apiUrl, apiKey) {
    return fetch(apiUrl, {
        method: 'GET',
        headers: {
            'X-Api-Key': apiKey
        }
    })
    .then(response => {
        if (!response.ok) {
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

function getWords() {
    const apiUrl_randomword = 'https://api.api-ninjas.com/v1/randomword';
    const apiUrl_quotes = 'https://api.api-ninjas.com/v1/quotes';
    // proton API key
    const myApiKey = '4I88y0CF+wwBCS077hPyww==qehGWqCdb3EInRKX';
    // gmail API key
    // const myApiKey = 'oXkso28oFz1SaMGuS/PuKQ==CdMpU8qT0fwFTJVm';
    const badgeColors = ['is-success', 'is-primary', 'is-warning', 'is-secondary', 'is-info', 'is-danger', 'is-dark'];
    const wordSuffix = ['definition', 'def', 'meaning', 'thesaurus', 'synonyms', 'antonyms'];
    const personSuffix = ['', 'quotes', 'biography', 'images', 'life'];
    let totalCounter = 0;

    if(detectMob()) {
        wordMaxCount = 11;
        personMaxCount = 11;
        maxTotal = wordMaxCount + personMaxCount;
    }

    // Get random words from API
    for(let x=0; x < wordMaxCount; x++) {
        fetchDataWithApiKey(apiUrl_randomword, myApiKey)
            .then(data => {
                let randomIndex = Math.floor(Math.random() * badgeColors.length);
                let suffixIndex = Math.floor(Math.random() * wordSuffix.length);
                let word = `${data['word']} ${wordSuffix[suffixIndex]}`;
                words.push(word);
                document.getElementById("word-list").innerHTML += `<span class="tag ${badgeColors[randomIndex]}">${word}</span>`;
                totalCounter += 1;
                document.getElementById("wordCount").innerHTML = `${totalCounter} words to search`;
                if(words.length >= maxTotal) {
                    document.getElementById("myButton").disabled = false;
                }
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                // Handle errors as needed
            });
    }

    // Get random person from quotes API
    for(let x=0; x < personMaxCount; x++) {
        fetchDataWithApiKey(apiUrl_quotes, myApiKey)
            .then(data => {
                randomIndex = Math.floor(Math.random() * badgeColors.length);
                let suffixIndex = Math.floor(Math.random() * personSuffix.length);
                let author = `${data[0]['author']} ${personSuffix[suffixIndex]}`;
                words.push(author);
                document.getElementById("word-list").innerHTML += `<span class="tag ${badgeColors[randomIndex]}">${author}</span>`;
                totalCounter += 1;
                document.getElementById("wordCount").innerHTML = `${totalCounter} words to search`;
                if(words.length >= maxTotal) {
                    document.getElementById("myButton").disabled = false;
                }
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                // Handle errors as needed
            });
    }
}

// getWords();
function loadData() {
    document.getElementById("loadButton").disabled = true;
    getWords();
}

const urlParams = new URLSearchParams(window.location.search);
const hitApi = urlParams.get('hitApi');

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

updateTime();
// Update every second
setInterval(updateTime, 1000);

if(detectMob()) {
    wordMaxCount = 11;
    personMaxCount = 11;
    maxTotal = wordMaxCount + personMaxCount;
    startImmediately = true;
    $("#device-type").html(`<span class="tag is-info"><i class="bi bi-phone"></i>&ensp;Mobile</span><span class="tag is-success"><i class="bi bi-stack"></i>&ensp;${maxTotal} words</span>`);
}else {
    $("#device-type").html(`<span class="tag is-info"><i class="bi bi-display"></i>&ensp;Desktop</span><span class="tag is-success"><i class="bi bi-stack"></i>&ensp;${maxTotal} words</span>`);
}