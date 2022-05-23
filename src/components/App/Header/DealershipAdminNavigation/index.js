import React from "react";
import { NavLink } from "react-router-dom";

import bookingsIcon from "assets/images/baseline-receipt-24px.svg";
import templatesIcon from "assets/images/baseline-forum-24px.svg";
import settingsIcon from "assets/images/baseline-settings-20px.svg";
import schedulingIcon from "assets/images/scheduling.svg";
import Navigation from "components/common/Navigation";

const DealershipAdminNavigation = () => (
  <Navigation>
    <li>
      <NavLink
        to={{ pathname: "/scheduling" }}
        activeClassName="conciergeNavLinkActive"
        className="conciergeNavLink"
      >
        <img src={schedulingIcon} alt="concierge scheduling" className="conciergeNavLinkImg" />
        <p className="conciergeNavLinkText">Scheduling</p>
      </NavLink>
    </li>
    <li className="conciergeNavigationItem">
      <NavLink
        to={{ pathname: "/bookings" }}
        activeClassName="conciergeNavLinkActive"
        className="conciergeNavLink"
      >
        <img src={bookingsIcon} alt="concierge bookings" className="conciergeNavLinkImg" />
        <p className="conciergeNavLinkText">Bookings</p>
      </NavLink>
    </li>
    <li>
      <NavLink
        to={{ pathname: "/templates" }}
        activeClassName="conciergeNavLinkActive"
        className="conciergeNavLink"
      >
        <img src={templatesIcon} alt="concierge templates" className="conciergeNavLinkImg" />
        <p className="conciergeNavLinkText">Menu templates</p>
      </NavLink>
    </li>
    <li>
      <NavLink
        to={{ pathname: "/settings" }}
        activeClassName="conciergeNavLinkActive"
        className="conciergeNavLink"
      >
        <img src={settingsIcon} alt="concierge settings" className="conciergeNavLinkImg" />
        <p className="conciergeNavLinkText">Settings</p>
      </NavLink>
    </li>
  </Navigation>
);

export default DealershipAdminNavigation;
