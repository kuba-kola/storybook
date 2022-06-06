import RadioButton from "../index";
import React from 'react';

export default {
    title: 'Done/Radio Button',
    component: RadioButton,
    argTypes: {
        labelText: {
            name: "labelText",
            description: "labelText",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        },
        isChecked: {
            name: "isChecked",
            description: "isChecked",
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

const Template = (args) => <RadioButton {...args}/>

export const Base = Template.bind({});
Base.args = {
    labelText: ""
}