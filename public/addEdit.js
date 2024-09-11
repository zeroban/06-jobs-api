import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showTires } from "./tires.js";


let addEditDiv = null;
let brand = null;
let size = null;
let location = null;

// if left uncommented it breaks the addingTire option
// let price = null;
// let quantity = null;
let addingTire = null;


export const handleAddEdit = () => {
    addEditDiv = document.getElementById("edit-tire");
    brand = document.getElementById("brand");
    size = document.getElementById("size");
    location = document.getElementById("location");
    // price = document.getElementById("price");
    // quantity = document.getElementById("quantity");
    addingTire = document.getElementById("adding-tire");
    const editCancel = document.getElementById("edit-cancel");


    addEditDiv.addEventListener("click", async (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {

            if (e.target === addingTire) {
                enableInput(false);

                let method = "POST";
                let url = "/api/v1/tires";

                if (addingTire.textContent === "update") {
                    method = "PATCH";
                    url = `/api/v1/tires/${addEditDiv.dataset.id}`;
                }

                try {
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            brand: brand.value,
                            size: size.value,
                            price: price.value,
                            quantity: quantity.value,
                            location: location.value,
                        }),
                    });

                    const data = await response.json();
                    if (response.status === 200 || response.status === 201) {
                        if (response.status === 200) {
                            // a 200 is expected for a successful update
                            message.textContent = "The job entry was updated.";
                        } else {
                            // a 201 is expected for a successful create
                            message.textContent = "The job entry was created.";
                        }

                        brand.value = "";
                        size.value = "";
                        price.value = "";
                        quantity.value = "";
                        location.value = "";
                        showTires();
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    console.log(err);
                    message.textContent = "A communication error occurred.";
                }
                enableInput(true);
            } else if (e.target === editCancel) {
                message.textContent = "";
                showTires();
            }
        }
    });
};

export const showAddEdit = async (tireID) => {
    if (!tireID) {
        brand.value = "";
        size.value = "";
        location.value = " ";
        price.value = " ";
        quantity.value = " ";
        addingTire.textContent = "Add";
        message.textContent = "";

        setDiv(addEditDiv);
    } else {
        enableInput(false);

        try {
            console.log("i am in the try block");

            const response = await fetch(`/api/v1/tires/${tireID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("you made it here!");

            const data = await response.json();
            console.log(data); // Log the entire response to see its structure

            if (response.status === 200) {
                brand.value = data.tires.brand;
                size.value = data.tires.size;
                location.value = data.tires.location;
                price.value = data.tires.price;
                quantity.value = data.tires.quantity;
                addingTire.textContent = "update";
                message.textContent = "";
                addEditDiv.dataset.id = tireID;

                setDiv(addEditDiv);

            } else {
                // might happen if the list has been updated since last display
                message.textContent = "The jobs entry was not found";
                showTires();
            }
        } catch (err) {
            console.log(err);
            message.textContent = "A communications error has occurred.";
            showTires();
        }

        enableInput(true);
    }
};

