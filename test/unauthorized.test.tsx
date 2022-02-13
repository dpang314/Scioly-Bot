import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Unauthorized from '../src/pages/unauthorized';

test('renders page', () => {
  render(<Unauthorized />);

  const element = screen.getByText('Unauthorized. Access is restricted to users with admin permission on the Discord server specified in the site configuration.');
  expect(element).toBeDefined();
});
