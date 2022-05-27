import CarouselNavigation from "../index";
import React from 'react';
import "../styles.scss"

export default {
    title: 'Example/Carousel Navigation',
    // component: CarouselNavigation,
}

const Template = (args) => <CarouselNavigation {...args}/>

export const Default = Template.bind({});
Default.args = {};