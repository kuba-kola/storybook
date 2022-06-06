import DrawableCanvas from '../index';
import React from 'react';

export default {
    title: 'Done/Drawable Canvas',
    argTypes: {
        width: {
            name: "width",
            description: "width",
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '400' },
                category: "Proportions"
            },
            defaultValue: "400",
            control: {
                type: 'number'
            }
        },
        height: {
            name: "height",
            description: "height",
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '400' },
                category: "Proportions"
            },
            defaultValue: "400",
            control: {
                type: 'number'
            }
        },
        lineWidth: {
            name: "lineWidth",
            description: "lineWidth",
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '1' },
                category: "Pen"
            },
            defaultValue: "1",
            control: {
                type: 'number'
            }
        },
        signature: {
            name: "signature",
            description: "signature",
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'null' }
            },
            defaultValue: "null",
        },
        disabled: {
            name: "disabled",
            description: 'disabled',
            control: {
                type: 'boolean'
            },
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: "Validation"
            }
        },
    }
}

const Template = (args) => <DrawableCanvas {...args}/>

export const Base = Template.bind({});
Base.args = {
    width: 400,
    height: 200,
    lineWidth: 1,
    signature: 'null',
    disabled: false
};