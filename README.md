# Epicture

The goal of this project is to make a Imgur client in a mobile aplication using their API

The project’s functionalities asked by the school are set out as follows:

* Imgur [API](https://apidocs.imgur.com/) implementation
* Authenticate to the Imgur platform
* Display the photos put online by the user connected
* Search for photos on the plateform
* Upload photos to the plateform
* Manage your favorites
* Filter the displayed photos

## Disclaimer for Epitech Students ⚠️

Just a little reminder for Epitech Students, copying code for a project is bad, I will not be responsible for any -42 you could get by copying the code of this repository.

## Authors

Project realise by Yoan Saint-Juste and Matthieu Kozicki. (3nd year in Epitech-Paris Promo - 2023)

## Installation

Requires : npm, react, react-native & expo </br>
Clone the repository

```bash
git clone  git@github.com:EpitechIT2020/B-DEV-501-PAR-5-1-epicture-yoan.saint-juste.git
```

## API Wrapper
[You can read about the Imgur API here.](https://apidocs.imgur.com/)
During this project we tried to make a little wrapper for the imgur API.
The imgur.js file holds many of the function used to make calls to the API

##### Example

```javascript
/* POST Comment Creation */
/**
 * Vote for a comment
 * @param {string} acessToken - a user's token giving by the api
 * @param {string} image_id - The ID of the image or album in the gallery that you wish to comment on
 * @param {string} comment - The comment text, this is what will be displayed
 * @param {string} parent_id - The ID of the parent comment, this is an alternative method to create a reply.
 */
export async function imgurCommentCreate(acessToken, image_id, comment, parent_id) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${acessToken}`);

    var formdata = new FormData();

    if (image_id) formdata.append("image_id", `${image_id}`);
    if (comment) formdata.append("comment", `${comment}`);
    if (parent_id) formdata.append("parent_id", `${parent_id}`);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    }

    console.log("POST Comment Creation");
    const rep = await fetch(`https://api.imgur.com/3/comment`, requestOptions);
    const data = await rep.json();
    return ({rep, data});
}
```

## Usage

```bash
npm install
npm start
```
Scan the QR-code and you are good to go !

## Functionalities

* Search for any post on imgur (filter with parameters)
* Upvote/downvote album
* Manage your favorites
* See comments and upvote/downvote
* See favorites of user connected
* See profil information (profil pic, name, internet point, ...)
* Modify profile information
* Post an album using a link, a file or camera
* Post a comment

## Git

Norm of commit used : [BRANCH][ACTION with verbs] Commit description


##### Example of commits used
[BRANCH] | [ACTION] | Description
------------ | ------------- | ------------
[TEST]|[ADD]| Image display for search page |
[TEST]|[MOD]| file
[TEST]|[FIXED]| an issue
[MASTER]|[INIT]| Branch test

##### Commits from ```git shortlog```
```bash
 [TEST][ADD] Image display for search page
 [TEST][ADD] Styles.js file with colors
 [TEST][FIXED] Issue in settings and added videos in CardDisplayer Modal
```

## Architecture
A folder 'Pages' contain each page of the project.
Each page directory contains a .jsx file with its main component.
For example the Favorites page contains a FavoritesPage.jsx file with a ```FavoritesPage()``` function.

```bash
.
├── Pages
│   ├── Authentification
│   │   └── AuthPage.jsx
│   ├── Favorites
│   │   └── FavoritesPage.jsx
│   ├── Profile
│   │   └── ProfilePage.jsx
│   ├── Search
│   │   ├── CardDisplayer.jsx
│   │   └── SearchPage.jsx
│   ├── Settings
│   │   └── SettingsPage.jsx
│   └── Upload
│       └── UploadPage.jsx

```

```jsx
/**
 * This component is used to render the favorites page
 * The favorite page mainly reuses the <RenderCards /> component with different data
 */
export default function FavoritesPage() {
  // Data from the imgur api
  const [userData, setUserData] = useState(null);
  // Switches to true and false to refresh the page
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getUserData().then((value) => {
      setUserData(value);
      imgurGetAlbumFav(value.acess_token, value.username).then((value) => {
        setUserData(value.data);
        setRefresh(false);
      });
    });
  }, [refresh]);

  return (
    <Container style={generalStyle.primaryColor}>
      <Header rounded androidStatusBarColor={GENERAL_COLOR} style={{backgroundColor: GENERAL_COLOR}}>
        <Text style={{marginTop: 17, color: BACKGROUND_LIGHT}}>Favorites </Text>
      </Header>
      <RenderCards data={userData} refreshing={refresh} onRefresh={() => setRefresh(true)}/>
    </Container>
  );
}
```

For this project we mainly used react functionnal components.

The App.js represents the root of the project it checks if the user is logged in the application and then chooses to display either a WebView to force the user to connect to Imgur or the whole application.

```javascript
  render() {
    if (this.state.loading) {
      return (
        <Root>
          <AppLoading />
        </Root>
      );
    }
    if (!this.state.isAuth) {
      return (
        <Root>
          <Auth setAuth={this.setAuth.bind(this)} />
        </Root>
      );
    }
    if (this.state.isAuth) {
      return (
        <Root>
          <AppContainer disconnect={this.disconnect.bind(this)} />
        </Root>
      );
    }
  }
```

The pages and the Tab Bar are written in the AppContainer.jsx file, it is this file that handles the rendering of all the pages of the application. It uses react-navigation.

```jsx
<Tab.Screen name="Upload" component={UploadPage} />
<Tab.Screen name="Favorites" component={FavoritesPage} />
<Tab.Screen name="Search" component={SearchPage} />
<Tab.Screen name="Profile" component={ProfilePage} initialParams={{disconnect: props.disconnect}} />
<Tab.Screen name="Settings" component={SettingsPage} />
```

## Styles and colors

The main styles and colors used in the application are stored in a file called Colors.js

```javascript
import { StyleSheet} from "react-native";

export const BACKGROUND_COLOR = "#EBEBEC" //blanc cassé

export const BACKGROUND_LIGHT = "#F9F9F1" //blanc

export const GENERAL_COLOR = "#7E78d2" // voilet

export const TEXT_COLOR = "#0C0C0C" // gris-noir

export const generalStyle = StyleSheet.create({
contentMiddle: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: BACKGROUND_COLOR,
},
primaryColor: {
  backgroundColor: BACKGROUND_LIGHT,
  color: GENERAL_COLOR
},
primaryWhite: {
  backgroundColor: BACKGROUND_COLOR,
  color: GENERAL_COLOR
},
primarySetting: {
	backgroundColor:GENERAL_COLOR
},
primaryHeader: {
	backgroundColor: GENERAL_COLOR,
	color: BACKGROUND_LIGHT
}
});
```
