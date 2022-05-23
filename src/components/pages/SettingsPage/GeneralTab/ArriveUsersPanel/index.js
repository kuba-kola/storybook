import React from "react";
import { arrayOf } from "prop-types";
import { settingsUserProptype } from "shared/prop-types";
import ArriveUserSettingsActionCell from "components/common/ReactTableElements/cellRenderers/ArriveUserSettingsActionCell";
import UsersPanel from "../UsersPanel";
import AddArriveUserModal from "./AddArriveUserModal";

const ArriveUsersPanel = ({ users }) => (
  <UsersPanel
    title="Arrive"
    users={users}
    addUserModal={AddArriveUserModal}
    userSettingsActionCell={ArriveUserSettingsActionCell}
  />
);

ArriveUsersPanel.propTypes = {
  users: arrayOf(settingsUserProptype),
};

ArriveUsersPanel.defaultProps = {
  users: [],
};

export default ArriveUsersPanel;
