import { helpers } from "./helpers.js";
import { state } from "./state.js";
import { showMap as showMapView } from "./showMap.js";
import { addUserPosition } from "./adduserposition.js";
import { login } from "./login.js";
import { signup } from "./signup.js";
import { api } from "./api.js";

export const add = (function () {
    let coordinates = false;
    let updatePositionInterval;

    function showMap () {
        clearInterval(updatePositionInterval);

        const map = L.map("map").setView([56.04, 12.65], 10);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        }).addTo(map);

        const layerGroup = L.layerGroup().addTo(map);

        map.addEventListener("click", (e) => {
            coordinates = e.latlng.lat + "," + e.latlng.lng;
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            layerGroup.clearLayers();
            L.marker([lat, lng]).addTo(layerGroup);
        });

        updatePositionInterval = addUserPosition.add(L, map);
    }

    function init () {
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
                        <p><a class="signin_link">Sign in</a> or <a class="signup_link">create an account.</a></p>
                    </div>
                </div>
            `;

            helpers.addListener("click", document.querySelector(".signin_link"), (e) => {
                helpers.resetContent();
                login.init();
            });

            helpers.addListener("click", document.querySelector(".signup_link"), (e) => {
                signup.init();
            });

            return;
        };

        content.innerHTML = `
        <div class="content_inner">
            <h2>Add</h2>
            <form action="" id="add-form">
                <input type="text" id="add_input_species" placeholder="Species" class="input">
                <input type="number" min="0" id="add_input_length" placeholder="Length (cm)" class="input">
                <input type="number" min="0" id="add_input_weight" placeholder="Weight (g)" class="input">
                <input type="date" id="add_input_date" class="input">
                <p>Click on the map to set location</p>
                <div id="map"></div>
                <img alt="Catch image" id="preview_image" style="display: none;" />
                <label for="uploadImage" id="uploadImageLabel">Add image</label>
                <input type="file" id="uploadImage">
                <button id="add_catch" class="button">Save</button>
            </form>
        </div>
        `;

        showMap();

        document.getElementById("uploadImage").addEventListener("change", (e) => {
            const src = URL.createObjectURL(e.target.files[0]);
            const previewImage = document.getElementById("preview_image");
            previewImage.style.display = "initial";
            previewImage.src = src;
        });

        helpers.addListener("keypress", window, (e) => {
            if (e.target.type === "number") {
                if (isNaN(e.key)) {
                    e.preventDefault();
                };
            }
        });

        const addButton = helpers.getId("add_catch");

        helpers.addListener("click", addButton, async (e) => {
            e.preventDefault();

            const species = helpers.getId("add_input_species").value;
            const length = helpers.getId("add_input_length").value;
            const weight = helpers.getId("add_input_weight").value;
            const date = helpers.getId("add_input_date").value;
            const uploadImageEl = helpers.getId("uploadImage");

            const data = {
                species,
                length,
                weight,
                date
            };

            if (coordinates) {
                data.location = coordinates;
            }

            if (uploadImageEl.files.length) {
                data.uploadImage = uploadImageEl.files[0];
            }

            const json = await api.postCatch(data);

            if (json.success) {
                helpers.showFlashMessage("Catch added!", "success");
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
    };
}());
