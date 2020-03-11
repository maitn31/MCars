import React, {useState, useEffect, useContext} from 'react';
import {
  Content,
  Form,
  Button,
  Text,
  Item,
  Spinner,
} from 'native-base';

import {
  Dimensions,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/UploadHooks';
import {MediaContext} from '../contexts/MediaContext';
import {validateField} from '../utils/validation';
import {uploadConstraints} from '../constants/validationConst';
import {mediaURL} from '../constants/urlConst';
import AsyncImage from '../components/AsyncImage';
import {Video} from 'expo-av';

const deviceHeight = Dimensions.get('window').height;

const Modify = (props) => {
  const [media, setMedia] = useContext(MediaContext);
  const [send, setSend] = useState(false);

  let {
    handleTitleChange,
    handleDescriptionChange,
    handleModify,
    handleLocationChange,
    handlePriceChange,
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


  const file = props.navigation.state.params.file;
  const fileInfo= JSON.parse(file.description);
  console.log("origin file", file);
  console.log("file description parsed", fileInfo);


  useEffect(() => {
    setInputs((inputs) =>
      ({
        ...inputs,
        title: file.title,
        description: fileInfo,
      }));
  }, []);

  const handleTitle = (text) => {
    handleTitleChange(text);
    validate('title', text);
  };

  const handleDescription = (text) => {
    handleDescriptionChange(text);
    validate('description', text);
  };

  const handleLocation = (text) => {
    handleLocationChange(text);
    validate('location', text);
  };

  const handlePrice = (text) => {
    handlePriceChange(text);
    validate('price', text);
  };

  const modify = () => {
    console.log('reg field errors', errors);
    handleModify(file.file_id, props.navigation, setMedia);
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
          <Item>
            <FormTextInput
              placeholder='Title'
              onChangeText={handleTitle}
              value={inputs.title}
              error={errors.title}
            />
          </Item>
          <Item>
            <FormTextInput
              placeholder='Description'
              onChangeText={handleDescription}
              value={inputs.description}
              error={errors.description}
            />
          </Item>
          <Item>
            <FormTextInput
                placeholder='Location'
                onChangeText={handleLocation}
                value={inputs.location}
                error={errors.location}
            />
          </Item>
          <Item>
            <FormTextInput
                placeholder='Price'
                onChangeText={handlePrice}
                value={inputs.price}
                error={errors.price}
            />
          </Item>

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
              useNativeControls
              style={{
                width: '100%',
                height: deviceHeight / 2,
              }}
              onError={(e) => {
                console.log('video error', e);
              }}
            />
            )
          }
          {send &&
          <Button full onPress={modify}>
            <Text>Send</Text>
          </Button>
          }
        </Form>
      )}
    </Content>
  );
};

// proptypes here
Modify.propTypes = {
  navigation: PropTypes.object,
};

export default Modify;
