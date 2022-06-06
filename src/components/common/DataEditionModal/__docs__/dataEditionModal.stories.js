import DataEditionModal from "..";
import React from "react";

export default {
    title: "Example/DataEditionModal",
    argTypes: {}
}

const Template = (args) => <DataEditionModal {...args}/>

export const Base = Template.bind({});
Base.args = {
    initialData: {},
    submitButtonText: "Create",
};