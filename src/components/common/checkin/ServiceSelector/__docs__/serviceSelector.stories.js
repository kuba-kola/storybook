import ServiceSelectorContainer from "..";
import React from "react";

export default {
    title: "Example/Service Selector Container",
    argTypes: {}
}

const Template = (args) => <ServiceSelectorContainer {...args}/>

export const Base = Template.bind({});
Base.args = {
};