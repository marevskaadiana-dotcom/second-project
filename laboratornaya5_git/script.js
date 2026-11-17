const carousel = document.getElementById('carousel');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pauseBtn = document.getElementById('pauseBtn');
const liveRegion = document.getElementById('liveRegion');

let currentIndex = 0;
let autoPlayInterval = null;
let autoPlayTimeout = null; // НОВАЯ ПЕРЕМЕННАЯ: для хранения таймера перезапуска
let isPlaying = true;

// Функция переключения слайда
function showSlide(index) {
    slides.forEach(slide => {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
    });

    slides[index].classList.add('active');
    slides[index].setAttribute('aria-hidden', 'false');
    liveRegion.textContent = `Слайд ${index + 1} из ${slides.length}`;
}

// Следующий слайд
function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

// Предыдущий слайд
function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
}

// Запуск автопрокрутки
function startAutoPlay() {
    // Если уже играет или стоит на паузе — ничего не делаем
    if (isPlaying && !autoPlayInterval) {
        autoPlayInterval = setInterval(nextSlide, 3000);
    }
}

// Остановка автопрокрутки
function stopAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
}

// Слушатели событий

// Кнопки переключения
nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

// Кнопка Пауза/Плей
pauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        // СТАВИМ ПАУЗУ
        stopAutoPlay();
        clearTimeout(autoPlayTimeout); // Очищаем отложенный запуск, если он был
        pauseBtn.textContent = 'Играть';
        pauseBtn.setAttribute('aria-label', 'Возобновить автопрокрутку');
        isPlaying = false;
    } else {
        // ВОЗОБНОВЛЯЕМ
        isPlaying = true;
        pauseBtn.textContent = 'Пауза';
        pauseBtn.setAttribute('aria-label', 'Приостановить автопрокрутку');
        startAutoPlay();
    }
});

// Управление с клавиатуры (Стрелки)
carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoPlay();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoPlay();
    }
});

// АВТОПАУЗА ПРИ ФОКУСЕ
carousel.addEventListener('focusin', () => {
    stopAutoPlay(); 
});

carousel.addEventListener('focusout', (e) => {
    // Возобновляем, только если фокус ушел за пределы карусели И не нажата пауза
    if (!carousel.contains(e.relatedTarget) && isPlaying) {
        startAutoPlay();
    }
});

// Сброс таймера при ручном переключении
function resetAutoPlay() {
    stopAutoPlay();
    clearTimeout(autoPlayTimeout); // Очищаем предыдущий таймер ожидания
    
    // Ставим новый таймер на возобновление, только если пользователь не нажал "Паузу"
    if (isPlaying) {
        autoPlayTimeout = setTimeout(startAutoPlay, 5000); 
    }
}

// Инициализация
showSlide(currentIndex);
startAutoPlay();