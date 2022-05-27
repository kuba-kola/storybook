import Accordion from "../index";
import React from "react";

export default {
    title: 'Example/Accordion',
    argTypes: {
        title: {
            name: "title",
            description: "The title of the generated accordion",
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Title' }
            },
            defaultValue: "Title",
        },
        children: {
            name: "label",
            description: "Content that is hidden under the accordion",
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Accordion content' }
            },
            defaultValue: "Accordion content",
        },
        expandable: {
            name: "expandable",
            description: "Content that is hidden under the accordion",
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            },
            defaultValue: "true",
            control: {
                type: 'boolean'
            }

        }
    }
}

const Template = (args) => <Accordion {...args}/>

export const Base = Template.bind({});
Base.args = {
    // customClass: "",
    title: "Title",
    children: "Accordion content",
    expandable: true,
    // maintenanceCount: 0,
    // concernCount: 0,
    // currentStep: "",
    // step: null,
    // isInitiallyExpanded: false,
    // selectedValue: null,
}; 

export const Booking = Template.bind({});
Booking.args = {};

export const Scheduling = Template.bind({});
Scheduling.args = {};
