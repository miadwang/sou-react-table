import React from 'react';
import { storiesOf } from '@storybook/react';
import SouTable from '../src';
import '../SouTable.css';

storiesOf('SouTable', module)
  .add('default view', () => (
    <SouTable />
  ))
  .add('scrollable view', () => (
    <SouTable minTableCol={35} minTableRow={60} width={603} height={561} />
  ))
  .add('styled cell view', () => (
    <SouTable
      minTableCol={35}
      minTableRow={60}
      width={603}
      height={561}
      minCellWidth={70}
      cellHeight={40}
    />
  ));
