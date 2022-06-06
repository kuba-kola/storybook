import HeaderEdit from "..";
import React from "react";

export default {
    title: "Done/Header Edit",
    argTypes: {
        isEditing: {
            name: "isEditing",
            description: "Toggle button state",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
                category: "Validation"
            },
            defaultValue: "false",
            control: {
                type: "boolean"
            }
        }
    }
}

const Template = (args) => <HeaderEdit {...args}/>

export const Base = Template.bind({});
Base.args = {
    isEditing: false,
}