export const state = function () {
    
    let isLoggedIn = false;
    let userName = "";

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

    function setUserName(value) {
        userName = value;
    }

    function getUserName() {
        return userName;
    }

    return {
        getLoggedIn,
        setLoggedIn,
        setUserName,
        getUserName,
        verifyToken
    }
}()
