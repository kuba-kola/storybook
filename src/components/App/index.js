import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

import Header from "components/App/Header";
import Routes from "components/routing";
import ActionCableAdmin from "components/common/ActionCable/Admin";
import ActionCableCheckin from "components/common/ActionCable/Checkin";

import "./styles.scss";

const App = () => {
  useEffect(() => {
    const existingGoogleMapsScript = document.querySelector("#googleMapsScript");

    if (!existingGoogleMapsScript) {
      const gmapScriptEl = document.createElement("script");
      gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
      gmapScriptEl.id = "googleMapsScript";
      document.querySelector("body").insertAdjacentElement("beforeend", gmapScriptEl);
    }
  }, []);

  return (
    <div className="conciergeApp">
      <Header />
      <Routes />
      <ActionCableAdmin channel="AdminChannel" />
      <ActionCableCheckin channel="CheckinChannel" />
    </div>
  );
};

export default withRouter(App);
