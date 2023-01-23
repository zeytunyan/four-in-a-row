'use strict';

{
	const firstCircle = document.getElementById("circle1");
    const secondCircle = document.getElementById("circle2");
    const randMode = document.getElementById("rand-mode");

    document.getElementById("change-button").addEventListener("click", changeColors);
    document.getElementById("play-button").addEventListener("click", toLocalStorage);

    function changeColors() {
        if (randMode.innerHTML) {
            randMode.innerHTML = "";
            [firstCircle.style.background, secondCircle.style.background] = ['red', 'gold'];
        }
        else {
            [firstCircle.style.background, secondCircle.style.background] = [secondCircle.style.background, firstCircle.style.background];
        }
    }

    function toLocalStorage() {
        localStorage.setItem('playerOneColor', firstCircle.style.background);
        localStorage.setItem('playerTwoColor', secondCircle.style.background);
    }
}

