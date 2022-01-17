import { helpers } from "./helpers.js";

const addListener = helpers.addListener;
const getId = helpers.getId;

export const show = function() {

    let data = {};
    let sortAscDesc = false;

    async function getData () {
        let res = await fetch("http://localhost:8000/api/public_fishcatch");
        let data = await res.json();
        return data;
    }
    
    async function init () {
        data = await getData();

        render();
    }

    function render() {
        const content = getId("content")
        content.innerHTML = `
            <div class="content_inner" id="content_inner">
                <h2>Catches</h2>
                <table id="catch_list">
                    <thead>
                        <tr>
                            <th id="date_header" class="sortable">Date &#8593;&#8595;</th>
                            <th id="location_header">Location</th>
                            <th id="species_header">Species</th>
                            <th id="length_header" class="sortable">Length (cm) &#8593;&#8595;</th>
                            <th id="weight_header" class="sortable">Weight (g) &#8593;&#8595;</th>
                            <th id="user_header">User</th>
                        </tr>
                    </thead>
                </table>
            </div>
        `;

        if (!data.length) {
            const contentInner = getId("content_inner");
            const infoPara = document.createElement("p");
            infoPara.classList.add("infoPara");
            infoPara.textContent = "There are not yet any catches.";
            contentInner.appendChild(infoPara);
        }

        const list = getId("catch_list");

        let tableHtml = "";
        tableHtml += `<tbody id="catch_list_body">`;

        data.forEach(item => {
            tableHtml += `
                <tr>
                    <td>${item.date.slice(2)}</td>
                    <td>
                        ${item.location.split(",")[0].slice(0, 5)},${item.location.split(",")[1].slice(0, 5)}
                    </td>
                    <td>${item.species}</td>
                    <td>${item.length}</td>
                    <td>${item.weight}</td>
                    <td>${item.username}</td>
                </tr>
            `;
        });

        tableHtml += `</tbody>`;

        list.innerHTML += tableHtml;

        addListener("click", getId("date_header"), () => {
            let listBody = getId("catch_list_body");
            listBody.parentNode.removeChild(listBody);
            sort("date");
        });

        addListener("click", getId("length_header"), () => {
            let listBody = getId("catch_list_body");
            listBody.parentNode.removeChild(listBody);
            sort("length");
        });

        addListener("click", getId("weight_header"), () => {
            let listBody = getId("catch_list_body");
            listBody.parentNode.removeChild(listBody);
            sort("weight");
        });
    }

    function sort (value) {
        if (!sortAscDesc || sortAscDesc === "desc") {
            data = data.sort((a, b) => {
                if (value === "date") {
                    return  new Date(a[value]) - new Date(b[value])
                }
                return a[value] - b[value]
            });
            sortAscDesc = "asc";
            render();
            return;
        }

        if (sortAscDesc === "asc") {
            data = data.sort((a, b) => {
                if (value === "date") {
                    return  new Date(b[value]) - new Date(a[value])
                }
                return b[value] - a[value]
            });
            sortAscDesc = "desc";
            render();
            return;
        }
    }

    return {
        init
    }
}()
