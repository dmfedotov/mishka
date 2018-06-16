(function () {
  var navMain = document.querySelector(".main-nav");
  var navToggle = document.querySelector(".main-nav__toggle");
  var overlay = document.querySelector(".overlay");
  var modal = document.querySelector(".modal");
  var modalBtn = document.querySelector(".offer__button");

  // Мобильное меню
  navMain.classList.remove("main-nav--nojs");

  navToggle.addEventListener("click", function () {
    if (navMain.classList.contains("main-nav--closed")) {
      navMain.classList.remove("main-nav--closed");
      navMain.classList.add("main-nav--opened");
    } else {
      navMain.classList.add("main-nav--closed");
      navMain.classList.remove("main-nav--opened");
    }
  });


  // Модальное окно
  modalBtn.addEventListener("click", function (e) {
    e.preventDefault();

    modal.classList.add("modal--show");
    overlay.classList.add("overlay--show");
  });

  // Закрытие
  overlay.addEventListener("click", function () {
    if (modal.classList.contains("modal--show")) {
      modal.classList.remove("modal--show");
    }

    if (overlay.classList.contains("overlay--show")) {
      overlay.classList.remove("overlay--show");
    }
  });

  window.addEventListener("keydown", function (e) {
    if (e.keyCode === 27) {
      modal.classList.remove("modal--show");
      overlay.classList.remove("overlay--show");
    }
  })

  modal.addEventListener("click", function (e) {
    e.stopPropagation(); // для предотвращения закрытия модального окна при клике по нему. Источник: https://learn.javascript.ru/event-bubbling#прекращение-всплытия
  });


  // Интерактивная карта
  (function () {
    ymaps.ready(init);
    var map;

    function init () {
      map = new ymaps.Map("map", {
        center: [59.93864018, 30.32309218],
        zoom: 17
      });

      map.controls
        .remove('geolocationControl')
        .remove('searchControl')
        .remove('trafficControl')
        .remove('typeSelector')
        .remove('rulerControl');
    }
  })();

})();