import React from "react";
import { arrayOf } from "prop-types";
import { settingsUserProptype } from "shared/prop-types";
import KioskSettingsActionCell from "components/common/ReactTableElements/cellRenderers/KioskSettingsActionCell";
import UsersPanel from "../UsersPanel";
import AddKioskModal from "./AddKioskModal";

const KiosksPanel = ({ kiosks }) => (
  <UsersPanel
    title="Kiosk"
    users={kiosks}
    addUserModal={AddKioskModal}
    userSettingsActionCell={KioskSettingsActionCell}
  />
);

KiosksPanel.propTypes = {
  kiosks: arrayOf(settingsUserProptype),
};

KiosksPanel.defaultProps = {
  kiosks: [],
};

export default KiosksPanel;
