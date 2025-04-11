function processImageData(imageData, width, height) {
  if (!imageData) return [];

  const rgbArray = height && width ? [height, width] : []; // unintuitive order but this is what controller expects

for (let i = 0; i < imageData.length; i += 4) {
  const alpha = imageData[i + 3] / 255; // Normalize alpha to [0, 1]
  rgbArray.push(
    imageData[i + 2] * alpha,     // Premultiply B
    imageData[i + 1] * alpha, // Premultiply G
    imageData[i] * alpha  // Premultiply R
  );
}

  return rgbArray;
}

export default processImageData;
