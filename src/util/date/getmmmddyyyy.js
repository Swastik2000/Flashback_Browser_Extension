const getmmmddyyyy = (date) => {
  // prettier-ignore
  let monthNames =
    ["Jan","Feb","Mar","Apr",
    "May","Jun","Jul","Aug",
    "Sep", "Oct","Nov","Dec"];

  let day = date.getDate();

  let monthIndex = date.getMonth();
  let monthName = monthNames[monthIndex];

  let year = date.getFullYear();

  return `${day}-${monthName}-${year}`;
};

export default getmmmddyyyy;
