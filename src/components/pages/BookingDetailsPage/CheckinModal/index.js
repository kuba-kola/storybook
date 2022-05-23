import React from "react";
import { func } from "prop-types";

import CheckinChat from "components/CheckinChat";
import Header from "components/common/checkin/Header";
import "../styles.scss";

const CheckinModal = ({
  onClose,
}) => (
  <div className="checkinModal">
    <div className="checkinContainer">
      <Header
        title="Check in"
        onClose={onClose}
      />
      <CheckinChat />
    </div>
  </div>
);

CheckinModal.propTypes = {
  onClose: func.isRequired,
};

export default CheckinModal;
