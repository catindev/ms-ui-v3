(function() {

    function leadHTML({ _id, name, calls: { missed, success } }) {
        const calls = missed > 0 ?
            `<span class="missed">${ missed  } пропущенных</span>`
            :
            `<span class="success">${ success } звонков</span>`

        return `
          <div class="row lead">
              <div class="col callbackButton"></div>
              <div class="col">
                  <a class="name" href="/customer/${ _id }/edit">${ name }</a>
                  <div class="row info">${ calls }</div>
              </div>
              <a href="/new/${ _id }" class="col saveButton"></a>
          </div>   
        `
    }

    fetch(Config.API_HOST + "/customers/leads?token=" + getCookie('msid'))
        .then(response => response.json())
        .then(response => {
            if (response.status !== 200) throw Error(response.message);
            return response;
        })
        .then(({ items }) => {
            leadsList.classList.remove('preloader');
            leadsList.classList.add('list__content');
            leadsList.innerHTML = items.map(leadHTML).join('')
        })
        .catch(error => {
            console.error('Error:',error.message)
            alert(error.message)
        });    


})();