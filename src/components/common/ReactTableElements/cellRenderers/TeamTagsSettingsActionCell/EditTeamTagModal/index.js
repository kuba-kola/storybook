import React, { useEffect, useState } from "react";
import {
  func, number, string, arrayOf, shape,
} from "prop-types";
import { connect } from "react-redux";

import { updateTeamTag } from "store/actions/settings-actions";
import { settingsTeamTagsSelector } from "store/selectors/settings-selectors";
import Input from "components/common/Input";
import closeIcon from "assets/images/close.svg";

const EditTeamTagModal = ({
  team_tags,
  id,
  changeTeamTag,
  onClose,
}) => {
  const [data, setData] = useState({
    name: "",
    expected_upsell: 0,
  });

  useEffect(() => {
    const currentTeamTag = team_tags.find((tag) => tag.id === id);
    if (currentTeamTag) {
      setData(currentTeamTag);
    }
  }, []);

  const submit = () => {
    const { id, name, expected_upsell } = data;
    changeTeamTag(id, {
      id,
      name,
      expected_upsell,
    });
    onClose();
  };

  const handleInputChange = (fieldName, value) => setData((data) => ({
    ...data,
    [fieldName]: value,
  }));

  return (
    <>
      <div className="menuTemplatesAddTemplateModal conciergeSettingsAddUserModal">
        <div className="menuTemplatesAddTemplateModalHeader">
          Edit user
          <button
            type="button"
            className="menuTemplatesAddTemplateModalCloseButton"
            onClick={onClose}
          >
            <img alt="close" src={closeIcon} />
          </button>
        </div>
        <div className="menuTemplatesAddTemplateModalBody">
          <Input
            label="Name"
            value={data.name}
            onChange={(value) => handleInputChange("name", value)}
          />
          <Input
            label="Expected upsell 1/10h"
            type="number"
            step="0.1"
            min="0"
            max="20"
            value={data.expected_upsell}
            onChange={(value) => value >= 0 && value <= 20 && handleInputChange("expected_upsell", value)}
          />
        </div>
        <div className="menuTemplatesAddTemplateModalFooter conciergeSettingsAddUserModalFooter">
          <button
            type="button"
            className="menuTemplatesAddTemplateModalCancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="menuTemplatesAddTemplateModalSave"
            onClick={submit}
          >
            Save
          </button>
        </div>
      </div>
      <button type="button" className="menuTemplatesAddTemplateOverlay" />
    </>
  );
};

EditTeamTagModal.propTypes = {
  changeTeamTag: func,
  onClose: func.isRequired,
  id: number.isRequired,
  team_tags: arrayOf(shape({
    id: number.isRequired,
    dealership_id: number.isRequired,
    name: string,
    members: arrayOf(shape({
      id: number,
      name: string,
    })),
  })),
};

EditTeamTagModal.defaultProps = {
  changeTeamTag: null,
  team_tags: [],
};

const mapStateToProps = (state) => ({
  team_tags: settingsTeamTagsSelector(state),
});

const actions = {
  changeTeamTag: updateTeamTag,
};

export default connect(mapStateToProps, actions)(EditTeamTagModal);
