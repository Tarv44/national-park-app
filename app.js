const apiKey = `fPZns4TP1vLZj4LdY4aWjrnKKgDveKwPq0oiWfTD`

const parksUrl = `https://developer.nps.gov/api/v1/parks`

function formatStates(states) {
    return states.replaceAll(",","").replaceAll(" ",",")
}

function formatQueryString(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function formatAddress(address) {
    return address.line1 + 
    ((address.line2 !== "") ? (', ' + address.line2) : '') + 
    ((address.line3 !== "") ? (', ' + address.line3) : '') +
    ', ' + address.city + ', ' + address.stateCode + ' ' + address.postalCode
}

function displayResults(responseJSON) {
    console.log('displayResults ran.');
    $('.js-results').empty()
    for (let i = 0; i < responseJSON.data.length; i++) {
        const park = responseJSON.data[i];
        const address = formatAddress(park.addresses[0]);
        $('.js-results').append(
            `<li>
                <h3>${park.fullName}</h3>
                <ul>
                    <li><a href='${park.url}'>${park.url}</a></li>
                    <li>${address}</li>
                    <li>${park.description}</li>
                </ul>
            </li>`
        )
    }
    $('.js-results').removeClass('hidden');
}

function getResults(states, maxCount) {
    console.log(`getResults ran.`)

    states = formatStates(states);

    const params = {
        api_key: apiKey,
        stateCode: states,
        limit: maxCount
    }

    const queryString = formatQueryString(params);

    const url = parksUrl + '?' + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            $('.js-error-msg').text(`Error: ${response.statusText}`)
            $('.js-error-msg').removeClass('hidden')
            throw new Error(response.statusText);})    
        .then(responseJSON => displayResults(responseJSON))
        .catch(err => {
            console.log(err);
        })
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        console.log(`watchForm ran.`)
        const states = $(`#js-states`).val()
        const maxCount = $(`#js-max-count`).val()
        getResults(states, maxCount);
    })
}

$(watchForm)