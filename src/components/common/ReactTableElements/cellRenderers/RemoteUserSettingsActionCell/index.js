import React, { useState } from "react";
import { number, func } from "prop-types";
import { connect } from "react-redux";
import { deleteRemoteUser } from "store/actions/settings-actions";

import menuIcon from "assets/images/menu.svg";
import editIcon from "assets/images/edit.svg";
import deleteIcon from "assets/images/delete.svg";
import DeleteModal from "components/common/DeleteModal";
import EditRemoteUserModal from "./EditRemoteUserModal";

const RemoteUserSettingsActionCell = ({
  openedPopupId,
  openPopup,
  closePopup,
  value: id,
  onDelete,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const editUser = () => {
    setEditModalOpen(true);
    closePopup();
  };

  const deleteUser = () => {
    setDeleteModalOpen(true);
    closePopup();
  };

  return (
    <div className="conciergeTableActionsCell conciergeUserSettingsActionCell">
      <button
        type="button"
        className="conciergeTableActionsCellButton"
        onClick={() => openPopup(id)}
      >
        <img alt="actions" src={menuIcon} />
      </button>
      {openedPopupId === id && (
        <>
          <div className="conciergeTableActionsCellPopup">
            <button type="button" className="conciergeTableActionsCellAction" onClick={editUser}>
              <img alt="edit" src={editIcon} />
              Edit
            </button>
            <button
              type="button"
              className="conciergeTableActionsCellAction conciergeTableActionsCellDelete"
              onClick={deleteUser}
            >
              <img alt="delete" src={deleteIcon} />
              Delete
            </button>
          </div>
          <button
            type="button"
            className="conciergeTableActionsCellOutsideOverlay"
            onClick={closePopup}
          />
        </>
      )}
      {editModalOpen && (
        <EditRemoteUserModal id={id} onClose={() => setEditModalOpen(false)} />
      )}
      {deleteModalOpen && (
        <DeleteModal
          text={`
            Deleting driver means that all the accesses will be taken away.
            Please note that this process cannot be undone.
          `}
          onSubmit={() => onDelete()}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

RemoteUserSettingsActionCell.propTypes = {
  value: number.isRequired,
  openedPopupId: number.isRequired,
  openPopup: func.isRequired,
  closePopup: func.isRequired,
};

const actions = {
  onDelete: deleteRemoteUser,
};

export default connect(null, actions)(RemoteUserSettingsActionCell);
