import ImageInput from "..";
import React from "react";

export default {
    title: "Example/ImageInput",
    argTypes: {}
}

const Template = (args) => <ImageInput {...args}/>

export const Base = Template.bind({});
Base.args = {
    isEditing: false,
    image: {},
    inputName: "",
    alt: "",
    imagePresentText: "",
    noImageText: ""
};