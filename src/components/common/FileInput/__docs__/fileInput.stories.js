import FileInput from "..";
import React from "react";

export default {
    title: "Done/File Input",
    argTypes: {
        label: {
            name: "label",
            description: "File input button label",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        }, 
        error: {
            name: "error",
            description: "Error text that appears when file added incorrectly",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        }
    }
}

const Template = (args) => <FileInput {...args}/>

export const Base = Template.bind({});
Base.args = {
    label: "Load",
    error: "",
};