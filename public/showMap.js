import { helpers } from "./helpers.js";

const addListener = helpers.addListener;
const getId = helpers.getId;

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
        helpers.getId("content").appendChild(mapDiv);

        var map = L.map('map').setView([56.04, 12.65], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const layerGroup = L.layerGroup().addTo(map);

        map.addEventListener("click", (e) => {
            coordinates = e.latlng.lat + "," + e.latlng.lng;
            const lat = e.latlng.lat;
            const lng = e.latlng.lng
            const locationButton = helpers.getId("add_button_location");
            locationButton.textContent = `${lat} ${lng}`;

            layerGroup.clearLayers();

            L.marker([lat, lng]).addTo(layerGroup);
        })
    }

    function render() {
        showMap();
    }

    return {
        init
    }
}()
