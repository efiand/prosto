'use strict';

(function () {
  /* Начальные операции */

  /* Открытие скрытых элементов */
  var hiddenElements = document.querySelectorAll('.hidden');
  for (var i = 0; i < hiddenElements.length; i++) {
    hiddenElements[i].classList.remove('hidden');
  }

  /* Предотвращение клика для ссылок-заглушек */
  var stubLinks = document.querySelectorAll('[href="#"]');
  for (i = 0; i < stubLinks.length; i++) {
    stubLinks[i].addEventListener('click', function (evt) {
      evt.preventDefault();
    });
  }
})();
