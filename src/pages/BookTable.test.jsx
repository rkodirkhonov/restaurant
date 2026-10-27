import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { getDocs } from 'firebase/firestore';
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
  await keyboard.keyboard('{Enter}');
  expect(screen.getByLabelText('Full name')).toHaveFocus();
});
