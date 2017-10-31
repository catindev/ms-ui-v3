function requestNextStep({ id }) {
    return fetch(`${ Config.API_HOST }/customers/${ id }/step.down?token=${ getCookie('msid') }`, {
            method: "put",
            headers: { "Content-type": "application/json" }
        })
        .then(response => response.json())
        .then(checkResponse)
        .then(console.log)
        .catch(error => console.error('Error:', error.message));
}


function registerFunnelButtons() {
    var funnelButtons = document.querySelectorAll('.funnelDownButton');


    for (var i = 0; i < funnelButtons.length; i++) {
        funnelButtons[i].onclick = function() {

            const nextID = this.getAttribute('to-step-id');
            const nextStep = this.getAttribute('to-step-id') === "false" ?
                false : document.getElementById(this.getAttribute('to-step-id'));
            if (nextStep === false) return;

            const nextStepID = nextStep.getAttribute('next-step-id');
            this.setAttribute('to-step-id', nextStepID);
            const item = document.getElementById(this.getAttribute('item-id'));
            item.classList.add('animateFunnelDown');

            const removeItem = () => {
                item.style.display = 'none';
                nextStep.insertBefore(item, nextStep.firstChild);
                item.classList.remove('animateFunnelDown');
                if (nextStepID === 'false') {
                    item.children[2].classList.remove('funnelDownButton');
                    item.children[2].classList.add('dealButton');
                    item.children[2].setAttribute('href', '/customers/' + this.getAttribute('item-id') + '/deal');
                }

                const nextStepEmpty = document.querySelectorAll(`#${nextID} .emptyList`)[0]
                nextStepEmpty.style.display = 'none';

                console.log({ id: this.getAttribute('item-id'), toStep: nextID })
                requestNextStep({ id: this.getAttribute('item-id'), toStep: nextID })
                  .then( () => item.style.display = 'block' )
            };

            document.body.addEventListener('animationend', removeItem);
            document.body.addEventListener('webkitAnimationEnd', removeItem);
        };
    }
}