import StyledSelect from "..";
import React from "react";
//разабрацца як адпрацоўвае label: string, value: any
export default {
    title: "Done/Styled Select",
    argTypes: {
        value: {
            name: "value",
            description: "value",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        },
        options: {
            name: "options",
            description: "options",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        },
        error: {
            name: "error",
            description: "error",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        },
        disabled: {
            name: "disabled",
            description: "disabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
                category: "Validation"
            },
            defaultValue: "false",
            control: {
                type: "boolean"
            }
        },
    }
}

const Template = (args) => <StyledSelect {...args}/>

export const Base = Template.bind({});
Base.args = {
    value: "",
    options: [],
    error: "",
    disabled: false
}