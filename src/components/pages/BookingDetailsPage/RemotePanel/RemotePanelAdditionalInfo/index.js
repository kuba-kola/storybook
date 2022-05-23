import React, { useCallback, useState, useEffect } from "react";
import { connect } from "react-redux";
import { isEmpty } from "ramda";
import { remotePanelAdditionalInfoType } from "components/common/Remote/propTypes";

import Block from "components/common/Block";
import RemotePanelDriverActivity from "components/pages/BookingDetailsPage/RemotePanel/RemotePanelDriverActivity";
import Button from "components/common/Button";
import {
  bookingDetailsDriversLoadingPickUpStateSelector,
  bookingDetailsDriversLoadingDropOffStateSelector,
  bookingDetailsDriversPickUpDataSelector,
  bookingDetailsDriversDropOffDataSelector,
  bookingDetailsAvailableJobSlotsSelector,
} from "store/selectors/booking-details-selectors";
import {
  retrieveAvailableDrivers,
  setNewDriverJob,
  updateDriverJobData,
  fetchAvailableJobSlots,
} from "store/actions/booking-details-actions";
import { isAllowedToUpdate } from "components/pages/BookingDetailsPage/RemotePanel/utils";
import UpdateButton from "components/pages/BookingDetailsPage/RemotePanel/UpdateButton";
import LocationInput from "components/common/Remote/LocationInput";
import RemotePanelAdditionalInfoItem from "./RemotePanelAdditionalInfoItem";
import DateItem from "./RemotePanelAdditionalInfoItem/DateItem";
import DriversItem from "./RemotePanelAdditionalInfoItem/DriversItem";

import "./styles.scss";

