import React, { useEffect, useState } from 'react';
import { fetchGET } from "../hooks/APIHooks";
import { mediaURL } from "../constants/urlConst";
import AsyncImage from "./AsyncImage";
import { Icon } from "native-base";

const UserAvatar = props => {
  const [userAvatar, setUserAvatar] = useState(undefined);
  const userId = props.userId;

  const getUserAvatar = async () => {
    try {
      const avatarPic = await fetchGET('tags', 'avatar_' + userId);
      console.log('avpic', avatarPic);
      if (avatarPic && avatarPic.length !== 0) {
        let avPic = mediaURL + avatarPic[0].filename;
        setUserAvatar(avPic);
      }
    } catch (e) {
      console.log('getUserAvatar error', e);
    }
  };

  useEffect(() => {
    getUserAvatar();
  }, []);

  return (
    <>
      {userAvatar ?
        <AsyncImage
          style={props.avatarStyle}
          spinnerColor='#777'
          source={{uri: userAvatar}}/> :
        <Icon name={'person'} style={props.iconStyle}/>
      }
    </>
  );
};

export default UserAvatar;
