/**
 * Name: Login Page
 *
 * This is the entry page when the user accesses the domain
 * User will have to login before being able to access the
 * rest of the system. Since we're following RBAC, all users
 * will use the same system but the presented UI will be
 * different for each user depending on his/her role.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.scss';
import loading from '../../assets/images/loading.svg';
import logoWhite from '../../assets/images/logo-white.svg';


class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCard: false,
      userFieldEmpty: true,
      passFieldEmpty: true,
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["componentDidMount", "handleChange", "handleSubmit"] }] */
  
  componentDidMount() {
    setTimeout(() => {
      this.setState({ showCard: true })
    }, 1000);
  }

  handleChange(event) {
    const { name, value } = event.target
    switch(name) {
      case 'username':
        if (value.length !== 0) {
          this.setState({ userFieldEmpty: false })
        } else {
          this.setState({ userFieldEmpty: true })
        }
        break;
      case 'password':
        if (value.length !== 0) {
          this.setState({ passFieldEmpty: false })
        } else {
          this.setState({ passFieldEmpty: true })
        }
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div className={`${s.background} ${this.state.showCard && s.showCard}`}>
        <img className={s.loading} alt="Loading" src={loading} />
        <img className={s.logo} alt="Logo-White" src={logoWhite} />
        <div className={s.cardWrapper}>
          <div className={s.descCard}>
            <h1>Crisis Management System (CMS)</h1>
            <p>Only authorized personnel are allowed to access the system. Your activity will be monitored upon logging in to the system.</p>
          </div>
          <div className={s.loginCard}>
            <form action="/login" method="post">
              <p>LOG IN TO THE SYSTEM</p>
              <div className={`${s.formGroup} ${!this.state.userFieldEmpty && s.userFieldFilled} ${!this.state.passFieldEmpty && s.passFieldFilled}`}>
                <input
                  className={s.formInput}
                  name="username"
                  id="username"
                  type="text"
                  placeholder="Username"
                  onChange={this.handleChange}
                />
                <input
                  className={s.formInput}
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Password"
                  onChange={this.handleChange}
                />
              </div>
              <div className={s.btnGroup}>
                <a className={s.forgetPass} href="/">Forget Password</a>
                <button className={s.button} value="Submit" type="submit">
                  LOG IN
                </button>
              </div>
            </form>
          </div>
          <div className={s.descCardEnd}/>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Login);
