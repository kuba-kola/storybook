import React, { useState, useRef, useEffect } from "react";
import { useDeepCompareEffect } from "shared/hooks";
import { connect } from "react-redux";
import cx from "classnames";
import Carousel from "nuka-carousel";
import {
  settingsTeamTagsSelector,
} from "store/selectors/settings-selectors";
import {
  bookingsPeriodFiltersSelector,
  bookingsTeamTagsCapacitySelector,
  bookingsIsCapacityDashboardLoading,
  bookingsAllAdvisorsCapacitySelector,
  bookingsDealershipAppointmentsCapacitySelector,
  bookingsDealershipHoursCapacitySelector,
} from "store/selectors/bookings-selectors";
import {
  retrieveDealershipTeamsCapacity,
  setAdditionalInfoFilterMultipleItems,
} from "store/actions/bookings-actions";
import { makeHashFromArray } from "shared/utils";
import ArrowButton from "components/common/CarouselNavigation/ArrowButton";
import CapacityDashboardItem from "./CapacityDashboardItem";

const CapacityDashboard = ({
  teamTags,
  periodFilters,
  teamTagsCapacity,
  dealershipHoursCapacity,
  dealershipAppointmentsCapacity,
  allAdvisorsCapacity,
  fetchDealershipTeamsCapacity,
  changeAdditionalInfoFilterMultipleItems,
  isCapacityDashboardLoading,
}) => {
  const [teamTagsHash, setTeamTagsHash] = useState(makeHashFromArray(teamTags));
  const [teamTagsCapacityHash, setTeamTagsCapacity] = useState(makeHashFromArray(teamTagsCapacity, "team_tag_id"));
  const [teamsCarouselIndex, setTeamsCarouselIndex] = useState(0);
  const [membersCarouselIndex, setMembersCarouselIndex] = useState(0);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [isAllCapacityActive, setIsAllCapacityActive] = useState(false);
  const previousPeriodFilters = useRef(null);
  const [allCapacityLabel, setAllCapacityLabel] = useState(null);
  const [allCapacityProgress, setAllCapacityProgress] = useState(null);

  const prepareHoursCapacityProgressData = ({
    allocated_time,
    max_actual_labor_time,
    max_overcapacity_time,
    ...rest
  }) => ({
    capacityHoursLabel: `${allocated_time || 0}/${max_actual_labor_time || 0}h`,
    capacityHoursProgress: (allocated_time * 100) / (max_actual_labor_time || allocated_time || 1),
    ...rest,
  });

  useDeepCompareEffect(() => {
    let fetchAllowed = false;

    if (previousPeriodFilters.current === null) {
      fetchAllowed = true;
    } else {
      Object.keys(periodFilters).forEach((key) => {
        if (!fetchAllowed) {
          fetchAllowed = new Date(previousPeriodFilters.current[key]).getTime() !== new Date(periodFilters[key]).getTime();
        }
      });
    }

    if (fetchAllowed) {
      fetchDealershipTeamsCapacity();
    }

    previousPeriodFilters.current = periodFilters;
  }, [periodFilters]);

  useDeepCompareEffect(() => {
    if (teamTags && teamTags.length > 0) {
      setTeamTagsHash(makeHashFromArray(teamTags));
    }
  }, [teamTags]);

  useDeepCompareEffect(() => {
    if (teamTagsCapacity && teamTagsCapacity.length > 0) {
      setTeamTagsCapacity(makeHashFromArray(teamTagsCapacity, "team_tag_id"));
    }
  }, [teamTagsCapacity]);

  useEffect(() => {
    const hoursCapacity = prepareHoursCapacityProgressData(dealershipHoursCapacity);
    setAllCapacityLabel(hoursCapacity.capacityHoursLabel);
    setAllCapacityProgress(hoursCapacity.capacityHoursProgress);
  }, [dealershipHoursCapacity]);

  const handleAllCapacityClick = () => {
    changeAdditionalInfoFilterMultipleItems({
      itemsKeys: allAdvisorsCapacity.map(
        ({ service_advisor_id }) => service_advisor_id,
      ).filter((i) => i),
      itemsValue: false,
      dropdownKey: "service_advisor",
    });
    setIsAllCapacityActive(true);
    setSelectedTeamId(null);
  };

  const prepareAppointmentsCapacityProgressData = ({
    allocated_appointments,
    max_advisor_appointments_per_day,
    ...rest
  }) => ({
    capacityAppointmentsLabel: `${allocated_appointments || 0}/${max_advisor_appointments_per_day || 0}`,
    capacityAppointmentsProgress: (allocated_appointments * 100) / (max_advisor_appointments_per_day || 1),
    ...rest,
  });

  const {
    dealership_appointments_amount: allCapacityAppointmentsLabel,
    max_dealership_appointments_per_day: allCapacityAppointmentsProgress,
  } = dealershipAppointmentsCapacity;

  const canSlideLeft = (carouselIndex) => carouselIndex > 0;
  const canSlideRight = (carouselIndex, slidesToShow, collectionLength) => (carouselIndex + slidesToShow) < collectionLength;
  const isTeamsNavigationActive = Object.values(teamTagsHash).length > 4;
  const isMembersNavigationActive = (selectedTeamId && teamTagsHash[selectedTeamId].members.length > 4)
    || (isAllCapacityActive && allAdvisorsCapacity.length > 4);

  return (
    <div className="conciergeBookingPageCapacityDashboard capacityDashboard">
      {isCapacityDashboardLoading && (
        <div className="capacityDashboardLoadingOverlay">Loading ...</div>
      )}
      <div className="capacityDashboardRow">
        <button
          type="button"
          className={cx("capacityDashboardRowItem capacityDashboardRowItemPinned", {
            capacityDashboardRowItemPale: isAllCapacityActive,
          })}
          onClick={handleAllCapacityClick}
        >
          <div className="capacityDashboardRowItemTop">
            <div className="capacityDashboardRowItemTitle">All hours</div>
            <div className="capacityDashboardRowItemCounter">{allCapacityLabel}</div>
          </div>
          <div className="capacityDashboardProgressBar">
            <div
              className="capacityDashboardProgressBarValue"
              style={{ width: `${allCapacityProgress}%` }}
            />
          </div>
        </button>
        <div className="capacityDashboardCarouselOuter">
          {isTeamsNavigationActive && (
            <ArrowButton
              isLeft
              onClick={() => setTeamsCarouselIndex(teamsCarouselIndex - 1)}
              disabled={!canSlideLeft(teamsCarouselIndex)}
            />
          )}
          <div className={`capacityDashboardCarouselWrapper${isTeamsNavigationActive ? "" : "NoButtons"}`}>
            <Carousel
              slidesToShow={4}
              swiping={false}
              dragging={false}
              slideIndex={teamsCarouselIndex}
              withoutControls
              className="capacityDashboardCarousel"
            >
              {!isCapacityDashboardLoading && Object.values(teamTagsHash)
                .map((item) => prepareHoursCapacityProgressData({
                  ...item,
                  ...teamTagsCapacityHash[item.id],
                }))
                .map(({
                  id, name, capacityHoursLabel, capacityHoursProgress,
                }) => (
                  <CapacityDashboardItem
                    key={id}
                    isSelected={id === selectedTeamId}
                    isDropdown
                    name={name}
                    capacityLabel={capacityHoursLabel}
                    capacityProgress={capacityHoursProgress}
                    onToggleClick={() => {
                      setSelectedTeamId(id === selectedTeamId ? null : id);
                      changeAdditionalInfoFilterMultipleItems({
                        itemsKeys: teamTagsHash[id].members.map(
                          ({ service_advisor_id }) => service_advisor_id,
                        ).filter((i) => i),
                        itemsValue: id !== selectedTeamId,
                        dropdownKey: "service_advisor",
                      });
                      setIsAllCapacityActive(false);
                    }}
                  />
                ))}
            </Carousel>
          </div>
          {isTeamsNavigationActive && (
            <ArrowButton
              isRight
              onClick={() => setTeamsCarouselIndex(teamsCarouselIndex + 1)}
              disabled={!canSlideRight(
                teamsCarouselIndex, 4, Object.values(teamTagsCapacityHash).length,
              )}
            />
          )}
        </div>
      </div>
      <div className="capacityDashboardRow capacityDashboardRowPale">
        <button
          type="button"
          className={cx("capacityDashboardRowItem capacityDashboardRowItemPinned", {
            capacityDashboardRowItemPale: isAllCapacityActive,
          })}
          onClick={handleAllCapacityClick}
        >
          <div className="capacityDashboardRowItemTop">
            <div className="capacityDashboardRowItemTitle">All appointments</div>
            <div className="capacityDashboardRowItemCounter">{allCapacityAppointmentsLabel}</div>
          </div>
          <div className="capacityDashboardProgressBar">
            <div
              className="capacityDashboardProgressBarValue"
              style={{ width: `${allCapacityAppointmentsProgress}%` }}
            />
          </div>
        </button>
        <div className="capacityDashboardCarouselOuter">
          {isMembersNavigationActive && (
          <ArrowButton
            isLeft
            onClick={() => setMembersCarouselIndex(membersCarouselIndex - 1)}
            disabled={!canSlideLeft(membersCarouselIndex)}
          />
          )}
          <div className={`capacityDashboardCarouselWrapper${isMembersNavigationActive ? "" : "NoButtons"}`}>
            <Carousel
              slidesToShow={4}
              swiping={false}
              dragging={false}
              slideIndex={membersCarouselIndex}
              withoutControls
              className="capacityDashboardCarousel capacityDashboardCarouselAdvisors"
            >
              {(selectedTeamId ? teamTagsHash[selectedTeamId].members : allAdvisorsCapacity)
                .map(({
                  id, name, service_advisor_name, service_advisor_id, photo,
                }) => {
                  const advisorCapacity = allAdvisorsCapacity
                    .find(
                      ({ service_advisor_id: advisor_id }) => advisor_id === service_advisor_id,
                    );

                  const {
                    capacityAppointmentsLabel,
                    capacityAppointmentsProgress,
                  } = prepareAppointmentsCapacityProgressData(advisorCapacity || {});

                  return (
                    <CapacityDashboardItem
                      key={service_advisor_id || id}
                      name={service_advisor_name || name}
                      avatarSrc={photo?.url}
                      capacityLabel={capacityAppointmentsLabel}
                      capacityProgress={capacityAppointmentsProgress}
                    />
                  );
                })}
            </Carousel>
          </div>
          {isMembersNavigationActive && (
          <ArrowButton
            isRight
            onClick={() => setMembersCarouselIndex(membersCarouselIndex + 1)}
            disabled={!canSlideRight(
              membersCarouselIndex,
              4,
              (selectedTeamId && teamTagsHash[selectedTeamId].members.length)
              || allAdvisorsCapacity.length,
            )}
          />
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  periodFilters: bookingsPeriodFiltersSelector(state),
  teamTags: settingsTeamTagsSelector(state),
  teamTagsCapacity: bookingsTeamTagsCapacitySelector(state),
  dealershipHoursCapacity: bookingsDealershipHoursCapacitySelector(state),
  dealershipAppointmentsCapacity: bookingsDealershipAppointmentsCapacitySelector(state),
  isCapacityDashboardLoading: bookingsIsCapacityDashboardLoading(state),
  allAdvisorsCapacity: bookingsAllAdvisorsCapacitySelector(state),
});

const actions = {
  changeAdditionalInfoFilterMultipleItems: setAdditionalInfoFilterMultipleItems,
  fetchDealershipTeamsCapacity: retrieveDealershipTeamsCapacity,
};

export default connect(mapStateToProps, actions)(CapacityDashboard);
