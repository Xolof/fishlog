import { location } from "./location.js";

export const addUserPosition = (function () {
    let userPosition = null;

    function getUserPosition () {
        return userPosition;
    }

    function add (L, map) {
        let position = null;
        const userPositionMarker = new L.FeatureGroup();

        return setInterval(
            () => {
                userPositionMarker.clearLayers();
                try {
                    position = location.getLocation();
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    userPosition = [lat, lon];

                    userPositionMarker.addTo(map);
                    const userIcon = L.icon({
                        iconUrl: "./images/user.png",
                        iconSize: [25, 25]
                    });
                    const marker = L.marker([lat, lon], { icon: userIcon });

                    userPositionMarker.addLayer(marker);
                } catch (err) {
                    console.log("Invalid position");
                }
            }, 1000
        );
    }

    return {
        add,
        getUserPosition
    };
}());
