import Panel from "..";
import React from "react";

export default {
    title: "Done/Panel",
    argTypes: {
        header: {
            name: "header",
            description: "Panel title which is in a separate block",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        }, 
        children: {
            name: "children",
            description: "children",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        }, 
        isToggle: {
            name: "isToggle",
            description: "isToggle",
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

const Template = (args) => <Panel {...args}/>

export const Base = Template.bind({});
Base.args = {
    header: "",
    children: "",
    isToggle: false,
}