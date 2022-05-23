export const formatTimeInfo = (chosenTimeSlot) => {
  const { day: { day_name, day_of_month }, quarterSlot } = chosenTimeSlot;
  return `${day_name}, ${day_of_month}, ${quarterSlot}`;
};
