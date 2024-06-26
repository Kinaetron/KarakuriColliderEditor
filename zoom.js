
function ZoomOut()
{
    if(currentZoom <= minZoom) {
        currentZoom = minZoom;
    }
    else {
        currentZoom = currentZoom - 0.25;
        Zoom();
        resizeRectangles();
    }
}

function ZoomIn() 
{
    if(currentZoom >= maxZoom) {
        currentZoom = maxZoom;
    }
    else {
        currentZoom = currentZoom + 0.25;
        Zoom();
        resizeRectangles();
    }
}

function DefaultSize()
{
    if(currentZoom === 1) {
        return;
    }
    else {
        currentZoom = 1;
        Zoom();
        resizeRectangles();
    }
}

function Zoom()
{
    xPositionImage = (frameCanvas.width / 2) - (width * currentZoom / 2);
    yPositionImage = (frameCanvas.height / 2) - (height * currentZoom / 2);

    frameContext.imageSmoothingEnabled = false;

    frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height);

    const img = new Image();
    img.src = sourceImage;

    const x = (frameCanvas.width - width * currentZoom) / 2;
    const y = (frameCanvas.height - height * currentZoom) / 2;
    frameContext.drawImage(img, x, y, width * currentZoom, height * currentZoom);
}