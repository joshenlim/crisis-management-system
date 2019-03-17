import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import normalizeCss from 'normalize.css';
import s from './Layout.css';
import Header from '../Header';

@connect(state => ({
  user: state.user,
}))
class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    hideHeader: PropTypes.bool.isRequired,
    user: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  };

  render() {
    const { hideHeader, user } = this.props;
    return (
      <div>
        {!hideHeader && <Header user={user} />}
        {this.props.children}
      </div>
    );
  }
}

export default withStyles(normalizeCss, s)(Layout);
