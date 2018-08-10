'use strict';

(function () {
  /* Устранение «дребезга» */
  var TIMEOUT = 100;
  var lastTimeout;
  var debounce = function (cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, TIMEOUT);
  };

  /* Табы и слайдеры */
  window.manageSlider = function (block) {
    var slider = document.querySelector('.' + block);
    slider.classList.add(block + '--interactive');
    var prefix = '.' + block + '__';
    var prevBtn = slider.querySelector(prefix + 'btn--prev');
    var nextBtn = slider.querySelector(prefix + 'btn--next');
    var pins = slider.querySelectorAll(prefix + 'pin');
    var slidesParent = slider.querySelector(prefix + 'tabs');
    var slides = slidesParent.querySelectorAll(prefix + 'tab');
    var currentClass = block + '__tab--current';
    var activeClass = block + '__pin--active';
    var currentSlide = 0;
    var i;

    var makePinActive = function (pin) {
      pin.classList.add(activeClass);
      pin.setAttribute('disabled', '');
    };
    var goToSlide = function (n) {
      var transitionEndHandler = function () {
        if (!slides[currentSlide].classList.contains(currentClass)) {
          slides[currentSlide].classList.add('hidden');

          currentSlide = (n + slides.length) % slides.length;
          slides[currentSlide].classList.remove('hidden');

          if (pins) {
            for (i = 0; i < pins.length; i++) {
              pins[i].classList.remove(activeClass);
              pins[i].removeAttribute('disabled');
            }
            makePinActive(pins[currentSlide]);
          }

          debounce(function () {
            slides[currentSlide].classList.add(currentClass);
          });
        }
        slides[currentSlide].removeEventListener('transitionend', transitionEndHandler);
      };

      slides[currentSlide].classList.remove(currentClass);
      slides[currentSlide].addEventListener('transitionend', transitionEndHandler);
    };

    if (pins) {
      var addPinListener = function (j) {
        pins[j].addEventListener('click', function () {
          goToSlide(j);
        });
      };

      for (i = 0; i < pins.length; i++) {
        pins[i].removeAttribute('disabled');
        if (slides[i].classList.contains(currentClass)) {
          makePinActive(pins[i]);
        }
        addPinListener(i);
      }
    }

    for (i = 0; i < slides.length; i++) {
      slides[i].classList.add('hidden');
      slides[i].classList.add(block + '__tab--interactive');
      if (slides[i].classList.contains(currentClass)) {
        currentSlide = i;
        slides[i].classList.remove('hidden');
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        debounce(function () {
          goToSlide(currentSlide - 1);
        });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        debounce(function () {
          goToSlide(currentSlide + 1);
        });
      });
    }
  };
})();
