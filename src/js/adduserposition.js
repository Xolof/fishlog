import { location } from "./location.js";

export const addUserPosition = function () {
    // If it works, move to separate file.
    function add(L, map) {
        // Position
        let position = null;
        const userPositionMarker = new L.FeatureGroup();

        return setInterval(
            () => {
                userPositionMarker.clearLayers();
                try {
                    position = location.getLocation();
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    userPositionMarker.addTo(map);
                    var userIcon = L.icon({
                        iconUrl: './images/user.png',
                        iconSize:     [25, 25],
                        // iconAnchor:   [25, 25],
                    });
                    const marker = L.marker([lat, lon], {icon: userIcon});

                    userPositionMarker.addLayer(marker);
                    console.log("Added user position to map");
                } catch (err) {
                    console.log("Invalid position");
                }
            }, 1000
        );
    }

    return {
        add
    }
}()
