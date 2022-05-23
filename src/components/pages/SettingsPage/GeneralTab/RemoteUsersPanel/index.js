import React from "react";
import { arrayOf } from "prop-types";
import { settingsUserProptype } from "shared/prop-types";
import RemoteUserSettingsActionCell from "components/common/ReactTableElements/cellRenderers/RemoteUserSettingsActionCell";
import UsersPanel from "../UsersPanel";
import AddRemoteUserModal from "./AddRemoteUserModal";

const RemoteUsersPanel = ({ users }) => (
  <UsersPanel
    title="Remote"
    users={users}
    addUserModal={AddRemoteUserModal}
    userSettingsActionCell={RemoteUserSettingsActionCell}
  />
);

RemoteUsersPanel.propTypes = {
  users: arrayOf(settingsUserProptype),
};

RemoteUsersPanel.defaultProps = {
  users: [],
};

export default RemoteUsersPanel;
