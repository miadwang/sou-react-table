import React from 'react';
import ReactDOM from 'react-dom';
import SouTable from './SouTable';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SouTable />, div);
});
