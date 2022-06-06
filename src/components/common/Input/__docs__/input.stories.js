import Input from '../index';
import React from 'react';

export default {
    title: 'Done/Input',
    argTypes: {
        label: {
            name: 'label',
            description: "Label at the top of the input",
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'null' }
            },
            defaultValue: "null",
        },
        error: {
            name: 'error',
            description: 
                "Error message that will appear at the bottom of the input in case of incorrect input",
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'null' }
            },
            defaultValue: "null",
        },
        // inputClassName: {
        //     name: 'inputClassName',
        //     description: "inputClassName",
        //     table: {
        //         type: { summary: 'string' },
        //         defaultValue: { summary: 'null' }
        //     },
        //     defaultValue: "null",
        // },
    }
}

const Template = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
    label: "",
    error: "",
    // inputClassName: ""
};