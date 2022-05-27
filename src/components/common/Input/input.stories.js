import Input from './index';
import React from 'react';

export default {
    title: 'Test/Input',
    component: Input,
    argTypes: {
        label: {
            control: {
                type: 'text'
            },
            description: 'Text label for the input.',
            table: {
                type: { summary: 'string' }
            }
        },
    }
}

const Template = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
    error: null,
    label: null,
    inputClassName: null,
};