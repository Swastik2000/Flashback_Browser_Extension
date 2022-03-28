const getMondayDate = (today) => {
  const dateToday = new Date(today);
  const dayNumber = dateToday.getDay();
  const mondayDate =
    dateToday.getDate() - dayNumber + (dayNumber == 0 ? -6 : 1); // if Sunday, get previous Monday
  const date = new Date(dateToday.setDate(mondayDate));
  date.setHours(0, 0, 0, 0);
  return date;
};

export default getMondayDate;
