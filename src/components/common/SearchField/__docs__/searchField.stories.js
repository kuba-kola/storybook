import SearchField from "..";
import React from 'react';


export default {
    title: "Done/Search Field",
    argTypes: {
        placeholder: {
            name: "placeholder",
            description: "placeholder",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        },
        showTooltip: {
            name: "showTooltip",
            description: "showTooltip",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "true" },
                category: "Validation"
            },
            defaultValue: "true",
            control: {
                type: "boolean"
            }
        },
        tooltipContent: {
            name: "tooltipContent",
            description: "tooltipContent",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        },
        value: {
            name: "value",
            description: "value",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        },
    }
}

const Template = (args) => <SearchField {...args}/>

export const Base = Template.bind({});
Base.args = {
    placeholder: "",
    showTooltip: true,
    tooltipContent: "",
    value: "",
}