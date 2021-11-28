import { helpers } from "./helpers.js";
const API_URL = "http://localhost:8000";

export const showMap = function() {

    let data = {};

    async function getData () {
        let res = await fetch("http://localhost:8000/api/public_fishcatch");
        let data = await res.json();
        return data;
    }
    
    async function init () {
        data = await getData();
        render();
    }

    function showMap () {
        let mapDiv = document.createElement("div");
        mapDiv.setAttribute("id", "map");
        mapDiv.setAttribute("class", "full_height");
        helpers.getId("content").appendChild(mapDiv);

        var map = L.map('map').setView([56.04, 12.65], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        data.forEach(c => {
            const lat = c.location.split(",")[0];
            const lon = c.location.split(",")[1];
            const popupContent =`
                <section>
                    <h2>${c.species}</h2>
                    <img
                        src="${API_URL}${c.imageurl}"
                        alt="catch_${c.imageurl}"
                    />
                    <p>${c.date}</p>
                    <p>${c.length} cm</p>
                    <p>${c.weight} g</p>
                    <p>Caught by ${c.username}</p>
                </section>
            `;
            L.marker([lat, lon]).addTo(map).bindPopup(popupContent);
        })
    }

    function render() {
        showMap();
    }

    return {
        init
    }
}()