const RemotePanelAdditionalInfo = ({
  jobs,
  appointmentId,
  additionalInfo,
  additionalInfo: { isSameLocation, pickUp, dropOff },
  setAdditionalInfo,
  pickUpJobFind,
  dropOffJobFind,
  isLoadingPickUpDrivers,
  availablePickUpDrivers,
  isLoadingDropOffDrivers,
  availableDropOffDrivers,
  fetchAvailableDrivers,
  postNewDriverJob,
  updateDriverJob,
  fetchDays,
  availableDays,
}) => {
  const [bookableDays, setBookableDays] = useState([]);
  useEffect(() => {
    fetchDays();
  }, []);

  useEffect(() => {
    setBookableDays(availableDays);
  }, [availableDays]);

  const onChangeHandle = useCallback(
    (updates) => {
      setAdditionalInfo({ ...additionalInfo, ...updates });
    },
    [additionalInfo],
  );

  const fetchAvailableDriversHandle = useCallback(
    (location, collectionTime, jobType) => {
      if (!isLoadingPickUpDrivers && !isLoadingDropOffDrivers) {
        fetchAvailableDrivers({ location, collectionTime, jobType });
      }
    },
    [fetchAvailableDrivers, isLoadingPickUpDrivers, isLoadingDropOffDrivers],
  );

  const postNewDriverJobHandle = useCallback(
    (
      addressData,
      collectionTime,
      jobType,
      mainDriverId,
      coDriverId,
      notes,
    ) => {
      postNewDriverJob({
        appointmentId,
        addressData,
        collectionTime,
        jobType,
        mainDriverId,
        coDriverId,
        notes,
      });
    },
    [fetchAvailableDrivers, appointmentId],
  );

  const updateDriverJobHandle = useCallback(
    (
      addressData,
      collectionTime,
      mainDriverId,
      coDriverId,
      notes,
      jobId,
    ) => {
      updateDriverJob({
        appointmentId,
        addressData,
        collectionTime,
        mainDriverId,
        coDriverId,
        notes,
        jobId,
      });
    },
    [fetchAvailableDrivers, appointmentId],
  );

  const toggleIsSameLocation = useCallback(() => {
    if (!isSameLocation) {
      onChangeHandle({
        dropOff: {
          ...dropOff,
          address: pickUp.address,
        },
        isSameLocation: !isSameLocation,
      });
    } else {
      onChangeHandle({ isSameLocation: !isSameLocation });
    }
  }, [additionalInfo]);

  return (
    <Block title="Summary info" className="conciergeBookingDetailsPanel">
      <RemotePanelAdditionalInfoItem jobs={jobs} title="pick-up">
        {!!bookableDays.length && (
          <DateItem
            isPickUp
            bookableDays={bookableDays}
            additionalInfo={additionalInfo}
            onChange={onChangeHandle}
            pickUpJobFind={pickUpJobFind}
          />
        )}
        <LocationInput
          isPickUp
          additionalInfo={additionalInfo}
          onChange={onChangeHandle}
          toggleIsSameLocation={toggleIsSameLocation}
          disabled={
            pickUpJobFind && !isAllowedToUpdate(pickUpJobFind.aasm_state)
          }
        />
        <DriversItem
          isPickUp
          isLoadingPickUpDrivers={isLoadingPickUpDrivers}
          availablePickUpDrivers={availablePickUpDrivers}
          additionalInfo={additionalInfo}
          onChange={onChangeHandle}
          fetchAvailableDriversHandle={fetchAvailableDriversHandle}
          pickUpJobFind={pickUpJobFind}
        />
        {pickUpJobFind && (
          <>
            <div className="conciergeBookingRemotePanelBottom">
              <RemotePanelDriverActivity jobs={pickUpJobFind} />
            </div>
            <UpdateButton
              jobFind={pickUpJobFind}
              job={pickUp}
              updateDriverJobHandle={updateDriverJobHandle}
            />
          </>
        )}
      </RemotePanelAdditionalInfoItem>
      <RemotePanelAdditionalInfoItem jobs={jobs} title="drop-off">
        {!!bookableDays.length && (
          <DateItem
            isDropOff
            bookableDays={bookableDays}
            additionalInfo={additionalInfo}
            onChange={onChangeHandle}
            dropOffJobFind={dropOffJobFind}
          />
        )}
        <LocationInput
          isDropOff
          additionalInfo={additionalInfo}
          onChange={onChangeHandle}
          toggleIsSameLocation={toggleIsSameLocation}
          disabled={
            dropOffJobFind && !isAllowedToUpdate(dropOffJobFind.aasm_state)
          }
        />
        <DriversItem
          isDropOff
          additionalInfo={additionalInfo}
          onChange={onChangeHandle}
          isLoadingDropOffDrivers={isLoadingDropOffDrivers}
          availableDropOffDrivers={availableDropOffDrivers}
          fetchAvailableDriversHandle={fetchAvailableDriversHandle}
          dropOffJobFind={dropOffJobFind}
        />
        {dropOffJobFind && (
          <>
            <div className="conciergeBookingRemotePanelBottom">
              <RemotePanelDriverActivity jobs={dropOffJobFind} />
            </div>
            <UpdateButton
              jobFind={dropOffJobFind}
              job={dropOff}
              updateDriverJobHandle={updateDriverJobHandle}
            />
          </>
        )}
      </RemotePanelAdditionalInfoItem>
      {!(pickUpJobFind && dropOffJobFind) && (
        <Button
          className="conciergeButtonApply AdditionalInfo"
          onClick={() => {
            if (
              pickUp.address
              && !isEmpty(pickUp.addressData)
              && pickUp.date
              && pickUp.time
              && pickUp.driver
              && !pickUpJobFind
            ) {
              postNewDriverJobHandle(
                pickUp.addressData,
                { date: pickUp.date, time: pickUp.time },
                "pickup",
                pickUp.driver.id,
                pickUp.coDriver.id,
                pickUp.notes,
              );
            }
            if (
              dropOff.address
              && !isEmpty(dropOff.addressData)
              && dropOff.date
              && dropOff.time
              && dropOff.driver
              && !dropOffJobFind
            ) {
              postNewDriverJobHandle(
                dropOff.addressData,
                { date: dropOff.date, time: dropOff.time },
                "dropoff",
                dropOff.driver.id,
                dropOff.coDriver.id,
                dropOff.notes,
              );
            }
          }}
          disabled={
            (!pickUp.address
              || isEmpty(pickUp.addressData)
              || !pickUp.date
              || !pickUp.time
              || !pickUp.driver
              || pickUpJobFind)
            && (!dropOff.address
              || isEmpty(dropOff.addressData)
              || !dropOff.date
              || !dropOff.time
              || !dropOff.driver
              || dropOffJobFind)
          }
        >
          Apply
        </Button>
      )}
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
  dropOffJobFind: {},
  isLoadingPickUpDrivers: false,
  availablePickUpDrivers: [],
  isLoadingDropOffDrivers: false,
  availableDropOffDrivers: [],
  availableDays: [],
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
  availableDays: bookingDetailsAvailableJobSlotsSelector(state),
});

const actions = {
  fetchAvailableDrivers: retrieveAvailableDrivers,
  postNewDriverJob: setNewDriverJob,
  updateDriverJob: updateDriverJobData,
  fetchDays: fetchAvailableJobSlots,
};

export default connect(mapStateToProps, actions)(RemotePanelAdditionalInfo);
