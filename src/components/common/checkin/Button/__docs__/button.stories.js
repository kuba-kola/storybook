import Button from '../index';
import React from 'react';

export default {
    title: 'Done/Button_1',
    type: "button",
    argTypes: {
        caption: {
            name: "caption",
            description: "caption",
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Button' }
            },
            defaultValue: "Button",
        },
        isBig: {
            name: "isBig",
            description: 'isBig',
            control: {
                type: 'boolean'
            },
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        isSecondary: {
            name: "isSecondary",
            description: 'isSecondary',
            control: {
                type: 'boolean'
            },
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        isWide: {
            name: "isWide",
            description: 'isWide',
            control: {
                type: 'boolean'
            },
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
    },

}

const Template = (args) => <Button {...args}/>

export const Base = Template.bind({});
Base.args = {
    caption: "Button",
    isSecondary: false,
    disabled: false,
    isWide: false,
    isBig: false,
};

export const Primary = Template.bind({});
Primary.args = {
    caption: "Button",
    isSecondary: false,
    disabled: false,
    isWide: false,
    isBig: false,
};

export const Secondary = Template.bind({});
Secondary.args = {
    caption: "Button",
    isSecondary: true,
    disabled: false,
    isWide: false,
    isBig: false,
};

export const Disable = Template.bind({});
Disable.args = {
    caption: "Button",
    isSecondary: true,
    disabled: true,
    isWide: false,
    isBig: false,
};