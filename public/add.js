import { helpers } from "./helpers.js";
import { state } from "./state.js";
import { showMap as showMapView } from "./showMap.js";

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
        const content = helpers.getId("content");

        if (!state.getLoggedIn()) {
            content.innerHTML = `
                <div class="content_inner">
                    <h2>Add</h2>
                    <div class="img_wrapper">
                        <img src="./images/atlantic_mackerel_2.jpg" >
                    </div>
                    <div class="info">
                        <p>You have to log in to be able to add a catch.</p>
                        <p>Sign in or create an account.</p>
                    </div>
                </div>
                `;
            return;
        };

        content.innerHTML = `
        <div class="content_inner">
            <h2>Add</h2>
            <form action="" id="add-form">
                <input type="text" id="add_input_species" placeholder="Species" class="input">
                <input type="number" id="add_input_length" placeholder="Length (cm)" class="input">
                <input type="number" id="add_input_weight" placeholder="Weight (g)" class="input">
                <input type="date" id="add_input_date" class="input">
                <button id="add_button_location" class="input">Add location</button>
                <label for="uploadImage">Image</label>
                <input type="file" id="uploadImage">
                <button id="add_catch" class="button">Save</button>
            </form>
        </div>
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
            const uploadImage = helpers.getId("uploadImage").files[0];

            if (
                species != ""
                && length != ""
                && weight != ""
                && date != ""
                && coordinates
                && uploadImage
            ) {
                postData ({
                    "species": species,
                    "length": length,
                    "weight": weight,
                    "date": date,
                    "location": coordinates,
                    "uploadImage": uploadImage
                });
            } else {
                helpers.showFlashMessage("Fill out all fields!", "error");
            }
        })
    }

    async function postData (data) {
        let formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key])
        }

        const res = await fetch("http://localhost:8000/api/create", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: formData
        });
        
        const json = await res.json();

        if (json.success) {
            helpers.showFlashMessage("Catch added!", "success");
            helpers.resetContent();
            showMapView.init();
        } else if (json.error) {
            helpers.showFlashMessage(json.error, "error");
        } else {
            helpers.showFlashMessage("The request failed.", "error");
        }
    }

    return {
        init
    }
}()
