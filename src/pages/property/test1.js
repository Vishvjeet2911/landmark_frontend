import React, { useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function CropImage() {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 0,
    y: 0,
    width: 50,
    height: 50
  });
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const imageRef = useRef(null);

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoaded = useCallback(image => {
    imageRef.current = image;
    return false; // Return false when setting ref via callback
  }, []);

  const onCropComplete = useCallback(crop => {
    makeClientCrop(crop);
  }, []);

  const onCropChange = (crop, percentCrop) => {
    setCrop(crop);
  };

  const makeClientCrop = async (crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const newCroppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        "newFile.jpeg"
      );
      setCroppedImageUrl(newCroppedImageUrl);
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        const fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/jpeg");
    });
  };

  console.log(src)
  return (
    <div className="App">
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      {src && (
        <ReactCrop
          src={src}
          crop={crop}
          ruleOfThirds
          onImageLoaded={onImageLoaded}
          onComplete={onCropComplete}
          onChange={onCropChange}
        />
      )}
      {croppedImageUrl && (
        <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
      )}
    </div>
  );
}

