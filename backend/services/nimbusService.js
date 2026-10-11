import nimbusAPI, {
    NIMBUS_API_KEY,
    NIMBUS_API_SECRET,
    NIMBUS_EMAIL,
} from "../config/nimbus.js";


/* =========================================================
   ERROR HELPER
========================================================= */

const getNimbusError = (error) => {

    const data =
        error?.response?.data;

    if (typeof data === "string") {
        return data;
    }

    return (
        data?.message ||
        data?.error ||
        data?.errors ||
        error?.message ||
        "NimbusPost request failed."
    );
};


/* =========================================================
   LOGIN
========================================================= */

export const getNimbusAccessToken = async () => {

    if (
        !NIMBUS_EMAIL ||
        !NIMBUS_API_KEY ||
        !NIMBUS_API_SECRET
    ) {

        throw new Error(
            "NimbusPost credentials are missing in backend .env"
        );

    }


    try {

        const { data } =
            await nimbusAPI.post(

                "/v1/auth/login",

                {
                    email: NIMBUS_EMAIL,

                    api_key:
                        NIMBUS_API_KEY,

                    api_secret:
                        NIMBUS_API_SECRET,
                }

            );


        const token =
            data?.data?.token ||
            data?.token ||
            data?.access_token;


        if (!token) {

            console.log(
                "Nimbus login response:",
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );

            throw new Error(
                "Nimbus access token was not received."
            );

        }


        return token;

    }

    catch (error) {

        console.log(
            "========== NIMBUS LOGIN =========="
        );

        console.log(
            error?.response?.data ||
            error?.message
        );

        console.log(
            "=================================="
        );

        throw new Error(
            getNimbusError(error)
        );

    }

};


/* =========================================================
   CREATE SHIPMENT
========================================================= */

export const createNimbusShipment =
async (payload) => {

    try {

        const token =
            await getNimbusAccessToken();


        const { data } =
            await nimbusAPI.post(

                "/v1/shipments",

                payload,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }

            );


        return data;

    }

    catch (error) {

        console.log(
            "======= NIMBUS CREATE SHIPMENT ======="
        );

        console.log(
            JSON.stringify(
                error?.response?.data ||
                error?.message,
                null,
                2
            )
        );

        console.log(
            "======================================"
        );

        throw error;

    }

};


/* =========================================================
   TRACK
========================================================= */

export const trackShipment =
async (awbNumber) => {

    try {

        const token =
            await getNimbusAccessToken();


        const { data } =
            await nimbusAPI.get(

                `/v1/shipments/track/${encodeURIComponent(
                    awbNumber
                )}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }

            );


        return data;

    }

    catch (error) {

        console.log(
            "======== NIMBUS TRACK ========"
        );

        console.log(
            error?.response?.data ||
            error?.message
        );

        console.log(
            "=============================="
        );

        throw error;

    }

};


/* =========================================================
   CANCEL
========================================================= */

export const cancelShipment =
async (awbNumber) => {

    try {

        const token =
            await getNimbusAccessToken();


        const { data } =
            await nimbusAPI.post(

                "/v1/shipments/cancel",

                {
                    awb: awbNumber,
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }

            );


        return data;

    }

    catch (error) {

        console.log(
            "======== NIMBUS CANCEL ========"
        );

        console.log(
            error?.response?.data ||
            error?.message
        );

        console.log(
            "==============================="
        );

        throw error;

    }

};


/* =========================================================
   LABEL
========================================================= */

export const generateShippingLabel =
async (shipmentId) => {

    try {

        const token =
            await getNimbusAccessToken();


        const { data } =
            await nimbusAPI.post(

                "/v1/shipments/label",

                [shipmentId],

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }

            );


        return data;

    }

    catch (error) {

        console.log(
            "========= NIMBUS LABEL ========="
        );

        console.log(
            error?.response?.data ||
            error?.message
        );

        console.log(
            "================================"
        );

        throw error;

    }

};


/* =========================================================
   MANIFEST
========================================================= */

export const generateManifest =
async (awbNumber) => {

    try {

        const token =
            await getNimbusAccessToken();


        const { data } =
            await nimbusAPI.post(

                "/v1/shipments/manifest",

                {
                    awbs: [
                        awbNumber
                    ],
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }

            );


        return data;

    }

    catch (error) {

        console.log(
            "======== NIMBUS MANIFEST ========"
        );

        console.log(
            error?.response?.data ||
            error?.message
        );

        console.log(
            "================================="
        );

        throw error;

    }

};