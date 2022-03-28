import getMondayDate from "./getMondayDate";

const getNextMonday = (date) => {
  const nextMonday = getMondayDate(
    new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000)
  ); // Monday of next week

  return nextMonday;
};

export default getNextMonday;
