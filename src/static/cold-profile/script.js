(function () {

    function template({ _id, name, info, trunk, user, phones, calls }) {
        const goodCalls = calls && calls.length > 0 ?
            calls.reduce((sum, call) => call.record ? sum + 1 : sum, 0) : 0;

        const mobileEditBtn = calls => {
            if (calls > 0) return `<a class="optionsButton" href="/leads/cold/${_id}/edit">Заполнить профиль 📝</a>`
            return ''
        }

        const noEditWarning = calls => calls === 0 ?
            `<div class="card">  
                <div class="data" style="background:#FCF3AF">
                Чтобы заполнить профиль и взять лида в работу нужно дозвониться до него хотя бы один раз
                </div>    
            </div>`: ''


        return `
            <h1 class="mobilePadding">
                <a href="/leads/cold" class="backButton"></a>
                ${ name}
            </h1>
            <h2 class="mobilePadding">${phones[0]}</h2>                

            ${noEditWarning(goodCalls)}

            <div class="optionsPanel onlyMobile">
                ${mobileEditBtn(goodCalls)}
                <a class="optionsButton" href="/leads/cold/${ _id}/reject">
                    Оформить отказ 🚯
                </a>
            </div>           

            <div class="sidebar onlyDesktop">
                <a class="sidebar__link sidebar__link--active">Профиль 🗿</a>
                <div class="sidebar__divider"></div>
                ${goodCalls > 0 ? `<a class="sidebar__link" href="/leads/cold/${_id}/edit">Заполнить профиль 📝</a>` : ''}
                <a class="sidebar__link" href="/leads/cold/${ _id}/reject">
                    Оформить отказ 🚯
                </a>
            </div>            
        `
    }

    fetch(`${Config.API_HOST}/customers/${location.pathname.split('/')[3]}?token=${getCookie('msid')}`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ customer }) => {
            Profile.classList.remove('preloader');
            Profile.innerHTML = template(customer) + createPlaylist(customer.calls, 'Вы ещё не звонили этому клиенту ')
            playerInit();
        })
        .catch(error => console.error('Error:', error.message));
})();