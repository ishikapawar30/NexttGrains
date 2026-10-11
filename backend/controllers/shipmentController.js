import Order from "../models/Order.js";

import {
    getNimbusAccessToken,
    createNimbusShipment,
    trackShipment,
    cancelShipment,
    generateShippingLabel,
    generateManifest,
} from "../services/nimbusService.js";


/* =========================================================
   HELPERS
========================================================= */

const firstValue = (...values) => {

    for (const value of values) {

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return "";
};


const extractNimbusData = (response) => {

    return (
        response?.data?.data ||
        response?.data ||
        response
    );
};


const extractShipmentInfo = (response) => {

    const data = extractNimbusData(response);

    return {

        shipmentId: firstValue(
            data?.shipment_id,
            data?.shipmentId,
            data?.id
        ),

        awbNumber: firstValue(
            data?.awb,
            data?.awb_number,
            data?.awbNumber,
            data?.waybill
        ),

        courierId: firstValue(
            data?.courier_id,
            data?.courierId
        ),

        courierName: firstValue(
            data?.courier_name,
            data?.courierName,
            data?.courier
        ),

        shipmentStatus: firstValue(
            data?.status,
            data?.shipment_status
        ),

        shippingCharge: Number(
            firstValue(
                data?.shipping_charge,
                data?.shippingCharge,
                data?.freight
            ) || 0
        ),

        labelUrl: firstValue(
            data?.label_url,
            data?.labelUrl,
            data?.label
        ),

        manifestUrl: firstValue(
            data?.manifest_url,
            data?.manifestUrl,
            data?.manifest
        ),

        pickupDate:
            data?.pickup_date ||
            data?.pickupDate ||
            null,
    };
};


/* =========================================================
   BUILD NIMBUS PAYLOAD
========================================================= */

const buildNimbusShipmentPayload = (order) => {

    const address = order.address || {};

    const items = Array.isArray(order.items)
        ? order.items
        : [];


    /*
      IMPORTANT:

      Nimbus V1 requires the Nimbus shipment payload,
      not our MongoDB Order document.

      order_number is the key identifier used by the
      Nimbus V1 shipment API.
    */

    const products = items.map((item) => {

        return {

            product_name:
                item.productName || "Product",

            product_sku:
                item.sku || "",

            product_quantity:
                Number(item.quantity || 1),

            product_price:
                Number(item.price || 0),

            product_unit:
                item.unit || "",

        };
    });


    const paymentType =
        order.paymentMethod === "COD"
            ? "cod"
            : "prepaid";


    return {

        order_number:
            order.orderNumber,

        order_amount:
            Number(order.grandTotal || 0),

        payment_type:
            paymentType,

        cod_amount:
            paymentType === "cod"
                ? Number(order.grandTotal || 0)
                : 0,

        total_items:
            Number(order.totalItems || items.length || 1),


        /* -------------------------
           CUSTOMER
        ------------------------- */

        consignee_name:
            firstValue(
                address.name,
                address.fullName,
                address.customerName,
                address.receiverName,
                "Customer"
            ),

        consignee_address1:
            firstValue(
                address.addressLine1,
                address.address,
                address.street,
                address.line1
            ),

        consignee_address2:
            firstValue(
                address.addressLine2,
                address.landmark,
                address.line2
            ),

        consignee_pincode:
            firstValue(
                address.pincode,
                address.pin,
                address.postalCode,
                address.zipCode
            ),

        consignee_city:
            firstValue(
                address.city,
                address.town
            ),

        consignee_state:
            firstValue(
                address.state,
                address.region
            ),

        consignee_phone:
            firstValue(
                address.phone,
                address.mobile,
                address.contactNumber
            ),

        consignee_email:
            firstValue(
                address.email
            ),


        /* -------------------------
           PRODUCTS
        ------------------------- */

        products,


        /* -------------------------
           TOTALS
        ------------------------- */

        subtotal:
            Number(order.subtotal || 0),

        discount:
            Number(order.discount || 0),

        shipping_charges:
            Number(order.deliveryCharge || 0),

        tax:
            Number(order.tax || 0),


        /* -------------------------
           PACKAGE
        ------------------------- */

        package_weight:
            Number(process.env.NIMBUS_DEFAULT_WEIGHT || 500),

        package_length:
            Number(process.env.NIMBUS_DEFAULT_LENGTH || 20),

        package_breadth:
            Number(process.env.NIMBUS_DEFAULT_BREADTH || 15),

        package_height:
            Number(process.env.NIMBUS_DEFAULT_HEIGHT || 10),
    };
};


/* =========================================================
   TEST NIMBUS LOGIN
========================================================= */

export const testNimbusConnection = async (
    req,
    res
) => {

    try {

        const token =
            await getNimbusAccessToken();

        return res.json({

            success: true,

            connected: true,

            message:
                "NimbusPost authentication successful.",

            tokenReceived:
                Boolean(token),
        });

    } catch (error) {

        return res.status(502).json({

            success: false,

            connected: false,

            message:
                error.message ||
                "NimbusPost connection failed.",
        });
    }
};


/* =========================================================
   CREATE SHIPMENT
========================================================= */

export const createShipment = async (
    req,
    res
) => {

    try {

        const order =
            await Order
                .findById(req.params.orderId)
                .populate("address")
                .populate("items.product");


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found.",
            });
        }


        if (order.shipmentCreated) {

            return res.status(409).json({

                success: false,

                message:
                    "Nimbus shipment already exists for this order.",

                shipment: {

                    shipmentId:
                        order.shipmentId,

                    awbNumber:
                        order.awbNumber,

                    courierName:
                        order.courierName,
                },
            });
        }


        if (!order.orderNumber) {

            return res.status(400).json({

                success: false,

                message:
                    "Order number is required.",
            });
        }


        if (!order.address) {

            return res.status(400).json({

                success: false,

                message:
                    "Delivery address is missing.",
            });
        }


        const shipmentPayload =
            buildNimbusShipmentPayload(order);


        console.log(
            "========== NIMBUS PAYLOAD =========="
        );

        console.log(
            JSON.stringify(
                shipmentPayload,
                null,
                2
            )
        );

        console.log(
            "===================================="
        );


        const response =
            await createNimbusShipment(
                shipmentPayload
            );


        const shipmentInfo =
            extractShipmentInfo(response);


        /*
          Save whatever Nimbus returned.

          If Nimbus does not return AWB because the
          account is not funded/serviceable yet,
          shipmentCreated remains false.
        */

        if (
            shipmentInfo.shipmentId ||
            shipmentInfo.awbNumber
        ) {

            order.shipmentCreated =
                true;

            order.shipmentId =
                String(
                    shipmentInfo.shipmentId || ""
                );

            order.awbNumber =
                String(
                    shipmentInfo.awbNumber || ""
                );

            order.courierId =
                String(
                    shipmentInfo.courierId || ""
                );

            order.courierName =
                String(
                    shipmentInfo.courierName || ""
                );

            order.shipmentStatus =
                shipmentInfo.shipmentStatus ||
                "Created";

            order.shippingCharge =
                shipmentInfo.shippingCharge || 0;

            order.labelUrl =
                shipmentInfo.labelUrl || "";

            order.manifestUrl =
                shipmentInfo.manifestUrl || "";

            order.pickupDate =
                shipmentInfo.pickupDate || null;


            order.trackingId =
                order.awbNumber;

            order.deliveryPartner =
                order.courierName;


            order.orderStatus =
                "Shipped";


            await order.save();
        }


        return res.json({

            success: true,

            message:
                "Nimbus shipment request completed.",

            shipment: {

                shipmentId:
                    order.shipmentId,

                awbNumber:
                    order.awbNumber,

                courierName:
                    order.courierName,

                shipmentStatus:
                    order.shipmentStatus,

                shippingCharge:
                    order.shippingCharge,
            },

            nimbusResponse:
                response,
        });


    } catch (error) {

        console.log(
            "========== CREATE SHIPMENT CONTROLLER ERROR =========="
        );

        console.log(
            error?.response?.data ||
            error?.message ||
            error
        );

        console.log(
            "========================================================"
        );


        return res.status(
            error?.response?.status || 500
        ).json({

            success: false,

            message:
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Unable to create Nimbus shipment.",

            nimbusError:
                error?.response?.data || null,
        });
    }
};


