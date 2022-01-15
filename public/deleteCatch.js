import { helpers } from "./helpers.js";
import { showMap as showMapView } from "./showMap.js";

const API_URL = "http://localhost:8000";

export const deleteCatch = function() {
    async function remove (id) {
        const res = await fetch(`${API_URL}/api/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });
        
        const json = await res.json();

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
