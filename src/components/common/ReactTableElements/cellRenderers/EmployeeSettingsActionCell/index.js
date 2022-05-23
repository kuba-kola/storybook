import React, { useState } from "react";
import { number, func } from "prop-types";
import { connect } from "react-redux";

import { toggleEmployeeAccess } from "store/actions/settings-actions";

import menuIcon from "assets/images/menu.svg";
import editIcon from "assets/images/edit.svg";
import deactivateIcon from "assets/images/deactivate.svg";
import EditEmployeeModal from "./EditEmployeeModal";

import "./styles.scss";

const EmployeeSettingsActionCell = ({
  isLocked,
  email,
  openedPopupId,
  openPopup,
  closePopup,
  value: id,
  onToggleAccess,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);

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
                onToggleAccess(!isLocked, email, id);
                closePopup();
              }}
            >
              <img alt="deactivate" src={deactivateIcon} />
              {isLocked ? "Unlock" : "Lock"}
            </button>
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
          </div>
          <button
            type="button"
            className="conciergeTableActionsCellOutsideOverlay"
            onClick={closePopup}
          />
        </>
      )}
      {editModalOpen && (
        <EditEmployeeModal id={id} onClose={() => setEditModalOpen(false)} />
      )}
    </div>
  );
};

EmployeeSettingsActionCell.propTypes = {
  value: number.isRequired,
  openedPopupId: number.isRequired,
  openPopup: func.isRequired,
  closePopup: func.isRequired,
};

const actions = {
  onToggleAccess: toggleEmployeeAccess,
};

export default connect(null, actions)(EmployeeSettingsActionCell);
