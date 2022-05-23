import React, { useState } from "react";
import { connect } from "react-redux";
import ReactTable from "react-table-6";
import { number, arrayOf, func } from "prop-types";

import { settingsDriversSelector } from "store/selectors/settings-selectors";
import { driverPropType } from "shared/prop-types";
import { addDriver } from "store/actions/settings-actions";
import FrontendPagination from "components/common/ReactTableElements/FrontendPagination";
import Panel from "components/common/Panel";
import Button from "components/common/Button";
import DriversWorkingHoursCell from "components/common/ReactTableElements/cellRenderers/AdvisorsWorkingHoursCell";
import DriversSettingsActionsCell from "components/common/ReactTableElements/cellRenderers/DriverSettingsActionsCell";
import AddDriverModal from "./AddDriverModal";

import "./styles.scss";

const DriversPanel = ({
  addNewDriver,
  perPage,
  currentPage,
  drivers,
}) => {
  const [page, setCurrentPage] = useState(currentPage);
  const [openedPopupId, setPopupId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const clearPopupId = () => setPopupId(null);

  const updatePopupId = (popupId) => {
    if (openedPopupId !== popupId) {
      setPopupId(popupId);
    } else {
      clearPopupId();
    }
  };

  /* eslint-disable react/prop-types */
  const columns = [
    {
      Header: "Photo",
      accessor: "photo.url",
      Cell: (props) => (
        props.value ? (
          <div key={props.original.id}>
            <img
              className="driverPhoto"
              src={(process.env.NODE_ENV === "development"
                ? `${process.env.REACT_APP_ROOT_URL}${props.value}`
                : props.value)}
              alt=""
            />
          </div>
        ) : null
      ),
      sortable: false,
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Phone Number",
      accessor: "phone_number",
    },
    {
      Header: "Capacity",
      accessor: "working_hours",
      minWidth: 140,
      Cell: (props) => {
        const updatedProps = {
          ...props,
          driverId: props.original.id,
          isActive: props.original.active,
        };
        return <DriversWorkingHoursCell key={props.original.id} {...updatedProps} />;
      },
      sortable: false,
    },
    {
      Header: "",
      accessor: "id",
      Cell: (props) => {
        const updatedProps = {
          ...props,
          id: props.value,
          isActive: props.original.active,
          name: props.original.name,
          photo: props.original.photo,
          phoneNumber: props.original.phone_number,
          workingHours: props.original.working_hours,
          openPopup: updatePopupId,
          closePopup: clearPopupId,
          openedPopupId,
        };
        return <DriversSettingsActionsCell {...updatedProps} />;
      },
      sortable: false,
    },
  ];
  /* eslint-enable react/prop-types */

  return (
    <Panel
      header={<p className="conciergeBookingDetailsPanelHeader">Drivers</p>}
      className="conciergeSettingsPageCapacityTabDriversPanel"
    >
      <ReactTable
        data={drivers}
        columns={columns}
        defaultPageSize={perPage}
        PaginationComponent={FrontendPagination}
        onPageChange={setCurrentPage}
        page={page}
        minRows={1}
      />
      <div className="conciergeSettingsPageUsersPanelButtonSection">
        <Button
          className="conciergeSettingsPageUsersPanelButton-add"
          onClick={() => setCreateModalOpen(true)}
        >
          + Add new driver
        </Button>
      </div>
      {createModalOpen && (
        <AddDriverModal onSubmit={addNewDriver} onClose={() => setCreateModalOpen(false)} />
      )}
    </Panel>
  );
};

DriversPanel.propTypes = {
  perPage: number.isRequired,
  currentPage: number.isRequired,
  drivers: arrayOf(driverPropType),
  addNewDriver: func.isRequired,
};

DriversPanel.defaultProps = {
  drivers: [],
};

const mapStateToProps = (state) => ({
  drivers: settingsDriversSelector(state),
});

const actions = {
  addNewDriver: addDriver,
};

export default connect(mapStateToProps, actions)(DriversPanel);
