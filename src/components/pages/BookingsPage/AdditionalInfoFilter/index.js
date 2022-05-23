import React, { useCallback } from "react";
import ReactTooltip from "react-tooltip";
import {
  shape, bool, func, objectOf,
} from "prop-types";
import { connect } from "react-redux";

import { setAdditionalInfoFilter, setAdditionalInfoFilterAllDropdownItems } from "store/actions/bookings-actions";
import { bookingsAdditionalInfoFiltersSelector } from "store/selectors/bookings-selectors";
import { activeAdvisorsSelector } from "store/selectors/settings-selectors";

import ServiceAdvisorIcon from "assets/images/bookings/service_advisor.svg";
import AdditionalInfoFilterItem from "./AdditionalInfoFilterItem";
import AdditionalInfoFilterDropdown from "./AdditionalInfoFilterDropdown";

import { filtersConfig, toFilterOption } from "./utils";

import "./styles.scss";

const AdditionalInfoFilter = ({
  activeAdvisors,
  additionalInfoFilters,
  changeAdditionalInfoFilter,
  toggleAllAdditionalInfoFilterDropdownItems,
}) => {
  const handleOnClick = useCallback(({ itemKey, dropdownKey }) => {
    changeAdditionalInfoFilter({ itemKey, dropdownKey });
  }, []);

  const toggleAllItems = useCallback(({ dropdownKey, itemsValue }) => {
    toggleAllAdditionalInfoFilterDropdownItems({ dropdownKey, itemsValue });
  }, []);

  const filterLabels = {
    service_advisor: "Advisors",
    jobStatus: "Status",
    bookingStatus: "Checkin",
    transportationStatus: "Transport",
    client_waiting: "Client waiting",
    with_concern: "Has concern",
    appraisal_requested: "Appraisal",
    with_recall: "Has recall",
  };

  const advisorOptions = activeAdvisors.map(
    (item) => toFilterOption(item, item.photo?.url || <ServiceAdvisorIcon key={item.id} />),
  );

  return (
    <div
      className="conciergeBookingsAdditionalInfoWrapper"
    >
      <ul className="conciergeBookingsAdditionalInfoFilter">
        {filtersConfig.map(({
          key, options, icon,
        }) => (
          (
            options || key === "service_advisor" ? (
              <div
                key={key}
                data-for="additional-info-filter-tooltip"
                data-tip={key}
              >
                <AdditionalInfoFilterDropdown
                  dropdownKey={key}
                  label={key}
                  dropdownConfig={
                      key === "service_advisor"
                        ? advisorOptions
                        : options
                    }
                  filters={additionalInfoFilters[key]}
                  dropdownIcon={icon && icon.type}
                  handleOnClick={handleOnClick}
                  toggleAllItems={toggleAllItems}
                />
              </div>
            )
              : (
                <div
                  key={key}
                  data-for="additional-info-filter-tooltip"
                  data-tip={key}
                >
                  <AdditionalInfoFilterItem
                    assets={icon.type}
                    label={key}
                    isActive={additionalInfoFilters[key]}
                    handleOnClick={() => handleOnClick({ itemKey: key })}
                  />
                </div>
              )
          )
        ))}
      </ul>
      <ReactTooltip
        id="additional-info-filter-tooltip"
        className="AdditionalInfoFilterDropdownLabel"
        place="bottom"
        backgroundColor="#F9FAFC"
        textColor="black"
        border
        borderColor="#dedee0"
        globalEventOff="click"
        getContent={(filterKey) => (<>{filterLabels[filterKey]}</>)}
      />
    </div>
  );
};

AdditionalInfoFilter.propTypes = {
  additionalInfoFilters: shape({
    jobStatus: objectOf(bool),
    bookingStatus: objectOf(bool),
    with_concern: bool,
    client_waiting: bool,
    appraisal_requested: bool,
    with_recall: bool,
  }),
  changeAdditionalInfoFilter: func,
  toggleAllAdditionalInfoFilterDropdownItems: func,
};

AdditionalInfoFilter.defaultProps = {
  additionalInfoFilters: null,
  changeAdditionalInfoFilter: null,
  toggleAllAdditionalInfoFilterDropdownItems: null,
};

const mapStateToProps = (state) => ({
  additionalInfoFilters: bookingsAdditionalInfoFiltersSelector(state),
  activeAdvisors: activeAdvisorsSelector(state),
});

const actions = {
  changeAdditionalInfoFilter: setAdditionalInfoFilter,
  toggleAllAdditionalInfoFilterDropdownItems: setAdditionalInfoFilterAllDropdownItems,
};

export default connect(mapStateToProps, actions)(AdditionalInfoFilter);
