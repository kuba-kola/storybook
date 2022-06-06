import ExtensionService from "..";
import React from "react";

export default {
    title: "Example/Extension Service",
    argTypes: {}
}

const Template = (args) => <ExtensionService {...args}/>

export const Base = Template.bind({});
Base.args = {
    isHighlighted: false,
    isRecall: false,
};