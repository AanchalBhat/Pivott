var swiper = new swiper(".ps-testmonialSwiper", {
    slidesPerView: 3.5,
    spaceBetween: 24,
    // loop: true,
    autoplay: true,
    speed: 500,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {

        0: {
          slidesPerView: 1,
        },
        558: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3.5,
          spaceBetween: 24,
        },
    },
});


