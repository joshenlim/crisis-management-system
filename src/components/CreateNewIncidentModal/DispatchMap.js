import GoogleMapReact from 'google-map-react';
import React from 'react';
import PropTypes from 'prop-types';
import { mapStyle } from './MapStyle';
import MapMarker from '../MapMarker';
import MarkerEnum from '../../constants/enum';

class DispatchMap extends React.Component {
  static propTypes = {
    center: PropTypes.objectOf(PropTypes.number).isRequired,
    zoom: PropTypes.number.isRequired,
    address: PropTypes.string.isRequired
  };

  render() {
    const mapOptions = {
      styles: mapStyle,
      scrollwheel: false,
      mapTypeControl: false,
      fullscreenControl: false,
      scaleControl: false,
      zoomControl: false,
    };
    return (
      <div style={{ height: '400px', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCoWLP6ZKKkLxK0kj9TJP0vt906LxFU3lo' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          options={mapOptions}
        >
          <MapMarker
            lng={this.props.center.lng}
            lat={this.props.center.lat}
            color="red"
            title="Incident Location"
            text={this.props.address}
            iconType={MarkerEnum.detailType.INCIDENT}
            mountModal={() => {console.log("test")}}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default DispatchMap;
