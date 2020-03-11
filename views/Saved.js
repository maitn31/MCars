import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';

const Saved = (props) => {
  const {navigation} = props;
  return (
    <List navigation={navigation} mode={'saved'}></List>
  );
};

Saved.propTypes = {
  navigation: PropTypes.object,
};

export default Saved;