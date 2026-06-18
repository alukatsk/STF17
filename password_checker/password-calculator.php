<?php
/*
Template Name: Анализатор надежности пароля
*/
get_header();
?>

<main class="site-main password-analyzer-page">
    <section class="password-analyzer">
        <div class="password-analyzer__container">
            <h1 class="password-analyzer__title">Анализатор надежности пароля</h1>

            <p class="password-analyzer__notice">
                Пароль анализируется только в вашем браузере и не передается на сервер.
            </p>

            <div class="password-analyzer__form-group">
                <label for="password-analyzer-input">Введите пароль для проверки:</label>

                <input 
                    type="password" 
                    id="password-analyzer-input" 
                    class="password-analyzer__input" 
                    autocomplete="off"
                    spellcheck="false"
                >

                <div class="password-analyzer__show-password">
                    <input type="checkbox" id="password-analyzer-show-password">
                    <label for="password-analyzer-show-password">Показать пароль</label>
                </div>
            </div>

            <div class="password-analyzer__strength-meter">
                <div class="password-analyzer__strength-fill"></div>
            </div>

            <div class="password-analyzer__score">
                Оценка: <span id="password-analyzer-score">0</span>/100
            </div>

            <div class="password-analyzer__crack-time">
                Примерное время для взлома: 
                <span id="password-analyzer-crack-time">Мгновенно</span>
            </div>

            <button id="password-analyzer-check-button" class="password-analyzer__button">
                Проверить надежность
            </button>

            <div class="password-analyzer__feedback" id="password-analyzer-feedback">
                <h3>Информация о взломе:</h3>
                <p id="password-analyzer-strength-text"></p>

                <p>
                    Примерное время взлома при использовании оборудования: 
                    <strong>12 x RTX 4090 (2024)</strong>
                </p>

                <h3>Рекомендации:</h3>
                <ul id="password-analyzer-recommendations"></ul>
            </div>
        </div>
    </section>
</main>

<?php
get_footer();