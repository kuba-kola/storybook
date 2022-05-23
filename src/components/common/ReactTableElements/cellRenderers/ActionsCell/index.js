import React, { Component, useState } from "react";
import { connect } from "react-redux";
import {
  number, bool, string, shape, func,
} from "prop-types";

import menuIcon from "assets/images/menu.svg";
import editIcon from "assets/images/edit.svg";
import deactivateIcon from "assets/images/deactivate.svg";
import deleteIcon from "assets/images/delete.svg";
import { toggleTemplate, deleteTemplate } from "store/actions/menu-templates-actions";

import DeleteModal from "components/common/DeleteModal";
import EditNameModal from "./EditNameModal";
import "./styles.scss";

const ActionsCell = ({
  openedPopupId,
  openPopup,
  closePopup,
  value: { id, name, isActive },
  onToggleTemplate,
  onDeleteTemplate,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const onEditName = () => {
    setEditModalOpen(true);
    closePopup();
  };

  const onDelete = () => {
    setDeleteModalOpen(true);
    closePopup();
  };

  const onToggleActive = () => {
    onToggleTemplate(id, !isActive);
    closePopup();
  };

  return (
    <div className="conciergeTableActionsCell">
      <button type="button" className="conciergeTableActionsCellButton" onClick={() => openPopup(id)}>
        <img alt="actions" src={menuIcon} />
      </button>
      {openedPopupId === id && (
        <>
          <div className="conciergeTableActionsCellPopup">
            <button type="button" className="conciergeTableActionsCellAction" onClick={onEditName}>
              <img alt="edit" src={editIcon} />
              Edit name
            </button>
            <button
              type="button"
              className="conciergeTableActionsCellAction"
              onClick={onToggleActive}
            >
              <img alt="deactivate" src={deactivateIcon} />
              {isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              type="button"
              className="conciergeTableActionsCellAction conciergeTableActionsCellDelete"
              onClick={onDelete}
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
        <EditNameModal
          id={id}
          name={name}
          onClose={() => setEditModalOpen(false)}
        />
      )}
      {deleteModalOpen && (
        <DeleteModal
          text={`
            Deleting template means that is will be no longer used in conversation.
            Please note that this process cannot be undone.`}
          onSubmit={() => onDeleteTemplate(id)}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

ActionsCell.propTypes = {
  value: shape({
    id: number.isRequired,
    isActive: bool.isRequired,
    name: string.isRequired,
  }).isRequired,
  openPopup: func.isRequired,
  closePopup: func.isRequired,
  onDeleteTemplate: func.isRequired,
  onToggleTemplate: func.isRequired,
  openedPopupId: number.isRequired,
};

const actions = {
  onToggleTemplate: toggleTemplate,
  onDeleteTemplate: deleteTemplate,
};

const ActionsCellContainer = connect(null, actions)(ActionsCell);

export default ActionsCellContainer;
