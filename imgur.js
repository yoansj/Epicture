
export const CLIENT_ID = "a508c5347923263"
export const CLIENT_SECRET = "b84797001e81d9bc98fc59f893c6459d994d0dd7"
export const REFRESH = "037982602bb806c9dcfc843a87f259642bdefa15"


// GET Gallery Search
export async function imgurSearch(sort = 'time', window = 'all', page = 0, text = "cats") {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Client-ID ${CLIENT_ID}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    console.log("Pre request");
    const rep = await fetch(`https://api.imgur.com/3/gallery/search/${sort}/` + ((sort === "top") ? `${window}/` : "") + `${page}?q=${text}`, requestOptions)
    const data = await rep.json();
    //console.log(JSON.stringify(rep));
    //console.log(JSON.stringify(data));
    return (data);
}

export async function imgurFavorites() {
    
}

// GET Gallery
export async function imgurGallery(acessToken, section = 'hot', sort = 'viral', page = 0, window = 'day', showViral = 'true', showMature = 'false') {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    console.log("Pre request");
    const rep = await fetch(`https://api.imgur.com/3/gallery/${section}/` + (section === "user" ? `${sort}/` : '') +
    (section === "top" ? `${window}/` : '') + `${page}?showViral=${showViral}&mature=${showMature}&albumPreviews=true`, requestOptions);
    const data = await rep.json();
    console.log(rep);
    return (data);
}