import React, { useState } from "react";
import { number, func } from "prop-types";
import { connect } from "react-redux";
import { deleteKiosk } from "store/actions/settings-actions";
import menuIcon from "assets/images/menu.svg";
import editIcon from "assets/images/edit.svg";
import deleteIcon from "assets/images/delete.svg";
import Modal from "components/common/Modal";
import EditKioskModal from "./EditKioskModal";
import "./styles.scss";

const KioskSetingsActionCell = ({
  openedPopupId,
  openPopup,
  closePopup,
  value: id,
  onDeleteKiosk,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
            <button
              type="button"
              className="conciergeTableActionsCellAction"
              onClick={() => {
                setEditModalOpen(true);
                closePopup();
              }}
            >
              <img alt="edit" src={editIcon} />
              Edit
            </button>
            <button
              type="button"
              className="conciergeTableActionsCellAction conciergeTableActionsCellDelete"
              onClick={() => {
                setDeleteModalOpen(true);
                closePopup();
              }}
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
        <EditKioskModal id={id} onClose={() => setEditModalOpen(false)} />
      )}
      {deleteModalOpen && (
        <Modal
          title="Wait. Are you sure?"
          text={`
                  Deleting kiosk means that all the accesses will be taken away.
                  Please note that this process cannot be undone.
                `}
          cancelButtonText="No"
          submitButtonText="Yes"
          submitButtonVariant="destructive"
          cancelButtonVariant="dark"
          size="small"
          onSubmit={() => onDeleteKiosk()}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

KioskSetingsActionCell.propTypes = {
  value: number.isRequired,
  openedPopupId: number.isRequired,
  closePopup: func.isRequired,
  openPopup: func.isRequired,
};

const actions = {
  onDeleteKiosk: deleteKiosk,
};

export default connect(null, actions)(KioskSetingsActionCell);
