import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import SouTable from '../index';

const { describe, it } = global;

describe('SouTable', () => {
  it('should render properly', () => {
    const wrapper = shallow(<SouTable />);
    expect(wrapper.exists()).to.be.equal(true);
  });
});
