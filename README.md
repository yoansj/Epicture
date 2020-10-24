# Epicture

The goal was to implement Imgur in a mobile aplication thank's to their API

## Authors

Project realise by Yoan Saint-Juste and Matthieu Kozicki. (3nd year in Epitech-Paris.)

## Installation

Requires : npm, react, react-native & expo </br>
Clone the repository

```bash
git clone  git@github.com:EpitechIT2020/B-DEV-501-PAR-5-1-epicture-yoan.saint-juste.git
```

## Api
[Imgur's API](https://apidocs.imgur.com/)

## Usage

```bash
npm installhttps://github.com/user/repo/blob/branch/other_file.md
npm start
```
Scan the QR-code and you are good to go !

## Functionalities

* Search for any post on imgur (filter with parameters)
* Upvote/downvote album
* Manage your favorites
* See comments and upvote/downvote
* See favorites of user connected
* See profil information (profil pick, name, internet point, ...)
* Modify profil's information
* Post an album/image
* Post a comment

## Git

Norm of commit is use : [BRANCH][ACTION with verbs] description

[BRANCH] | [ACTION] | description
------------ | ------------- | ------------
[TEST]|[ADD]| Image display for search page |


```bash
 [TEST][ADD] Image display for search page
 [TEST][ADD] Styles.js file with colors
 [TEST][FIXED] Issue in settings and added videos in CardDisplayer Modal
```

## Architecture
A folder 'Pages' contain each page of the project

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

The function architecture (hooks) is use which mean that there is not so many component.

```jsx
export default function FavoritesPage() {

  // Data from the imgur api
  const [userData, setUserData] = useState(null);
  // Switches to true and false to refresh the page
  const [refresh, setRefresh] = useState(false);

  const [updateList, setUpdateList] = useState(false);

  const [flatListRef, setFlatListRef] = useState(null);

  const [test, setTest] = useState("");

  useEffect(() => {
    getUserData().then((value) => {
      setUserData(value);
      imgurGetAlbumFav(value.acess_token, value.username).then((value) => {
        setUserData(value.data);
      });
    });
  }, [refresh]);

  return (
    <Container style={generalStyle.primaryWhite}>
      <Header rounded androidStatusBarColor={GENERAL_COLOR} style={{backgroundColor: GENERAL_COLOR}}>
        <Text style={{marginTop: 17, color: BACKGROUND_LIGHT}}>Favorites </Text>
        <Button transparent onPress={() => setRefresh(!refresh)}>
          <Icon style={{color: 'white'}} name="ios-refresh" />
        </Button>
      </Header>
      <RenderCards data={userData} setUpdateList={setUpdateList} setFlatListRef={setFlatListRef} />
      <Container style={generalStyle.contentMiddle}>
        <Icon style={styles.myloading} name="flask" />
        <Text style={styles.myloading}>Wow !</Text>
        <Text style={styles.myloading}>There is some space here</Text>
      </Container>
    </Container>
  );
}
const styles = StyleSheet.create({
  myWarning: {
    backgroundColor: 'red',
    alignItems: 'center',
    height: 60,
    justifyContent: "center"
  },
  myloading: {
    backgroundColor: '#EBEBEC',
    color: '#7E78d2'
  }
});

```