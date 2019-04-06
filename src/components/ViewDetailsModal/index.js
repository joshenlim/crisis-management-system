import React from 'react';
import axios from 'axios';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ViewDetailsModal.scss';
import closeBtn from '../../assets/images/close.svg';
import loading from '../../assets/images/loading-2.svg';

import Enum from '../../constants/enum';

import IncidentModal from './IncidentModal';
import FireStnModal from './FireStnModal';
import PublicHospitalModal from './PublicHospitalModal';
import PrivateHospitalModal from './PrivateHospitalModal';

class ViewDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      updatingIncident: false,
      statusClass: '',
    };
  }

  nextPage = () => this.setState({ page: 2 });
  prevPage = () => this.setState({ page: 1 });
  closeModal = (event) => this.props.mountModal();
  disableCloseModal = (event) => event.stopPropagation();

  dispatchUnits = (incident_id, dispatchList) => {
    this.setState({
      page: 0,
      updatingIncident: true,
    })
    dispatchList.forEach((vehicle) => {
      const body = {
        incident_id: incident_id,
        plate_number: vehicle.plate,
      }
      axios.post('/api/incident/dispatch', body)
        .then((res) => {
          setTimeout(() => {
            this.setState({ updatingIncident: false });
          }, 1000)
      
          setTimeout(() => {
            this.closeModal()
          }, 3000)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }

  renderContent = () => {
    switch (this.props.type) {
      case Enum.detailType.FIRE_STATION:
        return <FireStnModal {...this.props} />;
      case Enum.detailType.PUBLIC_HOSPITAL:
        return <PublicHospitalModal {...this.props} />;
      case Enum.detailType.PRIVATE_HOSPITAL:
        return <PrivateHospitalModal {...this.props} />;
      case Enum.detailType.INCIDENT:
        return <IncidentModal {...this.props}
                fireStationList={this.props.fireStationList}
                dispatchUnits={this.dispatchUnits}
                nextPage={this.nextPage}
                prevPage={this.prevPage}
                page={this.state.page} />;
      default:
        this.closeModal();
    }
  }

  render() {
    const { page, updatingIncident } = this.state;
    return (
      <div className={s.modalBackground} onClick={this.closeModal}>
        <div className={s.modal + " " + (page == 2 && s.dispatchMapStep) + " " + (page == 0 && s.submitStep)} onClick={this.disableCloseModal}>
          {
            page != 0 && <span className={s.closeBtn} onClick={this.closeModal}>
              <img src={closeBtn} alt="close" />
            </span>
          }
          {!updatingIncident && page != 0 && this.renderContent()}
          {
            updatingIncident && <div className={s.loadingWindow}>
              <img className={s.loadingIcon} src={loading} alt="loading" />
              <p>Updating Incident</p>
            </div>
          }
          {
            !updatingIncident && page == 0 && <div className={s.successWindow}>
                <div className={s.checkIcon}>
                <span className={s.iconLine + " " + s.lineTip}></span>
                <span className={s.iconLine + " " + s.lineLong}></span>
                <div className={s.iconCircle}></div>
                <div className={s.iconFix}></div>
              </div>
              <p>Incident successfully updated!</p>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ViewDetailsModal);
