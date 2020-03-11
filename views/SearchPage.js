import React from 'react'
import List from '../components/List';

const SearchPage = (props) => {

    const keySearch = props.navigation.state.params.input;
    return (
        <List keySearch={keySearch} mode={"search"} />
    )
}
export default SearchPage
