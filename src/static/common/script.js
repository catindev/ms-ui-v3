var Config = {
  // API_HOST: 'http://papi.mindsales-crm.com'
  API_HOST: 'http://localhost:5002'
};

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}