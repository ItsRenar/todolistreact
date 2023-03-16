import React from 'react'
import App from './App'
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

test('renders todotable', () => {
  const row = [
    {description: 'Go to coffee', date: '24.11.2022'}
  ]

  render(<App todos={row}/>);
  const tableRow = screen.getByText('Go to coffee');
  expect(tableRow).NottoBeInTheDocument();
})