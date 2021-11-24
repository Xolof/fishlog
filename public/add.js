import { helpers } from "./helpers.js";

export const add = function() {
    let coordinates = false;

    function hideMap () {
        let map = helpers.getId("map");
        map.parentNode.removeChild(map);
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

    function init() {
        helpers.getId("content").innerHTML = `
        <form action="" id="add-form">
            <input type="text" id="add_input_species" placeholder="Species" class="input">
            <input type="number" id="add_input_length" placeholder="Length (cm)" class="input">
            <input type="number" id="add_input_weight" placeholder="Weight (g)" class="input">
            <input type="date" id="add_input_date" class="input">
            <button id="add_button_location" class="input">Add location</button>
            <button id="add_catch" class="button">Save</button>
        </form>
        `;

        const addButton = helpers.getId("add_catch");
        const locationButton = helpers.getId("add_button_location");

        helpers.addListener("click", locationButton, (e) => {
            e.preventDefault();
            if (!helpers.getId("map")) {
                showMap();
            } else {
                hideMap();
            }
        });

        helpers.addListener("click", addButton, (e) => {
            e.preventDefault();

            const species = helpers.getId("add_input_species").value;
            const length = helpers.getId("add_input_length").value;
            const weight = helpers.getId("add_input_weight").value;
            const date = helpers.getId("add_input_date").value;

            if (
                species != ""
                && length != ""
                && weight != ""
                && date != ""
                && coordinates
            ) {
                postData ({
                    "species": species,
                    "length": length,
                    "weight": weight,
                    "date": date,
                    "location": coordinates
                });
            } else {
                helpers.showFlashMessage("Fill out all fields!", "error");
            }
        })
    }

    async function postData (data) {
        const res = await fetch("http://localhost:8000/api/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(data)
        });
        
        const json = await res.json();

        if (json.success) {
            helpers.showFlashMessage("Catch added!", "success");
        } else {
            helpers.showFlashMessage("Authentication failed!", "error");
        }
    }

    return {
        init
    }
}()
