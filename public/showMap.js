import { helpers } from "./helpers.js";
const API_URL = "http://localhost:8000";

export const showMap = function() {

    let data = {};
    const content = helpers.getId("content");
    let map;
    const markers = new L.FeatureGroup();

    async function getData () {
        let res = await fetch("http://localhost:8000/api/public_fishcatch");
        let data = await res.json();
        return data;
    }
    
    async function init () {
        data = await getData();
        render();
    }

    function showFilters () {
        const section = document.createElement("section");
        content.appendChild(section);
        const textInput = document.createElement("input");
        textInput.setAttribute("type", "text");
        textInput.setAttribute("placeholder", "species");
        section.appendChild(textInput);
        helpers.addListener("keyup", textInput, (e) => {
            filter(e.target.value);
        });
    }

    function filter (string) {
        if (string === "") {
            clearMarkers();
            addMarkers(data);
            return;
        }
        const filteredData = data.filter(item => item.species.includes(string));
        clearMarkers();
        addMarkers(filteredData);
    }

    function showMap () {
        let mapDiv = document.createElement("div");
        mapDiv.setAttribute("id", "map");
        mapDiv.setAttribute("class", "full_height");
        content.appendChild(mapDiv);

        map = L.map('map').setView([56.04, 12.65], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        markers.addTo(map);

        addMarkers(data);
    }

    function clearMarkers () {
        markers.clearLayers();
    }

    function addMarkers (newData) {
        newData.forEach(c => {
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
            const marker = L.marker([lat, lon]).bindPopup(popupContent);
            markers.addLayer(marker);
        });
    }

    function render() {
        showFilters();
        showMap(data);
    }

    return {
        init
    }
}()
