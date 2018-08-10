'use strict';

(function () {
  /* Обработка полученных данных */
  var loadHandler = function (block, node, data) {
    var options = Object.keys(data[0]);
    var prefix = '.' + block + '__';
    var counter;

    var tabsContainer = node.querySelector(prefix + 'tabs');
    var tabs = tabsContainer.querySelectorAll(prefix + 'tab');
    var tabsResult = document.createDocumentFragment();
    var tabsCount = tabs.length;

    var pinsContainer = node.querySelector('.content-tab__pins');
    var pinsBlocks = pinsContainer.querySelectorAll('.content-tab__pins-item');
    var pinsResult = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      var newTab = tabs[0].cloneNode(true);
      newTab.classList.remove(block + '__tab--current');
      newTab.classList.add('hidden');
      tabsCount++;
      counter = tabsCount.toString();

      for (var j = 0; j < options.length; j++) {
        var option = options[j];
        var content = data[i][option];

        /* Тестовый йункционал */
        if (option === 'header') {
          content += ' ' + counter;
        }

        newTab.querySelector('.content__' + option).textContent = content;
      }

      tabsResult.appendChild(newTab);

      var newPinBlock = pinsBlocks[0].cloneNode(true);
      var newPinBtn = newPinBlock.querySelector(prefix + 'pin');
      newPinBtn.classList.remove(block + '__pin--active');
      newPinBtn.querySelector('span').textContent = 'Материал ' + counter;
      pinsResult.appendChild(newPinBlock);
    }

    tabsContainer.appendChild(tabsResult);
    pinsContainer.appendChild(pinsResult);
    window.manageSlider(block);
  };

  /* Вывод ошибок запроса */
  var errorHandler = function (error) {
    var errorNode = document.querySelector('.error');
    errorNode.querySelector('.error__message').textContent = error;
    errorNode.querySelector('.error__board').classList.add('error__board--mini');
    errorNode.classList.remove('hidden');
  };

  /* Получение данных с сервера */
  var getRemoteData = function (block, node, URL) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          loadHandler(block, node, xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 403:
          error = 'Доступ запрещён!';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;
        case 500:
          error = 'Ошибка сервера';
          break;
        default:
          error = 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        errorHandler(error);
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open('GET', URL);
    xhr.send(null);
  };

  /* Запуск получения данных */
  window.loadContent = function (block, URL) {
    var node = document.querySelector('.' + block);
    var addBtn = node.querySelector('.content__add');

    addBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      getRemoteData(block, node, URL);
    });
  };
})();
