import React from "react";
import { NavLink } from "react-router-dom";

import settingsIcon from "assets/images/baseline-settings-20px.svg";
import Navigation from "components/common/Navigation";

const ConciergeAdminNavigation = () => (
  <Navigation>
    <li className="conciergeNavigationItem">
      <NavLink
        to={{
          pathname: "/dealerships",
        }}
        activeClassName="conciergeNavLinkActive"
        className="conciergeNavLink"
      >
        <img src={settingsIcon} alt="concierge settings" className="conciergeNavLinkImg" />
        <p className="conciergeNavLinkText">Dealerships</p>
      </NavLink>
    </li>
  </Navigation>
);

export default ConciergeAdminNavigation;
