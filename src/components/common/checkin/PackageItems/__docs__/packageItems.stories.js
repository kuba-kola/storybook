import PackageItem from "..";
import React from "react";

export default {
    title: "Example/Package Item",
    // argTypes: {}
}

const Template = (args) => <PackageItem {...args}/>

export const Base = Template.bind({});
Base.args = {
};