import AppointmentDetails from "../index";
import React from "react";

export default {
    title: 'Example/Appointment Details',
    argTypes: {
        customer: {
            name: "customer",
            description: "customer",
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'John Doe' }
            }
        }, 
        vehicle:{
            name: "vehicle",
            description: "vehicle",
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Acura' }
            },
        },
        sendSms: {
            name: "sendSms",
            description: "sendSms",
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        contactNumber: {
            name: "contactNumber",
            description: "contactNumber",
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '0000' }
            }
        }
    }
}

const Template = (args) => <AppointmentDetails {...args} />;

export const Default = Template.bind({});
Default.args = {
    sendSms: true,
    contactNumber: '000',
    customer: "John Doe",
    vehicle: "Acura"
};