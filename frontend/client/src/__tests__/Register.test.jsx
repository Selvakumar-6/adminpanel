import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../pages/Register';
import { BrowserRouter } from 'react-router-dom';
import API from '../services/api';

vi.mock('../services/api');

test('submits register form with role selection', async () => {
  API.post.mockResolvedValueOnce({});

  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@mail.com' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '123456' } });

  fireEvent.mouseDown(screen.getByLabelText(/Role/i));

  const listbox = await screen.findByRole('listbox');
  fireEvent.click(screen.getByRole('option', { name: 'User' }));

  fireEvent.click(screen.getByRole('button', { name: /Register/i }));

  await waitFor(() => {
    expect(API.post).toHaveBeenCalledWith('/register', {
      name: 'Test User',
      email: 'test@mail.com',
      password: '123456',
      role: 'user',
    });
  });
});
