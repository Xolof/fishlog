export const helpers = (function () {
    let flashZ = 10000;

    function getId (id) {
        return document.getElementById(id);
    }

    function addListener (eventType, element, func) {
        element.addEventListener(eventType, func);
    }

    function checkMatch (query, string) {
        if (string.slice(0, query.length) === query) {
            return true;
        }
    }

    function resetContent () {
        getId("content").innerHTML = "";
    }

    function showFlashMessage (message, css) {
        const app = getId("app");
        const flashMessage = document.createElement("ul");
        flashMessage.setAttribute("id", "flashmessage");
        flashMessage.style.zIndex = flashZ;
        flashZ += 1;
        app.prepend(flashMessage);

        if (message instanceof Array) {
            message.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                flashMessage.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = message;
            flashMessage.appendChild(li);
        }

        flashMessage.classList.add(css);
        flashMessage.classList.add("slide");
        setTimeout(() => {
            app.removeChild(flashMessage);
        }, 4000);
    }

    return {
        getId,
        addListener,
        checkMatch,
        resetContent,
        showFlashMessage
    };
}());
