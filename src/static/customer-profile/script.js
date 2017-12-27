(function () {

    function template(customer) {
        const { _id, name, trunk, user, phones, params, info } = customer;

        const notes = customer && customer.notes ? `
          <div class="label">Заметки</div>
          <div class="data">${customer.notes.replace(/\n/g, '<br>')}</div>
        ` : '';

        const taskHTML = customer && customer.task ? `
            <div class="label">Задача</div>
            <div class="data">
                <p style="font-size: 16px; font-weight: 500; padding-bottom:5px;">
                    ${customer.task.what}
                </p>
                <p style="font-size: 13px; color: #999898;">
                    ${customer.task.displayWhen}
                </p>
            </div>        
        ` : '';


        const getParamValue = value => typeof value === 'string' ?
            value : value.join(', ');

        function customs(params) {
            return (params.map(({ name, id }) => {
                if (typeof customer[id] === 'object' &&
                    customer[id].length === 0) return '';
                return customer[id] ?
                    `<div class="label">${name}</div>
                    <div class="data">${getParamValue(customer[id])}</div>`
                    :
                    ''
            })).join('')
        }

        return `
            <h1 class="mobilePadding">
            <a href="/customers" class="backButton changelog"></a>
                ${ name}
            </h1>
            <h2 class="mobilePadding">
                ${phones.join(', ')}
            </h2>

            <div class="card">  
                <div class="label">Описание</div>
                <div class="data">${info}</div>    
                          
                ${taskHTML}
            </div>

            <div class="optionsPanel onlyMobile">
                <a class="optionsButton" href="/customers/${ _id}/set.task">
                    Поставить задачу ✅
                </a>             
                <a class="optionsButton" href="/customers/${ _id}/profile">
                    Открыть профиль 📋
                </a>                 
                <a class="optionsButton" href="/customers/${ _id}/reject">
                    Оформить отказ 🚯
                </a>               
            </div> 

            <div class="sidebar onlyDesktop">
                <a class="sidebar__link sidebar__link--active" href="/customers/${ _id}">
                    Карточка 🗿
                </a>
                <div class="sidebar__divider"></div>
                <a class="sidebar__link" href="/customers/${ _id}/profile">
                    Профиль 📋
                </a>            
                <a class="sidebar__link" href="/customers/${ _id}/reject">
                    Оформить отказ 🚯
                </a>
                <div class="sidebar__divider"></div>
                <a class="sidebar__link" href="/customers/${ _id}/set.task">
                    Поставить задачу ✅
                </a>                  
            </div>                      
        `
    }

    fetch(`${Config.API_HOST}/customers/${location.pathname.split('/')[2]}?token=${getCookie('msid')}&params=1`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ customer }) => {
            Profile.classList.remove('preloader');
            Profile.innerHTML = template(customer) + createPlaylist(customer.calls)
            playerInit();
        })
        .catch(error => console.error('Error:', error.message));
})();