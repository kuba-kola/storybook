import React, { useState, useEffect } from "react";
import {
  shape, arrayOf, string, oneOfType, number,
} from "prop-types";

import PanelToggle from "components/common/PanelToggle";
import { convertDateFromISO } from "components/pages/BookingDetailsPage/RemotePanel/utils";
import RemotePanelAdditionalInfo from "./RemotePanelAdditionalInfo";

import { driverActivityLabel } from "./RemotePanelDriverActivity/RemotePanelDriverActivityItem/utils";

import "./styles.scss";

const RemotePanel = ({
  booking: {
    jobs,
    id,
    job_status,
    customerPickupAddress,
    customerPickupAddressData,
  },
}) => {
  const [additionalInfo, setAdditionalInfo] = useState({
    pickUp: {
      date: "",
      time: "",
      address: customerPickupAddress || "",
      addressData: customerPickupAddressData,
      driver: {},
      coDriver: {},
      notes: "",
    },
    dropOff: {
      date: "",
      time: "",
      address: customerPickupAddress || "",
      addressData: customerPickupAddressData,
      driver: {},
      coDriver: {},
      notes: "",
    },
    isSameLocation: false,
  });
  const [chosenOption, setChosenOption] = useState("");

  const title = (
    <>
      <p className="conciergeBookingDetailsPanelHeader">
        Remote
      </p>
      <span className="conciergeBookingDetailsPanelSelectedOption">
        {chosenOption}
      </span>
    </>
  );

  useEffect(() => (
    job_status ? setChosenOption(driverActivityLabel(job_status)) : setChosenOption("")
  ), [job_status]);

  const [pickUpJobFind, setPickUpJobFind] = useState(null);
  const [dropOffJobFind, setDropOffJobFind] = useState(null);

  useEffect(() => {
    if (jobs) {
      const pickUpJob = jobs.find((job) => job.job_type === "pickup");
      const dropOffJob = jobs.find((job) => job.job_type === "dropoff");

      if (pickUpJob && dropOffJob) {
        const pickUpCollectionTime = convertDateFromISO(pickUpJob.collection_time);
        const dropOffCollectionTime = convertDateFromISO(dropOffJob.collection_time);
        setAdditionalInfo({
          pickUp: {
            collectionTime: pickUpJob.collection_time,
            date: pickUpCollectionTime.date,
            time: pickUpCollectionTime.time,
            address: pickUpJob.address,
            addressData: pickUpJob.addressData,
            driver: pickUpJob.main_driver,
            coDriver: pickUpJob.co_driver,
            notes: pickUpJob.notes,
          },
          dropOff: {
            collectionTime: dropOffJob.collection_time,
            date: dropOffCollectionTime.date,
            time: dropOffCollectionTime.time,
            address: dropOffJob.address,
            addressData: dropOffJob.addressData,
            driver: dropOffJob.main_driver,
            coDriver: dropOffJob.co_driver,
            notes: dropOffJob.notes,
          },
          isSameLocation: false,
        });
        setPickUpJobFind(pickUpJob);
        setDropOffJobFind(dropOffJob);
      } else if (pickUpJob) {
        const pickUpCollectionTime = convertDateFromISO(pickUpJob.collection_time);
        setAdditionalInfo({
          ...additionalInfo,
          pickUp: {
            collectionTime: pickUpJob.collection_time,
            date: pickUpCollectionTime.date,
            time: pickUpCollectionTime.time,
            address: pickUpJob.address,
            addressData: pickUpJob.addressData,
            driver: pickUpJob.main_driver,
            coDriver: pickUpJob.co_driver,
            notes: pickUpJob.notes,
          },
        });
        setPickUpJobFind(pickUpJob);
      } else if (dropOffJob) {
        const dropOffCollectionTime = convertDateFromISO(dropOffJob.collection_time);
        setAdditionalInfo({
          ...additionalInfo,
          dropOff: {
            collectionTime: dropOffJob.collection_time,
            date: dropOffCollectionTime.date,
            time: dropOffCollectionTime.time,
            address: dropOffJob.address,
            addressData: dropOffJob.addressData,
            driver: dropOffJob.main_driver,
            coDriver: dropOffJob.co_driver,
            notes: dropOffJob.notes,
          },
        });
        setDropOffJobFind(dropOffJob);
      }
    }
  }, [jobs]);

  return (
    <PanelToggle
      className="conciergeBookingRemotePanel"
      header={title}
    >
      <RemotePanelAdditionalInfo
        jobs={jobs}
        appointmentId={id}
        additionalInfo={additionalInfo}
        setAdditionalInfo={setAdditionalInfo}
        pickUpJobFind={pickUpJobFind}
        dropOffJobFind={dropOffJobFind}
      />
    </PanelToggle>
  );
};

RemotePanel.propTypes = {
  booking: shape({
    jobs: arrayOf(shape({
      aasm_state: string,
      activity: shape({
        driver_assigned_at: string,
        en_route_to_customer: string,
        arrived_to_customer: string,
        en_route_to_dealership: string,
        arrived_to_dealership: string,
      }),
      co_driver: shape({
        dealership_id: oneOfType([string, number]),
        id: oneOfType([string, number]),
        name: string,
      }),
      collection_time: string,
      id: oneOfType([string, number]),
      job_type: string,
      address: string,
      main_driver: shape({
        dealership_id: oneOfType([string, number]),
        id: oneOfType([string, number]),
        name: string,
      }),
      notes: "",
    })),
    id: oneOfType([string, number]),
    vehicle: shape({
      vin: string,
    }),
  }),
};

RemotePanel.defaultProps = {
  booking: {
    jobs: [],
    id: null,
    vehicle: {},
    job_status: null,
    customerPickupAddress: "",
    customerPickupAddressData: {},
  },
};

export default RemotePanel;
