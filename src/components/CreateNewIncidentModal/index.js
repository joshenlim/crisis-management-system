import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';
import closeBtn from '../../assets/images/close.svg';

import AssistanceTypeQuestionSet from './AssistanceTypeQuestionSet';
import EAQuestionSet from './EAQuestionSet';
import FFQuestionSet from './FFQuestionSet';
import MEQuestionSet from './MEQuestionSet';
import CallerInformationQuestionSet from './CallerInformationQuestionSet';
import IncidentLocationQuestionSet from './IncidentLocationQuestionSet';
import DispatchMap from './DispatchMap';

class CreateNewIncidentModal extends React.Component {
  static propTypes = {
    mountModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      selectedType: "EA",
      escalate: false,
      incidentPostalCode: "",
      incidentLatLng: {},
    };

    this.closeModal = this.closeModal.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.updateSelectedType = this.updateSelectedType.bind(this);
    this.updateNumCasualties = this.updateNumCasualties.bind(this);
    this.updatePostalCode = this.updatePostalCode.bind(this);
    this.escalateIncident = this.escalateIncident.bind(this);
  }

  closeModal(event) {
    this.props.mountModal();
  }

  updateSelectedType = (type) => {
    this.setState({
      selectedType: type,
    })
  }

  updateNumCasualties = (event) => {
    const numberCasualties = event.target.value;
    if (numberCasualties >= 10 && !this.state.escalate) {
      this.setState({
        escalate: true,
      })
    } else if (numberCasualties < 10 && this.state.escalate) {
      this.setState({
        escalate: false,
      })
    }
  }

  updatePostalCode = (postalCode) => {
    this.setState({
      incidentPostalCode: postalCode,
    })
  }

  escalateIncident = () => {
    this.setState({
      escalate: !this.state.escalate,
    })
  }

  nextPage = (event) => {
    const self = this;
    if (this.state.incidentPostalCode.length && event.target.attributes.tag) {
      if (event.target.attributes.tag.value == "convertGeocode") {
        axios.get('/api/geocode/address?q=' + this.state.incidentPostalCode)
          .then(function (res) {
            self.setState({
              incidentLatLng: {
                address: res.data.address,
                center: {
                  lat: res.data.lat,
                  lng: res.data.lng,
                },
              }
            })
          });
      }
    }
    if (this.state.page < 3) {
      this.setState({
        page: this.state.page + 1,
      })
    }
  }

  prevPage = () => {
    if (this.state.page > 1) {
      this.setState({
        page: this.state.page - 1,
      })
    }
  }

  render() {
    return (
      <div className={s.modalBackground}>
        <div className={s.incidentModal + " " + (this.state.page == 3 ? s.dispatchMapStep : "")}>
          <span className={s.closeBtn} onClick={this.closeModal}>
            <img src={closeBtn} alt="close" />
          </span>
          <form action="/api/incident/create" method="post">
            <div className={s.segment}>
              <p className={s.category}>Create New Incident</p>
            </div>

            <hr />

            <div className={this.state.page == 1 ? s.showPage : s.hidePage}>
              <p className={s.contentHeader}>Type of assistance requested:</p>
              <div className={s.contentBody}>
                <AssistanceTypeQuestionSet updateSelectedType={this.updateSelectedType} />
              </div>

              <p className={s.contentHeader}>Incident Details</p>
              <div className={s.contentBody}>
                {this.state.selectedType == "EA" && <EAQuestionSet />}
                {this.state.selectedType == "FF" && <FFQuestionSet />}
                {this.state.selectedType == "ME" && <MEQuestionSet />}
                <div className={s.questionSet}>
                  <div className={s.textQuestion}>
                    <div className={s.question}>
                      <p className={s.title}>Number of Casualties:</p>
                    </div>
                    <input
                      className={s.textInput}
                      name="casualty_num"
                      type="number"
                      onChange={this.updateNumCasualties}
                    />
                  </div>
                  <div className={s.textQuestion}>
                    <div className={s.question}>
                      <p className={s.title}>Incident Description:</p>
                    </div>
                    <textarea
                      className={s.textInput}
                      name="description"
                      rows={3}
                      cols={30}
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

              <div
                className={s.nextButton}
                onClick={this.nextPage}>
                Next
              </div>
            </div>


            <div className={this.state.page == 2 ? s.showPage : s.hidePage}>
              <p className={s.contentHeader}>Caller Information</p>
              <div className={s.contentBody}>
                <CallerInformationQuestionSet />
              </div>

              <p className={s.contentHeader}>Incident Location</p>
              <div className={s.contentBody}>
                <IncidentLocationQuestionSet onPostalChange={this.updatePostalCode} />
              </div>

              <div className={s.btnGrp}>
                <div
                  className={s.prevButton}
                  onClick={this.prevPage}>
                  Back
                </div>
                <div
                  className={s.nextButton}
                  style={{ margin: 0 }}
                  onClick={this.nextPage}
                  tag="convertGeocode">
                  Next
                </div>
              </div>
            </div>

            <div className={this.state.page == 3 ? s.showPage : s.hidePage}>
              <p className={s.contentHeader}>Select a department to dispatch the case to - dropdown to view department status details.</p>

              <div className={s.dispatchUnits}>
                {/* Need to pull from db the list of vehicles, all probably from component will mount */}
                <div className={s.dispatchList}>
                  <p>Hello</p>
                </div>
                <div className={s.dispatchMap}>
                  {
                    this.state.incidentLatLng.center && <DispatchMap center={this.state.incidentLatLng.center} zoom={12} address={this.state.incidentLatLng.address} />
                  }
                </div>
              </div>

              <div className={s.btnGrp}>
                <div
                  className={s.prevButton}
                  onClick={this.prevPage}>
                  Back
                </div>
                <button className={s.button} value="Submit" type="submit">
                  Create Incident
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(CreateNewIncidentModal);