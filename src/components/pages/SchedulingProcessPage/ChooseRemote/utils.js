export const convertDateToISO = (date, time) => {
  const newDate = new Date(date);

  const fullYear = newDate.getFullYear();
  const fullMonth = newDate.getMonth() + 1 > 9 ? newDate.getMonth() + 1 : `0${newDate.getMonth() + 1}`;
  const fullDate = newDate.getDate() > 9 ? newDate.getDate() : `0${newDate.getDate()}`;

  return `${fullYear}-${fullMonth}-${fullDate}T${time}:00Z`;
};

export const convertDateFromISO = (collectionTime) => {
  const splitDate = collectionTime.split("T");
  const date = `${splitDate[0].slice(0, 4)}-${splitDate[0].slice(4, 6)}-${splitDate[0].slice(6, 8)}`;
  const time = `${splitDate[1].slice(0, 2)}:${splitDate[1].slice(2, 4)}`;

  return ({ date, time });
};

const allowedToUpdateStateList = [
  "created",
  "confirmed",
  "driver_assigned",
];

export const isAllowedToUpdate = (jobState) => allowedToUpdateStateList.includes(jobState);
