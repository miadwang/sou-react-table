import React from 'react';
import { storiesOf } from '@kadira/storybook';
import SouTable from '../index';
import '../../SouTable.css';

storiesOf('SouTable', module)
  .add('default view', () => (
    <SouTable />
  ))
  .add('scrollable view', () => (
    <SouTable minTableCol={35} width={600} height={560} />
  ))
  .add('styled cell view', () => (
    <SouTable
      minTableCol={35}
      width={600}
      height={560}
      cellMinWidth={70}
      cellHeight={40}
    />
  ));
