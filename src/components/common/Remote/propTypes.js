import {
  array, shape, bool, object, string, oneOfType, number, func, arrayOf, instanceOf,
} from "prop-types";
import { daySlotPropType } from "shared/prop-types";

export const remoteAdditionalInfoJobPropType = shape({
  coDriver: oneOfType([object, string]),
  date: oneOfType([string, instanceOf(Date)]),
  driver: oneOfType([object, string]),
  location: string,
  notes: string,
  time: string,
  collectionTime: oneOfType([string, instanceOf(Date)]),
});

export const remotePanelAdditionalInfoType = {
  jobs: array,
  additionalInfo: shape({
    dropOff: remoteAdditionalInfoJobPropType,
    pickUp: remoteAdditionalInfoJobPropType,
    isSameLocation: bool,
  }).isRequired,
  appointmentId: oneOfType([string, number]),
  setAdditionalInfo: func.isRequired,
  pickUpJobFind: shape({
    aasm_state: string,
    activity: shape({
      driver_assigned_at: string,
      en_route_to_customer_at: string,
      arrived_to_customer_at: string,
      en_route_to_dealership_at: string,
      arrived_to_dealership_at: string,
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
  }),
  dropOffJobFind: shape({
    aasm_state: string,
    activity: shape({
      driver_assigned_at: string,
      en_route_to_customer_at: string,
      arrived_to_customer_at: string,
      en_route_to_dealership_at: string,
      arrived_to_dealership_at: string,
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
  }),
  isLoadingPickUpDrivers: bool,
  availablePickUpDrivers: arrayOf(shape({
    id: oneOfType([string, number]),
    name: string,
  })),
  isLoadingDropOffDrivers: bool,
  availableDropOffDrivers: arrayOf(shape({
    id: oneOfType([string, number]),
    name: string,
  })),
  fetchAvailableDrivers: func.isRequired,
  postNewDriverJob: func.isRequired,
  isLoadingVideos: bool,
  availablePickUpVideos: arrayOf(shape({
    date: string,
    videoURL: string,
  })),
  availableDropOffVideos: arrayOf(shape({
    date: string,
    videoURL: string,
  })),
  availableDays: arrayOf(daySlotPropType),
};
