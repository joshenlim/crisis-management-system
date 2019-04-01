import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ViewDetailsModal.scss';
import closeBtn from '../../assets/images/close.svg';

import Enum from '../../constants/enum';

import IncidentModal from './IncidentModal';
import FireStnModal from './FireStnModal';
import PublicHospitalModal from './PublicHospitalModal';

class ViewDetailsModal extends React.Component {
  static propTypes = {
    type: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    mountModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      statusClass: '',
    };

    this.closeModal = this.closeModal.bind(this);
    this.disableCloseModal = this.disableCloseModal.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  closeModal(event) {
    console.log(event);
    this.props.mountModal();
  }

  disableCloseModal(event) {
    event.stopPropagation();
  }

  //TODO - Pri/Pub Hospital Modals
  renderContent() {
    switch (this.props.type) {
      case Enum.detailType.FIRE_STATION:
        return <FireStnModal {...this.props} />;
      case Enum.detailType.PUBLIC_HOSPITAL:
        return <PublicHospitalModal {...this.props} />;
      case Enum.detailType.PRIVATE_HOSPITAL:
        return <IncidentModal {...this.props} />;
      case Enum.detailType.INCIDENT:
        return <IncidentModal {...this.props} />;
      default:
        this.closeModal();
    }
  }

  render() {
    return (
      <div className={s.modalBackground} onClick={this.closeModal}>
        <div className={s.modal} onClick={this.disableCloseModal}>
          <span className={s.closeBtn} onClick={this.closeModal}>
            <img src={closeBtn} alt="close" />
          </span>
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ViewDetailsModal);
