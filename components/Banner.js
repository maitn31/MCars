import React from 'react'
import {View, Text, ListView, Image, Dimensions} from 'react-native'
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';


const width = Dimensions.get("window").width;

const Banner = (props) => {
    const logos = [
        {link: "https://global.toyota/pages/global_toyota/mobility/toyota-brand/emblem_001.jpg", brand:"Toyota"},
        {link: "https://pictures.dealer.com/j/jimellisaudiatlantaaoa/1047/70e485452c868b71f14cd5e1286ed574x.jpg", brand: "Audi"},
        {link: "https://netrinoimages.s3.eu-west-2.amazonaws.com/2017/06/30/458555/153377/kia_logo_3d_model_c4d_max_obj_fbx_ma_lwo_3ds_3dm_stl_1737003_o.jpg", brand: "KIA"},
        {link: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/1200px-Ford_Motor_Company_Logo.svg.png", brand: "Ford"},
        {link: "https://3.bp.blogspot.com/-qBNXsVSBBXk/UNMudewwl2I/AAAAAAAAGAw/gXxR5nqCg8M/s1600/Honda+Logo+3.jpg", brand: "Honda"},
        {link: "https://cdn.motor1.com/images/mgl/GwZbJ/s1/logo-story-volkswagen.jpg", brand: "Wolf"},
    ];

    return (
        <View style={{
            marginHorizontal: 20, flexWrap: "wrap",
            flexDirection: "row",
            marginVertical:20,
        }}>
            {logos.map((item, index) =>
                <TouchableOpacity onPress={() => {
                    props.navigation.push("SearchPage", {input: item.brand})
                }}>
                    <Image
                        key={index}
                        style={{width: (width-40)*0.333333333333333, height: 100}}
                        source={{uri: item.link}}
                        resizeMethod={"auto"}
                    />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default Banner
