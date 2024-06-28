import { DateTime } from 'luxon';

const dataTimeFormatter = (payload: string) => {
  const currentDate = DateTime.local().toISODate();
  const dateTimeString = `${currentDate}T${payload}`;
  const dateTime = DateTime.fromISO(dateTimeString, {
    zone: 'America/Sao_Paulo',
  }).toISO();
  return dateTime;
};

export default dataTimeFormatter;
