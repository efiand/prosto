'use strict';

(function () {
  /* Стилизация селектов */
  var customizeSelect = function (id) {
    var select = document.getElementById(id);
    select.setAttribute('readonly', '');

    var options = document.querySelectorAll('#'
      + select.getAttribute('list') + ' option');

    var list = document.createElement('ul');
    list.classList.add('post__opt-list');
    list.classList.add('hidden');

    for (var i = 0; i < options.length; i++) {
      var item = document.createElement('li');
      item.classList.add('post__opt-item');
      item.textContent = options[i].value;
      list.appendChild(item);
    }
    select.insertAdjacentElement('afterEnd', list);
    var items = document.querySelectorAll('#' + id + ' ~ ul li');

    /* Переполненный селект */
    var listSize = select.getAttribute('data-size') || options.length;
    var isOverflowed = false;
    if (options.length > listSize) {
      isOverflowed = true;
      list.classList.add('post__opt-list--overflowed');
    }

    var currentIndex = -1;

    var selectBlurHandler = function () {
      select.parentNode.classList.remove('post__group--interactive');
      list.classList.add('hidden');
    };

    var setActiveOption = function (isSetValue) {
      for (i = 0; i < items.length; i++) {
        items[i].classList.remove('post__opt-item--selected');
      }
      if (~currentIndex) {
        items[currentIndex].classList.add('post__opt-item--selected');
        if (isSetValue) {
          select.value = items[currentIndex].textContent;
        }
      }
    };

    var selectKeydownHandler = function (evt) {
      if (evt.keyCode === 40) {
        if (currentIndex < options.length - 1) {
          currentIndex++;
        }
      } else if (evt.keyCode === 38) {
        if (currentIndex) {
          currentIndex--;
        }
      } else if (evt.keyCode === 13) {
        evt.preventDefault();
        selectBlurHandler();
      }
      setActiveOption(true);
      if (isOverflowed) {
        list.scrollTop = items[0].offsetHeight * currentIndex;
      }
    };

    var itemsListener = function (ind) {
      if (select.value === items[ind].textContent) {
        currentIndex = ind;
      }
      items[ind].addEventListener('mouseover', function () {
        currentIndex = ind;
        setActiveOption(false);
      });
      items[ind].addEventListener('mousedown', function () {
        currentIndex = ind;
        setActiveOption(true);
      });
    };
    for (i = 0; i < items.length; i++) {
      itemsListener(i);
    }

    select.addEventListener('focus', function () {
      select.parentNode.classList.add('post__group--interactive');

      for (i = 0; i < items.length; i++) {
        if (select.value === items[i].textContent) {
          currentIndex = i;
        }
      }
      if (~currentIndex) {
        items[currentIndex].classList.add('post__opt-item--selected');
      }
      list.classList.remove('hidden');
    });
    select.addEventListener('keydown', selectKeydownHandler);
    select.addEventListener('blur', selectBlurHandler);
  };

  customizeSelect('request-type');
  customizeSelect('request-theme');
})();
