import React, { useState } from "react";
import { number, func } from "prop-types";
import { connect } from "react-redux";
import { deleteTvScreen } from "store/actions/settings-actions";
import Modal from "components/common/Modal";
import menuIcon from "assets/images/menu.svg";
import editIcon from "assets/images/edit.svg";
import deleteIcon from "assets/images/delete.svg";
import EditTvScreenModal from "./EditTvScreenModal";
import "./styles.scss";

const TvScreenSettingsActionCell = ({
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
        <EditTvScreenModal id={id} onClose={() => this.setState({ editModalOpen: false })} />
      )}
      {deleteModalOpen && (
        <Modal
          title="Wait. Are you sure?"
          text={`
                  Deleting TV screen means that all the accesses will be taken away.
                  Please note that this process cannot be undone.
                `}
          cancelButtonText="No"
          submitButtonText="Yes"
          submitButtonVariant="destructive"
          cancelButtonVariant="dark"
          size="small"
          onSubmit={() => onDelete()}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

TvScreenSettingsActionCell.propTypes = {
  value: number.isRequired,
  openedPopupId: number.isRequired,
  closePopup: func.isRequired,
  openPopup: func.isRequired,
};

const actions = {
  onDelete: deleteTvScreen,
};

export default connect(null, actions)(TvScreenSettingsActionCell);
