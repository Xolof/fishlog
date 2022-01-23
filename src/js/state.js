import { api } from "./api.js";

export const state = function () {

    const API_URL = api.getURL();
    let isLoggedIn = false;
    let userName = "";

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
        getUserName
    }
}()
