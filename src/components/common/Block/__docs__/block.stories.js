import Block from "../index";
import React from "react";

export default {
    title: "Done/Block",
    argTypes: {
        title: {
            name: "title",
            description: "The title of the block that is placed above the block",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            }
        },
        children: {
            name: "children",
            description: "Block content that is displayed on the application page",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            }
        }
    }
}

const Template = (args) => <Block {...args}/>

export const Base = Template.bind({});
Base.args = {
    title: "Title",
    children: 
        "Block content that will be displayed on the application page"
};
