import React from "react";
import { node } from "prop-types";

import Block from "components/common/Block";

import "./styles.scss";

const RemotePanelAdditionalInfoItem = ({ children }) => (
  <div className="conciergeRemotePanelAdditionalInfoItemWrapper">
    <Block className="conciergeRemotePanelAdditionalInfoItem">
      {children}
    </Block>
  </div>
);

RemotePanelAdditionalInfoItem.propTypes = {
  children: node.isRequired,
};

export default RemotePanelAdditionalInfoItem;
