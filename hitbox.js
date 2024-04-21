
// get references to the canvas and context
var canvas = document.getElementById("canvas");
var overlay = document.getElementById("overlay");
var ctx = canvas.getContext("2d");
var ctxo = overlay.getContext("2d");

var xTextBox = document.getElementById("x");
var yTextBox = document.getElementById("y");
var widthTextBox = document.getElementById("width");
var heightTextBox = document.getElementById("height");

const hitboxType = "hitbox";
const hurtboxType = "hurtbox";
const colliderType = "colliderbox";

const hitboxColour = "rgb(0 0 255 / 40%)";
const hurtboxColour = "rgb(255 0 0 / 40%)";
const colliderboxColour  = "rgb(0 255 0 / 40%)";
const selectedboxColour = "rgb(255 255 0 / 40%)";

// style the context
ctx.fillStyle = hitboxColour;
ctxo.fillStyle = hitboxColour;

let currentType = hitboxType;
let currentColour = hitboxColour;

function pointBoxCollide(x, y, box) {
    const left = box.x * currentZoom + xPositionImage;
    const right = (left + (box.width * currentZoom));
    const top = box.y * currentZoom + yPositionImage;
    const bottom = (top + (box.height * currentZoom));

    return x >= left &&
           x <= right &&
           y >= top &&
           y <= bottom;
}

class box {
    constructor(x, y, width, height, boxType) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.boxType = boxType;
    }
}

// calculate where the canvas is on the window
function calculateCanvasOffset() {
    var canvasOffset = canvas.getBoundingClientRect();
    offsetX = canvasOffset.left;
    offsetY = canvasOffset.top;
}

// initial calculation
calculateCanvasOffset();

let isDrawing = true;
let isSelecting = false;

// this flag is true when the user is dragging the mouse
let isDown = false;

// these vars will hold the starting mouse position
let startX;
let startY;

let prevStartX = 0;
let prevStartY = 0;

let prevWidth = 0;
let prevHeight = 0;

let selectedBoxIndex = -1;

let movingBox = false;
let movingBoxPositionX = 0;
let movingBoxPositionY = 0;

function resizeRectangles() {

    if(isDrawing) {
        reDrawBoxes(true);
    }
    else if(isSelecting) {
        reDrawBoxes(false);
        reDrawSelectedBox();
    }
}

function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    // save the starting x/y of the rectangle
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);

    // set a flag indicating the drag has begun
    isDown = true;
}

function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();

    isDown = false;

    if(isDrawing) {

        if(frameBoxes[frameIndex].length == 0) {
            frameBoxes[frameIndex].push({ boxCount: 0 });
        }

        frameBoxes[frameIndex].push(
            new box(
                Math.round((prevStartX - xPositionImage) / currentZoom), 
                Math.round((prevStartY - yPositionImage) / currentZoom),
                Math.round(prevWidth / currentZoom),
                Math.round(prevHeight / currentZoom),
                currentType));
        
        frameBoxes[frameIndex][0].boxCount = frameBoxes[frameIndex][0].boxCount + 1;

        ctxo.fillRect(prevStartX, prevStartY, prevWidth, prevHeight);
    }
    else if(isSelecting) {

        if(!frameBoxes) {
            return;
        }

        if(movingBox) {
            movingBox = false;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctxo.clearRect(0, 0, canvas.width, canvas.height);
            
            frameBoxes[frameIndex][selectedBoxIndex].x = Math.round((movingBoxPositionX - xPositionImage) / currentZoom);
            frameBoxes[frameIndex][selectedBoxIndex].y = Math.round((movingBoxPositionY - yPositionImage) / currentZoom);

            reDrawBoxes(true);
            return;
        }

        for(var i = 1; i < frameBoxes[frameIndex].length; i++) 
        {
            if(pointBoxCollide(
                startX, 
                startY, 
                frameBoxes[frameIndex][i])) {

                selectedBoxIndex = i;
                ctx.clearRect(0, 0, overlay.width, overlay.height);
                ctxo.clearRect(0, 0, overlay.width, overlay.height);

                for(var j = 0; j < frameBoxes[frameIndex].length; j++) {

                    if(selectedBoxIndex == j){
                        continue;
                    }

                    currentColour = ctxo.fillStyle;
                    const boxType = frameBoxes[frameIndex][j].boxType;

                    if(boxType === hitboxType) {
                        ctxo.fillStyle = hitboxColour;
                    }
                    else if(boxType === hurtboxType) {
                        ctxo.fillStyle = hurtboxColour;
                    }
                    else if(boxType === colliderType) {
                        ctxo.fillStyle = colliderboxColour;
                    }

                    ctxo.fillRect(
                        frameBoxes[frameIndex][j].x * currentZoom + xPositionImage, 
                        frameBoxes[frameIndex][j].y * currentZoom + yPositionImage, 
                        frameBoxes[frameIndex][j].width * currentZoom, 
                        frameBoxes[frameIndex][j].height * currentZoom);

                    ctxo.fillStyle = currentColour;
                }
                
                reDrawSelectedBox();

                xTextBox.value = Math.round(frameBoxes[frameIndex][selectedBoxIndex].x * currentZoom + xPositionImage);
                yTextBox.value = Math.round(frameBoxes[frameIndex][selectedBoxIndex].y * currentZoom + yPositionImage);
                widthTextBox.value = Math.round(frameBoxes[frameIndex][selectedBoxIndex].width * currentZoom);
                heightTextBox.value = Math.round(frameBoxes[frameIndex][selectedBoxIndex].height * currentZoom);
            }
        }
    }
}

