import { render, screen, waitFor } from '@testing-library/react';
import UserList from '../pages/UserList';
import { BrowserRouter } from 'react-router-dom';
import API from '../services/api';
import { vi } from 'vitest';

vi.mock('../services/api');

test('renders user list with MUI table', async () => {
  const mockUsers = [
    { _id: '1', name: 'Admin User', email: 'admin@mail.com', role: 'admin' },
    { _id: '2', name: 'Regular User', email: 'user@mail.com', role: 'user' },
  ];

  const mockToken = { id: '1', role: 'admin' };

  // Create a fake JWT to decode inside the component
  const base64Payload = btoa(JSON.stringify(mockToken));
  const fakeToken = `header.${base64Payload}.signature`;
  localStorage.setItem('token', fakeToken);

  API.get.mockResolvedValueOnce({ data: mockUsers });

  render(
    <BrowserRouter>
      <UserList />
    </BrowserRouter>
  );

  await waitFor(() => expect(screen.getByText('Admin User')).toBeInTheDocument());
  expect(screen.getByText('Regular User')).toBeInTheDocument();
  expect(screen.getByText('Download Excel')).toBeInTheDocument();
});
