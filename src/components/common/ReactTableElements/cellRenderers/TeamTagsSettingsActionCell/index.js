import React, { useState } from "react";
import { number, func } from "prop-types";
import { connect } from "react-redux";

import { deleteTeamTag } from "store/actions/settings-actions";

import editIcon from "assets/images/edit.svg";
import deleteIcon from "assets/images/delete.svg";
import DeleteModal from "components/common/DeleteModal";
import EditTeamTagModal from "./EditTeamTagModal";

import "./styles.scss";

const TeamTagsSettingsActionCell = ({
  value: id,
  onDelete,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <div className="conciergeTableActionsCell conciergeTeamTagsSettingsActionCell">
      <button
        type="button"
        className="conciergeTableActionsCellAction"
        onClick={() => setEditModalOpen(true)}
      >
        <img alt="edit" src={editIcon} />
      </button>
      <button
        type="button"
        className="conciergeTableActionsCellAction conciergeTableActionsCellDelete"
        onClick={() => setDeleteModalOpen(true)}
      >
        <img alt="delete" src={deleteIcon} />
      </button>
      {editModalOpen && (
        <EditTeamTagModal id={id} onClose={() => setEditModalOpen(false)} />
      )}
      {deleteModalOpen && (
        <DeleteModal
          text={`
            Deleting Team Tag means that all relations will be taken away.
            Please note that this process cannot be undone.
          `}
          onSubmit={() => {
            onDelete(id);
            setDeleteModalOpen(false);
          }}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}

    </div>
  );
};

TeamTagsSettingsActionCell.propTypes = {
  value: number.isRequired,
  onDelete: func.isRequired,
};

const actions = {
  onDelete: deleteTeamTag,
};

export default connect(null, actions)(TeamTagsSettingsActionCell);
