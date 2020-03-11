import React, {useState, useEffect, useContext} from 'react';
import {
  Content,
  Form,
  Button,
  Text,
  Spinner,
} from 'native-base';

import {
  Dimensions,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import useUploadForm from '../hooks/UploadHooks';
import {MediaContext} from '../contexts/MediaContext';
import {validateField} from '../utils/validation';
import {uploadConstraints} from '../constants/validationConst';

const deviceHeight = Dimensions.get('window').height;

const ChangeAvatar = (props) => {
  const [media, setMedia] = useContext(MediaContext);
  const [image, setImage] = useState(null);
  const [send, setSend] = useState(false);

  const {
    handleProPic,
    inputs,
    errors,
    setErrors,
    setInputs,
    loading,
  } = useUploadForm();

  const validationProperties = {
    title: {title: inputs.title},
    description: {description: inputs.description},
  };

  const validate = (field, value) => {
    console.log('vp', validationProperties[field]);
    setErrors((errors) =>
      ({
        ...errors,
        [field]: validateField({[field]: value},
            uploadConstraints),
        fetch: undefined,
      }));
  };

  const reset = () => {
    setErrors({});
    setInputs({});
    setImage(null);
  };

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  useEffect(() => {
    getPermissionAsync();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
      exif: true,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result);
    }
  };



  const upload = () => {
    console.log('reg field errors', errors);
    handleProPic(image, props.navigation, setMedia);
    alert('You have changed your profile pictures!');
    reset();
  };

  const checkErrors = () => {
    console.log('errors', errors);
    if (errors.title !== undefined ||
      errors.description !== undefined) {
      setSend(false);
    } else {
      setSend(true);
    }
  };

  useEffect(() => {
    checkErrors();
  }, [errors]);

  console.log('send', send);

  return (
    <Content>
      {loading ? (
        <Spinner/>
      ) : (
        <Form>
  
          {image &&
          <Image source={{uri: image.uri}}
            style={{width: '100%', height: deviceHeight / 3}}/>
          }
          <Button full onPress={pickImage}>
            <Text>Choose image</Text>
          </Button>
          {image && send &&
          <Button full onPress={upload}>
            <Text>Upload</Text>
          </Button>
          }
          <Button
            dark
            full
            onPress={reset}>
            <Text>Reset form</Text>
          </Button>
        </Form>
      )}
    </Content>
  );
};

// proptypes here
ChangeAvatar.propTypes = {
  navigation: PropTypes.object,
};

export default ChangeAvatar;
