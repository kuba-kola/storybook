import AppointmentDetails from "../index";
import React from "react";

export default {
    title: 'Example/Appointment Details',
    // component: ActionCable
}

const Template = (args) => <AppointmentDetails {...args} />;

export const Default = Template.bind({});
Default.args = {};