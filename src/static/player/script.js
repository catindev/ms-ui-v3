
function createPlaylist(calls) {

  function call({ user: { name = false }, isCallback, date, record }) {
    const type = isCallback === true?
      (record? 'outcoming' : 'outcoming-missed')
      :
      (record? 'incoming' : 'incoming-missed')
      ;

    return `
        <div class="track ${ type }">
            ${ 
              record? 
                `<a href="${ record }" class="jouele" data-hide-timeline-on-pause="true">
                  ${ date }
                </a>`
                : 
                date 
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