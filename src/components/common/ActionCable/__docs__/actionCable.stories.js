import ActionCable from "../index";
import React from "react";

export default {
    title: 'Example/Action Cable',
    // component: ActionCable
}

const Template = (args) => <ActionCable {...args} />;

export const Default = Template.bind({});
Default.args = {};