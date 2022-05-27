import Block from "../index";
import React from "react";

export default {
    title: 'Example/Block',
}

const Template = (args) => <Block {...args}/>

export const Default = Template.bind({});
Template.args = {};
