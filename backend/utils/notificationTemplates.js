const BRAND_NAME = "NextTGrains";

const formatCurrency = (amount) => {
  const number = Number(amount || 0);

  return `₹${number.toLocaleString("en-IN")}`;
};

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const baseTemplate = ({
  title,
  subtitle = "",
  content,
  buttonText = null,
  buttonUrl = null,
}) => {
  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8" />

<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>${escapeHtml(title)}</title>

</head>

<body
style="
margin:0;
padding:0;
background:#f5f4ef;
font-family:Arial,Helvetica,sans-serif;
color:#292d22;
"
>

<table
width="100%"
cellspacing="0"
cellpadding="0"
style="background:#f5f4ef;padding:40px 15px;"
>

<tr>

<td align="center">

<table
width="100%"
cellspacing="0"
cellpadding="0"
style="
max-width:620px;
background:#ffffff;
border-radius:18px;
overflow:hidden;
box-shadow:0 8px 30px rgba(0,0,0,.06);
"
>

<!-- HEADER -->

<tr>

<td
style="
background:#315f2d;
padding:28px 30px;
text-align:center;
"
>

<div
style="
display:inline-block;
width:52px;
height:52px;
line-height:52px;
border-radius:50%;
background:#ffffff;
color:#315f2d;
font-size:26px;
font-weight:bold;
"
>
N
</div>

<div
style="
margin-top:10px;
font-size:22px;
font-weight:bold;
color:#ffffff;
"
>
${BRAND_NAME}
</div>

<div
style="
margin-top:5px;
font-size:12px;
letter-spacing:2px;
color:#dfead8;
"
>
PURE • HONEST • ORGANIC
</div>

</td>

</tr>

<!-- BODY -->

<tr>

<td style="padding:38px 35px;">

<h1
style="
margin:0;
font-size:27px;
line-height:1.25;
color:#294d25;
"
>
${escapeHtml(title)}
</h1>

${
  subtitle
    ? `
<p
style="
margin:10px 0 25px;
font-size:15px;
line-height:1.6;
color:#777;
"
>
${escapeHtml(subtitle)}
</p>
`
    : ""
}

<div
style="
font-size:15px;
line-height:1.7;
color:#454545;
"
>

${content}

</div>

${
  buttonText && buttonUrl
    ? `
<div style="margin-top:30px;text-align:center;">

<a
href="${buttonUrl}"
style="
display:inline-block;
padding:13px 24px;
background:#315f2d;
color:#ffffff;
text-decoration:none;
border-radius:9px;
font-size:14px;
font-weight:bold;
"
>
${escapeHtml(buttonText)}
</a>

</div>
`
    : ""
}

</td>

</tr>

<!-- FOOTER -->

<tr>

<td
style="
padding:22px 30px;
background:#faf9f5;
text-align:center;
border-top:1px solid #eeeeea;
"
>

<p
style="
margin:0;
font-size:12px;
color:#777;
"
>
© ${new Date().getFullYear()} ${BRAND_NAME}
</p>

<p
style="
margin:7px 0 0;
font-size:11px;
color:#999;
"
>
This is an automated notification. Please do not reply directly to this email.
</p>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`;
};


// =====================================================
// CUSTOMER REGISTERED
// =====================================================

export const customerRegisteredEmail = ({
  name,
}) => ({
  subject: `Welcome to ${BRAND_NAME}, ${name}`,

  html: baseTemplate({
    title: "Welcome to NextTGrains 🌾",

    subtitle: "Your account has been created successfully.",

    content: `
<p>
Hello <strong>${escapeHtml(name)}</strong>,
</p>

<p>
Thank you for creating your NextTGrains account.
We're happy to have you with us.
</p>

<p>
You can now explore our range of quality grains and
organic products.
</p>
`,
  }),
});


// =====================================================
// ADMIN — CUSTOMER REGISTERED
// =====================================================

export const adminCustomerRegisteredEmail = ({
  name,
  email,
  phone,
}) => ({
  subject: `New Customer Registered — ${name}`,

  html: baseTemplate({
    title: "New Customer Registered",

    subtitle: "A new customer has joined NextTGrains.",

    content: `
<table
width="100%"
cellspacing="0"
cellpadding="0"
style="
background:#f7f8f4;
border-radius:12px;
padding:18px;
"
>

<tr>
<td style="padding:8px 0;color:#777;">Name</td>
<td style="padding:8px 0;font-weight:bold;">
${escapeHtml(name)}
</td>
</tr>

<tr>
<td style="padding:8px 0;color:#777;">Email</td>
<td style="padding:8px 0;font-weight:bold;">
${escapeHtml(email)}
</td>
</tr>

<tr>
<td style="padding:8px 0;color:#777;">Phone</td>
<td style="padding:8px 0;font-weight:bold;">
${escapeHtml(phone)}
</td>
</tr>

</table>
`,
  }),
});


// =====================================================
// ADMIN — VENDOR REGISTERED
// =====================================================

export const adminVendorRegisteredEmail = ({
  name,
  email,
  phone,
  businessName,
  gstNumber,
}) => ({
  subject: `New Vendor Registration — ${businessName}`,

  html: baseTemplate({
    title: "New Vendor Registration 🏪",

    subtitle: "A new vendor has registered on NextTGrains.",

    content: `
<table
width="100%"
cellspacing="0"
cellpadding="0"
style="
background:#f7f8f4;
border-radius:12px;
padding:18px;
"
>

<tr>
<td style="padding:8px 0;color:#777;">Vendor</td>
<td style="padding:8px 0;font-weight:bold;">
${escapeHtml(name)}
</td>
</tr>

<tr>
<td style="padding:8px 0;color:#777;">Business</td>
<td style="padding:8px 0;font-weight:bold;">
${escapeHtml(businessName)}
</td>
</tr>

<tr>
<td style="padding:8px 0;color:#777;">Email</td>
<td style="padding:8px 0;font-weight:bold;">
${escapeHtml(email)}
</td>
</tr>

<tr>
<td style="padding:8px 0;color:#777;">Phone</td>
<td style="padding:8px 0;font-weight:bold;">
${escapeHtml(phone)}
</td>
</tr>

${
  gstNumber
    ? `
<tr>
<td style="padding:8px 0;color:#777;">GST</td>
<td style="padding:8px 0;font-weight:bold;">
${escapeHtml(gstNumber)}
</td>
</tr>
`
    : ""
}

</table>
`,
  }),
});


// =====================================================
// ADMIN — PRODUCT ADDED
// =====================================================

export const adminProductAddedEmail = ({
  productName,
  vendorName,
}) => ({
  subject: `New Product Added — ${productName}`,

  html: baseTemplate({
    title: "New Product Added 📦",

    subtitle: "A vendor has added a new product.",

    content: `
<p>
<strong>Product:</strong>
${escapeHtml(productName)}
</p>

<p>
<strong>Vendor:</strong>
${escapeHtml(vendorName || "Vendor")}
</p>

<p>
Please review the product from the admin console.
</p>
`,
  }),
});


// =====================================================
// ADMIN — ORDER PLACED
// =====================================================

export const adminOrderPlacedEmail = ({
  orderNumber,
  customerName,
  totalAmount,
  itemCount,
}) => ({
  subject: `New Order Received — #${orderNumber}`,

  html: baseTemplate({
    title: "New Order Received 🛒",

    subtitle: `Order #${orderNumber} has been placed.`,

    content: `
<table
width="100%"
cellspacing="0"
cellpadding="0"
style="
background:#f7f8f4;
border-radius:12px;
padding:18px;
"
>

<tr>
<td style="padding:8px 0;color:#777;">Order</td>
<td style="padding:8px 0;font-weight:bold;">
#${escapeHtml(orderNumber)}
</td>
</tr>

<tr>
<td style="padding:8px 0;color:#777;">Customer</td>
<td style="padding:8px 0;font-weight:bold;">
${escapeHtml(customerName || "Customer")}
</td>
</tr>

<tr>
<td style="padding:8px 0;color:#777;">Items</td>
<td style="padding:8px 0;font-weight:bold;">
${itemCount || 0}
</td>
</tr>

<tr>
<td style="padding:8px 0;color:#777;">Total</td>
<td style="padding:8px 0;font-weight:bold;">
${formatCurrency(totalAmount)}
</td>
</tr>

</table>
`,
  }),
});


