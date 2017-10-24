var Config = {
  API_HOST: 'http://papi.mindsales-crm.com'
  // API_HOST: 'http://localhost:5002'
};

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function checkResponse( response ) {
  console.log(response)
  if (response.status === 403) {
    document.cookie = 'msid=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    window.location.reload()
    return false
  }
  if (response.status !== 200) throw Error(response.message)
  return response
}