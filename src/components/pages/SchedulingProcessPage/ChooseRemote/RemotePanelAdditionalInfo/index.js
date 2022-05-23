import React, { useCallback } from "react";
import { connect } from "react-redux";
import { isEmpty } from "ramda";
import { remotePanelAdditionalInfoType } from "components/common/Remote/propTypes";

import {
  bookingDetailsDriversLoadingPickUpStateSelector,
  bookingDetailsDriversLoadingDropOffStateSelector,
  bookingDetailsDriversPickUpDataSelector,
  bookingDetailsDriversDropOffDataSelector,
  bookingDetailsVideosLoadingStateSelector,
  bookingDetailsVideosPickUpSelector,
  bookingDetailsVideosDropOffSelector,
} from "store/selectors/booking-details-selectors";
import { schedulingChosenTimeSlotSelector } from "store/selectors/scheduling-process-selectors";
import { retrieveAvailableDrivers } from "store/actions/booking-details-actions";
import { setCurrentStep, setRemoteJobData } from "store/actions/scheduling-process-actions";

import Block from "components/common/Block";

import Button from "components/common/Button";
import DateLocationItem from "./RemotePanelAdditionalInfoItem/DateLocationItem";
import DriversItem from "./RemotePanelAdditionalInfoItem/DriversItem";
import RemotePanelAdditionalInfoItem from "./RemotePanelAdditionalInfoItem";

import "./styles.scss";

const RemotePanelAdditionalInfo = ({
  additionalInfo,
  additionalInfo: { pickUp },
  setAdditionalInfo,
  isLoadingPickUpDrivers,
  availablePickUpDrivers,
  fetchAvailableDrivers,
  storeRemoteJobData,
  setSchedulingStep,
}) => {
  const onChangeHandle = useCallback(
    (updates) => {
      setAdditionalInfo({ ...additionalInfo, ...updates });
    },
    [additionalInfo],
  );

  const fetchAvailableDriversHandle = useCallback(
    (location, collectionTime, jobType) => {
      if (!isLoadingPickUpDrivers) {
        fetchAvailableDrivers({ location, collectionTime, jobType });
      }
    },
    [fetchAvailableDrivers, isLoadingPickUpDrivers],
  );

  const storeRemoteJobDataHandle = useCallback(
    (
      address,
      addressData,
      collectionTime,
      jobType,
      mainDriverId,
      coDriverId,
      notes,
    ) => {
      storeRemoteJobData({
        address,
        addressData,
        collectionTime,
        jobType,
        mainDriverId,
        coDriverId,
        notes,
      });
    },
    [fetchAvailableDrivers],
  );

  return (
    <Block className="conciergeBookingDetailsPanel conciergeRemotePanel">
      <RemotePanelAdditionalInfoItem>
        <DateLocationItem
          isPickUp
          additionalInfo={additionalInfo}
          onChange={onChangeHandle}
        />
        <DriversItem
          isPickUp
          isLoadingPickUpDrivers={isLoadingPickUpDrivers}
          availablePickUpDrivers={availablePickUpDrivers}
          additionalInfo={additionalInfo}
          onChange={onChangeHandle}
          fetchAvailableDriversHandle={fetchAvailableDriversHandle}
        />
      </RemotePanelAdditionalInfoItem>
      <Button
        className="conciergeButtonApply AdditionalInfo"
        onClick={() => {
          if (
            pickUp.address
            && !isEmpty(pickUp.addressData)
            && pickUp.date
            && pickUp.time
            && pickUp.driver
          ) {
            storeRemoteJobDataHandle(
              pickUp.address,
              pickUp.addressData,
              { date: pickUp.date, time: pickUp.time },
              "pickup",
              pickUp.driver.id,
              pickUp.coDriver.id,
              pickUp.notes,
            );
            setSchedulingStep("");
          }
        }}
        disabled={
          !pickUp.address || !pickUp.date || !pickUp.time || !pickUp.driver || isEmpty(pickUp.addressData)
        }
      >
        Apply
      </Button>
    </Block>
  );
};

RemotePanelAdditionalInfo.propTypes = {
  ...remotePanelAdditionalInfoType,
};

RemotePanelAdditionalInfo.defaultProps = {
  jobs: [],
  appointmentId: null,
  pickUpJobFind: {},
  isLoadingPickUpDrivers: false,
  availablePickUpDrivers: [],
  isLoadingDropOffDrivers: false,
  availableDropOffDrivers: [],
  isLoadingVideos: false,
  availablePickUpVideos: [],
  availableDropOffVideos: [],
};

const mapStateToProps = (state) => ({
  isLoadingPickUpDrivers: bookingDetailsDriversLoadingPickUpStateSelector(
    state,
  ),
  availablePickUpDrivers: bookingDetailsDriversPickUpDataSelector(state),
  isLoadingDropOffDrivers: bookingDetailsDriversLoadingDropOffStateSelector(
    state,
  ),
  availableDropOffDrivers: bookingDetailsDriversDropOffDataSelector(state),
  isLoadingVideos: bookingDetailsVideosLoadingStateSelector(state),
  availablePickUpVideos: bookingDetailsVideosPickUpSelector(state),
  availableDropOffVideos: bookingDetailsVideosDropOffSelector(state),
  chosenTimeSlot: schedulingChosenTimeSlotSelector(state),
});

const actions = {
  fetchAvailableDrivers: retrieveAvailableDrivers,
  storeRemoteJobData: setRemoteJobData,
  setSchedulingStep: setCurrentStep,
};

export default connect(mapStateToProps, actions)(RemotePanelAdditionalInfo);
