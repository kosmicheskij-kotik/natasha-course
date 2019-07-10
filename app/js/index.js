'use strict';
let start = Date.now(); // сохранить время начала
let positionLeft = 0;
let positionTop = 0;

function draw() {
    if (positionLeft===0 && positionTop<200) {
        positionTop += 1;
    } else if (0<positionTop<=200 && positionLeft>=0) {
        positionLeft += 1;
        positionTop -= 1;
    } else if (0<=positionTop<200 && positionLeft>199) {
        positionLeft += 1;
        positionTop += 1;
    } else {
        positionTop -= 1;
    }
    text.style.left = positionLeft + 'px';
    text.style.top = positionTop + 'px';
}

let timer = setInterval(function() {
    // вычислить сколько времени прошло с начала анимации
    let timePassed = Date.now() - start;

    if (timePassed >= 2000) {
        clearInterval(timer); // конец через 2 секунды
        return;
    }

    // рисует состояние анимации, соответствующее времени timePassed
    draw(timePassed);

}, 20);
