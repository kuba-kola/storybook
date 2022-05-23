import React, { useState, useEffect } from "react";
import {
  arrayOf, bool, func, number, shape, string,
} from "prop-types";
import { connect } from "react-redux";
import { settingsTeamTagsLoadingStateSelector, settingsTeamTagsSelector } from "store/selectors/settings-selectors";
import { updateTeamTagsSeniority, retrieveTeamTags } from "store/actions/settings-actions";
import TableRowDraggable from "components/common/ReactTableElements/TableRowDraggable";
import Panel from "components/common/Panel";
import Button from "components/common/Button";
import TeamTagsSettingsActionCell from "components/common/ReactTableElements/cellRenderers/TeamTagsSettingsActionCell";
import ExpectedUpsellCell from "./ExpectedUpsellCell";
import MembersCell from "./MembersCell";
import AddTeamTagModal from "./AddTeamTagModal";

import "./styles.scss";

const TeamTagsPanel = ({
  teamTags,
  isTeamTagsLoading,
  onUpdateSeniority,
  fetchTeamTags,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchTeamTags();
  }, []);

  const columns = [
    {
      Header: "SENIORITY",
      accessor: "seniority",
      style: {
        width: "50px",
        flex: "50 0 auto",
      },
    },
    {
      Header: "NAME",
      accessor: "name",
      style: {
        width: "50px",
        flex: "50 0 auto",
      },
    },
    {
      Header: "EXPECTED UPSELL 1/10h",
      accessor: "expected_upsell",
      style: {
        width: "100px",
        flex: "100 0 auto",
      },
      Cell: (props) => <ExpectedUpsellCell tagId={props.row.original.id} value={props.value} />,
    },
    {
      Header: "MEMBERS",
      accessor: "members",
      style: {
        width: "200px",
        flex: "200 0 auto",
      },
      Cell: (props) => <MembersCell tagId={props.row.original.id} value={props.value} />,
    },
    {
      Header: "",
      accessor: "id",
      style: {
        width: "50px",
        flex: "50 0 auto",
      },
      Cell: (props) => <TeamTagsSettingsActionCell value={props.value} />,
    },
  ];

  return (
    <Panel
      header={(
        <div className="conciergeBookingDetailsPanelHeader conciergeSettingsPagePanelHeader">
          <p>Team Tags</p>
          <Button
            className="conciergeSettingsPageUsersPanelButton-add"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Add new team tag
          </Button>
        </div>
      )}
      className="conciergeSettingsPageTeamTagsPanel"
    >
      <TableRowDraggable
        columns={columns}
        data={teamTags}
        loading={isTeamTagsLoading}
        onRowDrop={(records) => {
          onUpdateSeniority({
            team_tags_seniorities: records.map(({ id }, index) => ({ id, seniority: index + 1 })),
          });
        }}
      />
      {isCreateModalOpen && (
        <AddTeamTagModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </Panel>
  );
};

TeamTagsPanel.propTypes = {
  isTeamTagsLoading: bool.isRequired,
  teamTags: arrayOf(shape({
    id: number,
    name: string,
    expected_upsell: number,
    members: arrayOf(shape({
      id: number,
      name: string,
    })),
  })).isRequired,
  onUpdateSeniority: func.isRequired,
  fetchTeamTags: func.isRequired,
};

const mapStateToProps = (state) => ({
  isTeamTagsLoading: settingsTeamTagsLoadingStateSelector(state),
  teamTags: settingsTeamTagsSelector(state),
});

const actions = {
  onUpdateSeniority: updateTeamTagsSeniority,
  fetchTeamTags: retrieveTeamTags,
};

export default connect(mapStateToProps, actions)(TeamTagsPanel);
