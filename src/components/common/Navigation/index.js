import React, { Component } from "react";
import { func, node } from "prop-types";
import { connect } from "react-redux";
import { history as historyType } from "react-router-prop-types";
import { withRouter } from "react-router-dom";

import { logOut } from "store/actions/auth-actions";

import exitIcon from "assets/images/baseline-exit-24px.svg";

import "./styles.scss";

class Navigation extends Component {
  logout = () => {
    const { logout, history } = this.props;
    logout();
    sessionStorage.clear("CONCIERGE_TOKEN");
    sessionStorage.clear("CONCIERGE_ROLE");
    sessionStorage.clear("CONCIERGE_DEALERSHIP");
    history.push("/login");
  }

  render() {
    return (
      <nav className="conciergeNavigation">
        <ul className="conciergeNavigationList">
          {this.props.children}
        </ul>
        <section className="conciergeNavigationLogoutBlock">
          <div className="conciergeNavLink" onClick={this.logout}>
            <img src={exitIcon} alt="concierge exit" className="conciergeNavLinkImg" />
            <p className="conciergeNavLinkText">Logout</p>
          </div>
        </section>
      </nav>
    );
  }
}

Navigation.propTypes = {
  children: node.isRequired,
  logout: func.isRequired,
  history: historyType.isRequired,
};

const actions = {
  logout: logOut,
};

export default withRouter(connect(null, actions)(Navigation));
