import * as FileSystem from 'expo-file-system';

export const CLIENT_ID = "350a4b0450465d9"
export const CLIENT_SECRET = "3cd9f8af74e1c40abbf9abbb5da334fefcdd075b"
export const REFRESH = "fecba479d2891084b4426d0fc9594c17b37f60f3"


/* GET Gallery Search */
/**
 * Search the gallery with a given query string.
 * @param {string} acessToken - a user's token giving by the api
 * @param {string} sort -how so sort search
 * @param {string} window - Change the date range of the request
 * @param {number} page - the data paging number
 * @param {string} text - searching parameter
 */
export async function imgurSearch(acessToken, sort = 'time', window = 'all', page = 0, text = "cats") {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    console.log("GET Gallery Search");
    const rep = await fetch(`https://api.imgur.com/3/gallery/search/${sort}/` + ((sort === "top") ? `${window}/` : "") + `?q=${encodeURI(text)}`, requestOptions).catch
    (value => {console.log("GET Gallery Search Error : ", value)})
    const data = await rep.json();
    //console.log(JSON.stringify(rep));
    //console.log(JSON.stringify(data));
    return (data);
}

/* GET Account Favorites */
/**
 * Returns the users favorited images, only accessible if you're logged in as the user.
 * @param {string} acessToken - a user's token giving by the api
 * @param {string} username - user's name you're looking for
 * @param {number} page - allows you to set the page number so you don't have to retrieve all the data at once
 * @param {string} sort -how so sort search
 */
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
    //console.log(JSON.stringify(rep));
    return (data);
}

/* GET Gallery */
/**
 * Getting the gallery of imgur api
 * @param {string} acessToken - a user's token giving by the api
 * @param {string} section - top, hot or user parameter
 * @param {string} sort  - sorting filter
 * @param {string} window - Change the date range of the request (day, week, ...)
 * @param {boolean} showViral - showing or not by viral
 * @param {number} page - Page of the search
 */
export async function imgurGallery(acessToken, section = 'hot', sort = 'viral', window = 'day', showViral = 'true', page = 0) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    console.log("GET Gallery");
    const rep = await fetch(`https://api.imgur.com/3/gallery/${section}/` + (section === "user" ? `${sort}/` : '') +
    (section === "top" ? `${window}/` : '') + `showViral=${showViral}&albumPreviews=true&page=${page}&perPage=100`, requestOptions);
    const data = await rep.json();
    //console.log(JSON.stringify(data));
    return (data);
}

/* GET Album Fav */
/**
 *  Listing the favorites of a user
 * @param {string} accessToken - a user's token giving by the api
 * @param {string} username - user's name you're looking for
 */
export async function imgurGetAlbumFav(accessToken, username) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);


    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    console.log("GET album fav");
    const rep = await fetch(`https://api.imgur.com/3/account/${username}/gallery_favorites`, requestOptions)
    const data = await rep.json();
    //console.log(JSON.stringify(rep),JSON.stringify(data), "get album");
    return (data);
}

/* GET Gallery Album */
/**
 * Get additional information about an album in the gallery.
 * @param {string} acessToken - a user's token giving by the api
 * @param {string} id - the id of the user in imgur
 */
export async function imgurGalleryGetAlbum(acessToken, id) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    console.log("GET Gallery Album");
    const rep = await fetch(`https://api.imgur.com/3/gallery/album/${id}`,requestOptions);
    const data = await rep.json();
    //console.log(JSON.stringify(rep),JSON.stringify(data), "get album");
    return (data);
}

/* GET account submissions */
/**
 * Return the images a user has submitted to the gallery.
 * @param {string} acessToken - a user's token giving by the api
 */
export async function imgurAccountSubmission(acessToken) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const rep = await fetch(`https://api.imgur.com/3/account/me/submissions`, requestOptions);
    const data = await rep.json();
    console.log(JSON.stringify(rep),JSON.stringify(data), "account sub");
    return (data);
}

/* GET image from id */
/**
 * Returns an array of Image IDs that are associated with the account.
 * @param {string} accessToken - a user's token giving by the api
 * @param {string} imageHash - image you are looking for
 */
