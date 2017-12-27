function requestNextStep({ id }) {
    return fetch(`${Config.API_HOST}/customers/${id}/step.down?token=${getCookie('msid')}`, {
        method: "put",
        headers: { "Content-type": "application/json" }
    })
        .then(response => response.json())
        .then(checkResponse)
        .then(console.log)
        .catch(error => console.error('Error:', error.message));
}

function processCustomer(element) {

    const nextID = element.getAttribute('to-step-id');
    const nextStep = element.getAttribute('to-step-id') === "false" ?
        false : document.getElementById(element.getAttribute('to-step-id'));

    if (nextStep === false) return;

    const nextStepID = nextStep.getAttribute('next-step-id');
    element.setAttribute('to-step-id', nextStepID);
    const item = document.getElementById(element.getAttribute('item-id'));
    item.classList.add('animateFunnelDown');

    const removeItem = () => {
        document.body.removeEventListener('webkitAnimationEnd', removeItem, false);
        document.body.removeEventListener('animationend', removeItem, false);

        item.style.display = 'none';
        nextStep.insertBefore(item, nextStep.firstChild);
        item.classList.remove('animateFunnelDown');
        if (nextStepID === 'false') {
            item.children[2].classList.remove('funnelDownButton');
            item.children[2].classList.add('dealButton');
            item.children[2].setAttribute('href', '/customers/' + element.getAttribute('item-id') + '/deal');
        }

        const nextStepEmpty = document.querySelectorAll(`#${nextID} .emptyList`)
        nextStepEmpty && (nextStepEmpty[0].style.display = 'none');

        console.log({ id: element.getAttribute('item-id'), toStep: nextID })
        item.style.display = 'block'
        requestNextStep({ id: element.getAttribute('item-id'), toStep: nextID })
            .then(() => console.log('request for', element.getAttribute('item-id'), 'ok'))
    };

    document.body.addEventListener('animationend', removeItem);
    document.body.addEventListener('webkitAnimationEnd', removeItem);
}