// =====================================================
// CUSTOMER — ORDER PLACED
// =====================================================

export const customerOrderPlacedEmail = ({
  customerName,
  orderNumber,
  totalAmount,
}) => ({
  subject: `Order Confirmed — #${orderNumber}`,

  html: baseTemplate({
    title: "Order Placed Successfully 🎉",

    subtitle: `Thank you for shopping with ${BRAND_NAME}.`,

    content: `
<p>
Hello <strong>${escapeHtml(customerName || "Customer")}</strong>,
</p>

<p>
Your order
<strong>#${escapeHtml(orderNumber)}</strong>
has been placed successfully.
</p>

<div
style="
background:#f7f8f4;
border-radius:12px;
padding:18px;
margin-top:20px;
"
>

<p style="margin:0 0 8px;">
<strong>Order Number:</strong>
#${escapeHtml(orderNumber)}
</p>

<p style="margin:0;">
<strong>Total:</strong>
${formatCurrency(totalAmount)}
</p>

</div>

<p>
We'll keep you updated about your order.
</p>
`,
  }),
});


// =====================================================
// ADMIN — PAYMENT SUCCESS
// =====================================================

export const adminPaymentSuccessEmail = ({
  orderNumber,
  paymentId,
  amount,
}) => ({
  subject: `Payment Received — Order #${orderNumber}`,

  html: baseTemplate({
    title: "Payment Received 💳",

    subtitle: `Payment for order #${orderNumber} was successful.`,

    content: `
<p>
<strong>Order:</strong>
#${escapeHtml(orderNumber)}
</p>

<p>
<strong>Payment ID:</strong>
${escapeHtml(paymentId || "N/A")}
</p>

<p>
<strong>Amount:</strong>
${formatCurrency(amount)}
</p>
`,
  }),
});


