'use strict';

function getRandomColors() {
    return getRand(0, 1) ? ["gold", "red"] : ["red", "gold"];
}

function getRand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
