import React from "react";
import { Dropdown } from '../components/Dropdown/Dropdown';
import { Story, Meta } from '@storybook/react';

import { options } from "./constants";
import { MultiselectProps } from "../components/Dropdown/interface";

export default {
	title: 'Dropdown',
	component: Dropdown,
} as Meta;


const Template: Story<MultiselectProps> = (args) => <Dropdown {...args} />;
export const MultiSelect = Template.bind({});

MultiSelect.args = {
	options,
  	displayValue: 'key',
  	showCheckbox: true,
  	groupBy: "cat"		
}