// =====================================================
// CUSTOMER — PAYMENT SUCCESS
// =====================================================

export const customerPaymentSuccessEmail = ({
  customerName,
  orderNumber,
  amount,
}) => ({
  subject: `Payment Successful — #${orderNumber}`,

  html: baseTemplate({
    title: "Payment Successful ✅",

    content: `
<p>
Hello <strong>${escapeHtml(customerName || "Customer")}</strong>,
</p>

<p>
Your payment for order
<strong>#${escapeHtml(orderNumber)}</strong>
was successfully received.
</p>

<p>
<strong>Amount Paid:</strong>
${formatCurrency(amount)}
</p>

<p>
Your order is now being processed.
</p>
`,
  }),
});


// =====================================================
// ADMIN — PAYMENT FAILED
// =====================================================

export const adminPaymentFailedEmail = ({
  orderNumber,
  amount,
  reason,
}) => ({
  subject: `Payment Failed — Order #${orderNumber}`,

  html: baseTemplate({
    title: "Payment Failed ⚠️",

    content: `
<p>
Payment for order
<strong>#${escapeHtml(orderNumber)}</strong>
could not be completed.
</p>

<p>
<strong>Amount:</strong>
${formatCurrency(amount)}
</p>

${
  reason
    ? `
<p>
<strong>Reason:</strong>
${escapeHtml(reason)}
</p>
`
    : ""
}
`,
  }),
});


// =====================================================
// CUSTOMER — PAYMENT FAILED
// =====================================================

export const customerPaymentFailedEmail = ({
  customerName,
  orderNumber,
}) => ({
  subject: `Payment Failed — #${orderNumber}`,

  html: baseTemplate({
    title: "Payment Could Not Be Completed",

    content: `
<p>
Hello <strong>${escapeHtml(customerName || "Customer")}</strong>,
</p>

<p>
Unfortunately, the payment for order
<strong>#${escapeHtml(orderNumber)}</strong>
was unsuccessful.
</p>

<p>
Please try again or choose another payment method.
</p>
`,
  }),
});


// =====================================================
// ADMIN — ORDER CANCELLED
// =====================================================

export const adminOrderCancelledEmail = ({
  orderNumber,
  customerName,
}) => ({
  subject: `Order Cancelled — #${orderNumber}`,

  html: baseTemplate({
    title: "Order Cancelled",

    content: `
<p>
Order
<strong>#${escapeHtml(orderNumber)}</strong>
has been cancelled.
</p>

<p>
Customer:
<strong>${escapeHtml(customerName || "Customer")}</strong>
</p>
`,
  }),
});


// =====================================================
// CUSTOMER — ORDER CANCELLED
// =====================================================

export const customerOrderCancelledEmail = ({
  customerName,
  orderNumber,
}) => ({
  subject: `Order Cancelled — #${orderNumber}`,

  html: baseTemplate({
    title: "Order Cancelled",

    content: `
<p>
Hello <strong>${escapeHtml(customerName || "Customer")}</strong>,
</p>

<p>
Your order
<strong>#${escapeHtml(orderNumber)}</strong>
has been cancelled.
</p>

<p>
If you did not request this cancellation, please contact our support team.
</p>
`,
  }),
});


// =====================================================
// GENERIC
// =====================================================

export const genericNotificationEmail = ({
  title,
  message,
}) => ({
  subject: `NextTGrains — ${title}`,

  html: baseTemplate({
    title,

    content: `
<p>
${escapeHtml(message)}
</p>
`,
  }),
});