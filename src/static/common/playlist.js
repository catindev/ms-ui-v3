
function createPlaylist(calls) {

  function call({ user: { name = false }, isCallback, date, record }) {
    const type = isCallback === true ? 'исходящий' : 'входящий'
    return `
        <div class="data" style="font-size: 14px">
            ${ 
              record? 
                `<a href="${ record }" class="jouele">${ type }</a>`
                : 
                'Без ответа, ' + type 
            } 
        </div> 
    `
  }

  return (calls.map(call)).join('')
}