/* eslint-disable react/display-name */
import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Car from '../views/Car';
import AuthLoading from '../views/AuthLoading';
import Login from '../views/Login';
import Upload from '../views/Upload';
import Saved from "../views/Saved";
import {Icon} from 'native-base';
import MyFiles from '../views/MyFiles';
import Modify from '../views/Modify';
import SearchPage from '../views/SearchPage';
import ChangeAvatar from "../views/ChangeAvatar";

const TabNavigator = createBottomTabNavigator(
  {
    Home,
    Profile,
    Saved,
    Upload,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, color}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'ios-home';
        } else if (routeName === 'Profile') {
          iconName = 'person';
        } else if (routeName === 'Upload') {
          iconName = 'ios-add-circle';
        } else if (routeName === 'Saved') {
          iconName = 'bookmark';
        }

        // You can return any component that you like here!
        return <Icon name={iconName} size={28} style={{color: focused ? '#000' : '#d1cece'}} color={color}/>;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#000',
      inactiveTintColor: '#d1cece',
    },
  },
);

TabNavigator.navigationOptions = ({navigation}) => {
  const {routeName} = navigation.state.routes[navigation.state.index];

  // You can do whatever you like here to pick the title based on the route name
  const headerTitle = routeName;

  return {
    headerTitle,
  };
};

const StackNavigator = createStackNavigator(
  // RouteConfigs
  {
    Home: {
      screen: TabNavigator,
      navigationOptions: {
        headerMode: 'none', // this will hide the header
        headerLeft: () => {}, // this will hide back button
      },
    },
    Car: {
      screen: Car,
    },
    MyFiles: {
      screen: MyFiles,
    },
    Modify: {
      screen: Modify,
    },
    Logout: {
      screen: Login,
    },
    SearchPage: {
      screen: SearchPage
    },
    ChangeAvatar: {
      screen: ChangeAvatar
    },
  },
);

const Navigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: StackNavigator,
    Auth: Login,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default createAppContainer(Navigator);
