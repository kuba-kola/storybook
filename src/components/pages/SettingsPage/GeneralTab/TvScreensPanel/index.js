import React from "react";
import { arrayOf } from "prop-types";
import { settingsUserProptype } from "shared/prop-types";
import TvScreenSettingsActionCell from "components/common/ReactTableElements/cellRenderers/TvScreenSettingsActionCell";
import UsersPanel from "../UsersPanel";
import AddTvScreenModal from "./AddTvScreenModal";

const TvScreensPanel = ({ tvScreens }) => (
  <UsersPanel
    title="TV screen"
    users={tvScreens}
    addUserModal={AddTvScreenModal}
    userSettingsActionCell={TvScreenSettingsActionCell}
  />
);

TvScreensPanel.propTypes = {
  tvScreens: arrayOf(settingsUserProptype),
};

TvScreensPanel.defaultProps = {
  tvScreens: [],
};

export default TvScreensPanel;
