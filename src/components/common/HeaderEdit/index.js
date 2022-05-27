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
              variant="dark-outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={handleSave}
              disabled={isSaveDisabled}
              style={{ marginLeft: "16px" }}
            >
              <p>Save</p>
            </Button>
          </>
        )
          : (
            <Button
              variant="dark"
              icon="editWhite"
              onClick={handleEdit}
            >
              <p>Edit</p>
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
