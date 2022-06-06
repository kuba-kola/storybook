import ChooseAdvisor from "../ChooseAdvisor/index";
import React from "react";

export default {
    title: "Example/Booking Steps",
}

const Template = (args) => <ChooseAdvisor {...args}/>

export const Base = Template.bind({});
Base.args = {
    teamServiceAdvisors: [],
    serviceAdvisors: [],
};
