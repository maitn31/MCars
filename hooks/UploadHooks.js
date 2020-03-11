import {useState} from 'react';
import {AsyncStorage} from 'react-native';
import {fetchFormData, fetchPOST, fetchPUT, getAllMedia, getUserMedia, fetchGET, fetchDELETE} from './APIHooks';

let description = {};

const useUploadForm = () => {

  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        title: text,
      }));
  };

  const handleDescriptionChange = (text) => {
    description = {
      ...description,
      description: text,
    }

    setInputs((inputs) =>
      ({
        ...inputs,
        description: description
      }));

  };
  const handleLocationChange = (text) => {
    description = {
      ...description,
      location: text,
    };
    setInputs((inputs) =>
      ({
        ...inputs,
        description: description
      }));

  };
  const handleCapacityChange = (text) => {
    description = {
      ...description,
      capacity: text,
    }
    setInputs((inputs) =>
      ({
        ...inputs,
        description: description
      }));
  };
  const handlePriceChange = (text) => {
    description = {
      ...description,
      price: text,
    }

    setInputs((inputs) =>
      ({
        ...inputs,
        description: description
      }));
  };
  // Handle modify form
  const handleDescriptionModify = (text) => {
    description = {
      ...description,
      description: text,
    }

    setInputs((inputs) =>
      ({
        ...inputs,
        description: JSON.stringify(description)
      }));

  };
  const handleLocationModify = (text) => {
    description = {
      ...description,
      location: text,
    };
    setInputs((inputs) =>
      ({
        ...inputs,
        description: JSON.stringify(description)
      }));

  };
  const handleCapacityModify = (text) => {
    description = {
      ...description,
      capacity: text,
    }
    setInputs((inputs) =>
      ({
        ...inputs,
        description: JSON.stringify(description)
      }));
  };
  const handlePriceModify = (text) => {
    description = {
      ...description,
      price: text,
    }
    setInputs((inputs) =>
      ({
        ...inputs,
        description: JSON.stringify(description)

      }));
  };

  const handleUpload = async (file, navigation, setMedia) => {
    const filename = file.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    // fix jpg mimetype
    if (type === 'image/jpg') {
      type = 'image/jpeg';
    }

    const json = JSON.stringify(description);
    const fd = new FormData();
    fd.append('title', inputs.title);
    console.log('description',description)
    //  fd.append('description', inputs.description ? inputs.description : '');
    fd.append('description', json ? json : '');

    fd.append('file', {uri: file.uri, name: filename, type});

    console.log('Form data from UPloadHooks:', fd);

    try {
      const token = await AsyncStorage.getItem('userToken');

      const resp = await fetchFormData('media', fd, token);
      console.log('upl resp', resp);

      const tagData = {
        file_id: resp.file_id,
        tag: 'sellcar',
      };

      const result = await fetchPOST('tags', tagData, token);

      if (result.message) {
        const data = await getAllMedia();
        setMedia((media) =>
          ({
            ...media,
            allFiles: data,
          }));
        setLoading(false);
        navigation.push('Home');
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  // upload user's avatar
  const handleProPic = async (file, navigation, setMedia) => {
    
    const token = await AsyncStorage.getItem('userToken');
    const userFromStorage = await AsyncStorage.getItem("user");
    const uData = JSON.parse(userFromStorage);
    const avatarPic = await fetchGET('tags', 'avatar_' + uData.user_id);
      // delete the current user's avatar
      for(let i =0; i < avatarPic.length; i++) {
        fetchDELETE('media', avatarPic[i].file_id,token);
      }
    const filename = file.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    // fix jpg mimetype
    if (type === 'image/jpg') {
      type = 'image/jpeg';
    };

    const fd = new FormData();
    fd.append('file', {uri: file.uri, name: filename, type});

    console.log('Form data from UPloadHooks:', fd);

    try {
      const resp = await fetchFormData('media', fd, token);
      console.log('upl resp', resp);

      // add tag for avatar image
      const tagData = {
        file_id: resp.file_id,
        tag: 'avatar_' + uData.user_id ,
      };

      const result = await fetchPOST('tags', tagData, token);

      if (result.message) {
        const data = await getAllMedia();
        setMedia((media) =>
          ({
            ...media,
            allFiles: data,
          }));
        setLoading(false);
        navigation.push('Home');
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleModify = async (id, navigation, setMedia) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const resp = await fetchPUT('media', id, inputs, token);
      console.log('upl resp', resp);
      if (resp.message) {
        const data = await getUserMedia(token);
        setMedia((media) =>
          ({
            ...media,
            myFiles: data,
          }));
        setLoading(false);
        navigation.push('Home');
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const resetDescription = (object) => {
    object.capacity = "";
    object.description = "";
    object.location = "";
    object.price = "";
  }

  return {
    handleTitleChange,
    handleDescriptionChange,
    handleLocationChange,
    handleCapacityChange,
    handlePriceChange,
    handleDescriptionModify,
    handleLocationModify,
    handlePriceModify,
    handleCapacityModify,
    handleUpload,
    handleModify,
    handleProPic,
    description,
    inputs,
    errors,
    loading,
    setErrors,
    setInputs,
    resetDescription
  };
};

export default useUploadForm;
