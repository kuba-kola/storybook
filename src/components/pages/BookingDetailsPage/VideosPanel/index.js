import React, { useState, useEffect } from "react";
import {
  shape, arrayOf, string, oneOfType, number, func, array, bool,
} from "prop-types";
import { connect } from "react-redux";
import {
  retrieveVideos,
} from "store/actions/booking-details-actions";
import PanelToggle from "components/common/PanelToggle";
import {
  bookingDetailsVideosLoadingStateSelector,
  bookingDetailsVideosPickUpSelector,
  bookingDetailsVideosDropOffSelector,
  bookingDetailsVideosWalkaroundSelector,
} from "store/selectors/booking-details-selectors";

import RemotePanelVideos from "./RemotePanelVideos";

const VideosPanel = ({
  booking: {
    arrived_at,
    jobs,
    vehicle,
  },
  fetchVideos,
  isLoadingVideos,
  availablePickUpVideos,
  availableDropOffVideos,
  availableWalkaroundVideos,
}) => {
  useEffect(() => {
    if (vehicle && vehicle.vin) {
      const dates = jobs && jobs.reduce((acc, job) => {
        if (job.activity && job.activity.arrived_to_customer_at) {
          acc.push(job.activity.arrived_to_customer_at);
        }
        return acc;
      }, []);

      if (dates.length || arrived_at) {
        fetchVideos({ vin: vehicle.vin, dates: dates.length ? dates : [arrived_at] });
      }
    }
  }, [vehicle]);

  const title = (
    <>
      <p className="conciergeBookingDetailsPanelHeader">
        Videos
      </p>
      <span className="conciergeBookingDetailsPanelSelectedOption">
        {[...availablePickUpVideos, ...availableDropOffVideos, ...availableWalkaroundVideos].length}
      </span>
    </>
  );

  if (!availablePickUpVideos.length
      && !availableDropOffVideos.length
      && !availableWalkaroundVideos.length) return null;

  return (
    <PanelToggle
      className="conciergeBookingRemotePanel"
      header={title}
    >
      {isLoadingVideos && <div>Loading ...</div>}
      {availablePickUpVideos.length > 0 && (
        <RemotePanelVideos
          title="Pickup"
          videos={availablePickUpVideos}
        />
      )}
      {availableDropOffVideos.length > 0 && (
        <RemotePanelVideos
          title="Dropoff"
          videos={availableDropOffVideos}
        />
      )}
      {availableWalkaroundVideos.length > 0 && (
        <RemotePanelVideos
          title="Drive walkaround"
          videos={availableWalkaroundVideos}
        />
      )}
    </PanelToggle>
  );
};

const videoShape = shape({
  vin: string,
  videoURL: string,
  mileage: number,
  tagNumber: number,
  jobType: string,
  date: string,
});

VideosPanel.propTypes = {
  booking: shape({
    arrived_at: string,
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
      location: string,
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
  fetchVideos: func.isRequired,
  isLoadingVideos: bool,
  availablePickUpVideos: arrayOf(videoShape),
  availableDropOffVideos: arrayOf(videoShape),
  availableWalkaroundVideos: arrayOf(videoShape),
};

VideosPanel.defaultProps = {
  booking: {
    jobs: [],
    id: null,
    vehicle: {},
    job_status: null,
  },
  isLoadingVideos: false,
  availablePickUpVideos: [],
  availableDropOffVideos: [],
  availableWalkaroundVideos: [],
};

const mapStateToProps = (state) => ({
  isLoadingVideos: bookingDetailsVideosLoadingStateSelector(state),
  availablePickUpVideos: bookingDetailsVideosPickUpSelector(state),
  availableDropOffVideos: bookingDetailsVideosDropOffSelector(state),
  availableWalkaroundVideos: bookingDetailsVideosWalkaroundSelector(state),
});

const actions = {
  fetchVideos: retrieveVideos,
};

export default connect(mapStateToProps, actions)(VideosPanel);