/* =========================================================
   TRACK SHIPMENT
========================================================= */

export const getShipmentTracking = async (
    req,
    res
) => {

    try {

        const {
            awb
        } = req.params;


        if (!awb) {

            return res.status(400).json({

                success: false,

                message:
                    "AWB number is required.",
            });
        }


        const tracking =
            await trackShipment(awb);


        /*
          Update local order too.
        */

        const order =
            await Order.findOne({
                awbNumber: awb,
                isDeleted: false,
            });


        if (order) {

            const trackingData =
                tracking?.data?.data ||
                tracking?.data ||
                tracking;


            const status =
                trackingData?.status ||
                trackingData?.shipment_status ||
                trackingData?.tag ||
                trackingData?.current_status;


            if (status) {

                order.shipmentStatus =
                    status;

                const normalized =
                    String(status)
                        .toLowerCase();


                if (
                    normalized.includes("delivered")
                ) {

                    order.orderStatus =
                        "Delivered";

                    order.deliveredAt =
                        new Date();
                }

                else if (
                    normalized.includes(
                        "out for delivery"
                    )
                ) {

                    order.orderStatus =
                        "Out For Delivery";
                }

                else if (
                    normalized.includes(
                        "transit"
                    )
                ) {

                    order.orderStatus =
                        "Shipped";
                }


                /*
                  Keep raw tracking response
                  inside our normalized event array
                  where possible.
                */

                const events =
                    trackingData?.tracking_events ||
                    trackingData?.trackingEvents ||
                    trackingData?.checkpoints ||
                    [];


                if (Array.isArray(events)) {

                    order.trackingEvents =
                        events.map((event) => ({

                            status:
                                event.status ||
                                event.tag ||
                                event.subtag ||
                                "",

                            location:
                                event.location ||
                                event.city ||
                                "",

                            activity:
                                event.activity ||
                                event.message ||
                                event.subtag_message ||
                                "",

                            date:
                                event.date ||
                                event.checkpoint_time ||
                                event.created_at ||
                                null,
                        }));
                }


                await order.save();
            }
        }


        return res.json({

            success: true,

            awb,

            tracking,
        });


    } catch (error) {

        return res.status(
            error?.response?.status || 500
        ).json({

            success: false,

            message:
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Unable to fetch shipment tracking.",

            nimbusError:
                error?.response?.data || null,
        });
    }
};


