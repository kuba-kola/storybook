import Button from '../index';
import React from 'react';

export default {
    title: 'Example/Button',
    component: Button,
    type: "button",
    
    argTypes: {
        children: {
            name: "label",
            description: "Button content",
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Button' }
            },
            defaultValue: "Button",
        },
        variant: {
            name: "variant",
            description: 
                'The variant changes the appearance of button. Accepted variants include base, base-grey, neutral, aqua, brand, brand-outline, dark, dark-outline, success, destructive or destructive-outline.',
            defaultValue: 'base',
            options: [
                "base",
                "base-grey",
                "neutral",
                "aqua",
                "brand",
                "brand-outline",
                "dark",
                "dark-outline",
                "success",
                "destructive",
                "destructive-outline",
            ],
            control: {
                type: 'select'
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'base' }
            }
        },
        padding: {
            neme: "padding",
            description: 'The size of padding. Options include small, medium or large.',
            defaultValue: "large",
            options: ["small", "medium", "large"],
            control: {
                type: 'radio'
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'large' }
            }
        },
        icon: {
            name: "Icon type",
            description: 
                'The icon type changes view of button context. Options include add, addWhite, bin, close, checkmark, edit, editGrey, editWhite, leftArrow or rightArrow.',
            options: [
                "add",
                "addWhite",
                "bin",
                "close",
                "checkmark",
                "edit",
                "editGrey",
                "editWhite",
                "leftArrow",
                "rightArrow",
                null,
            ],
            control: {
                type: 'select'
            },
            defaultValue: null,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'null' }
            }
        },
        fullWidth: {
            name: "Full Width",
            description: 'Size of button. Can be standard or occupy the entire width of the block',
            control: {
                type: 'boolean'
            },
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        }
    },

}

const Template = (args) => <Button {...args}/>

export const Base = Template.bind({});
Base.args = {
    children: "Button"
};

export const BaseGrey = Template.bind({});
BaseGrey.args = {
    children: "Button",
    variant: "base-grey"
};

export const Neutral = Template.bind({});
Neutral.args = {
    children: "Button",
    variant: "neutral"
}; 

export const Aqua = Template.bind({});
Aqua.args = {
    children: "Button",
    variant: "aqua"
};

export const Brand = Template.bind({});
Brand.args = {
    children: "Button",
    variant: "brand"
};

export const BrandOutline = Template.bind({});
BrandOutline.args = {
    children: "Button",
    variant: "brand-outline"
};

export const Dark = Template.bind({});
Dark.args = {
    children: "Button",
    variant: "dark",
    icon: "editWhite"
};

export const DarkOutline = Template.bind({});
DarkOutline.args = {
    children: "Button",
    variant: "dark-outline",
};

export const Success = Template.bind({});
Success.args = {
    children: "Button",
    variant: "success"
};

export const Destructive = Template.bind({});
Destructive.args = {
    children: "Button",
    variant: "destructive"
};

export const DestructiveOutline = Template.bind({});
DestructiveOutline.args = {
    children: "Button",
    variant: "destructive-outline",
    icon: "bin"
};