import PageHeader from "../index";
import React from "react";

export default {
    title: "Example/Page Header",
    argTypes: {
        title: {
            name: "title",
            description: "title",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        }, 
        rightSideContent: {
            name: "rightSideContent",
            description: "rightSideContent",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        },
    }
}

const Template = (args) => <PageHeader {...args}/>

export const Base = Template.bind({});
Base.args = {
    title: "",
    rightSideContent: "",
};