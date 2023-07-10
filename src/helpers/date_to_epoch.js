const toEpoch = (dateString) => {
  // Convert the string to a Date object.
  const date = new Date(dateString);

  // Get the epoch timestamp.
  const epoch = date.getTime() / 1000;

  return epoch;
}

module.exports = toEpoch;
