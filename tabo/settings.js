async function fetchDataWithApiKey(apiUrl) {
    return fetch(apiUrl, {
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

function openURI() {
    s_hitaApi = $('#settings-hitapi').prop('checked');
    s_autoStart = $('#settings-autostart').prop('checked');
    // s_autoClose = $('#settings-autoclose').prop('checked');
    s_stringCount = $('#settings-stringcount').val()

    a_string = `?hitApi=${s_hitaApi}&autoStart=${s_autoStart}&stringCount=${s_stringCount}`;

    // console.log(s_hitaApi);
    // console.log(s_autoStart);
    console.log(s_stringCount);

    window.open(outputString + a_string, '_blank');
}


const apiUrl_version = "https://motionbox.pythonanywhere.com/api/version";
let outputString = `https://visethr.site/tabo/`;

fetchDataWithApiKey(apiUrl_version)
    .then(data => {
        console.log(data);
        $('#about-api-version').text(data['version']);
    })
    .catch(err => {
        console.error('Error fetching data:', err);
        // Handle errors as needed
    });



console.log(`App version: ${ver}`);
$('#ui-version').text(ver);
$('#about-ui-version').text(ver);
$('#about-platform').text(platform);
if (detectMob()) {
    $('#about-platform').text(platform);
}

    