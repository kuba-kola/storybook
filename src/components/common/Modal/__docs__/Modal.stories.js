import Modal from "..";
import React from "react";

export default {
    title: "Done/Modal",
    argTypes: {
        title: {
            name: "title",
            description: 
                "The title of the modal window, which is reflected in the upper left corner",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        },
        text: {
            name: "text",
            description: 
                "Modal window content that is reflected inside",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        },
        subtitle: {
            name: "subtitle",
            description: 
                "Text that follows the title and is written in gray italics",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" }
            },
            defaultValue: "null",
        },
        cancelButtonText: {
            name: "cancelButtonText",
            description: 
                "Cancel button text",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Cancel" }
            },
            defaultValue: "Cancel",
        },
        submitButtonText: {
            name: "submitButtonText",
            description: 
                "Submit button text",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "Submit" }
            },
            defaultValue: "Submit",
        },
        cancelButtonVariant: {
            name: "cancelButtonVariant",
            description: 
                "The variant changes the appearance of cancel button. Accepted variants include base, neutral, aqua, brand, brand-outline, dark, dark-outline, success or destructive.",
            options: [
                "base",
                "neutral",
                "aqua",
                "brand",
                "brand-outline",
                "dark",
                "dark-outline",
                "success",
                "destructive",
            ],
            control: {
                type: "select"
            },
            defaultValue: "dark-outline",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "dark-outline" }
            }
        },
        submitButtonVariant: {
            name: "submitButtonVariant",
            description: 
                "The variant changes the appearance of submit button. Accepted variants include base, neutral, aqua, brand, brand-outline, dark, dark-outline, success or destructive.",
            options: [
                "base",
                "neutral",
                "aqua",
                "brand",
                "brand-outline",
                "dark",
                "dark-outline",
                "success",
                "destructive",
            ],
            control: {
                type: "select"
            },
            defaultValue: "dark-outline",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "dark-outline" }
            }
        },
        submitDisabled: {
            name: "submitDisabled",
            description: "confirm button state change",
            control: {
                type: "boolean"
            },
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
                category: "Validation"
            }
        },
        size: {
            neme: "size",
            description: "The size of modal window. Options include small, medium or large.",
            defaultValue: "medium",
            options: ["small", "medium", "large"],
            control: {
                type: "radio"
            },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "medium" }
            }
        },
        isForm: {
            name: "isForm",
            description: "",
            control: {
                type: "boolean"
            },
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
                category: "Validation"
            }
        },
        loading: {
            name: "loading",
            description: "",
            control: {
                type: "boolean"
            },
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
                category: "Validation"
            }
        },
    }
}

const Template = (args) => <Modal {...args}/>

export const Base = Template.bind({});
Base.args = {
    title: "",
    text: "",
    subtitle: "",
    cancelButtonText: "Cancel",
    submitButtonText: "Submit",
    cancelButtonVariant: "dark-outline",
    submitButtonVariant: "brand",
    submitDisabled: false,
    size: "medium",
    isForm: false,
    loading: false,
    children: "",
};