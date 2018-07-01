(function () {
  var navMain = document.querySelector(".main-nav");
  var navToggle = document.querySelector(".main-nav__toggle");
  var overlay = document.querySelector(".overlay");
  var modal = document.querySelector(".modal");
  var modalBtns = document.querySelectorAll(".btn-modal");

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
  [].forEach.call(modalBtns, function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      modal.classList.add("modal--show");
      overlay.classList.add("overlay--show");
    });
  });

  // Закрытие по клику на оверлей
  overlay.addEventListener("click", function () {
    if (modal.classList.contains("modal--show")) {
      modal.classList.remove("modal--show");
    }

    if (overlay.classList.contains("overlay--show")) {
      overlay.classList.remove("overlay--show");
    }
  });

  // Закрытие по клавише ESC
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
    var map = document.querySelector(".contacts__map")
    var myPlacemark,
      myPin;

    function init() {
      map = new ymaps.Map(map, {
        center: [59.93864018, 30.32309218],
        zoom: 17
      });

      map.behaviors.disable("scrollZoom") // отключаем скроллинг карты с помощью колеса мыши

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // отключаем перетаскивание карты на мобильных устройствах
        map.behaviors.disable('drag');
      }

      map.controls
        .remove('geolocationControl')
        .remove('searchControl')
        .remove('trafficControl')
        .remove('typeSelector')
        .remove('rulerControl');

      myPin = new ymaps.GeoObjectCollection({}, {
        iconLayout: 'default#image',
        iconImageHref: 'assets/images/icons/icon-map-pin.svg',
        iconImageSize: [66, 101],
        iconImageOffset: [-40, -90]
      });

      myPlacemark = new ymaps.Placemark([59.93871720, 30.32316715], {

      });

      myPin.add(myPlacemark);
      map.geoObjects.add(myPin);
    }
  })();

})();
