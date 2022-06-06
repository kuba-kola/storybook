import LoadingState from "..";
import React from "react";

export default {
    title: "Done/Loading State",
    argTypes: {}
}

const Template = (args) => <LoadingState {...args}/>

export const Base = Template.bind({});
Base.args = {
};