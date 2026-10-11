import express from "express";

import {
    testNimbusConnection,
    createShipment,
    getShipmentTracking,
    cancelShipmentController,
    downloadLabel,
    downloadManifestController,
} from "../controllers/shipmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();


/* =========================================================
   TEST NIMBUS CONNECTION
========================================================= */

router.get(
    "/test",
    authMiddleware,
    testNimbusConnection
);


/* =========================================================
   CREATE SHIPMENT
========================================================= */

router.post(
    "/create/:orderId",
    authMiddleware,
    createShipment
);


/* =========================================================
   TRACK BY AWB
========================================================= */

router.get(
    "/track/:awb",
    authMiddleware,
    getShipmentTracking
);


/* =========================================================
   CANCEL BY OUR ORDER ID
========================================================= */

router.put(
    "/cancel/:orderId",
    authMiddleware,
    cancelShipmentController
);


/* =========================================================
   LABEL BY OUR ORDER ID
========================================================= */

router.get(
    "/label/:orderId",
    authMiddleware,
    downloadLabel
);


/* =========================================================
   MANIFEST BY OUR ORDER ID
========================================================= */

router.get(
    "/manifest/:orderId",
    authMiddleware,
    downloadManifestController
);


export default router;