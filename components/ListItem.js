import React, {useState} from "react";
import {Icon} from "native-base";
import PropTypes from "prop-types";
import {mediaURL} from "../constants/urlConst";
import {Dimensions, Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {fetchDELETE} from '../hooks/APIHooks';
import {AsyncStorage} from 'react-native';
import {Button, Text} from 'native-base'

const width = Dimensions.get("window").width;
const ListItem = props => {
  const {singleMedia, mode, getMedia, navigation} = props;
  const { description, thumbnails} = singleMedia;
  const [open, setOpen] = useState(false);
  
  return (
    <TouchableOpacity
      style={(mode === "myfiles" || mode === "search") ? styles.columnContainer : styles.wrapContainer}
      onPress={() => {
        if (open) {
          setOpen(!open);
        }
        navigation.push("Single", {file: singleMedia});
      }}
      onLongPress={() => {
        if (mode === "myfiles") {
          setOpen(!open);
        }
      }}
    >
      {mode === 'myfiles' && open &&
        <View style={{...styles.buttonContainer, top: 100, width: "100%"}}>
          <Button
            full
            info
            onPress={
              () => {
                setOpen(!open);
                props.navigation.push('Modify', {file: props.singleMedia});
              }
            }
          >
            <Icon name='create' />
            <Text>Modify</Text>
          </Button>
          <Button
            full
            danger
            onPress={async () => {
              setOpen(!open);
              const token = await AsyncStorage.getItem('userToken');
              const del = await fetchDELETE('media', props.singleMedia.file_id, token);
              console.log('delete', del);
              if (del.message) {
                getMedia(props.mode);
              }
            }}
          >
            <Icon name='trash' />
            <Text>Delete</Text>
          </Button>
        </View>
      }
      <Image
        source={{uri: mediaURL + thumbnails.w320}}
        style={{
          height: (mode === "myfiles" || mode === "search") ? 250 : 150,
          width: "100%",
          borderRadius: 5,
          opacity: open ? 0.4 : 1
        }}
      />
      <View style={(mode === "myfiles" || mode === "search") ? {flexDirection: "row", justifyContent: "space-between"} : {}}>
        <View style={{marginVertical: 3}}>
          <Text numberOfLines={1} style={(mode === "myfiles" || mode === "search") ? {...styles.title2} : {...styles.title1, color: "#9E6969"}} numberOfLines={1}>
            Helsinki
          </Text>
          <Text numberOfLines={1} style={(mode === "myfiles" || mode === "search") ? {...styles.subtitle2} : {...styles.subtitle1}} numberOfLines={1}>
            Toyota
          </Text>
          {(mode !== "myfiles" && mode !== "search") &&
            <Text>2000 € </Text>
          }
        </View>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapContainer: {
    width: (width - 40) * 0.48,
    marginVertical: 5,
  },
  columnContainer: {
    marginVertical: 15,
  },
  title1: {
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 3
  },
  subtitle1: {
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 3
  },
  title2: {
    fontSize: 14,
    paddingVertical: 3,
    color: "#727272"
  },
  subtitle2: {
    fontSize: 16,
    paddingVertical: 3,
    fontWeight: "600",
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
    alignContent: "flex-start"

  },
  bottomLeft: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonContainer: {
    position: "absolute",
    zIndex: 4,
    borderWidth: 0.4,
    opacity: 1,
  }
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  mode: PropTypes.string,
  getMedia: PropTypes.func
};

export default ListItem;