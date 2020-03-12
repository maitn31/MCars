/* eslint-disable max-len */
import React, {useContext, useEffect, useState} from 'react';
import {ScrollView} from "react-native-gesture-handler";
import ListItem from './ListItem';
import {MediaContext} from '../contexts/MediaContext';
import {getAllMedia, getFavoriteMedia, getUserMedia} from '../hooks/APIHooks';
import PropTypes from 'prop-types';
import {AsyncStorage, StyleSheet, View, Text} from 'react-native';
import {Spinner} from "native-base";
import Banners from './Banners';
import Header from './Header';

const List = (props) => {
  const [media, setMedia] = useContext(MediaContext);
  const [loading, setLoading] = useState(true);

  const keySearch=props.keySearch;
  const isAvatar = async (file) => {
    return file.filter(item => item.description !== "");
  };

  const getMedia = async (mode) => {
    try {
      console.log('mode', mode);
      const allData = await getAllMedia();
      const token = await AsyncStorage.getItem('userToken');
      const myData = await getUserMedia(token);
      const myFile = await isAvatar(myData);
      const favoriteMedia = await getFavoriteMedia(token);
      setMedia({
        allFiles: allData.reverse(),
        myFiles: myFile,
        favoriteMedia: favoriteMedia,
        searchList: searchList,
      });
      setLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };
  let searchList;
  if (props.mode === "search") {
    searchList = media.allFiles.filter(item =>  (item.title.toUpperCase().includes(keySearch.toUpperCase()) || JSON.parse(item.description).description.toUpperCase().includes(keySearch.toUpperCase())));
  }

  useEffect(() => {
    getMedia(props.mode);
  }, []);

  return (
    <View>
      {loading ? (
        <Spinner />
      ) : (
          <>
            {props.mode === "all" && (
              <ScrollView>
                <Banners navigation={props.navigation} />
                <Text style={{marginHorizontal:20, fontSize:30, fontWeight:"700"}}>Welcome to CarsDream!</Text>
                <Text style={{marginHorizontal:20, fontSize:15, fontStyle:"italic"}}>List of new cars in month!</Text>
                <View style={styles.wrapContainer}>
                  {media.allFiles.map((item, index) => (
                    <ListItem
                      key={index}
                      navigation={props.navigation}
                      singleMedia={item}
                      mode={props.mode}
                      getMedia={getMedia}
                    />
                  ))}
                </View>
              </ScrollView>
            )}
            {props.mode === 'myfiles' &&
              <ScrollView>
                <View style={styles.columnContainer}>
                  {media.myFiles.map((item, index) => (
                    <ListItem
                      key={index}
                      navigation={props.navigation}
                      singleMedia={item}
                      mode={props.mode}
                      getMedia={getMedia}
                    />
                  ))}
                </View>
              </ScrollView>
            }
            {props.mode === "search" && (
              <ScrollView>
                <Header title={`Related to "${keySearch}" :`} subtitle={searchList.length > 0 ? null : "There's nothing match your search!"} count={searchList.length > 0 ? searchList.length : null} />
                {searchList.length > 1}
                <View style={styles.columnContainer}>
                  {media.searchList.map((item, index) => (
                    <ListItem
                      key={index}
                      navigation={props.navigation}
                      singleMedia={item}
                      mode={props.mode}
                      getMedia={getMedia}
                    />
                  ))}
                </View>
              </ScrollView>
            )}
            {props.mode === "saved" && (
              <ScrollView>
                <Header title={media.favoriteMedia.length > 0 ? null : "You didn't save anything!"} count={media.favoriteMedia.length > 0 ? media.favoriteMedia.length : null} />
                {media.favoriteMedia.length > 1}
                <View style={styles.columnContainer}>
                  {media.favoriteMedia.map((item, index) => (
                    <ListItem
                      key={index}
                      navigation={props.navigation}
                      singleMedia={item}
                      mode={props.mode}
                      getMedia={getMedia}
                    />
                  ))}
                </View>
              </ScrollView>
            )}
          </>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 75,
    justifyContent: "space-between",
  },
  columnContainer: {
    marginHorizontal: 20,
    marginBottom: 75,
  }
});


List.propTypes = {
  navigation: PropTypes.object,
  mode: PropTypes.string,
};

export default List;