function handleMouseOut(e) {

    if(isDrawing) {
        e.preventDefault();
        e.stopPropagation();

        // the drag is over, clear the dragging flag
        isDown = false;
    }
}

function handleMouseMove(e) {

    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(isDrawing) {
        // if we're not dragging, just return
        if (!isDown) {
            return;
        }
    
        // calculate the rectangle width/height based
        // on starting vs current mouse position
        var width = mouseX - startX;
        var height = mouseY - startY;

        // draw a new rect from the start position 
        // to the current mouse position
        ctx.fillRect(startX, startY, width, height);
    
        prevWidth = width;
        prevHeight = height;
    }
    else if(isSelecting) {

        if(selectedBoxIndex == -1 || !isDown) {
            return;
        }

        if(pointBoxCollide(
            startX, 
            startY, 
            frameBoxes[frameIndex][selectedBoxIndex])) {

            movingBox = true;

            ctxo.clearRect(0, 0, canvas.width, canvas.height);
            reDrawBoxes(false);

            var selectedPositionX = frameBoxes[frameIndex][selectedBoxIndex].x * currentZoom + xPositionImage;
            var selectedPositionY = frameBoxes[frameIndex][selectedBoxIndex].y * currentZoom + yPositionImage;
            
            movingBoxPositionX = mouseX + (selectedPositionX - startX);
            movingBoxPositionY = mouseY + (selectedPositionY - startY);

            ctx.fillStyle = selectedboxColour;
            ctx.fillRect(
                movingBoxPositionX, 
                movingBoxPositionY, 
                frameBoxes[frameIndex][selectedBoxIndex].width * currentZoom, 
                frameBoxes[frameIndex][selectedBoxIndex].height * currentZoom);
        }
    }

    prevStartX = startX;
    prevStartY = startY;
}

function boxModeSelection() {
    var selectedValue = document.getElementById("boxMode").value;

    if (selectedValue === "drawingMode") {
        isDrawing = true;
        isSelecting = false;
    
        selectedRectangleIndex = - 1;
    
        reDrawBoxes(true);
    
        xTextBox.value = "";
        yTextBox.value = "";
        widthTextBox.value = "";
        heightTextBox.value = "";
    }
    else if (selectedValue == "selectMode") {
        isSelecting = true;
        isDrawing = false;
    }
}

function boxTypeSelection() {
    var selectedValue = document.getElementById("boxType").value;

    if(selectedValue === "hitbox") {
        currentType = hitboxType;
        currentColour = hitboxColour;
        ctx.fillStyle = hitboxColour;
        ctxo.fillStyle = hitboxColour;
    }
    else if (selectedValue === "hurtbox") {
        currentType = hurtboxType;
        currentColour = hurtboxColour;
        ctx.fillStyle = hurtboxColour;
        ctxo.fillStyle = hurtboxColour;
    }
    else if (selectedValue === "colliderbox") {
        currentType = colliderType;
        currentColour = colliderboxColour;
        ctx.fillStyle = colliderboxColour;
        ctxo.fillStyle = colliderboxColour;
    }
}

function Delete() {
    if (isSelecting) {
        frameBoxes[frameIndex][0].boxCount = frameBoxes[frameIndex][0].boxCount - 1;
        frameBoxes[frameIndex].splice(selectedBoxIndex, 1);
        selectedBoxIndex = - 1;

        reDrawBoxes(true);

        xTextBox.value = "";
        yTextBox.value = "";
        widthTextBox.value = "";
        heightTextBox.value = "";
    }
}