export async function imgurGetImageId(accessToken, imageHash) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    const rep = await fetch(`https://api.imgur.com/3/image/${imageHash}`, requestOptions);
    const data = await rep.json();
    console.log(JSON.stringify(rep),JSON.stringify(data), "image's info");
    return (data);
}

/* POST Album / Image Voting */
/**
 * Vote for an image
 * @param {string} acessToken - a user's token giving by the api
 * @param {number} id - the id of the user in imgur
 * @param {string} vote - can be 'up' or 'down'
 */
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

/* GET ACCOUNT BASE */
/**
 * Get account base
 * @param {string} acessToken - a user's token giving by the api
 * @param {string} username - the name of the user in imgur
 */
export async function imgurProfileBase(acessToken, username = "Mamouki", returnRep) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);


    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    console.log("GET ACCOUNT BASE");
    const rep = await fetch(`https://api.imgur.com/3/account/${username}`, requestOptions);
    const data = await rep.json();
    //console.log(JSON.stringify(rep));
    if (returnRep) return (rep);
    return (data)
}

/* POST Favorite Album */
/**
 * Favorite an album with a given ID
 * @param {string} acessToken - a user's token giving by the api
 * @param {number} id  - the id of the user in imgur
 */
export async function imgurAlbumFavorite(acessToken, id) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
    };

    console.log("POST Favorite Album");
    const rep = await fetch(`https://api.imgur.com/3/album/${id}/favorite`, requestOptions);
    const data = await rep.json();
    console.log(JSON.stringify(rep), JSON.stringify(data));
    return (data);
}

/* GET Album */
/**
 * Get all the albums associated with the account.
 * @param {string} acessToken - a user's token giving by the api
 * @param {number} id - the id of the user in imgur
 */
export async function imgurAlbum(acessToken, id) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    console.log("GET Album");
    const rep = await fetch(`https://api.imgur.com/3/album/${id}`, requestOptions);
    const data = await rep.json();
    console.log(JSON.stringify(rep), JSON.stringify(data));
    return (data);
}

/* POST Image Upload */
/**
 * Upload a new image or video.
 * @param {string} acessToken - a user's token giving by the api
 * @param {*} media 
 * @param {string} mediaType -url
 * @param {*} album 
 * @param {*} title 
 * @param {*} description 
 * @param {*} disable_audio 
 */
export async function imgurImageUpload(acessToken, media, mediaType, album, title, description, disable_audio) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var formdata = new FormData();

    if (mediaType === "url") formdata.append("type", "url");
    if (mediaType === "image") formdata.append("type", "base64");
    if (mediaType === "video") {
        formdata.append("type", "file");
        const file = await FileSystem.readAsStringAsync(media, {
            encoding: FileSystem.EncodingType.UTF8,
        }).catch(
            err => {console.log(err)}
        ).then(
            value => {formdata.append("video", `${value}`); console.log("---------->", value);}
        );
    }
    if (mediaType === "image" || mediaType === "url") formdata.append("image", `${media}`);
    if (album) formdata.append("album", `${album}`);
    if (title) formdata.append("title", `${title}`);
    if (description) formdata.append("description", `${description}`);
    if (disable_audio) formdata.append("disable_audio", 1);

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
    };

    console.log("POST Image Upload");
    const rep = await fetch("https://api.imgur.com/3/image", requestOptions);
    const data = await rep.json();
    console.log(JSON.stringify(rep), JSON.stringify(data));
    console.log("Image upload ended");
    return ({rep, data});
}

//POST Album Creation
export async function imgurAlbumCreate(acessToken, ids, deleteHashes, title, description, privacy, cover) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var formdata = new FormData();

    if (ids) formdata.append("ids[]", ids);
    if (deleteHashes) formdata.append("deletehashes[]", deleteHashes);
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("privacy", privacy);
    if (cover) formdata.append("cover", cover);

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
    };

    console.log("POST Album Creation");
    const rep = await fetch("https://api.imgur.com/3/album", requestOptions);
    const data = await rep.json();
    console.log(JSON.stringify(data), JSON.stringify(rep));
    return ({rep, data});
}
