import axios from "axios";

export const NIMBUS_API_KEY = process.env.NIMBUS_API_KEY;
export const NIMBUS_API_SECRET = process.env.NIMBUS_API_SECRET;
export const NIMBUS_EMAIL = process.env.NIMBUS_EMAIL;

const NIMBUS_API_BASE_URL =
    process.env.NIMBUS_API_BASE_URL ||
    "https://api.nimbuspost.com";

const nimbusAPI = axios.create({
    baseURL: NIMBUS_API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default nimbusAPI;