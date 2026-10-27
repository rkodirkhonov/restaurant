import { validateReservation } from './validateReservation';
const now = new Date('2027-01-01T12:00:00').getTime();
const valid = { name: ' Alice ', email: 'alice@example.com', datetime: '2027-01-02T18:00' };
test('accepts a valid future reservation', () => expect(validateReservation(valid, now)).toEqual({}));
test('rejects whitespace names and malformed email', () => {
  expect(validateReservation({ ...valid, name: '  ', email: 'alice@' }, now)).toEqual({
    name: 'Enter your full name.', email: 'Enter a valid email address.',
  });
});
test.each(['', 'invalid', '2026-12-31T18:00', '2027-01-01T12:00'])('rejects invalid or nonfuture date %s', datetime => {
  expect(validateReservation({ ...valid, datetime }, now)).toHaveProperty('datetime');
});
