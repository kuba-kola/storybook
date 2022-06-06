import TextMessage from "../index";
import React from "react";

export default {
    title: "Done/Text Message",
    argTypes: {
        source: {
            name: "sourse",
            description: "sourse",
            options: ["SOURCE_CONCIERGE", "SOURCE_USER"],
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "SOURCE_USER" }
            },
            defaultValue: "SOURCE_USER",
            control: {
                type: "select"
            }
        },
        message: {
            name: "message",
            description: "message",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Test message" }
            },
            defaultValue: "Test message",
        },
        isOpening: {
            name: "isOpening",
            description: "isOpening",
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
        isClosing: {
            name: "isClosing",
            description: "isClosing",
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
        isBig: {
            name: "isBig",
            description: "isBig",
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

const Template = (args) => <TextMessage {...args}/>

export const Base = Template.bind({});
Base.args = {
    source: "SOURCE_USER",
    message: "Message",
    isOpening: false,
    isClosing: false,
    isBig: false,
};

export const UserMessage = Template.bind({});
UserMessage.args = {
    source: "SOURCE_USER",
    message: "Message",
    isOpening: false,
    isClosing: false,
    isBig: false,
}

export const ConsiergeMessage = Template.bind({});
ConsiergeMessage.args = {
    source: "SOURCE_CONCIERGE",
    message: "Message",
    isOpening: false,
    isClosing: false,
    isBig: false,
}
