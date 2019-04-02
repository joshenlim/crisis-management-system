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
    const { fireStationList, publicHospitalList, privateHospitalList, ongoingIncidentList } = this.props;
    const mapOptions = { styles: mapStyle };
    return (
      <div style={{ height: 'calc(100vh - 230px)', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCoWLP6ZKKkLxK0kj9TJP0vt906LxFU3lo' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          options={mapOptions}
        >
          {
            fireStationList.map((station) => {
              return <MapMarker
                lng={station.lng}
                lat={station.lat}
                title={station.name}
                text={station.address}
                iconType={MarkerEnum.detailType.FIRE_STATION}
                mountModal={this.props.mountModal}
              />
            })
          }
          {
            publicHospitalList.map((publicHospital) => {
              return <MapMarker
                id ={publicHospital.id}
                lng={publicHospital.lng}
                lat={publicHospital.lat}
                title={publicHospital.name}
                text={publicHospital.address}
                iconType={MarkerEnum.detailType.PUBLIC_HOSPITAL}
                mountModal={this.props.mountModal}
              />
            })
          }
          {
            ongoingIncidentList.map((ongoingIncidents) => {
              return <MapMarker
                lng={ongoingIncidents.lng}
                lat={ongoingIncidents.lat}
                title={ongoingIncidents.description}
                text={ongoingIncidents.address}
                iconType={MarkerEnum.detailType.INCIDENT}
                mountModal={this.props.mountModal}
              />
            })
          }
          {
            privateHospitalList.map((privateHospital) => {
              return <MapMarker
                lng={privateHospital.lng}
                lat={privateHospital.lat}
                title={privateHospital.name}
                text={privateHospital.address}
                iconType={MarkerEnum.detailType.PRIVATE_HOSPITAL}
                mountModal={this.props.mountModal}
              />
            })
          }
          
        </GoogleMapReact>
        <MapLegend />
      </div>
    );
  }
}

export default Map;
