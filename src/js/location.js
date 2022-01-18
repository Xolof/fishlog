export const location = function () {

    function getLocation() {
        if (window.navigator.geolocation) {
            window.navigator.geolocation.watchPosition(
                (position) => console.log(position)
            );
        } else {
            console.log("Geolocation is not supported by this browser");
        }
    }

    return {
        getLocation
    }
}()
