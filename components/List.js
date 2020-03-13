/* eslint-disable max-len */
import React, {useContext, useEffect, useState} from 'react';
import {ScrollView} from "react-native-gesture-handler";
import ListItem from './ListItem';
import {MediaContext} from '../contexts/MediaContext';
import {getAllMedia, getUserMedia} from '../hooks/APIHooks';
import PropTypes from 'prop-types';
import {AsyncStorage, StyleSheet, View, Text} from 'react-native';
import {Spinner} from "native-base";
import Search from './Search';
import Banner from './Banner';


const List = (props) => {
  const [media, setMedia] = useContext(MediaContext);
  const [loading, setLoading] = useState(true);

  const keySearch=props.keySearch;

  const checkAvatar = async (file) => {
    return file.filter(item => item.description !== "");
  };
  const getMedia = async (mode) => {
    try {
      console.log('mode', mode);
      const allData = await getAllMedia();
      const token = await AsyncStorage.getItem('userToken');
      const allMyData = await getUserMedia(token);
      const myFilesData = allData.filter(item => (item.user_id=== allMyData[0].user_id));
      const myData = await checkAvatar(myFilesData);
      const searchList= allData.filter(item=> (item.title.toUpperCase().includes(keySearch) || JSON.parse(item.description).description.toUpperCase().includes(keySearch)));
      setMedia({
        allFiles: allData.reverse(),
        myFiles: myData,
        searchList: searchList,
      });
      setLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };

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
                <Banner navigation={props.navigation} />
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
