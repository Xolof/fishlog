import { helpers } from "./helpers.js";
import { state } from './state.js';

export const login = function() {
    function init() {
        helpers.getId("content").innerHTML = `
        <form action="" id="add-form">
            <input type="text" id="email" placeholder="Email" class="input">
            <input type="password" id="password" placeholder="Password" class="input">
            <button id="login" class="button">Log in</button>
        </form>
        `;

        helpers.addListener("click", helpers.getId("login"), (e) => {
            e.preventDefault();

            const email = helpers.getId("email").value;
            const password = helpers.getId("password").value;
            
            if (email && password) {
                const data = {
                    email,
                    password
                };
    
                login(data);
            } else {
                helpers.showFlashMessage("Fill out all fields.", "error");
            }
        });
    }

    async function logout() {
        const url = "http://localhost:8000/api/logout?token=" + localStorage.getItem("token")
        const res = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const json = await res.json();

        if (json.success) {
            helpers.showFlashMessage("You logged out.", "success");
            localStorage.removeItem("token");
            state.setLoggedIn(false);
            const loginButton = helpers.getId("nav_login");
            loginButton.textContent = "Login";
        } else {
            helpers.showFlashMessage("Login failed.", "error");
        }
    }

    async function login(data) {
        const res = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const json = await res.json();

        if (json.success) {
            localStorage.setItem("token", json.token);
            state.setLoggedIn(true);
            helpers.getId("nav_login").textContent = "Logout";
            helpers.showFlashMessage("You logged in!", "success");
        } else {
            helpers.showFlashMessage("Login failed.", "error");
        }
    }

    return {
        init,
        logout
    }
}();
