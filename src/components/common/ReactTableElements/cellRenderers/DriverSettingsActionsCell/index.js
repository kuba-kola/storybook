import React, { useState } from "react";
import { connect } from "react-redux";
import {
  number, bool, func, string,
} from "prop-types";
import { removeDriver, updateDriver } from "store/actions/settings-actions";
import { workingHoursPropType, photoPropType } from "shared/prop-types";
import menuIcon from "assets/images/menu.svg";
import editIcon from "assets/images/edit.svg";
import deleteIcon from "assets/images/delete.svg";
import deactivateIcon from "assets/images/deactivate.svg";
import Modal from "components/common/Modal";
import EditDriverModal from "./EditDriverModal";

const DriversSettingsActionsCell = ({
  id,
  isActive,
  name,
  photo,
  phoneNumber,
  workingHours,
  updateDriverSettings,
  removeDriverUser,
  closePopup,
  openedPopupId,
  openPopup,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const toggleActive = () => {
    updateDriverSettings(id, { active: !isActive });
    closePopup();
  };

  const editDriver = () => {
    setEditModalOpen(true);
    closePopup();
  };

  const deleteDriver = () => {
    setDeleteModalOpen(true);
    closePopup();
  };

  const updateDriverData = (driverData) => {
    updateDriverSettings(id, driverData);
  };

  return (
    <div className="conciergeTableActionsCell">
      <button type="button" className="conciergeTableActionsCellButton" onClick={() => openPopup(id)}>
        <img alt="actions" src={menuIcon} />
      </button>
      {openedPopupId === id && (
        <>
          <div className="conciergeTableActionsCellPopup">
            <button type="button" className="conciergeTableActionsCellAction" onClick={() => editDriver()}>
              <img alt="edit" src={editIcon} />
              Edit driver
            </button>
            <button
              type="button"
              className="conciergeTableActionsCellAction"
              onClick={toggleActive}
            >
              <img alt="deactivate" src={deactivateIcon} />
              {isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              type="button"
              className="conciergeTableActionsCellAction conciergeTableActionsCellDelete"
              onClick={deleteDriver}
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
        <EditDriverModal
          key={id}
          name={name}
          photo={photo}
          phoneNumber={phoneNumber}
          workingHours={workingHours}
          onSubmit={updateDriverData}
          onClose={() => setEditModalOpen(false)}
        />
      )}
      {deleteModalOpen && (
        <Modal
          title="Wait. Are you sure?"
          text={`
                  Deleting driver means that all the accesses will be taken away.
                  Please note that this process cannot be undone.
                `}
          cancelButtonText="No"
          submitButtonText="Yes"
          submitButtonVariant="destructive"
          cancelButtonVariant="dark"
          size="small"
          onSubmit={() => removeDriverUser()}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

DriversSettingsActionsCell.propTypes = {
  id: number.isRequired,
  isActive: bool.isRequired,
  name: string.isRequired,
  photo: photoPropType.isRequired,
  phoneNumber: string.isRequired,
  workingHours: workingHoursPropType.isRequired,
  updateDriverSettings: func.isRequired,
  openPopup: func.isRequired,
  closePopup: func.isRequired,
  openedPopupId: number,
};

DriversSettingsActionsCell.defaultProps = {
  openedPopupId: null,
};

const actions = {
  updateDriverSettings: updateDriver,
  removeDriverUser: removeDriver,
};

export default connect(null, actions)(DriversSettingsActionsCell);
