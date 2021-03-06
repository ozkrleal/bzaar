import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

class Button extends Component {
  constructor(props) {
    super(props);
    this.onPress = _.debounce(
      props.onPress,
      300,
      { leading: true, trailing: false },
    ).bind(this);
  }

  render() {
    const { style, children } = this.props;
    return (
      <TouchableOpacity
        style={style}
        onPress={this.onPress}
      >
        { children }
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  onPress: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default Button;
