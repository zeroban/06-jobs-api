import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showTires } from "./tires.js";

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
