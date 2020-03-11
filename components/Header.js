import React from "react";
import {View, Text, StyleSheet} from "react-native";

const Header = (props) => {
  console.log(props.count);
  return (
    <View style={styles.container}>
      {props.title &&
        <Text style={styles.title}>{props.title}</Text>
      }
      {props.subtitle &&
        <Text style={styles.subtitle}>
          {props.subtitle}
        </Text>
      }
      {props.count &&
        <Text style={styles.count}>
          {props.count} result(s)
        </Text>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10
  },
  title: {
    fontSize: 25,
    fontWeight: "700"
  },
  subtitle: {
    marginVertical: 5
  },
  count: {
    marginVertical: 5,
    fontSize: 18,
    fontWeight: "600",
    paddingTop: 5
  }
});

export default Header;
