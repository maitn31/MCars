import {useState} from 'react';
import {AsyncStorage} from 'react-native';
import {fetchFormData, fetchPOST, fetchPUT, getAllMedia, getUserMedia} from './APIHooks';

const useUploadForm = () => {
    const data = {
        title: undefined,
        info: {
            location: undefined,
            price: undefined,
            description: undefined
        }
    }

    const [inputs, setInputs] = useState({data});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    const handleTitleChange = (text) => {
        setInputs((inputs) =>
            ({
                ...inputs,
                title: text,
            }));
    };

    const handleLocationChange = (text) => {
        setInputs((inputs) =>
            ({
                ...inputs,
                info: {
                    ...inputs.info,
                    location: text
                }
            }));

    };

    const handlePriceChange = (text) => {
        setInputs((inputs) =>
            ({
                ...inputs,
                info: {
                    ...inputs.info,
                    price: text
                }
            }));
    };
    const handleDescriptionChange = (text) => {
        setInputs((inputs) =>
            ({
                ...inputs,
                info: {
                    ...inputs.info,
                    description: text
                }
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


        const fd = new FormData();
        fd.append('title', inputs.title);
        fd.append('description', JSON.stringify(inputs.info));
        fd.append('file', {uri: file.uri, name: filename, type});

        console.log('FD:', fd);

        try {
            const token = await AsyncStorage.getItem('userToken');


            const resp = await fetchFormData('media', fd, token);

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


    const handleModify = async (id, navigation, setMedia) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const {title, info} = inputs;
            const curInputs = {title: title, description: JSON.stringify(info)};
            const resp = await fetchPUT('media', id, curInputs, token);
            console.log('upl resp', resp);
            if (resp.message) {
                const data = await getUserMedia(token);
                setMedia((media) =>
                    ({
                        ...media,
                        myFiles: data,
                    }));
                setLoading(false);
                const homeData = await getAllMedia();
                setMedia((media) =>
                    ({
                        ...media,
                        allFiles: homeData,
                    }));
                setLoading(false);
                navigation.pop();
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    return {
        handleTitleChange,
        handleDescriptionChange,
        handlePriceChange,
        handleLocationChange,
        handleUpload,
        handleModify,
        inputs,
        errors,
        loading,
        setErrors,
        setInputs,
        resetDescription,
    };
};
export default useUploadForm;
