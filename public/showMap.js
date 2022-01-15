import { helpers } from "./helpers.js";
const API_URL = "http://localhost:8000";

export const showMap = function() {

    let data = {};
    const content = helpers.getId("content");
    let inner;
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
        section.classList.add("filters");
        inner.appendChild(section);

        const textInput = document.createElement("input");
        textInput.classList.add("input");
        textInput.setAttribute("type", "text");
        textInput.setAttribute("placeholder", "Filter by species");
        section.appendChild(textInput);
        helpers.addListener("keyup", textInput, (e) => {
            filter(e.target.value);
        });

        const lenghtSlider = document.createElement("input");
        lenghtSlider.setAttribute("type", "text");
        lenghtSlider.setAttribute("id", "lenghtSlider");
        section.appendChild(lenghtSlider);

        const lengthLabel = document.createElement("label");
        lengthLabel.textContent = "length (cm)";
        lengthLabel.setAttribute("for", "lengthSlider");
        section.appendChild(lengthLabel);

        var custom_values = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 125, 150, 175, 200, "more"];
        var my_from = custom_values.indexOf(0);
        var my_to = custom_values.indexOf("more");

        ionRangeSlider("#lenghtSlider", {
            skin: "round",
            type: "double",
            grid: true,
            from: my_from,
            to: my_to,
            prefix: "cm",
            values: custom_values,
            onChange: (data) => {
                console.log("From:", data.from_value);
                console.log("To: ", data.to_value);
            }
        });

        const weightSlider = document.createElement("input");
        weightSlider.setAttribute("type", "text");
        weightSlider.setAttribute("id", "weightSlider");
        section.appendChild(weightSlider);

        const weightLabel = document.createElement("label");
        weightLabel.textContent = "weight (g)";
        lengthLabel.setAttribute("for", "weightSlider");
        section.appendChild(weightLabel);

        var custom_values = [0, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 7500, 10000, "more"];
        var my_from = custom_values.indexOf(0);
        var my_to = custom_values.indexOf("more");

        ionRangeSlider("#weightSlider", {
            skin: "round",
            type: "double",
            grid: true,
            from: my_from,
            to: my_to,
            prefix: "g",
            values: custom_values,
            onChange: (data) => {
                console.log("From:", data.from_value);
                console.log("To: ", data.to_value);
            }
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
        inner.appendChild(mapDiv);

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
        inner = document.createElement("div");
        inner.classList.add("content_inner");
        content.appendChild(inner);
        const heading = document.createElement("h2");
        heading.textContent = "Catches";
        inner.appendChild(heading);
        showFilters();
        showMap(data);
    }

    return {
        init
    }
}()
