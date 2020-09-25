import React, { useState, useEffect } from 'react';
import { imgurSearch } from './imgur';
import { StyleSheet, Text, View, Button, Image, TextInput } from 'react-native';

function Search() {
    
    const [searchData, setSearchData] = useState(null);
    const [searched, setSearched] = useState(false);

    const [searchText, setSearchText] = useState("League of legends");

    useEffect(() => {
        if (searched) {
            console.log("update !!!");
            setSearched(false);
            imgurSearch("viral", "top", 1, searchText)
            .then(data => setSearchData(data));
        }
    },[searched])

    function showImages() {

        if (searchData === null)
            return (
                <View>
                </View>
            )

        return (
            searchData.data.map(element => {
                console.log(element);
                if (element.images) {
                    return (
                        element.images.map(image => {
                            return (
                                <Image key={image.link} blurRadius={5} source={{uri: image.link}} style={{width: 100, height: 100}} />
                            )
                        })
                    )
                } else {
                    return (
                        <View>
                        </View>
                    )
                }
            })
        )
    }

    return (
        <View style={styles.mainView}>
            <TextInput
                value={searchText}
                onChangeText={text => setSearchText(text)}
                style={styles.searchInput}
                placeholder={"What do you want to search ?"}
            />
            <Button
                title="Search"
                onPress={() => setSearched(true)}
            />
            <View style={styles.imagesView}>
                {showImages()}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        height: 50,
        borderColor: 'green',
        borderWidth: 3,
        textAlign: 'center',
    },
    imagesView: {
        display: 'flex',
        flexDirection: 'row',
    }
})

export default Search;