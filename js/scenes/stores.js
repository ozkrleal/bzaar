import React, { Component } from 'react';
import { StyleSheet, ImageBackground, FlatList, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as Actions from '../actions/stores';
import { stores } from '../styles';

const styles = StyleSheet.create(stores);

class Stores extends Component {

  constructor(props) {
    super(props);
    this.state = {
      jwt: this.props.jwt,
      list: this.props.stores.list || [],
      loadingRequest: !!this.props.stores.loadingRequest,
    };
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.props.storeActions.list(this.props.jwt);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loadingRequest: nextProps.stores.loadingRequest,
      list: nextProps.stores.list,
    });
  }

  pressItem(item) {
    this.props.storeActions.openStore(item);
  }

  handleRefresh() {
    this.props.storeActions.list(this.props.jwt);
  }

  renderItem({ item, index }) {
    const imageStyle = styles.storeExtendedImage;
    return (
      <TouchableOpacity
        key={index}
        style={styles.imageContainer}
        onPress={() => this.pressItem(item)}
      >
        <ImageBackground
          source={{ uri: item.logo }}
          blurRadius={10}
          style={[imageStyle, {
            justifyContent: 'center',
            alignItems: 'center',
          }]}
        >
          <Text style={{
            backgroundColor: 'transparent',
            color: 'white',
            fontSize: 40,
          }}
          >
            {item.name}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <FlatList
        numColumns={1}
        horizontal={false}
        data={this.state.list}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        refreshing={this.state.loadingRequest}
        onRefresh={() => this.handleRefresh()}
        ListEmptyComponent={<Text>Não foi possivel encontrar lojas.</Text>}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    stores: state.stores,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    storeActions: bindActionCreators(Actions, dispatch),
  };
}

Stores.propTypes = {
  jwt: PropTypes.string.isRequired,
  stores: PropTypes.shape({
    list: PropTypes.arrayOf(PropTypes.object),
    loadingRequest: PropTypes.bool,
  }).isRequired,
  storeActions: PropTypes.shape({
    list: PropTypes.func.isRequired,
    openStore: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Stores);
