import React, { useState } from "react";
import { arrayOf, node, string } from "prop-types";
import ReactTable from "react-table-6";

import { settingsUserProptype } from "shared/prop-types";
import Panel from "components/common/Panel";
import Button from "components/common/Button";

const UsersPanel = ({
  title,
  users,
  addUserModal,
  userSettingsActionCell,
}) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [openedPopupId, setOpenedPopupId] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);
  const AddUserModal = addUserModal;
  const UserSettingsActionCell = userSettingsActionCell;

  const columns = [
    {
      Header: "EMAIL",
      accessor: "email",
    },
    {
      Header: "PASSWORD",
      accessor: passwordShown ? "decrypted_password" : "encrypted_password",
    },
    {
      Header: "",
      accessor: "id",
      Cell: (props) => {
        const updatedProps = {
          ...props,
          openPopup: (popupId) => setOpenedPopupId(openedPopupId === popupId ? null : popupId),
          closePopup: () => setOpenedPopupId(null),
          openedPopupId,
        };
        return <UserSettingsActionCell {...updatedProps} />;
      },
    },
  ];

  return (
    <Panel
      header={(
        <p className="conciergeBookingDetailsPanelHeader">
          {title}
          {" "}
          Users
        </p>
)}
      className="conciergeSettingsPageUsersPanel"
    >
      <ReactTable
        columns={columns}
        getTdProps={(state, rowInfo, { Header }) => ({
          onClick: () => {
            if (Header === "PASSWORD") {
              setPasswordShown(!passwordShown);
            }
          },
          style: {
            cursor: Header === "PASSWORD" ? "pointer" : "inherit",
          },
        })}
        data={users}
        showPagination={false}
        minRows={1}
      />

      <div className="conciergeSettingsPageUsersPanelButtonSection">
        <Button
          className="conciergeSettingsPageUsersPanelButton-add"
          onClick={() => setCreateModalOpen(true)}
        >
          + Add new
          {" "}
          {title.toLowerCase()}
          {" "}
          user
        </Button>
      </div>
      {createModalOpen && (
        <AddUserModal onClose={() => setCreateModalOpen(false)} />
      )}
    </Panel>
  );
};

UsersPanel.propTypes = {
  title: string,
  users: arrayOf(settingsUserProptype),
  addUserModal: node.isRequired,
};

UsersPanel.defaultProps = {
  title: "",
  users: [],
};

export default UsersPanel;
