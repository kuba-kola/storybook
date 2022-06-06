import Header from "..";
import React from "react";

export default {
    title: "Example/Header",
    argTypes: {}
}

const Template = (args) => <Header {...args}/>

export const Base = Template.bind({});
Base.args = {
};