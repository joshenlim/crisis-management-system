import React, { Component } from 'react';
import AlertedIncidentList from './AlertedIncidentList';
import AlertedIncidentDetail from './AlertedIncidentDetail';

class AlertedIncidentPage extends Component {
  constructor(props) {
    super(props);
    this.state = { page: 0, incidentId: 0 };

    this.displayDetail = this.displayDetail.bind(this);
    this.displayList = this.displayList.bind(this);
  }

  displayDetail(id) {
    this.setState({ page: 1, incidentId: id });
  }

  displayList() {
    this.setState({ page: 0, incidentId: 0 });
  }

  render() {
    switch (this.state.page) {
      case 0:
        return <AlertedIncidentList displayDetail={this.displayDetail} />;
      case 1:
        return (
          <AlertedIncidentDetail
            displayList={this.displayList}
            incidentId={this.state.incidentId}
          />
        );
    }
  }
}

export default AlertedIncidentPage;
