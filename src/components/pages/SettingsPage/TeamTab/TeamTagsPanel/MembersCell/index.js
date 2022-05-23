import React from "react";
import {
  arrayOf, func, number, shape, string,
} from "prop-types";
import { connect } from "react-redux";
import { updateTeamTag } from "store/actions/settings-actions";
import { settingsEmploymentsSelector } from "store/selectors/settings-selectors";
import MultiTagSelect from "components/common/MultiTagSelect";
import "./styles.scss";

const MembersCell = ({
  tagId,
  value,
  onTeamTagUpdate,
  employments,
}) => (
  <div className="conciergeTableMembersCell">
    <MultiTagSelect
      value={value}
      options={employments}
      onChange={(selected) => {
        onTeamTagUpdate(tagId, { member_ids: selected.map(({ id }) => id) });
      }}
    />
  </div>
);

MembersCell.propTypes = {
  onTeamTagUpdate: func.isRequired,
  tagId: number.isRequired,
  value: arrayOf(shape({
    name: string,
    id: number,
  })).isRequired,
  employments: arrayOf(shape({
    name: string,
    id: number,
  })).isRequired,
};

const mapStateToProps = (state) => ({
  employments: settingsEmploymentsSelector(state),
});

const actions = {
  onTeamTagUpdate: updateTeamTag,
};

export default connect(mapStateToProps, actions)(MembersCell);
