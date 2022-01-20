import help from "nodemon/lib/help";
import { helpers } from "./helpers.js";

const API_URL = "http://localhost:8000";

export const signup = function() {
    function init() {
        helpers.getId("content").innerHTML = `
        <div class="content_inner">
            <h2>Sign up</h2>
            <form action="" id="add-form">
                <input type="text" id="name" placeholder="Username" class="input">
                <input type="text" id="email" placeholder="Email" class="input">
                <input type="password" id="password" placeholder="Password" class="input">
                <button id="signup" class="button">Sign up</button>
            </form>
        </div>
        `;

        helpers.addListener("click", helpers.getId("signup"), (e) => {
            e.preventDefault();

            const name = helpers.getId("name").value;
            const email = helpers.getId("email").value;
            const password = helpers.getId("password").value;
            
            if (email && password) {
                const data = {
                    name,
                    email,
                    password
                };
    
                signup(data);
            } else {
                helpers.showFlashMessage("Fill out all fields.", "error");
            }
        });
    }

    async function signup(data) {
        const res = await fetch("http://localhost:8000/api/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const json = await res.json();

        if (json.success) {
            helpers.showFlashMessage("You have signed up!", "success");
            login.init();
        } else {
            helpers.showFlashMessage("Sign up failed.", "error");
        }
    }

    return {
        init
    }
}();
