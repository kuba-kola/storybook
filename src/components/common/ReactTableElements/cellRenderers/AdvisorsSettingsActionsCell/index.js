import React, { useState } from "react";
import { connect } from "react-redux";
import {
  number, bool, func, string,
} from "prop-types";

import menuIcon from "assets/images/menu.svg";
import editIcon from "assets/images/edit.svg";
import deactivateIcon from "assets/images/deactivate.svg";
import { updateAdvisor } from "store/actions/settings-actions";
import { workingHoursPropType, photoPropType } from "shared/prop-types";
import EditAdvisorModal from "./EditAdvisorModal";

const AdvisorsSettingsActionsCell = ({
  id,
  isActive,
  name,
  availability,
  photo,
  employeeNumber,
  workingHours,
  advisorTeamTags,
  updateServiceAdvisor,
  closePopup,
  openedPopupId,
  openPopup,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleActive = () => {
    updateServiceAdvisor(id, { active: !isActive });
    closePopup();
  };

  const editAdvisor = () => {
    setModalOpen(true);
    closePopup();
  };

  const updateAdvisorData = (newPhoto, shouldDeletePhoto, updatedHours, availability) => {
    const dataToSend = new FormData();
    if (newPhoto) {
      dataToSend.append("photo", newPhoto);
    } else if (shouldDeletePhoto) {
      dataToSend.append("remove_photo", true);
    }
    dataToSend.append("working_hours", JSON.stringify(updatedHours));
    dataToSend.append("availability", availability);
    updateServiceAdvisor(id, dataToSend);
  };

  return (
    <div className="conciergeTableActionsCell">
      <button type="button" className="conciergeTableActionsCellButton" onClick={() => openPopup(id)}>
        <img alt="actions" src={menuIcon} />
      </button>
      {openedPopupId === id && (
        <>
          <div className="conciergeTableActionsCellPopup">
            <button type="button" className="conciergeTableActionsCellAction" onClick={() => editAdvisor()}>
              <img alt="edit" src={editIcon} />
              Edit advisor
            </button>
            <button
              type="button"
              className="conciergeTableActionsCellAction"
              onClick={toggleActive}
            >
              <img alt="deactivate" src={deactivateIcon} />
              {isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
          <button
            type="button"
            className="conciergeTableActionsCellOutsideOverlay"
            onClick={closePopup}
          />
        </>
      )}
      {modalOpen && (
        <EditAdvisorModal
          key={id}
          name={name}
          availability={availability}
          photo={photo}
          employeeNumber={employeeNumber}
          workingHours={workingHours}
          advisorTeamTags={advisorTeamTags}
          onUpdateAdvisorTeamTags={(ids) => {
            if (!ids.length) {
              return;
            }
            updateServiceAdvisor(id, { team_tag_ids: ids, active: isActive });
          }}
          onSubmit={updateAdvisorData}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

AdvisorsSettingsActionsCell.propTypes = {
  id: number.isRequired,
  isActive: bool.isRequired,
  name: string.isRequired,
  availability: string,
  photo: photoPropType.isRequired,
  workingHours: workingHoursPropType.isRequired,
  updateServiceAdvisor: func.isRequired,
  openPopup: func.isRequired,
  closePopup: func.isRequired,
  openedPopupId: number,
};

AdvisorsSettingsActionsCell.defaultProps = {
  openedPopupId: null,
};

const actions = {
  updateServiceAdvisor: updateAdvisor,
};

export default connect(null, actions)(AdvisorsSettingsActionsCell);
