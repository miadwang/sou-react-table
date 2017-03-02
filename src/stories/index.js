import React from 'react';
import { storiesOf } from '@kadira/storybook';
import SouTable from '../index';
import '../../SouTable.css';

storiesOf('SouTable', module)
  .add('default view', () => (
    <SouTable />
  ));
