const getddmm = (date) => {
  // prettier-ignore
  let monthNames =
      ["Jan","Feb","Mar","Apr",
      "May","Jun","Jul","Aug",
      "Sep", "Oct","Nov","Dec"];

  let day = date.getDate();

  let monthIndex = date.getMonth();
  let monthName = monthNames[monthIndex];

  return `${day} ${monthName}`;
};

export default getddmm;
