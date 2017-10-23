function registerCallbacks() {
    const callButtons = document.getElementsByClassName('callbackButton');
    
    const callHandler = function() {
        console.log('wwop')
        const attribute = this.getAttribute("name");
        callbackLayout.style.display = 'block';
    } 

    for (var i = 0; i < callButtons.length; i++) {
        callButtons[i].addEventListener('click', callHandler, false)
    }       

}