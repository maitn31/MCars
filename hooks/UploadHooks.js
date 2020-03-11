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

    const [description, setDescription] = useState({});
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const resetDescription = (object) => {
        object.description = "";
        object.location = "";
        object.price = "";
    }

    const handleTitleChange = (text) => {
        setInputs((inputs) =>
            ({
                ...inputs,
                title: text,
            }));
    };

    const handleDescriptionChange = (text) => {

        setDescription((description) =>
            ({
                ...description,
                description: text,
            }))
        setInputs((inputs) =>
            ({
                ...inputs,
                description: description
            }));
    };

    const handleLocationChange = (text) => {
        setDescription((description) =>
            ({
                ...description,
                location: text,
            }))
        setInputs((inputs) =>
            ({
                ...inputs,
                description: description
            }));
    };

    const handlePriceChange = (text) => {
        setDescription((description) =>
            ({
                ...description,
                price: text,
            }))
        setInputs((inputs) =>
            ({
                ...inputs,
                description: description
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

        const jDescription = JSON.stringify(description);

        const fd = new FormData();
        fd.append('title', inputs.title);
        fd.append('description', jDescription ? jDescription : '');
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
                navigation.pop();
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    return {
        handleTitleChange,
        handleDescriptionChange,
        handleUpload,
        handleModify,
        handlePriceChange,
        handleLocationChange,
        handleDescriptionModify,
        handleLocationModify,
        handlePriceModify,
        inputs,
        errors,
        loading,
        setErrors,
        setInputs,
        description,
        resetDescription,
    };
};

export default useUploadForm;
