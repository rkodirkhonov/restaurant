export function validateReservation(values, now = Date.now()) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  const timestamp = new Date(values.datetime).getTime();
  if (!Number.isFinite(timestamp) || timestamp <= now) errors.datetime = 'Choose a future date and time.';
  return errors;
}
