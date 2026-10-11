export const buildNimbusShipmentPayload = (order) => {

    const address = order.address;

    if (!address) {

        throw new Error(
            "Order delivery address is missing."
        );

    }

    if (!order.items?.length) {

        throw new Error(
            "Order has no items."
        );

    }


    /*
    ========================================================
    PAYMENT TYPE
    ========================================================
    */

    const paymentType =
        order.paymentMethod === "COD"
            ? "cod"
            : "prepaid";


    /*
    ========================================================
    PACKAGE WEIGHT

    Product model me actual weight available ho
    to yaha use karna better hai.

    Temporary fallback:
    500 grams per item.
    ========================================================
    */

    const totalQuantity =
        order.items.reduce(
            (sum, item) =>
                sum + Number(item.quantity || 0),
            0
        );

    const packageWeight =
        Math.max(
            totalQuantity * 500,
            500
        );


    /*
    ========================================================
    ORDER ITEMS
    ========================================================
    */

    const orderItems =
        order.items.map((item) => {

            return {

                name:
                    item.productName,

                qty:
                    String(item.quantity),

                price:
                    String(item.price),

                sku:
                    item.sku ||
                    String(item.product || "")

            };

        });


    /*
    ========================================================
    PAYLOAD
    ========================================================
    */

    const payload = {

        order_number:
            order.orderNumber,

        shipping_charges:
            String(order.deliveryCharge || 0),

        discount:
            String(order.discount || 0),

        cod_charges:
            "0",

        payment_type:
            paymentType,

        order_amount:
            String(order.grandTotal || 0),

        package_weight:
            String(packageWeight),

        package_length:
            "10",

        package_breadth:
            "10",

        package_height:
            "10",


        /*
        ====================================================
        CONSIGNEE
        ====================================================
        */

        consignee: {

            name:
                address.fullName,

            company_name:
                "",

            address:
                address.houseNo || "",

            address_2:
                [
                    address.area,
                    address.landmark
                ]
                    .filter(Boolean)
                    .join(", "),

            city:
                address.city,

            state:
                address.state,

            pincode:
                String(address.pincode),

            phone:
                String(address.mobile)

        },


        /*
        ====================================================
        ORDER ITEMS
        ====================================================
        */

        order_items:
            orderItems

    };


    return payload;

};