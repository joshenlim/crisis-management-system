import GoogleMapReact from 'google-map-react';
import React from 'react';
import PropTypes from 'prop-types';
import { mapStyle } from './MapStyle';

import MapMarker from '../MapMarker';
import MarkerEnum from '../../constants/enum';
import MapLegend from '../MapLegend';

class Map extends React.Component {
  static propTypes = {
    center: PropTypes.objectOf(PropTypes.number),
    zoom: PropTypes.number,
    mountModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    center: {
      lat: 1.35,
      lng: 103.82,
    },
    zoom: 11.8,
  };

  render() {
    const mapOptions = { styles: mapStyle };
    return (
      <div style={{ height: 'calc(100vh - 230px)', width: '100%' }}>
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
          <MapMarker
            lng={103.689564}
            lat={1.381662}
            color="blue"
            title="This is a title"
            text="This event etc etc"
            iconType={MarkerEnum.detailType.PUBLIC_HOSPITAL}
            mountModal={this.props.mountModal}
          />
          <MapMarker
            lng={103.680564}
            lat={1.383262}
            title="This is a title"
            text="This event etc etc"
            iconType={MarkerEnum.detailType.FIRE_STATION}
            mountModal={this.props.mountModal}
          />
          <MapMarker
            lng={103.67}
            lat={1.383162}
            title="This is a title"
            text="This event etc etc"
            iconType={MarkerEnum.detailType.INCIDENT}
            mountModal={this.props.mountModal}
          />
          <MapMarker
            lng={103.69}
            lat={1.388}
            title="This is a title"
            text="This event etc etc"
            iconType={MarkerEnum.detailType.PRIVATE_HOSPITAL}
            mountModal={this.props.mountModal}
          />
        </GoogleMapReact>
        <MapLegend />
      </div>
    );
  }
}

export default Map;
