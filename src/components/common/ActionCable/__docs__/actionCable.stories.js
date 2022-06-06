import ActionCable from "../index";
import React from "react";

export default {
    title: 'Example/Action Cable',
}

const Template = (args) => <ActionCable {...args}/>
export const Base = Template.bind({});
Base.args = {
    channel: null,
    channelKey: null,
    authToken: null,
};