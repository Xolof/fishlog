export const api = function () {
    
    const API_URL = "http://localhost:8000";

    function getURL() {
        return API_URL;
    }

    return {
        getURL
    }
}()
