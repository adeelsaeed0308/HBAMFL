import { fetchImage } from "common/functions";
import { ErrorText } from "common/styles";
import { getIn } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import { Container, Image, Label, Remove } from "./styles";

const ImageUpload = ({ label, required, field, form, image }) => {
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (images && images.length > 0) {
      const { file: value, dataURL } = images[images.length - 1];
      setImageUrl(dataURL);
      form.handleChange({
        target: { name: field.name, value },
      });
    } else {
      form.handleChange({
        target: { name: field.name, value: null },
      });
      setImageUrl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, field.name]);

  const errorMessage = getIn(form, `errors.${field.name}`);

  const isTouched = getIn(form, `touched.${field.name}`);
  const hasError = !!isTouched && !!errorMessage;

  return (
    <ImageUploading multiple value={images} onChange={setImages}>
      {({ onImageUpload, onImageRemoveAll, isDragging, dragProps }) => {
        return (
          <Container hasError={hasError}>
            {label && (
              <Label hasError={hasError}>
                <p>
                  {label}
                  {required ? " *" : ""}
                </p>
                {field.value && <Remove onClick={onImageRemoveAll} />}
              </Label>
            )}
            <Image
              image={imageUrl}
              isDragging={isDragging}
              {...dragProps}
              onClick={onImageUpload}
            >
              {!field.value && "Click to Upload / Drop Image Here"}
            </Image>
            {hasError && <ErrorText>{errorMessage}</ErrorText>}
            {image && (
              <Fragment>
                <div>Current Image:</div>
                <img
                  src={fetchImage(image)}
                  alt="OLD"
                  width="100px"
                  height="50px"
                />
              </Fragment>
            )}
          </Container>
        );
      }}
    </ImageUploading>
  );
};

export default ImageUpload;
