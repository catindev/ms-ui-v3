(function() {

  const inputs = document.getElementsByClassName('js-input');
  for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('focus', function() {
          bottomTabs.style.display = 'none'
      }, false);
      inputs[i].addEventListener('blur', function() {
          bottomTabs.style.display = 'block'
      }, false);
  }

})();  