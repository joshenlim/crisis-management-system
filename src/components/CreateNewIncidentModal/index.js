import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Socket from 'socket.io-client';

import s from './CreateNewIncidentModal.scss';
import closeBtn from '../../assets/images/close.svg';
import loading from '../../assets/images/loading-2.svg';
import { SOCKIO_HOST } from '../../constants';
import Enum from '../../constants/enum';

import AssistanceTypeQuestionSet from './AssistanceTypeQuestionSet';
import RTAQuestionSet from './RTAQuestionSet';
import FFQuestionSet from './FFQuestionSet';
import MEQuestionSet from './MEQuestionSet';
import CallerInformationQuestionSet from './CallerInformationQuestionSet';
import IncidentLocationQuestionSet from './IncidentLocationQuestionSet';
import DispatchMap from './DispatchMap';
import DispatchVehicleList from './DispatchVehicleList';

const io = Socket(SOCKIO_HOST);

class CreateNewIncidentModal extends React.Component {
  static propTypes = {
    mountModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      selectedType: 'EA',
      escalate: false,
      selectedVehicles: [],
      fireStations: [],
      submittingIncident: false,

      // General Incident Information
      category: 'road_traffic_accident',
      casualtyNo: 0,
      callerName: null,
      callerContact: null,
      description: null,
      incidentPostalCode: null,
      incidentAddress: null,
      incidentLocation: {},

      // RTA Specific
      vehicleType: null,
      vehiclePlate: null,

      // ME Specific
      condition: null,
      consciousness: 'alert',
      suicide: false,
      suicidalMethod: null,
      suicidalEquipment: null,

      // FE Specific
      fireSpreadRate: 1,

      // Vehicle Dispatch
      vehicleDispatch: [],
    };
  }

  closeModal = event => {
    this.props.mountModal();
  };

  updateNumCasualties = event => {
    const numberCasualties = event.target.value;
    this.setState({ casualtyNo: numberCasualties });
    if (numberCasualties >= 10 && !this.state.escalate) {
      this.setState({
        escalate: true,
      });
    } else if (numberCasualties < 10 && this.state.escalate) {
      this.setState({
        escalate: false,
      });
    }
  };

  updateSelectedType = (typeRef, typeVal) => {
    this.setState({
      selectedType: typeRef,
      category: typeVal,
    });
  };

  updatePostalCode = postalCode =>
    this.setState({ incidentPostalCode: postalCode });
  updateAddress = address => this.setState({ incidentAddress: address });
  updateCallerName = name => this.setState({ callerName: name });
  updateCallerContact = contact => this.setState({ callerContact: contact });
  updateDescription = event =>
    this.setState({ description: event.target.value });
  escalateIncident = () => this.setState({ escalate: !this.state.escalate });

  updateVehicleType = type => this.setState({ vehicleType: type });
  updateVehiclePlate = plate => this.setState({ vehiclePlate: plate });
  updateFireSpreadRate = rate => this.setState({ fireSpreadRate: rate });
  updateCurrentCondition = condition => this.setState({ condition: condition });
  updateLevelConsc = level => this.setState({ consciousness: level });
  updateSuicide = res => this.setState({ suicide: res });
  updateSuicidalEquipment = equipment =>
    this.setState({ suicidalEquipment: equipment });
  updateSuicidalMethod = method => this.setState({ suicidalMethod: method });
  updateVehicleDispatch = vehicles =>
    this.setState({ vehicleDispatch: vehicles });

  nextPage = event => {
    const self = this;
    if (this.state.incidentPostalCode && event.target.attributes.tag) {
      if (event.target.attributes.tag.value == 'convertGeocode') {
        axios
          .get('/api/geocode/address?q=' + this.state.incidentPostalCode)
          .then(function(res) {
            self.setState({
              incidentLocation: {
                address: res.data.address,
                center: {
                  lat: res.data.lat,
                  lng: res.data.lng,
                },
              },
            });
          });
      }
    }
    if (this.state.page < 3) {
      this.setState({ page: this.state.page + 1 });
    }
  };

  prevPage = () => {
    if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1 });
    }
  };

  onSubmit = event => {
    event.preventDefault();
    this.setState({
      page: 0,
      submittingIncident: true,
    });
    const postBody = {
      caller_name: this.state.callerName,
      caller_contact: this.state.callerContact,
      category: this.state.category,
      postal_code: this.state.incidentPostalCode,
      address: this.state.incidentAddress || 'nil',
      lat: this.state.incidentLocation.center.lat,
      lng: this.state.incidentLocation.center.lng,
      casualty_no: this.state.casualtyNo,
      description: this.state.description,
      vehicle_type: this.state.vehicleType,
      vehicle_plate: this.state.vehiclePlate,
      curr_condition: this.state.condition,
      level_of_consc: this.state.consciousness,
      if_suicide: this.state.suicide,
      suicidal_equipment: this.state.suicidalEquipment,
      suicidal_method: this.state.suicidalMethod,
      fire_spread_rate: this.state.fireSpreadRate,
    };

    const { vehicleDispatch } = this.state;

    axios
      .post('/api/incident/create', postBody)
      .then(res => {
        vehicleDispatch.forEach(vehicle => {
          const body = {
            incident_id: res.data.incident_id,
            plate_number: vehicle.plate,
          };
          axios
            .post('/api/incident/dispatch', body)
            .then(res => {
              setTimeout(() => {
                this.setState({ submittingIncident: false });
                io.emit('notify', Enum.socketEvents.NEW_INCIDENT);
                console.log(
                  'SocketIo: emitted "new incident" at ' +
                    new Date().getTime() +
                    'ms',
                );
              }, 1000);

              setTimeout(() => {
                this.closeModal();
              }, 3000);
            })
            .catch(err => {
              console.log(err);
            });
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { fireStationList } = this.props;
    return (
      <div className={s.modalBackground}>
        <div
          className={
            s.incidentModal +
            ' ' +
            (this.state.page == 3 ? s.dispatchMapStep : '') +
            ' ' +
            (this.state.page == 0 ? s.submitStep : '')
          }
        >
          {!this.state.page == 0 && (
            <span className={s.closeBtn} onClick={this.closeModal}>
              <img src={closeBtn} alt="close" />
            </span>
          )}

          <form onSubmit={this.onSubmit}>
            {!this.state.page == 0 && (
              <div className={s.segment}>
                <p className={s.category}>Create New Incident</p>
              </div>
            )}

            {!this.state.page == 0 && <hr />}

            <div className={this.state.page == 1 ? s.showPage : s.hidePage}>
              <p className={s.contentHeader}>Type of assistance requested:</p>
              <div className={s.contentBody}>
                <AssistanceTypeQuestionSet
                  updateSelectedType={this.updateSelectedType}
                />
              </div>

              <p className={s.contentHeader}>Incident Details</p>
              <div className={s.contentBody}>
                {this.state.selectedType == 'EA' && (
                  <RTAQuestionSet
                    onVehicleTypeChange={this.updateVehicleType}
                    onVehiclePlateChange={this.updateVehiclePlate}
                  />
                )}
                {this.state.selectedType == 'FF' && (
                  <FFQuestionSet
                    onFireSpreadRateChange={this.updateFireSpreadRate}
                  />
                )}
                {this.state.selectedType == 'ME' && (
                  <MEQuestionSet
                    onCurrConditionChange={this.updateCurrentCondition}
                    onLevelConscChange={this.updateLevelConsc}
                    onSuicideChange={this.updateSuicide}
                    onSuicidalEquipmentChange={this.updateSuicidalEquipment}
                    onSuicidalMethodChange={this.updateSuicidalMethod}
                  />
                )}
                <div className={s.questionSet}>
                  <div className={s.textQuestion}>
                    <div className={s.question}>
                      <p className={s.title}>Number of Casualties:</p>
                    </div>
                    <input
                      className={s.textInput}
                      name="casualty_no"
                      type="number"
                      onChange={this.updateNumCasualties}
                    />
                  </div>
                  <div className={s.textQuestion + ' ' + s.textArea}>
                    <div className={s.question}>
                      <p className={s.title}>Incident Description:</p>
                    </div>
                    <textarea
                      className={s.textInput}
                      name="description"
                      rows={3}
                      cols={30}
                      onChange={this.updateDescription}
                    />
                  </div>
                </div>
              </div>

              <div className={s.escalateQuestion}>
                <div className={s.textQuestion}>
                  <div className={s.question}>
                    <p className={s.title}>Escalate Incident to HQ:</p>
                  </div>
                  <input
                    name="escalateToHQ"
                    type="checkbox"
                    checked={this.state.escalate}
                    onChange={this.escalateIncident}
                  />
                </div>
              </div>

              <div className={s.nextButton} onClick={this.nextPage}>
                Next
              </div>
            </div>

            <div className={this.state.page == 2 ? s.showPage : s.hidePage}>
              <p className={s.contentHeader}>Caller Information</p>
              <div className={s.contentBody}>
                <CallerInformationQuestionSet
                  onCallerNameChange={this.updateCallerName}
                  onCallerContactChange={this.updateCallerContact}
                />
              </div>

              <p className={s.contentHeader}>Incident Location</p>
              <div className={s.contentBody}>
                <IncidentLocationQuestionSet
                  onPostalChange={this.updatePostalCode}
                  onAddressChange={this.updateAddress}
                />
              </div>

              <div className={s.btnGrp}>
                <div className={s.prevButton} onClick={this.prevPage}>
                  Back
                </div>
                <div
                  className={s.nextButton}
                  style={{ margin: 0 }}
                  onClick={this.nextPage}
                  tag="convertGeocode"
                >
                  Next
                </div>
              </div>
            </div>

            <div className={this.state.page == 3 ? s.showPage : s.hidePage}>
              <p className={s.contentHeader}>
                Select a department to dispatch the case to - dropdown to view
                department status details.
              </p>

              <div className={s.dispatchUnits}>
                <div className={s.dispatchList}>
                  <DispatchVehicleList
                    fireStationList={fireStationList}
                    updateVehicleDispatch={this.updateVehicleDispatch}
                  />
                </div>
                <div className={s.dispatchMap}>
                  <DispatchMap
                    center={this.state.incidentLocation.center}
                    zoom={12}
                    address={this.state.incidentLocation.address}
                  />
                </div>
              </div>

              <div className={s.btnGrp}>
                <div className={s.prevButton} onClick={this.prevPage}>
                  Back
                </div>
                <button className={s.button} value="Submit" type="submit">
                  Create Incident
                </button>
              </div>
            </div>

            <div className={this.state.page == 0 ? s.showPage : s.hidePage}>
              {this.state.submittingIncident && (
                <div className={s.loadingWindow}>
                  <img className={s.loadingIcon} src={loading} alt="loading" />
                  <p>Creating Incident</p>
                </div>
              )}
              {!this.state.submittingIncident && (
                <div className={s.successWindow}>
                  <div className={s.checkIcon}>
                    <span className={s.iconLine + ' ' + s.lineTip} />
                    <span className={s.iconLine + ' ' + s.lineLong} />
                    <div className={s.iconCircle} />
                    <div className={s.iconFix} />
                  </div>
                  <p>Incident successfully created!</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(CreateNewIncidentModal);
