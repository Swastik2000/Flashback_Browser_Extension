const getDayDiff = (date1, date2) => {
  const diffTimeSec = Math.abs(date1 - date2);
  return Math.ceil(diffTimeSec / (1000 * 60 * 60 * 24));
};

export default getDayDiff;
