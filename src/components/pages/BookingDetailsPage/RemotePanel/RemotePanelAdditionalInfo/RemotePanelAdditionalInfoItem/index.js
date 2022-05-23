import React from "react";
import { string, node } from "prop-types";

import Block from "components/common/Block";

import "./styles.scss";

const RemotePanelAdditionalInfoItem = ({ title, children }) => (
  <div className="conciergeBookingDetailsPanelAdditionalInfoItemWrapper">
    <p className="title">{title}</p>
    <Block className="conciergeBookingDetailsPanelAdditionalInfoItem">
      {children}
    </Block>
  </div>
);

RemotePanelAdditionalInfoItem.propTypes = {
  title: string,
  children: node.isRequired,

};

RemotePanelAdditionalInfoItem.defaultProps = {
  title: "",
};

export default RemotePanelAdditionalInfoItem;
