import React, {useState, useEffect} from 'react';
import {
  Container,
  Content,
  Card,
  CardItem,
  Left,
  Body,
  H3,
  Icon,
  Text,
  View,
  Button
} from 'native-base';
import PropTypes from 'prop-types';
import AsyncImage from '../components/AsyncImage';
import {Dimensions, StyleSheet} from 'react-native';
import {mediaURL} from '../constants/urlConst';
import {Video} from 'expo-av';
import { fetchDELETE, fetchGET, fetchPOST, getFavoriteMedia } from '../hooks/APIHooks';
import {AsyncStorage} from 'react-native';
const deviceHeight = Dimensions.get('window').height;

const Car = (props) => {
  const [user, setUser] = useState({});
  const {navigation} = props;
  const file = navigation.state.params.file;
  const [saved, setSaved] = useState(undefined);

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await fetchGET('users', file.user_id, token);
      setUser(json);
    } catch (e) {
      console.log('getUser error', e);
    }
  };
  const checkSaved = async () => {
    try {
      const savedLists = await fetchGET('favourites/file', file.file_id);
      savedLists.filter(item => item.user_id === file.user_id);
      console.log('saved', savedLists);
      if (savedLists.length !== 0) {
        setSaved(true);
      } else {
        setSaved(false);
      }
    } catch (e) {
      console.log('checkSaved error', e);
    }
  };

  const toggleSaved = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!saved) {
      try {
        const json = await fetchPOST('favourites', {file_id: file.file_id}, token);
        console.log('Save', json);
        if (json.favourite_id) {
          setSaved(true);
        }
      } catch (e) {
        console.log('saving error', e);
      }
    } else if (saved) {
      try {
        const json = await fetchDELETE('favourites/file', file.file_id, token);
        console.log('Unsave', json);
        if (json.message.includes('deleted')) {
          setSaved(false);
        }
      } catch (e) {
        console.log('unsaving error', e);
      }
    }
    const favouriteMedia = await getFavoriteMedia(token);
    setMedia((media) => ({
      ...media,
      favouriteMedia: favouriteMedia,
    }))
  };

  useEffect(() => {
    getUser();
    checkSaved();
  }, []);

  return (
    <Container>
      <Content>
        <Card>
          <CardItem>
            {file.media_type === 'image' ? (
                <AsyncImage
                  style={{
                    width: '100%',
                    height: deviceHeight / 2,
                  }}
                  spinnerColor='#777'
                  source={{uri: mediaURL + file.filename}}
                />) :
              (<Video
                source={{uri: mediaURL + file.filename}}
                resizeMode={'cover'}
                useNativeControls
                style={{
                  width: '100%',
                  height: deviceHeight / 2,
                }}
                onError={(e) => {
                  console.log('video error', e);
                }}
                onLoad={(evt) => {
                  console.log('onload', evt);
                }}
              />
              )
            }
            {saved !== undefined &&
              <View style={styles.saveArea}>
                <Button rounded light onPress={toggleSaved}>
                  <Icon style={saved ? styles.svIcon : styles.unsvIcon} name={'bookmark'} />
                </Button>
              </View>
            }
          </CardItem>
        </Card>
        <Card>
          <CardItem>
            <Left>
              <Icon name='car'/>
              <Body>
                <H3 style={styles.title}>  {file.title.toUpperCase()}</H3>
                <Text style={styles.subtitle2}>  {JSON.parse(file.description).location.toUpperCase()}</Text>
              </Body>
            </Left>
          </CardItem>
        </Card>
        <Card>
          <CardItem>
            <Body>
              <Text style={styles.subtitle}>{JSON.parse(file.description).description}</Text>
              <Text>Price: {JSON.parse(file.description).price} €</Text>
              <Text>Contact: {user.email}</Text>
            </Body>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  // wrapContainer: {
  //   width: (width - 40) * 0.48,
  //   marginVertical: 5,
  // },
  columnContainer: {
    marginVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    paddingVertical: 3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "700",
    paddingVertical: 3
  },
  subtitle2: {
    fontSize: 16,
    paddingVertical: 3,
    fontWeight: "600",
    color: "#9E6969"
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
  },
  saveArea: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  unsvIcon: {
    color: '#000'
  },
  svIcon: {
    color: '#a83f39',
  },
});
Car.propTypes = {
  navigation: PropTypes.object,
  file: PropTypes.object,
};

export default Car;
