import MultiTagSelect from "..";
import React from "react";

export default {
    title: "Done/MultiTag Select",
    argTypes: {
        label: {
            name: "label",
            description: "Label at the top of the multitag select",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        },
        options: {
            name: "options",
            description: "",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "[]" }
            },
            defaultValue: "[]",
            control: {
                type: "object"
            },
        },
        value: {
            name: "value",
            description: "",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "[]" }
            },
            defaultValue: "[]",
            control: {
                type: "object"
            },
        }
    }
}

const Template = (args) => <MultiTagSelect {...args}/>

export const Base = Template.bind({});
Base.args = {
    label: "",
    options: [{
        name: "options item",
        id: 1,
      }],
    value: [{
        name: "value item",
        id: 0,
      }]

};