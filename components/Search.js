import React, {useState} from "react";
import {Icon} from "native-base";
// import {Icon} from "react-native-elements";
import {TextInput, StyleSheet, View, Button} from "react-native";

const Search
 = props => {
  const [input, setInput] = useState("");
  return (
    <>
    <View style={styles.searchInput}>
        <Icon
        name='ios-search' 
        size={22} 
        style={styles.searchIcon} 
        color='#bbb'
        />
        <View>
            <TextInput 
            style={styles.inputText}
            placeholder={'I\'m looking for...'}
            placeholderTextColor={'#999'}
            underlineColorAndroid={'#fff'}
            autoCorrect={false}
            onChangeText={e => {
                setInput(e);
            }}
            value={input}
            />
        </View>
    </View>
    <View style = {styles.submitBtn}>
        <Button disabled={input === "" ? true : false}
        title={"Search"}
        onPress={() => {
            props.navigation.push("SearchPage", {input: input});
        }}
        >
        </Button>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
 
  textInput: {
    width: "60%"
  },
  searchContainer: {
    zIndex: 99,
    backgroundColor: '#597fab',
    width: '100%',
    overflow: 'hidden',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 3,
    height: 45,
    marginTop: 3,
    marginLeft: 10,
    marginRight: 10
  },
  submitBtn: {
    borderRadius: 3,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  searchIcon: {
    position: 'absolute',
    left: 13,
    top: 8,
  },
  inputText: {
    marginTop: 8,
    marginLeft: 43,
    fontSize: 20,
    color: '#999',
  },
});

export default Search;
