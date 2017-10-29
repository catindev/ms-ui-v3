
function createPlaylist(calls) {

  function call({ user: { name = false }, isCallback, date, record }) {
    const type = isCallback === true ? 'Исходящий ➡️' : 'Входящий ⬅️'
    return `
        <div class="track" style="font-size: 14px">
            ${ 
              record? 
                `<a href="${ record }" class="jouele" data-hide-timeline-on-pause="true">
                  ${ date }
                </a>`
                : 
                type + ', без ответа' 
            } 
        </div> 
    `
  }

  return `
    <div class="playListWithCalls" style="padding-top: .5rem">
      <h2>История звонков</h2>
      ${ (calls.map(call)).join('') }      
    </div>
  `

}