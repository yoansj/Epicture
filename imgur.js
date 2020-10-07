
export const CLIENT_ID = "a508c5347923263"
export const CLIENT_SECRET = "b84797001e81d9bc98fc59f893c6459d994d0dd7"
export const REFRESH = "037982602bb806c9dcfc843a87f259642bdefa15"


// GET Gallery Search
export async function imgurSearch(acessToken, sort = 'time', window = 'all', page = 0, text = "cats") {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    console.log("GET Gallery Search");
    const rep = await fetch(`https://api.imgur.com/3/gallery/search/${sort}/` + ((sort === "top") ? `${window}/` : "") + `${page}?q=${text}`, requestOptions).catch
    (value => {console.log("GET Gallery Search Error : ", value)})
    const data = await rep.json();
    //console.log(JSON.stringify(rep));
    //console.log(JSON.stringify(data));
    return (data);
}

// GET Account Favorites
export async function imgurFavorites(acessToken, username, page = 0, sort = "newest") {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    console.log("GET Account Favorites");
    const rep = await fetch(`https://api.imgur.com/3/account/${username}/favorites/${page}/${sort}`, requestOptions);
    const data = await rep.json();
    console.log(JSON.stringify(rep));
    return (data);
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

    console.log("GET Gallery");
    const rep = await fetch(`https://api.imgur.com/3/gallery/${section}/` + (section === "user" ? `${sort}/` : '') +
    (section === "top" ? `${window}/` : '') + `${page}?showViral=${showViral}&mature=${showMature}&albumPreviews=true`, requestOptions);
    const data = await rep.json();
    console.log(JSON.stringify(rep));
    return (data);
}

// POST Album / Image Voting
export async function imgurAlbumVote(acessToken, id, vote = "up") {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    }

    console.log("POST Album / Image Voting");
    const rep = await fetch(`https://api.imgur.com/3/gallery/${id}/vote/${vote}`, requestOptions);
    const data = await rep.json();
    //console.log(JSON.stringify(rep), JSON.stringify(data));
    return (rep);
}

//POST ACCOUNT BASE
export async function imgurProfileBase(acessToken, username = "Mamouki") {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);


    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const rep = await fetch(`https://api.imgur.com/3/account/${username}`, requestOptions);
    const data = await rep.json();
    return (data)
}

//POST Favorite Album
export async function imgurAlbumFavorite(acessToken, id) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
    };

    const rep = await fetch(`https://api.imgur.com/3/album/${id}/favorite`, requestOptions);
    const data = await rep.json();
    console.log(JSON.stringify(rep), JSON.stringify(data));
    return (data);
}