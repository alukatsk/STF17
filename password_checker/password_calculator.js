document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password-analyzer-input');
    const showPasswordCheckbox = document.getElementById('password-analyzer-show-password');
    const checkButton = document.getElementById('password-analyzer-check-button');
    const strengthMeterFill = document.querySelector('.password-analyzer__strength-fill');
    const feedbackContainer = document.getElementById('password-analyzer-feedback');
    const strengthText = document.getElementById('password-analyzer-strength-text');
    const recommendationsList = document.getElementById('password-analyzer-recommendations');
    const numericalScore = document.getElementById('password-analyzer-score');
    const crackTimeDisplay = document.getElementById('password-analyzer-crack-time');

    if (!passwordInput || !showPasswordCheckbox || !checkButton) {
        return;
    }

    showPasswordCheckbox.addEventListener('change', function () {
        passwordInput.type = this.checked ? 'text' : 'password';
    });

    checkButton.addEventListener('click', function () {
        const password = passwordInput.value;
        const result = checkPasswordStrength(password);

        strengthMeterFill.style.width = result.percentScore + '%';
        strengthMeterFill.className = 'password-analyzer__strength-fill';
        strengthMeterFill.classList.add(result.strengthClass);

        strengthText.textContent = result.strengthText;
        numericalScore.textContent = result.percentScore;
        crackTimeDisplay.textContent = result.crackTime;

        recommendationsList.innerHTML = '';

        result.recommendations.forEach(function (rec) {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationsList.appendChild(li);
        });

        feedbackContainer.style.display = 'block';
    });

    function checkPasswordStrength(password) {
        if (!password) {
            return {
                score: 0,
                percentScore: 0,
                strengthClass: 'very-weak',
                strengthText: 'Пароль не введен',
                crackTime: 'Мгновенно',
                recommendations: ['Введите пароль для проверки']
            };
        }

        let score = 0;
        let recommendations = [];

        const hasLength = password.length >= 8;
        const hasUppercase = /[A-ZА-Я]/.test(password);
        const hasLowercase = /[a-zа-я]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        const hasRepeatingChars = /(.)\1{2,}/.test(password);
        const hasSequentialChars = checkForSequentialChars(password);
        const hasCommonPatterns = checkForCommonPatterns(password);

        if (hasLength) score += 1;
        if (hasUppercase) score += 1;
        if (hasLowercase) score += 1;
        if (hasNumbers) score += 1;
        if (hasSpecialChars) score += 1;

        if (password.length < 8) {
            recommendations.push('Увеличьте длину пароля до 8 или более символов');
        }

        if (!hasUppercase) {
            recommendations.push('Добавьте хотя бы одну заглавную букву');
        }

        if (!hasLowercase) {
            recommendations.push('Добавьте хотя бы одну строчную букву');
        }

        if (!hasNumbers) {
            recommendations.push('Добавьте хотя бы одну цифру');
        }

        if (!hasSpecialChars) {
            recommendations.push('Добавьте хотя бы один специальный символ (!, @, #, $ и т.д.)');
        }

        if (hasRepeatingChars) {
            score -= 1;
            recommendations.push('Избегайте повторяющихся символов, например: aaa, 111');
        }

        if (hasSequentialChars) {
            score -= 1;
            recommendations.push('Избегайте последовательных символов, например: abc, 123, qwerty');
        }

        if (hasCommonPatterns) {
            score -= 1;
            recommendations.push('Избегайте распространенных комбинаций, имен и шаблонов');
        }

        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;

        score = Math.max(0, score);
        score = Math.min(5, score);

        const percentScore = calculatePercentScore(
            password,
            hasRepeatingChars,
            hasSequentialChars,
            hasCommonPatterns
        );

        const crackTime = estimateCrackTime(password);

        let strengthClass = '';
        let strengthText = '';

        switch (score) {
            case 0:
            case 1:
                strengthClass = 'very-weak';
                strengthText = 'Очень слабый пароль';
                break;

            case 2:
                strengthClass = 'weak';
                strengthText = 'Слабый пароль';
                break;

            case 3:
                strengthClass = 'medium';
                strengthText = 'Средний пароль';
                break;

            case 4:
                strengthClass = 'strong';
                strengthText = 'Сильный пароль';
                break;

            case 5:
                strengthClass = 'very-strong';
                strengthText = 'Очень сильный пароль';

                if (recommendations.length === 0) {
                    recommendations.push('Отличный пароль! Он соответствует всем требованиям безопасности.');
                }

                break;
        }

        if (percentScore === 100) {
            recommendations = ['Превосходный пароль! Максимальный уровень защиты достигнут.'];
        } else if (crackTime.includes('млрд') && percentScore >= 90) {
            recommendations = ['Отличный пароль! Для взлома потребуются миллиарды лет.'];
        } else if (score >= 4 && recommendations.length > 0) {
            recommendations.unshift('Ваш пароль достаточно надежный, но его можно улучшить:');
        }

        if (score < 3) {
            recommendations.push('Используйте генератор паролей для создания более надежного пароля');
            recommendations.push('Рассмотрите возможность использования менеджера паролей для хранения сложных паролей');
        }

        return {
            score: score,
            percentScore: percentScore,
            strengthClass: strengthClass,
            strengthText: strengthText,
            crackTime: crackTime,
            recommendations: recommendations
        };
    }

    function calculatePercentScore(password, hasRepeatingChars, hasSequentialChars, hasCommonPatterns) {
        let percentScore = 0;

        if (password.length >= 8) percentScore += 10;
        if (password.length >= 10) percentScore += 5;
        if (password.length >= 12) percentScore += 5;
        if (password.length >= 14) percentScore += 5;
        if (password.length >= 16) percentScore += 5;
        if (password.length >= 20) percentScore += 10;

        if (/[A-ZА-Я]/.test(password)) percentScore += 10;
        if (/[a-zа-я]/.test(password)) percentScore += 10;
        if (/\d/.test(password)) percentScore += 10;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) percentScore += 10;

        const uniqueChars = new Set(password).size;
        const uniqueRatio = uniqueChars / password.length;
        percentScore += Math.floor(uniqueRatio * 20);

        if (hasRepeatingChars) percentScore -= 10;
        if (hasSequentialChars) percentScore -= 10;
        if (hasCommonPatterns) percentScore -= 15;

        if (/[a4][s5][e3]|[p][a4][s5][s5]|[a4][d][m][i1][n]|[w][e3][l][c][o0][m][e3]/i.test(password)) {
            percentScore -= 5;
        }

        const crackTime = estimateCrackTime(password);

        if (crackTime.includes('млрд')) percentScore += 10;
        if (crackTime.includes('тыс млрд')) percentScore += 15;
        if (crackTime.includes('млн млрд')) percentScore += 20;
        if (crackTime.includes('млрд млрд')) percentScore = 100;

        percentScore = Math.max(0, percentScore);
        percentScore = Math.min(100, percentScore);

        return Math.round(percentScore);
    }

    function estimateCrackTime(password) {
        const hasNumbers = /\d/.test(password);
        const hasLowercase = /[a-zа-я]/.test(password);
        const hasUppercase = /[A-ZА-Я]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        let category = 0;

        if (hasLowercase && !hasUppercase && !hasNumbers && !hasSpecial) {
            category = 1;
        } else if (hasLowercase && hasUppercase && !hasNumbers && !hasSpecial) {
            category = 2;
        } else if (hasNumbers && hasLowercase && !hasUppercase && !hasSpecial) {
            category = 3;
        } else if (hasNumbers && hasLowercase && hasUppercase && !hasSpecial) {
            category = 4;
        } else if ((hasNumbers || hasLowercase || hasUppercase) && hasSpecial) {
            category = 5;
        }

        const crackTimeTable = [
            [
                'Мгновенно', 'Мгновенно', 'Мгновенно', 'Мгновенно', 'Мгновенно', 'Мгновенно',
                'Мгновенно', '37 сек', '6 мин', '1 час', '10 часов', '4 дня', '1 месяц', '1 год',
                '10 лет', '100 лет', '1000 лет'
            ],
            [
                'Мгновенно', 'Мгновенно', 'Мгновенно', 'Мгновенно', '4 сек', '2 мин', '2 часа',
                '2 дня', '2 месяца', '4 года', '100 лет', '3000 лет', '64000 лет', '1.6 млн лет',
                '41 млн лет', '1 млрд лет', '26 млрд лет'
            ],
            [
                'Мгновенно', 'Мгновенно', 'Мгновенно', '3 сек', '3 мин', '2 часа', '6 часов',
                '8 месяцев', '4 года', '10 лет', '500 лет', '26000 лет', '1.3 млн лет', '67 млн лет',
                '3.5 млрд лет', '180 млрд лет', '9.3 тыс млрд лет'
            ],
            [
                'Мгновенно', 'Мгновенно', 'Мгновенно', '6 сек', '6 мин', '6 часов', '2 недели',
                '3 года', '200 лет', '11000 лет', '580000 лет', '30 млн лет', '1.6 млрд лет',
                '83 млрд лет', '4.3 тыс млрд лет', '226 тыс млрд лет', '12 млн млрд лет'
            ],
            [
                'Мгновенно', 'Мгновенно', '9 сек', '10 мин', '12 часов', '1 месяц', '5 лет',
                '300 лет', '18000 лет', '1 млн лет', '62 млн лет', '3.6 млрд лет', '211 млрд лет',
                '12 тыс млрд лет', '722 тыс млрд лет', '42 млн млрд лет', '2.4 млрд млрд лет'
            ],
            [
                'Мгновенно', '4 сек', '5 мин', '22 часа', '3 недели', '20 лет', '1100 лет',
                '59000 лет', '3.2 млн лет', '173 млн лет', '9.4 млрд лет', '513 млрд лет',
                '28 тыс млрд лет', '1.5 млн млрд лет', '84 млн млрд лет', '4.6 млрд млрд лет',
                '251 млрд млрд лет'
            ]
        ];

        const length = Math.min(password.length, 16);

        return crackTimeTable[category][length];
    }

    function checkForSequentialChars(password) {
        const sequences = [
            'abcdefghijklmnopqrstuvwxyz',
            'абвгдеёжзийклмнопрстуфхцчшщъыьэюя',
            '0123456789',
            'qwertyuiop',
            'asdfghjkl',
            'zxcvbnm',
            'йцукенгшщзхъ',
            'фывапролджэ',
            'ячсмитьбю'
        ];

        const lowercasePassword = password.toLowerCase();

        for (const seq of sequences) {
            for (let i = 0; i < seq.length - 2; i++) {
                const fragment = seq.substring(i, i + 3);

                if (lowercasePassword.includes(fragment)) {
                    return true;
                }
            }
        }

        return false;
    }

    function checkForCommonPatterns(password) {
        const lowercasePassword = password.toLowerCase();

        const commonPatterns = [
            'password', 'пароль', 'admin', 'админ', 'user', 'пользователь',
            'qwerty', 'йцукен', '123456', '111111', 'abc123', 'welcome', 'привет',
            '12345678', '123456789', '1234', '12345', '1234567890', '1234567',
            '102030', 'qwerty123', 'qwerty1', '1q2w3e', 'рандеву', '123йцу',
            'марина', '1234йцук', '1й2ц3у4к', '12345йцуке', 'любовь', 'максим',
            'люблю', 'андрей', 'кристина'
        ];

        for (const pattern of commonPatterns) {
            if (lowercasePassword.includes(pattern)) {
                return true;
            }
        }

        return false;
    }
});
