"use strict";

import { helpers } from "./helpers.js";
import { add } from "./add.js";
import { show } from "./show.js";
import { showMap } from "./showMap.js";
import { login } from "./login.js";
import { state } from './state.js';

const main = async function() {
    const user = await state.verifyToken();
    if (user) {
        const userInfo = document.createElement("p");
        userInfo.setAttribute("id", "userInfo");
        userInfo.textContent = `Logged in as ${user.name}`;
        document.getElementById("main").prepend(userInfo);
        state.setUserName(user.name);
        state.setLoggedIn(true);
    };

    const nav = document.getElementsByClassName("main_nav")[0];
    nav.innerHTML = `
    <a id="nav_add" title="Add catch"><img src="./images/add.svg"></a>
    <a id="nav_show" title="Show catches in list"><img src="./images/list.svg"></a>
    <a id="nav_showMap" title="Show catches on map"><img src="./images/map.svg"></a>
    <a id="nav_login" title="${ state.getLoggedIn() ? "Logout" : "Login" }">
        <img src="./images/${ state.getLoggedIn() ? "logout" : "login" }.svg">
    </a>`;

    showMap.init();

    helpers.addListener("click", helpers.getId("nav_add"), (e) => {
        helpers.resetContent();
        add.init();
    });

    helpers.addListener("click", helpers.getId("nav_show"), (e) => {
        helpers.resetContent();
        show.init();
    });

    helpers.addListener("click", helpers.getId("nav_showMap"), (e) => {
        helpers.resetContent();
        showMap.init();
    });

    helpers.addListener("click", helpers.getId("nav_login"), async (e) => {
        helpers.resetContent();
        if (!state.getLoggedIn()) {
            login.init();
        } else {
            await login.logout();
            showMap.init();
        }
    });
}();
