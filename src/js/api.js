export const api = function () {
    
    const API_URL = "http://localhost:8000";

    function getURL() {
        return API_URL;
    }

    async function getCatches () {
        let res = await fetch(`${API_URL}/api/public_fishcatch`);
        let data = await res.json();
        return data;
    }

    async function getCatch (id) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        const res = await fetch(`${API_URL}/api/fishcatch/${id}`, requestOptions)
        const json = await res.json();
        return json;
    }

    async function signup (data) {
        const res = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        return await res.json();
    }

    async function postCatch (data) {
        let formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key])
        }

        const res = await fetch(`${API_URL}/api/create`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: formData
        });
        
        return await res.json();
    }

    async function login(data) {
        const res = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        return await res.json();
    }

    async function logout() {
        const url = `${API_URL}/api/logout?token=${localStorage.getItem("token")}`
        const res = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await res.json();
    }

    async function remove(id) {
        const res = await fetch(`${API_URL}/api/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        return await res.json();
    }
    
    return {
        getURL,
        getCatches,
        getCatch,
        signup,
        postCatch,
        login,
        logout,
        remove
    }
}()
