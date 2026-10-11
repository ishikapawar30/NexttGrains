import axios from "axios";


const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";


const getToken = () => {

    return (
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken")
    );
};


const authConfig = () => {

    const token = getToken();

    return {

        headers: {

            Authorization:
                `Bearer ${token}`,

            "Content-Type":
                "application/json",
        },
    };
};


/* =========================================================
   TEST
========================================================= */

export const testNimbusConnection =
    async () => {

        const response =
            await axios.get(
                `${API_URL}/api/shipments/test`,
                authConfig()
            );

        return response.data;
    };


/* =========================================================
   CREATE
========================================================= */

export const createNimbusShipment =
    async (orderId) => {

        const response =
            await axios.post(
                `${API_URL}/api/shipments/create/${orderId}`,
                {},
                authConfig()
            );

        return response.data;
    };


/* =========================================================
   TRACK
========================================================= */

export const trackNimbusShipment =
    async (awb) => {

        const response =
            await axios.get(
                `${API_URL}/api/shipments/track/${encodeURIComponent(
                    awb
                )}`,
                authConfig()
            );

        return response.data;
    };


/* =========================================================
   CANCEL
========================================================= */

export const cancelNimbusShipment =
    async (orderId) => {

        const response =
            await axios.put(
                `${API_URL}/api/shipments/cancel/${orderId}`,
                {},
                authConfig()
            );

        return response.data;
    };


/* =========================================================
   LABEL
========================================================= */

export const getNimbusLabel =
    async (orderId) => {

        const response =
            await axios.get(
                `${API_URL}/api/shipments/label/${orderId}`,
                authConfig()
            );

        return response.data;
    };


/* =========================================================
   MANIFEST
========================================================= */

export const getNimbusManifest =
    async (orderId) => {

        const response =
            await axios.get(
                `${API_URL}/api/shipments/manifest/${orderId}`,
                authConfig()
            );

        return response.data;
    };