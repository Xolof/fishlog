export const api = function () {
    
    const API_URL = "http://localhost:8000";

    function getURL() {
        return API_URL;
    }

    async function getCatches () {
        try {
            let res = await fetch(`${API_URL}/api/public_fishcatch`);
            return await res.json();
        } catch (err) {
            return { error: "Request failed" }
        }
    }

    async function getCatch (id) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        try {
            const res = await fetch(`${API_URL}/api/fishcatch/${id}`, requestOptions)
            const json = await res.json();
            return json;
        } catch (err) {
            return { error: "Request failed" }
        }
    }

    async function signup (data) {
        try {
            const res = await fetch(`${API_URL}/api/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            return await res.json();
        
        } catch (err) {
            return { error: "Request failed" }
        }
    }

    async function postCatch (data) {
        let formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key])
        }

        try {
            const res = await fetch(`${API_URL}/api/create`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: formData
            });

            return await res.json();
        } catch (err) {
            return { error: "Request failed" }
        }
    }

    async function editCatch (data, id) {
        let formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key])
        }

        try {
            const res = await fetch(`${API_URL}/api/update/${id}`, {
                method: "POST", // Must use post because in PHP PUT/PATCH request with multipart/form-data will not populate $_FILES.
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: formData,
                redirect: "follow"
            });
        } catch (err) {
            return { error: "Request failed" }
        }

        return await res.json();
    }

    async function verifyToken() {
        try {
            const url = `${API_URL}/api/get_user?token=${localStorage.getItem("token")}`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const json = await res.json();
            return json.user ?? false;
        } catch (err) {
            return { error: "Request failed" }
        }
    }

    async function login(data) {
        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            return await res.json();
        } catch (err) {
            return { error: "Request failed" }
        }
    }

    async function logout() {
        try {
            const url = `${API_URL}/api/logout?token=${localStorage.getItem("token")}`
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return await res.json();
        } catch (err) {
            return { error: "Request failed" }
        }
    }

    async function remove(id) {
        try {
            const res = await fetch(`${API_URL}/api/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });

            return await res.json();
        } catch (err) {
            return { error: "Request failed" }
        }
    }
    
    return {
        getURL,
        getCatches,
        getCatch,
        signup,
        postCatch,
        editCatch,
        login,
        logout,
        verifyToken,
        remove
    }
}()
