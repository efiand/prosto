'use strict';

(function () {
  /* Заключительные операции */
  window.openChildMenus('nav__main');

  window.doPopup('menu');
  window.doPopup('login-popup');
  window.doPopup('feedback-popup');
  window.doPopup('error');

  window.manageSlider('slider');
  window.manageSlider('offers');
  window.manageSlider('news');
  window.manageSlider('publications');
  window.manageSlider('content');
  window.manageSlider('login');
  window.manageSlider('feedback');
  window.loadContent('news', 'js/news.json');
  window.loadContent('publications', 'js/publications.json');
})();