function CopyToAllFrames() {

    if(selectedBoxIndex == -1) {
        return;
    }

    for(var i = 0; i < frameCount; i++) {

        var alreadyThere = false;

        for(var j = 1; j < frameBoxes[i].length; j++) {
            if(frameBoxes[i][j].x == frameBoxes[frameIndex][selectedBoxIndex].x &&
               frameBoxes[i][j].y == frameBoxes[frameIndex][selectedBoxIndex].y &&
               frameBoxes[i][j].width == frameBoxes[frameIndex][selectedBoxIndex].width && 
               frameBoxes[i][j].height == frameBoxes[frameIndex][selectedBoxIndex].height) {
                alreadyThere = true;
                continue;
               }
        }

        if(alreadyThere) {
            continue;
        }

        if(frameBoxes[i].length == 0) {
            frameBoxes[i].push({ boxCount: 0 });
        }

       frameBoxes[i].push(
        new box(
            frameBoxes[frameIndex][selectedBoxIndex].x, 
            frameBoxes[frameIndex][selectedBoxIndex].y,
            frameBoxes[frameIndex][selectedBoxIndex].width,
            frameBoxes[frameIndex][selectedBoxIndex].height,
            frameBoxes[frameIndex][selectedBoxIndex].boxType));
        
        frameBoxes[i][0].boxCount = frameBoxes[i][0].boxCount + 1;
    }

    reDrawBoxes(true);
}

// listen for mouse events
canvas.addEventListener("mousedown", function (e) {
    handleMouseDown(e);
});

canvas.addEventListener("mousemove", function (e) {
    handleMouseMove(e);
});

canvas.addEventListener("mouseup", function (e) {
    handleMouseUp(e);
});

canvas.addEventListener("mouseout", function (e) {
    handleMouseOut(e);
});

// listen for window resize events
window.addEventListener("resize", function () {
    // recalculate the canvas offset when the window is resized
    calculateCanvasOffset();
});

xTextBox.addEventListener("input", function() {
    frameBoxes[frameIndex][selectedBoxIndex].x = Math.round((xTextBox.value - xPositionImage) / currentZoom);

    reDrawBoxes(false);
    reDrawSelectedBox();
});

yTextBox.addEventListener("input", function() {
    frameBoxes[frameIndex][selectedBoxIndex].y = Math.round((yTextBox.value - yPositionImage) / currentZoom);

    reDrawBoxes(false);
    reDrawSelectedBox();
});

widthTextBox.addEventListener("input", function() {
    frameBoxes[frameIndex][selectedBoxIndex].width = Math.round(widthTextBox.value / currentZoom);

    reDrawBoxes(false);
    reDrawSelectedBox();
});

heightTextBox.addEventListener("input", function() {
    frameBoxes[frameIndex][selectedBoxIndex].height = Math.round(heightTextBox.value / currentZoom);

    reDrawBoxes(false);
    reDrawSelectedBox();
});

function resetSelected() {
    selectedBoxIndex = -1;
}

function reDrawBoxes(drawSelectedBox) {
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    ctxo.clearRect(0, 0, overlay.width, overlay.height);

    for(var i = 1; i < frameBoxes[frameIndex].length; i++) {

        if(drawSelectedBox == false && selectedBoxIndex == i) {
            continue;
        }

        if(frameBoxes[frameIndex][i].boxType === hitboxType) {
            ctx.fillStyle  = hitboxColour;
            ctxo.fillStyle = hitboxColour;
        }
        else if(frameBoxes[frameIndex][i].boxType === hurtboxType) {
            ctx.fillStyle  = hurtboxColour;
            ctxo.fillStyle = hurtboxColour;
        }
        else if(frameBoxes[frameIndex][i].boxType === colliderType) {
            ctx.fillStyle  = colliderboxColour;
            ctxo.fillStyle = colliderboxColour;
        }
        
        ctxo.fillRect(
            frameBoxes[frameIndex][i].x * currentZoom + xPositionImage, 
            frameBoxes[frameIndex][i].y * currentZoom + yPositionImage, 
            frameBoxes[frameIndex][i].width * currentZoom, 
            frameBoxes[frameIndex][i].height * currentZoom);
    }

    ctx.fillStyle  = currentColour;
    ctxo.fillStyle = currentColour;

}

function reDrawSelectedBox() {
    if(selectedBoxIndex == -1 || movingBox) {
        return;
    }

    currentColour = ctxo.fillStyle;
    ctxo.fillStyle = selectedboxColour;

    ctxo.fillRect(
        frameBoxes[frameIndex][selectedBoxIndex].x * currentZoom + xPositionImage, 
        frameBoxes[frameIndex][selectedBoxIndex].y * currentZoom + yPositionImage, 
        frameBoxes[frameIndex][selectedBoxIndex].width * currentZoom, 
        frameBoxes[frameIndex][selectedBoxIndex].height * currentZoom);
    
    ctxo.fillStyle = currentColour;
}