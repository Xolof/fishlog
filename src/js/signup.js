import { helpers } from "./helpers.js";

const API_URL = "http://localhost:8000";

export const signup = function() {
    function init() {
        helpers.getId("content").innerHTML = `
        <div class="content_inner">
            <h2>Sign up</h2>
            <form action="" id="add-form">
                <input type="text" id="input-field-1" placeholder="U&#8204;sername" class="input" autocomplete="off">
                <input type="text" id="input-field-2" placeholder="Em&#8204;ail" class="input" autocomplete="off">
                <input type="password" id="input-field-3" placeholder="Pas&#8204;sword" class="input" autocomplete="off">
                <button id="signup" class="button">Sign up</button>
            </form>
        </div>
        `;

        helpers.addListener("click", helpers.getId("signup"), (e) => {
            e.preventDefault();

            const name = helpers.getId("input-field-1").value;
            const email = helpers.getId("input-field-2").value;
            const password = helpers.getId("input-field-3").value;
            
            if (name && email && password) {
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
            helpers.resetContent();
            login.init();
        } else {
            helpers.showFlashMessage("Sign up failed.", "error");
        }
    }

    return {
        init
    }
}();
