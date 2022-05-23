import React, { useState, useCallback } from "react";
import {
  arrayOf, number, shape, string,
} from "prop-types";
import ReactTable from "react-table-6";
import Panel from "components/common/Panel";
import Button from "components/common/Button";
import FrontendPagination from "components/common/ReactTableElements/FrontendPagination";
import UserSettingsActionCell from "components/common/ReactTableElements/cellRenderers/EmployeeSettingsActionCell";
import searchIcon from "assets/images/search.svg";
import AddUserModal from "./AddEmployeeModal";
import "./styles.scss";

const EmployeesPanel = ({
  employments,
}) => {
  const [page, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openPopupId, setOpenPopupId] = useState(false);

  const handleSearch = (e) => {
    setCurrentPage(0);
    setSearch(e.target.value);
  };

  const filteredUsers = useCallback(() => {
    if (!search) return employments;
    return employments
      .filter((employment) => employment.name && employment.name.toLowerCase().includes(search.toLowerCase()));
  }, [employments, search]);

  const columns = [
    {
      Header: "NAME",
      accessor: "name",
    },
    {
      Header: "EMPLOYEE NO.",
      accessor: "employee_number",
    },
    {
      Header: "EMAIL",
      accessor: "email",
      minWidth: 160,
    },
    {
      Header: "ROLE",
      accessor: "role",
    },
    {
      Header: "LOCKED",
      accessor: "locked_at",
      Cell: (props) => <span>{Boolean(props.value).toString()}</span>,
    },
    {
      Header: "",
      accessor: "id",
      Cell: (props) => {
        const updatedProps = {
          ...props,
          isLocked: props.original.locked_at,
          email: props.original.email,
          openPopup: (popupId) => setOpenPopupId(openPopupId !== popupId ? popupId : null),
          closePopup: () => setOpenPopupId(false),
          openedPopupId: openPopupId,
        };
        return <UserSettingsActionCell {...updatedProps} />;
      },
    },
  ];

  return (
    <Panel
      header={(
        <div className="conciergeBookingDetailsPanelHeader conciergeSettingsPagePanelHeader">
          <p>Users</p>

          <div className="conciergeSettingsPagePanelHeaderControls">
            <form className="conciergeMenuTemplatesSearch">
              <input
                className="conciergeMenuTemplatesSearchInput"
                placeholder="Search for users..."
                value={search}
                onChange={handleSearch}
              />
              <img alt="search" className="conciergeMenuTemplatesSearchIcon" src={searchIcon} />
            </form>
            <div className="conciergeSettingsPagePanelHeaderSeparator">&nbsp;</div>
            <Button
              className="conciergeSettingsPageUsersPanelButton-add"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Add new user
            </Button>
          </div>
        </div>
      )}
      className="conciergeSettingsPageUsersPanel"
    >
      <ReactTable
        columns={columns}
        data={filteredUsers()}
        defaultPageSize={5}
        PaginationComponent={FrontendPagination}
        page={page}
        onPageChange={setCurrentPage}
        minRows={1}
      />
      {isCreateModalOpen && (
        <AddUserModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </Panel>
  );
};

EmployeesPanel.propTypes = {
  employments: arrayOf(shape({
    id: number,
    name: string,
  })).isRequired,
};

export default EmployeesPanel;
