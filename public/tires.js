import { inputEnabled, setDiv, message, setToken, token, enableInput, } from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";
// import { deleteTire } from "./deleteTires.js";


let tiresDiv = null;
let tiresTable = null;
let tiresTableHeader = null;

export const handleTires = () => {
    tiresDiv = document.getElementById("tires");
    const logoff = document.getElementById("logoff");
    const addTire = document.getElementById("add-tire");
    tiresTable = document.getElementById("tires-table");
    tiresTableHeader = document.getElementById("tires-table-header");

    tiresDiv.addEventListener("click", (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addTire) {
                showAddEdit(null);
            } else if (e.target === logoff) {
                setToken(null);

                message.textContent = "You have been logged off.";

                tiresTable.replaceChildren([tiresTableHeader]);

                showLoginRegister();
            }
            else if (e.target.classList.contains("editButton")) {
                message.textContent = "";
                showAddEdit(e.target.dataset.id);
            } else if (e.target.classList.contains("deleteButton")) {
                message.textContent = "";
                deleteTire(e.target.dataset.id);
            }
        }
    });
};

export const showTires = async () => {
    try {
        enableInput(false);

        const response = await fetch("/api/v1/tires", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        let children = [tiresTableHeader];

        if (response.status === 200) {
            if (data.count === 0) {
                jobsTable.replaceChildren(...children); // clear this for safety
            } else {
                for (let i = 0; i < data.tires.length; i++) {
                    let rowEntry = document.createElement("tr");

                    let editButton = `<td><button type="button" class="editButton" data-id=${data.tires[i]._id}>Edit</button></td>`;
                    let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.tires[i]._id}>Delete</button></td>`;
                    let rowHTML = `
              <td>${data.tires[i].brand}</td>
              <td>${data.tires[i].size}</td>
              <td>${data.tires[i].price}</td>
              <td>${data.tires[i].quantity}</td>
              <td>${data.tires[i].location}</td>
              <div>${editButton}${deleteButton}</div>`;

                    rowEntry.innerHTML = rowHTML;
                    children.push(rowEntry);
                }
                tiresTable.replaceChildren(...children);
            }
        } else {
            message.textContent = data.msg;
        }
    } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
    }
    enableInput(true);
    setDiv(tiresDiv);
};


// delete function - possible refactoring to its own moduel 
export const deleteTire = async (tireID) => {
    if (!tireID) {
        message.textContent = "Tire ID is required to delete a tire.";
        return;
    }

    enableInput(false);

    try {
        const response = await fetch(`/api/v1/tires/${tireID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            message.textContent = "Tire deleted successfully.";
            showTires(); // Refresh the list of tires after deletion
        } else if (response.status === 404) {
            message.textContent = "Tire not found. It may have already been deleted.";
        } else {
            message.textContent = "Failed to delete the tire. Please try again.";
        }
    } catch (err) {
        console.log(err);
        message.textContent = "A communications error has occurred.";
    }

    enableInput(true);
};
