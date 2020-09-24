
const CLIENT_ID = "a508c5347923263"
const CLIENT_SECRET = "b84797001e81d9bc98fc59f893c6459d994d0dd7"
const REFRESH = "037982602bb806c9dcfc843a87f259642bdefa15"

export function gallery() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Client-ID ${CLIENT_ID}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    fetch("https://api.imgur.com/3/gallery/hot/showViral=true&mature=false&album_previews=true", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

export async function imgurSearch(sort = 'time', window = 'all', page = 0, text = "cats") {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Client-ID ${CLIENT_ID}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    var returnValue;

    // Renvoie un objet json
    // Data correspond aux images
    // Data est un tableau
    /*await fetch(`https://api.imgur.com/3/gallery/search/${sort}/` + ((sort === "top") ? `${window}/` : "") + `${page}?q=${text}`, requestOptions)
        .then(response => response.text())
        .then(result => {returnValue = JSON.parse(result); console.log(returnValue); console.log(returnValue.data[0])})
        .catch(error => console.log('error', error));*/
    console.log("Pre request");
    const rep = await fetch(`https://api.imgur.com/3/gallery/search/${sort}/` + ((sort === "top") ? `${window}/` : "") + `${page}?q=${text}`, requestOptions)
    const data = await rep.json();
        /*.then(response => response.text())
        .then(result => {returnValue = JSON.parse(result); console.log(returnValue); console.log(returnValue.data[0])})
        .catch(error => console.log('error', error));*/
    console.log("After request", rep, data);
    return (data);
}