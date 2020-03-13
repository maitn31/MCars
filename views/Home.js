import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';
import Search from '../components/Search';
console.disableYellowBox = true;
const Home = (props) => {
  // console.log('Home', props);
  const {navigation} = props;
  return (
    <>
      <Search navigation={navigation} />
      <List navigation={navigation} mode={'all'}></List>
    </>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
