import PackageItems from "../PackageItems";
import React from "react";

export default {
    title: "Example/Package Items",
    argTypes: {
        packageItems: {
            name: "packageItems",
            description: "packageItems",
            table: {
                type: { summary: "array" },
            },
            control: {
                type: "object"
            }
        },
        extras: {
            name: "extras",
            description: "extras",
            table: {
                type: { summary: "array" },
            },
            control: {
                type: "object"
            }
        },
    }
}

const Template = (args) => <PackageItems {...args}/>

export const Base = Template.bind({});
Base.args = {
    packageItems: [],
    extras: [],
}