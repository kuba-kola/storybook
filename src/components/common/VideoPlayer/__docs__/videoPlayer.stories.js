import VideoPlayer from "..";
import React from "react";

export default {
    title: "Example/VideoPlayer",
    // argTypes: {}
}

const Template = (args) => <VideoPlayer {...args}/>

export const Base = Template.bind({});
Base.args = {}