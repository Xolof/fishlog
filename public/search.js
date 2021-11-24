import { helpers } from "./helpers.js";

export const search = function() {

    async function getSpecies () {
        let species = await fetch("./data/species.json");
        species = await species.json();
        return species;
    }
    
    let searchField = helpers.getId("species_input");
    let resultsEl = helpers.getId("results");
    let loadedFishes = [];

    function resetResults () {
        resultsEl.innerHTML = "";
        loadedFishes = [];
    }

    function init () {
        helpers.getId("content").innerHTML = `
            <form action="" id="species-form">
                <input type="text" id="species_input" placeholder="Search for a fish" class="input">
            </form>
            <ul id="results"></ul>
        `;
        searchField = helpers.getId("species_input");
        resultsEl = helpers.getId("results");
        helpers.addListener("input", searchField, (e) => {
            if (e.target.value === "") {
                resetResults();
                return;
            }
            getResults(e.target.value);
        });
    }

    async function getResults(query) {
        let hits = 0;

        const species = await getSpecies();

        for (var key in species) {
            let name = species[key].swedish_name;
            let imageFile = species[key].image;
            if (helpers.checkMatch(query, name)) {
                hits += 1;
                if (!loadedFishes.includes(name)) {
                    showResult(name, imageFile);
                    loadedFishes.push(name);
                }
            } else if (loadedFishes.includes(name)) {
                const elToRemove = helpers.getId(name);
                if (elToRemove) {
                    elToRemove.parentNode.removeChild(elToRemove);
                    loadedFishes = loadedFishes.filter((fish) => {
                        return fish != name;
                    })
                }
            }
        }

        if (hits === 0) {
            resetResults();
        }
    }

    function showResult(name, imageFile) {
        let li = document.createElement("li");
        li.setAttribute("id", name);

        let h3 = document.createElement("h3");
        h3.textContent = name;
        li.appendChild(h3);

        let img = document.createElement("img");
        img.setAttribute("src", "./images/" + imageFile);
        img.classList.add("results_image");
        img.style.opacity = 0;
        li.appendChild(img);

        resultsEl.appendChild(li);

        let start = Date.now();
        let timer = setInterval(function() {
            let timePassed = Date.now() - start;

            if (timePassed >= 500) {
                clearInterval(timer);
                return
            }
            
            img.style.opacity = timePassed / 500;
        }, 20);
    }

    return {
        init
    }
}()
