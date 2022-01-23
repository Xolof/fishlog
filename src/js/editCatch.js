import { helpers } from "./helpers.js";
import { showMap as showMapView } from "./showMap.js";
import { addUserPosition } from "./adduserposition.js";
import { api } from "./api.js";

const API_URL = api.getURL();

export const editCatch = function() {
    let coordinates = false;
    let updatePositionInterval;

    async function getCatch (id) {      
        try {
            return await api.getCatch(id);
        } catch (e) {
            console.error(e);
            helpers.showFlashMessage("The request failed.", "error");
        }
    }

    function showMap (location) {
        clearInterval(updatePositionInterval);

        var lat = location.split(",")[0];
        var lng = location.split(",")[1];
        coordinates = lat + "," + lng;

        var map = L.map('map').setView([lat, lng], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const layerGroup = L.layerGroup().addTo(map);

        L.marker([lat, lng]).addTo(layerGroup);

        map.addEventListener("click", (e) => {
            coordinates = e.latlng.lat + "," + e.latlng.lng;
            lat = e.latlng.lat;
            lng = e.latlng.lng

            layerGroup.clearLayers();

            L.marker([lat, lng]).addTo(layerGroup);
        });

        updatePositionInterval = addUserPosition.add(L, map);
    }

    async function init(id) {
        const content = helpers.getId("content");

        const catchData = await getCatch(id);

        content.innerHTML = `
        <div class="content_inner">
            <h2>Edit</h2>
            <form action="" id="edit-form">
                <input type="text" id="edit_input_species" placeholder="Species" class="input" value="${catchData.species}">
                <input type="number" min="0" id="edit_input_length" placeholder="Length (cm)" class="input" value="${catchData.length}">
                <input type="number" min="0" id="edit_input_weight" placeholder="Weight (g)" class="input" value="${catchData.weight}">
                <input type="date" id="edit_input_date" class="input" value="${catchData.date}">
                <p>Click on the map to set location</p>
                <div id="map"></div>
                <img src="${API_URL}${catchData.imageurl}" alt="Catch image" id="preview_image" />
                <label for="uploadImage" id="uploadImageLabel">Change image</label>
                <input type="file" id="uploadImage">
                <button id="edit_catch" class="button">Save</button>
            </form>
        </div>
        `;

        document.getElementById("uploadImage").addEventListener("change", (e) => {
            const src = URL.createObjectURL(e.target.files[0]);
            document.getElementById("preview_image").src = src;
        });

        helpers.addListener("keypress", window, (e) => {
            if (e.target.type === "number") {
                if (isNaN(e.key)) {
                    e.preventDefault();
                };
            }
        });

        const editButton = helpers.getId("edit_catch");

        showMap(catchData.location);

        helpers.addListener("click", editButton, async (e) => {
            e.preventDefault();

            const species = helpers.getId("edit_input_species").value;
            const length = helpers.getId("edit_input_length").value;
            const weight = helpers.getId("edit_input_weight").value;
            const date = helpers.getId("edit_input_date").value;
            const uploadImageEl = helpers.getId("uploadImage");

            const data = {
                "species": species,
                "length": length,
                "weight": weight,
                "date": date
            };

            if (coordinates) {
                data.location = coordinates
            }

            if (uploadImageEl.files.length) {
                data.uploadImage = uploadImageEl.files[0];
            }

            const json = await api.editCatch(data, id);

            if (json.success) {
                helpers.showFlashMessage("Catch updated!", "success");
                helpers.resetContent();
                const splitLocation = data.location.split(",");
                showMapView.init([splitLocation[0], splitLocation[1]], json.data.id);
            } else if (json.error) {
                helpers.showFlashMessage(json.error, "error");
            } else {
                helpers.showFlashMessage("The request failed.", "error");
            }
        });
    }

    return {
        init
    }
}()
