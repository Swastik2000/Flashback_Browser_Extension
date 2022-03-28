const getSignedDayDiff = (date1, date2) => {
  const diffTimeSec = date1 - date2;
  return Math.ceil(diffTimeSec / (1000 * 60 * 60 * 24));
};

export default getSignedDayDiff;
