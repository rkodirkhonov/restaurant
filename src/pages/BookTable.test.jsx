import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { getDocs, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import BookTable from './BookTable';

jest.mock('../firebase', () => ({ auth: {}, db: {} }));
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn(), signOut: jest.fn() }));
jest.mock('firebase/firestore', () => ({
  getDocs: jest.fn(), addDoc: jest.fn(), collection: jest.fn(), query: jest.fn(),
  where: jest.fn(), orderBy: jest.fn(),
}));
const mockNavigate = jest.fn();
let authChanged;
beforeEach(() => {
  jest.clearAllMocks();
  onAuthStateChanged.mockImplementation((_auth, callback) => {
    authChanged = callback;
    callback({ uid: 'alice' });
    return jest.fn();
  });
});

test('shows loading followed by an empty state', async () => {
  let finish;
  getDocs.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  render(<BookTable />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  await act(async () => finish({ docs: [] }));
  expect(screen.getByText('You have no bookings yet.')).toBeInTheDocument();
});

test('shows an error and allows a successful retry', async () => {
  getDocs.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({
    docs: [{ id: 'one', data: () => ({ name: 'Alice', datetime: '2027-01-01T18:00' }) }],
  });
  render(<BookTable />);
  expect(await screen.findByRole('alert')).toHaveTextContent('could not load');
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(await screen.findByText(/Alice - 2027/)).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('ignores results from the previous account', async () => {
  let finishAlice;
  getDocs.mockReturnValueOnce(new Promise(resolve => { finishAlice = resolve; }))
    .mockResolvedValueOnce({ docs: [] });
  render(<BookTable />);
  act(() => authChanged({ uid: 'bob' }));
  await screen.findByText('You have no bookings yet.');
  await act(async () => finishAlice({ docs: [{ id: 'private', data: () => ({ name: 'Alice private' }) }] }));
  expect(screen.queryByText(/Alice private/)).not.toBeInTheDocument();
});

test('cleans up authentication listener and ignores requests after unmount', async () => {
  const unsubscribe = jest.fn();
  onAuthStateChanged.mockImplementation((_auth, callback) => { callback({ uid: 'alice' }); return unsubscribe; });
  let finish;
  getDocs.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  const { unmount } = render(<BookTable />);
  unmount();
  await act(async () => finish({ docs: [] }));
  expect(unsubscribe).toHaveBeenCalledTimes(1);
});


test('labels fields and focuses the first invalid input', async () => {
  getDocs.mockResolvedValue({ docs: [] });
  render(<BookTable />);
  await screen.findByText('You have no bookings yet.');
  expect(screen.getByLabelText('Special requests (optional)')).toBeInTheDocument();
  fireEvent.submit(screen.getByRole('button', { name: 'Book Now' }).closest('form'));
  expect(screen.getByLabelText('Full name')).toHaveFocus();
  expect(screen.getByLabelText('Full name')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getAllByRole('alert')).toHaveLength(3);
});


test('keyboard users can reach submit and are returned to the invalid field', async () => {
  getDocs.mockResolvedValue({ docs: [] });
  render(<BookTable />);
  await screen.findByText('You have no bookings yet.');
  const keyboard = userEvent;
  await keyboard.tab();
  expect(screen.getByLabelText('Full name')).toHaveFocus();
  for (let i = 0; i < 4; i++) await keyboard.tab();
  expect(screen.getByRole('button', { name: 'Book Now' })).toHaveFocus();
  await act(async () => keyboard.keyboard('{Enter}'));
  expect(screen.getByLabelText('Full name')).toHaveFocus();
});


function fillReservation() {
  fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Alice' } });
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'alice@example.com' } });
  fireEvent.change(screen.getByLabelText('Date and time'), { target: { value: '2099-01-01T18:00' } });
}

test('guards duplicate submissions and confirms only after the write', async () => {
  getDocs.mockResolvedValue({ docs: [] });
  let finish;
  addDoc.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  render(<BookTable />);
  await screen.findByText('You have no bookings yet.');
  fillReservation();
  const form = screen.getByRole('button', { name: 'Book Now' }).closest('form');
  fireEvent.submit(form);
  fireEvent.submit(form);
  expect(addDoc).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
  expect(screen.queryByText('Your reservation request was saved.')).not.toBeInTheDocument();
  await act(async () => finish({ id: 'new-booking' }));
  expect(screen.getByText('Your reservation request was saved.')).toBeInTheDocument();
  expect(screen.getByLabelText('Full name')).toHaveValue('');
});

test('retains details on write failure and allows retry', async () => {
  getDocs.mockResolvedValue({ docs: [] });
  addDoc.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ id: 'saved' });
  render(<BookTable />);
  await screen.findByText('You have no bookings yet.');
  fillReservation();
  fireEvent.click(screen.getByRole('button', { name: 'Book Now' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('could not save');
  expect(screen.getByLabelText('Full name')).toHaveValue('Alice');
  fireEvent.click(screen.getByRole('button', { name: 'Book Now' }));
  expect(await screen.findByText('Your reservation request was saved.')).toBeInTheDocument();
  expect(addDoc).toHaveBeenCalledTimes(2);
});
