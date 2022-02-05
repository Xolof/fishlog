export const location = (function () {
    let location = null;

    try {
        const interval = setInterval(setLocation(), 2000);
    } catch (err) {
        console.error(err);
    }

    function setLocation () {
        if (window.navigator.geolocation) {
            window.navigator.geolocation.watchPosition(
                (position) => {
                    location = position;
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser");
        }
    }

    function getLocation () {
        return location;
    }

    return {
        getLocation
    };
}());
