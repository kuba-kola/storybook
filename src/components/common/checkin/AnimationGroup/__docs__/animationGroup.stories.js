import AnimationGroup from "../index";
import React from 'react';

export default {
    title: 'Example/Animation Group',
    argTypes: {
        children: {
            name: "children",
            description: "children",
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Test message' }
            },
            defaultValue: "Test message",
        },
        isComplete: {
            name: "isComplete",
            description: "isComplete",
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            },
            defaultValue: "false",
            control: {
                type: 'boolean'
            }
        }
    }
}

const Template = (args) => <AnimationGroup {...args}/>

export const Base = Template.bind({});
Base.args = {
    children: "Test test test",
    isComplete: false
    
};

