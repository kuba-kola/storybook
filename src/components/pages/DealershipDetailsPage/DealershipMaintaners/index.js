import React, { useState } from "react";
import { arrayOf } from "prop-types";
import ReactTable from "react-table-6";

import { settingsUserProptype } from "shared/prop-types";
import Panel from "components/common/Panel";
import Button from "components/common/Button";
import DealershipMaintainersActionCell from "components/common/ReactTableElements/cellRenderers/DealershipMaintainersActionCell";
import AddMaintainerModal from "./AddMaintainerModal";

const DealershipMaintainersPanel = ({
  maintainers,
}) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [openedPopupId, setOpenedPopupId] = useState(null);

  const updatePopupId = (popupId) => {
    setOpenedPopupId(openedPopupId === popupId ? null : popupId);
  };

  const isDeleteActionDisabled = maintainers.length === 1;

  const columns = [
    {
      Header: "EMAIL",
      accessor: "email",
    },
    {
      Header: "",
      accessor: "id",
      Cell: (props) => {
        const updatedProps = {
          ...props,
          openPopup: updatePopupId,
          closePopup: () => setOpenedPopupId(null),
          openedPopupId,
          deleteDisabled: isDeleteActionDisabled,
        };
        return <DealershipMaintainersActionCell {...updatedProps} />;
      },
    },
  ];

  return (
    <Panel
      header={<p className="conciergeBookingDetailsPanelHeader">Dealership Maintainers</p>}
      className="conciergeSettingsPageUsersPanel"
    >
      <ReactTable
        columns={columns}
        data={maintainers}
        showPagination={false}
        minRows={1}
      />

      <div className="conciergeSettingsPageUsersPanelButtonSection">
        <Button
          className="conciergeSettingsPageUsersPanelButton-add"
          onClick={() => setCreateModalOpen(true)}
        >
          + Add new maintainer
        </Button>
      </div>
      {createModalOpen && (
        <AddMaintainerModal onClose={() => setCreateModalOpen(false)} />
      )}
    </Panel>
  );
};

DealershipMaintainersPanel.propTypes = {
  maintainers: arrayOf(settingsUserProptype),
};

DealershipMaintainersPanel.defaultProps = {
  maintainers: [],
};

export default DealershipMaintainersPanel;
