import { helpers } from "./helpers.js";
import { showMap as showMapView } from "./showMap.js";
import { api } from "./api.js";

const API_URL = api.getURL();

export const deleteCatch = function() {
    async function remove (id) {
       
        const json = await api.remove(id);

        if (json.success) {
            helpers.showFlashMessage("Catch deleted!", "success");
            helpers.resetContent();
            showMapView.init();
        } else if (json.error) {
            helpers.showFlashMessage(json.error, "error");
        } else {
            helpers.showFlashMessage("The request failed.", "error");
        }
    }

    return {
        remove
    }
}()
