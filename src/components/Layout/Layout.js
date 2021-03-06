/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import Header from '../Header';
// import Feedback from '../Feedback';
// import Footer from '../Footer';

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
        {/* <Feedback /> */}
        {/* <Footer /> */}
      </div>
    );
  }
}

export default withStyles(normalizeCss, s)(Layout);
