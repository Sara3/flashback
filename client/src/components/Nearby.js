import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { connect } from 'react-redux';
import NearbyPhotoCard from './NearbyPhotoCard';
import Loading from './Loading';
import { imageAction, imageIsFetched, fetchPhotoFromRadius } from '../actions/imageAction';
import { Link } from 'react-router';
import { nearbyPhoto, mapPhotosWithRadius } from '../helpers/axiosAction';
import { urlAction } from '../actions/urlAction';

require('!style-loader!css-loader!sass-loader!../styles/main.scss');
require('!style-loader!css-loader!sass-loader!../styles/main.css');

class Nearby extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.urlAction('nearby');
  }
  
  componentWillUpdate(nextProps) {
    if (!nextProps.location.isFetched) {
      nearbyPhoto({ location: nextProps.location, max: 20 }, (res) => {
        this.props.imageAction(res.data);
        this.props.imageIsFetched(true);
      });
      if (!this.props.allPhotoFromRadius.length) {
        mapPhotosWithRadius(1, { location: this.props.location }, (res) => {
          this.props.fetchPhotoFromRadius(res.data);
        });
      }
    }
  }
 
  renderPhotos() {
    return this.props.photoArray.map((photo, i) => {
      return (
        <NearbyPhotoCard key={i} photo={photo} i={i}/>
      );
    });
  }
  render() {
    const isFetched = this.props.location.isFetched;
    if (!isFetched) {
      return (
        <div>
          <Loading />
        </div>
      );
    } else {
      return (
        <div className="photoCard-container container">
          <h4 className="h4-heading"> Nearby Photos </h4>
          {this.renderPhotos.bind(this)()} 
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    location: state.location,
    photoArray: state.photoArray,
    url: state.url,
    allPhotoFromRadius: state.currentPhoto.allPhotoFromRadius
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ imageAction, imageIsFetched, urlAction, fetchPhotoFromRadius }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Nearby);
