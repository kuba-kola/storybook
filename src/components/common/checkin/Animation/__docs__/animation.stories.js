import Animation from "../index";
import React from 'react';

export default {
    title: 'Example/Animation',
    args: {
       type:{
            name: "type",
            description: "type", 
            options: ["SLIDE_UP", "UNFOLD_RIGHT", "FADE_IN"],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'SLIDE_UP' }
            },
            defaultValue: "SLIDE_UP",
            control: {
                type: 'select'
            }
        },
        delay: {
            name: "delay",
            description: "delay",
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '0' }
            },
            defaultValue: "0",
            control: {
                type: 'number'
            }
        },
        children: {
            name: "children",
            description: "children",
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Test message' }
            },
            defaultValue: "Test message",
        },
    }
}

const Template = (args) => <Animation {...args}/>

export const Base = Template.bind({});
Base.args = {
    type: "SLIDE_UP",
    delay: 0,
    children: "Test"
    
};

export const SLIDE_UP = Template.bind({});
SLIDE_UP.args = {
    type: "SLIDE_UP",
    delay: 2000,
    children: "Test"
};

export const UNFOLD_RIGHT = Template.bind({});
UNFOLD_RIGHT.args = {
    type: "UNFOLD_RIGHT",
    delay: 2000,
    children: "Test"
};

export const FADE_IN = Template.bind({});
FADE_IN.args = {
    type: "FADE_IN",
    delay: 3000,
    children: "Test"
};