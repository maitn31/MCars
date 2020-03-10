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
} from 'native-base';
import PropTypes from 'prop-types';
import AsyncImage from '../components/AsyncImage';
import {Dimensions, StyleSheet} from 'react-native';
import {mediaURL} from '../constants/urlConst';
import {Video} from 'expo-av';
import {fetchGET} from '../hooks/APIHooks';
import {AsyncStorage} from 'react-native';

const deviceHeight = Dimensions.get('window').height;

const Single = (props) => {
  const [user, setUser] = useState({});
  const {navigation} = props;
  const file = navigation.state.params.file;

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await fetchGET('users', file.user_id, token);
      setUser(json);
    } catch (e) {
      console.log('getUser error', e);
    }
  };

  useEffect(() => {
    getUser();
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
          </CardItem>
        </Card>
        <Card>
          <CardItem>
            <Left>
              <Icon name='car'/>
              <Body>
                <H3 style={styles.title}>{file.title}</H3>
                <Text style={styles.subtitle2}>{JSON.parse(file.description).location}</Text>
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
  }
});
Single.propTypes = {
  navigation: PropTypes.object,
  file: PropTypes.object,
};

export default Single;
