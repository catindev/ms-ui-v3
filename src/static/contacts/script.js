(function () {

    const CUSTOMERID = location.pathname.split('/')[2];
    var contactsList = document.getElementById('contactsList');

    function setHTML({ _id, name }) {
        return `
            <h1 class="pageTitle">
                <a onclick="window.history.go(-1); return false;" class="backButton"></a>
                ${name}
            </h1>
            <h2 class="pageSubTitle">Контакты</h2>
            <div id="ContactsListWidget" 
                data-customer="${_id}" 
                data-msid="${getCookie('msid')}"></div>  
        `
    }

    fetch(`${Config.API_HOST}/customers/${CUSTOMERID}?token=${getCookie('msid')}`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ customer }) => {

            contactsList.classList.remove('preloader');
            // contactsList.classList.add('list__content');

            contactsList.innerHTML = setHTML(customer)

            loadScript('/static/common/contactsWidget/script.js')
        })
        .catch(error => console.error('Error:', error.message));
})();