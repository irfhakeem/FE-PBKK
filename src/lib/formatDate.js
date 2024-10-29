// dateUtils.js

export const formatDate = (date) => {
  const d = new Date(date);
  const dNow = new Date();

  if (
    dNow.getMonth() === d.getMonth() &&
    dNow.getFullYear() === d.getFullYear() &&
    dNow.getDate() === d.getDate()
  ) {
    if (dNow.getHours() - d.getHours() > 1) {
      return `${dNow.getHours() - d.getHours()} hours ago`;
    } else return "Recently";
  } else if (
    dNow.getMonth() === d.getMonth() &&
    dNow.getFullYear() === d.getFullYear()
  ) {
    return `${dNow.getDate() - d.getDate()} days ago`;
  }

  return `${d.toLocaleString("default", {
    month: "short",
  })} ${d.getFullYear()}`;
};

export const formatDateToISO = (date) => {
  const dateObj = new Date(date);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${month} ${year}`;
};
