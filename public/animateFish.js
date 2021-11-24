const animatedFish = document.createElement("img");
animatedFish.setAttribute("src", "./images/cod-clipart-4.jpg");
animatedFish.classList.add("animated_fish");
getId("app").appendChild(animatedFish);

function animateFish () {
    let offset = 0;
    let timer = setInterval(function () {
        if (false) {
            clearInterval(timer);
        }
        offset += 5;
        if (offset > 1000) {
            offset = 0;
        }
        animatedFish.style.left = offset + "px";
    }, 20);
}

animateFish();