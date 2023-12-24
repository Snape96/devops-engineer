/**
 * Converts a dateTime value to a Date object with the time set to the start of the day (midnight).
 * @param {string | Date} dateTime - The date time value to convert.
 * @returns {Date} The Date object set to midnight of the specified date.
 */
export function getDateOnlyFromDateTime(dateTime: string | Date): Date {
  const date = new Date(dateTime);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
* Retrieves the current date with the time set to the start of the day (midnight).
* @returns {Date} The current Date object set to midnight.
*/
export function getTodaysDate(): Date {
return getDateOnlyFromDateTime(new Date());
}

/**
* Calculates the date for the start of the previous day (yesterday).
* @returns {Date} A Date object set to midnight at the start of yesterday.
*/
export function getYesterdayLimit(): Date {
const today = getTodaysDate();
today.setDate(today.getDate() - 1); 
return today;
}

/**
* Calculates the date for the start of the day one week ago.
* @returns {Date} A Date object set to midnight at the start of the day one week ago.
*/
export function getOneWeekLimit(): Date {
const today = getTodaysDate();
today.setDate(today.getDate() - 7); 
return today;
}

/**
* Calculates the date for the start of the day one month ago.
* @returns {Date} A Date object set to midnight at the start of the day one month ago.
*/
export function getOneMonthLimit(): Date {
const today = getTodaysDate();
today.setMonth(today.getMonth() - 1);
return today;
}
