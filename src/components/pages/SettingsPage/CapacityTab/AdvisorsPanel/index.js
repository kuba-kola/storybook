import React, { useState } from "react";
import { connect } from "react-redux";
import ReactTable from "react-table-6";
import { number, arrayOf } from "prop-types";
import Switch from "react-switch";

import { serviceAdvisorsSelector } from "store/selectors/settings-selectors";
import { serviceAdvisorPropType } from "shared/prop-types";
import FrontendPagination from "components/common/ReactTableElements/FrontendPagination";
import Panel from "components/common/Panel";
import AdvisorsWorkingHoursCell from "components/common/ReactTableElements/cellRenderers/AdvisorsWorkingHoursCell";
import AdvisorsSettingsActionsCell from "components/common/ReactTableElements/cellRenderers/AdvisorsSettingsActionsCell";
import searchIcon from "assets/images/search.svg";

import "./styles.scss";

const AdvisorsPanel = ({
  perPage,
  currentPage,
  serviceAdvisors,
}) => {
  const [page, setCurrentPage] = useState(currentPage);
  const [openedPopupId, setPopupId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const clearPopupId = () => setPopupId(null);

  const updatePopupId = (popupId) => {
    if (openedPopupId !== popupId) {
      setPopupId(popupId);
    } else {
      clearPopupId();
    }
  };

  const filteredAdvisors = () => {
    if (!search && !activeOnly) return serviceAdvisors;
    return serviceAdvisors
      .filter((advisor) => {
        if (!search) return true;
        return advisor.name && advisor.name.toLowerCase().includes(search.toLowerCase());
      })
      .filter((advisor) => {
        if (!activeOnly) return true;
        return advisor.active
          && Object.values(advisor.working_hours).find((day) => day.from !== undefined);
      });
  };

  const handleSwitch = () => {
    setCurrentPage(0);
    setActiveOnly(!activeOnly);
  };

  const handleSearch = (e) => {
    setCurrentPage(0);
    setSearch(e.target.value);
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
              className="advisorPhoto"
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
      Header: "Employee",
      accessor: "employee_number",
    },
    {
      Header: "Capacity",
      accessor: "working_hours",
      minWidth: 140,
      Cell: (props) => {
        const updatedProps = {
          ...props,
          advisorId: props.original.id,
          isActive: props.original.active,
        };
        return <AdvisorsWorkingHoursCell key={props.original.id} {...updatedProps} />;
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
          availability: props.original.availability,
          photo: props.original.photo,
          employeeNumber: props.original.employee_number,
          workingHours: props.original.working_hours,
          advisorTeamTags: props.original.team_tags,
          openPopup: updatePopupId,
          closePopup: clearPopupId,
          openedPopupId,
        };
        return <AdvisorsSettingsActionsCell {...updatedProps} />;
      },
      sortable: false,
    },
  ];
  /* eslint-enable react/prop-types */

  return (
    <>
      {serviceAdvisors.length > 0 && (
        <Panel
          header={(
            <div className="conciergeBookingDetailsPanelHeader">
              <p>Advisors</p>
              <div className="conciergeSettingsPageCapacityTabAdvisorsSwitch">
                <label className="conciergeInputLabel" htmlFor="active-advisors-switch">Active only</label>
                <Switch
                  id="active-advisors-switch"
                  className="activeAdvisorsOnlySwitch"
                  onChange={handleSwitch}
                  checked={activeOnly}
                  onColor="#36af5e"
                  offColor="#dedee0"
                  activeBoxShadow="0 0 2px 3px #0bcaf9"
                  aria-labelledby="active-advisors-label"
                />
              </div>
              <form className="conciergeMenuTemplatesSearch">

                <input
                  className="conciergeMenuTemplatesSearchInput"
                  placeholder="Search for advisor"
                  value={search}
                  onChange={handleSearch}
                />
                <img alt="search" className="conciergeMenuTemplatesSearchIcon" src={searchIcon} />
              </form>
            </div>
          )}
          className="conciergeSettingsPageCapacityTabAdvisorsPanel"
        >
          <div className="conciergeSettingsPageCapacityTabAdvisorsPanelBody">
            <ReactTable
              data={filteredAdvisors()}
              columns={columns}
              defaultPageSize={perPage}
              PaginationComponent={FrontendPagination}
              onPageChange={setCurrentPage}
              page={page}
              minRows={1}
            />
          </div>
        </Panel>
      )}
    </>
  );
};

AdvisorsPanel.propTypes = {
  perPage: number.isRequired,
  currentPage: number.isRequired,
  serviceAdvisors: arrayOf(serviceAdvisorPropType),
};

AdvisorsPanel.defaultProps = {
  serviceAdvisors: [],
};

const mapStateToProps = (state) => ({
  serviceAdvisors: serviceAdvisorsSelector(state),

});

export default connect(mapStateToProps, null)(AdvisorsPanel);
