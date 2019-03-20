import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateNewIncidentModal.scss';
import closeBtn from '../../assets/images/close.svg';

import AssistanceTypeQuestionSet from './AssistanceTypeQuestionSet';
import EAQuestionSet from './EAQuestionSet';
import CallerInformationQuestionSet from './CallerInformationQuestionSet';
import IncidentLocationQuestionSet from './IncidentLocationQuestionSet';

class CreateNewIncidentModal extends React.Component {
  static propTypes = {
    mountModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      selectedType: "EA",
    };

    this.closeModal = this.closeModal.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.updateSelectedType = this.updateSelectedType.bind(this);
  }

  closeModal(event) {
    this.props.mountModal();
  }

  updateSelectedType = (type) => {
    this.setState({
      selectedType: type,
    })
  }

  nextPage = () => {
    this.setState({
      page: 2,
    })
  }

  prevPage = () => {
    this.setState({
      page: 1,
    })
  }

  render() {

    return (
      <div className={s.modalBackground}>
        <div className={s.incidentModal}>
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
                <AssistanceTypeQuestionSet updateSelectedType={this.updateSelectedType}/>
              </div>

              <p className={s.contentHeader}>Incident Details</p>
              <div className={s.contentBody}>
                { this.state.selectedType == "EA" && <EAQuestionSet /> }
              </div>

              <p className={s.contentHeader}>Caller Information</p>
              <div className={s.contentBody}>
                <CallerInformationQuestionSet />
              </div>

              <p className={s.contentHeader}>Incident Location</p>
              <div className={s.contentBody}>
                <IncidentLocationQuestionSet />
              </div>

              <div className={s.escalateQuestion}>
                <div className={s.textQuestion}>
                  <div className={s.question}>
                    <p className={s.title}>Escalate Incident to HQ:</p>
                  </div>
                  <input
                    name="escalateToHQ"
                    type="checkbox"
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
