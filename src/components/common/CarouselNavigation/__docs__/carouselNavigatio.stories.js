import CarouselNavigation from "../index";
import React from 'react';
import "../styles.scss"

export default {
    title: 'Example/Carousel Navigation',
    argTypes: {
        carouselIndex: {
            name: "carouselIndex",
            description: "carouselIndex",
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '1' }
            },
            defaultValue: "1",
            control: {
                type: 'number'
            }
        },
        collectionLength: {
            name: "collectionLength",
            description: "collectionLength",
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '1' }
            },
            defaultValue: "12",
            control: {
                type: 'number'
            }
        },
        slidesToShow: {
            name: "slidesToShow",
            description: "slidesToShow",
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '1' }
            },
            defaultValue: "1",
            control: {
                type: 'number'
            }
        },  
    }
}

const Template = (args) => <CarouselNavigation {...args}/>

export const Default = Template.bind({});
Default.args = {
    carouselIndex: 1,
    collectionLength: 12,
    slidesToShow:10
};