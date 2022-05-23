import React from "react";
import { string } from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { authTokenSelector, authRoleSelector } from "store/selectors/auth-selectors";
import {
  ADMIN_ROLE, ADVISOR_ROLE, BDC_ROLE, MANAGER_ROLE,
} from "shared/constants";

import conciergeLogo from "assets/images/carmen_logo_white.svg";

import DealershipAdminNavigation from "./DealershipAdminNavigation";
import DealershipAdvisorNavigation from "./DealershipAdvisorNavigation";
import ConciergeAdminNavigation from "./ConciergeAdminNavigation";
import "./styles.scss";

const Header = ({ token, role }) => {
  const navigation = () => {
    if (!token) return null;
    switch (role) {
      case ADMIN_ROLE: return <ConciergeAdminNavigation />;
      case MANAGER_ROLE: return <DealershipAdminNavigation />;
      case ADVISOR_ROLE:
      case BDC_ROLE:
        return <DealershipAdvisorNavigation />;
      default: return null;
    }
  };

  return (
    <header className="conciergeHeader">
      <div className="conciergeHeaderCentering">
        <img className="conciergeLogo" alt="concierge logo" src={conciergeLogo} />
        {navigation()}
      </div>
    </header>
  );
};

Header.propTypes = {
  token: string,
  role: string,
};

Header.defaultProps = {
  token: null,
  role: null,
};

const mapStateToProps = (state) => ({
  token: authTokenSelector(state),
  role: authRoleSelector(state),
});

export default withRouter(connect(mapStateToProps)(Header));
