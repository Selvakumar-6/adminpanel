import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';
import { BrowserRouter } from 'react-router-dom';
import API from '../services/api';
import { vi } from 'vitest';

vi.mock('../services/api');

test('submits login form and stores token', async () => {
  API.post.mockResolvedValueOnce({ data: { token: 'fake-jwt-token' } });

  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/Email/i), {
    target: { value: 'user@mail.com' },
  });

  fireEvent.change(screen.getByLabelText(/Password/i), {
    target: { value: '123456' },
  });

  const loginButton = screen.getByRole('button', { name: /login/i });
  fireEvent.click(loginButton);

  expect(API.post).toHaveBeenCalledWith('/login', {
    email: 'user@mail.com',
    password: '123456',
  });
});
