export const state = function () {
    
    let isLoggedIn = false;

    async function verifyToken() {
        const url = "http://localhost:8000/api/get_user?token=" + localStorage.getItem("token");
        const res = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const json = await res.json();
        return json.user ?? false;
    }

    function getLoggedIn() {
        return isLoggedIn;
    }

    function setLoggedIn(value) {
        isLoggedIn = value;
    }

    return {
        getLoggedIn,
        setLoggedIn,
        verifyToken
    }
}()
