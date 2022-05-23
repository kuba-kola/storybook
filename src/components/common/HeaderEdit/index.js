import React from "react";
import { bool, func } from "prop-types";
import Button from "components/common/Button";

import editIcon from "assets/images/edit-light.svg";
import saveIcon from "assets/images/checkmark-blue.svg";

import "./styles.scss";

const HeaderEdit = ({
  isEditing,
  handleCancel,
  handleSave,
  handleEdit,
  isSaveDisabled,
}) => (
  <>
    <div className="conciergePanelHeaderButtonsWrapper">
      {
        isEditing ? (
          <>
            <Button
              onClick={handleCancel}
              className="conciergeSettingsPageActionButton conciergeSettingsPageActionButton-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="conciergeSettingsPageActionButton conciergeSettingsPageActionButton-save"
              disabled={isSaveDisabled}
            >
              <img src={saveIcon} alt="concierge edit light" className="conciergeSettingsPageIcon conciergeSettingsPageIcon-save" />
              Save
            </Button>
          </>
        )
          : (
            <Button
              onClick={handleEdit}
              className="conciergeSettingsPageActionButton conciergeSettingsPageActionButton-edit"
            >
              <img src={editIcon} alt="concierge edit light" className="conciergeSettingsPageIcon conciergeSettingsPageIcon-edit" />
              Edit
            </Button>
          )
      }
    </div>
  </>
);

HeaderEdit.propTypes = {
  isEditing: bool,
  handleCancel: func,
  handleEdit: func,
  handleSave: func,
};

HeaderEdit.defaultProps = {
  isEditing: false,
  handleCancel: null,
  handleEdit: null,
  handleSave: null,
};

export default HeaderEdit;
