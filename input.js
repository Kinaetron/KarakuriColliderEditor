function handleKeyPress(event) {

    switch(event.key) {

        case "ArrowUp":
            ZoomIn();
            break;
        
        case "ArrowDown":
            ZoomOut();
            break;

        case "ArrowLeft":
            window.karakuriAPI.decrementFrame();
            break;

        case "ArrowRight":
            window.karakuriAPI.incrementFrame();
            break;
        
        case "Delete":
            Delete();
            break;
        
        case "d":
            DefaultSize();
            break;

        default:
            return;
    }
}

function handleMouseWheel(event) {

    event.preventDefault();
    const direction = event.deltaY > 0 ? 'Down' : 'Up';

    switch(direction) {
        
        case 'Up':
            ZoomIn();
            break;
        
        case 'Down':
            ZoomOut();
            break;
        
        default:
            return;
    }
}


window.addEventListener('wheel', handleMouseWheel, { passive: false });
window.addEventListener('keyup', handleKeyPress, true);