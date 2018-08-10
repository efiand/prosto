'use strict';

(function () {
  var BREAKPOINT_TABLET = 780;

  /* Показ и скрытие попапов */
  window.doPopup = function (block) {
    var prefix = '.' + block + '__';
    var popup = document.querySelector('.' + block);
    var popupOpener = document.querySelector('.' + block + '-opener');
    var popupCloser = popup.querySelector(prefix + 'closer');
    var popupBoard = popup.querySelector(prefix + 'board');
    if (block !== 'menu') {
      var menu = document.querySelector('.menu');
    }

    popup.classList.add(block + '--interactive');
    popup.classList.add('hidden');
    popupBoard.classList.add(block + '__board--interactive');

    if (popupOpener) {
      popupOpener.addEventListener('click', function () {
        popup.classList.remove('hidden');
        if (menu && document.body.clientWidth < BREAKPOINT_TABLET) {
          menu.classList.add('hidden');
        }
        if (popupBoard.clientHeight < popup.clientHeight) {
          popupBoard.classList.add(block + '__board--mini');
        }
        document.body.classList.add('cropped');
      });
    }

    popupCloser.addEventListener('click', function () {
      popupBoard.classList.remove(block + '__board--mini');
      popup.classList.add('hidden');
      document.body.classList.remove('cropped');
    });
  };
})();
