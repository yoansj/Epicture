
const CLIENT_ID = "a508c5347923263"
const CLIENT_SECRET = "b84797001e81d9bc98fc59f893c6459d994d0dd7"
const REFRESH = "037982602bb806c9dcfc843a87f259642bdefa15"

export function gallery() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Client-ID a508c5347923263");

    var formdata = new FormData();

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