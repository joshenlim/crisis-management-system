import GoogleMapReact from 'google-map-react';
import React from 'react';
import PropTypes from 'prop-types';
import { mapStyle } from './MapStyle';

class Map extends React.Component {
  static propTypes = {
    center: PropTypes.objectOf(
        PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
        })
    ),
    zoom: PropTypes.number,
  };

  static defaultProps = {
    center: {
      lat: 1.35,
      lng: 103.82
    },
    zoom: 11
  };

  render() {
    const mapOptions = {
        styles: mapStyle
    }
    return (
        <div style={{ height: '500px', width: '100%' }}>
            <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyCoWLP6ZKKkLxK0kj9TJP0vt906LxFU3lo' }}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
            options={mapOptions}
            >
            {/* <AnyReactComponent
                lat={59.955413}
                lng={30.337844}
                text="My Marker"
            /> */}
            </GoogleMapReact>
        </div>
    );
  }
}

export default (Map);
