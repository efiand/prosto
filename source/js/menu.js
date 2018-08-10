'use strict';

(function () {
  /* Показ и скрытие разделов меню */
  window.openChildMenus = function (block, initActiveNum) {
    var prefix = '.' + block + '-';
    var menu = document.querySelector('.' + block);
    var items = menu.querySelectorAll(prefix + 'item');
    var submenus = menu.querySelectorAll(prefix + 'sub-menu');
    var links = menu.querySelectorAll(prefix + 'link');
    var togglers = menu.querySelectorAll(prefix + 'toggler');

    var initActive = function (i) {
      togglers[i].classList.add(block + '-toggler--active');
      items[i].classList.add(block + '-item--active');
      links[i].classList.add(block + '-link--active');
      submenus[i].classList.remove('hidden');
    };

    var togglerHandler = function (i) {
      togglers[i].addEventListener('click', function () {
        if (submenus[i].classList.contains('hidden')) {
          initActive(i);
        } else {
          togglers[i].classList.remove(block + '-toggler--active');
          items[i].classList.remove(block + '-item--active');
          links[i].classList.remove(block + '-link--active');
          submenus[i].classList.add('hidden');
        }
      });
    };

    for (var i = 0; i < submenus.length; i++) {
      submenus[i].classList.add('hidden');
    }

    initActive(initActiveNum || 0);

    for (i = 0; i < togglers.length; i++) {
      togglerHandler(i);
    }
  };
})();