/* =========================================================
   CANCEL SHIPMENT
========================================================= */

export const cancelShipmentController =
    async (req, res) => {

        try {

            const {
                orderId
            } = req.params;


            const order =
                await Order.findById(
                    orderId
                );


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found.",
                });
            }


            if (!order.awbNumber) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This order does not have a Nimbus AWB.",
                });
            }


            const response =
                await cancelShipment(
                    order.awbNumber
                );


            order.shipmentStatus =
                "Cancelled";

            order.orderStatus =
                "Cancelled";


            await order.save();


            return res.json({

                success: true,

                message:
                    "Nimbus shipment cancelled.",

                response,
            });


        } catch (error) {

            return res.status(
                error?.response?.status || 500
            ).json({

                success: false,

                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.message ||
                    "Unable to cancel shipment.",

                nimbusError:
                    error?.response?.data || null,
            });
        }
    };


/* =========================================================
   LABEL
========================================================= */

export const downloadLabel =
    async (req, res) => {

        try {

            const {
                orderId
            } = req.params;


            const order =
                await Order.findById(
                    orderId
                );


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found.",
                });
            }


            if (!order.shipmentId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Nimbus shipment ID not available.",
                });
            }


            const label =
                await generateShippingLabel(
                    order.shipmentId
                );


            const labelData =
                label?.data?.data ||
                label?.data ||
                label;


            const labelUrl =
                labelData?.label_url ||
                labelData?.labelUrl ||
                labelData?.url ||
                labelData?.label ||
                "";


            if (labelUrl) {

                order.labelUrl =
                    labelUrl;

                await order.save();
            }


            return res.json({

                success: true,

                label,

                labelUrl,
            });


        } catch (error) {

            return res.status(
                error?.response?.status || 500
            ).json({

                success: false,

                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.message ||
                    "Unable to generate shipping label.",

                nimbusError:
                    error?.response?.data || null,
            });
        }
    };


/* =========================================================
   MANIFEST
========================================================= */

export const downloadManifestController =
    async (req, res) => {

        try {

            const {
                orderId
            } = req.params;


            const order =
                await Order.findById(
                    orderId
                );


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found.",
                });
            }


            if (!order.awbNumber) {

                return res.status(400).json({

                    success: false,

                    message:
                        "AWB number is required.",
                });
            }


            const manifest =
                await generateManifest(
                    order.awbNumber
                );


            const manifestData =
                manifest?.data?.data ||
                manifest?.data ||
                manifest;


            const manifestUrl =
                manifestData?.manifest_url ||
                manifestData?.manifestUrl ||
                manifestData?.url ||
                manifestData?.manifest ||
                "";


            if (manifestUrl) {

                order.manifestUrl =
                    manifestUrl;

                await order.save();
            }


            return res.json({

                success: true,

                manifest,

                manifestUrl,
            });


        } catch (error) {

            return res.status(
                error?.response?.status || 500
            ).json({

                success: false,

                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.message ||
                    "Unable to generate manifest.",

                nimbusError:
                    error?.response?.data || null,
            });
        }
    };