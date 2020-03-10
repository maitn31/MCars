import React from 'react'
import {ScrollView} from 'react-native'
import List from '../components/List';
import {View, Text} from 'native-base';

const SearchPage = (props) => {
    const keySearch = props.navigation.state.params.input;
    console.log("in search page",keySearch)
    return (
        <>
            <View><Text style={{marginHorizontal:20}}>Your search relate to "{keySearch}":</Text></View>
            <List keySearch={keySearch.toUpperCase()} mode={"search"} />
        </>

    )
}
export default SearchPage
