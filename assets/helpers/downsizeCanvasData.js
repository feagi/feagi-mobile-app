function downsizeCanvasData(originalCanvas, maxWidth, maxHeight) {
  const aspectRatio = originalCanvas.width / originalCanvas.height;
  const maxAspectRatio = maxWidth / maxHeight;

  let newWidth, newHeight;

  // Scale down canvas, maintaining aspect ratio
  if (aspectRatio > maxAspectRatio) {
    // If canvas is wider than maxWidth, fit within maxWidth
    newWidth = Math.min(originalCanvas.width, maxWidth);
    newHeight = Math.round(newWidth / aspectRatio);
  } else {
    // Else if canvas is taller than maxHeight, fit within maxHeight
    newHeight = Math.min(originalCanvas.height, maxHeight);
    newWidth = Math.round(newHeight * aspectRatio);
  }

  // Draw the original image onto the smaller canvas
  const smallCanvas = document.createElement("canvas");
  smallCanvas.width = newWidth;
  smallCanvas.height = newHeight;

  const smallCtx = smallCanvas.getContext("2d");
  smallCtx.drawImage(originalCanvas, 0, 0, newWidth, newHeight);

  return {
    downsizedData: smallCtx.getImageData(0, 0, newWidth, newHeight).data,
    newWidth,
    newHeight,
    smallCanvas,
  };
}

export default downsizeCanvasData;
