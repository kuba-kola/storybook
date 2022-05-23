import { getAppointmentFormattedDate } from "shared/utils/datetime";

export const concatArrays = (activity, activeState) => {
  const list = [
    {
      key: "arrived_to_dealership",
    },
    {
      key: "en_route_to_dealership",
    },
    {
      key: "arrived_to_customer",
    },
    {
      key: "en_route_to_customer",
    },
    {
      key: "driver_assigned",
    },
  ];

  return list.map((item) => {
    if (activity[`${item.key}_at`] && activeState === item.key) {
      return {
        ...item,
        date: "Current state",
        isDone: false,
        isActive: true,
      };
    } if (activity[`${item.key}_at`]) {
      return {
        ...item,
        date: getAppointmentFormattedDate(activity[`${item.key}_at`]),
        isDone: true,
        isActive: false,
      };
    }
    return {
      ...item,
      date: "Not yet",
      isDone: false,
      isActive: false,
    };
  });
};
