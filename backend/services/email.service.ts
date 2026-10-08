import transporter from "../config/mailer";

interface EnquiryEmailData {
  name: string;
  email: string;
  phone: string;
  message: string;
  agree: boolean;
}

export const sendEnquiryEmail = async ({
  name,
  email,
  phone,
  message,
  agree,
}: EnquiryEmailData) => {
  if (!process.env.MAIL_FROM) {
    throw new Error("MAIL_FROM is not defined");
  }

  if (!process.env.MAIL_TO) {
    throw new Error("MAIL_TO is not defined");
  }

  const mailOptions = {
    from: `"Strap World" <${process.env.MAIL_FROM}>`,

    to: process.env.MAIL_TO,

    replyTo: email,

    subject: `New Website Enquiry - ${name}`,

    html: `
      <!DOCTYPE html>

      <html>
        <head>
          <meta charset="UTF-8" />
          <title>New Website Enquiry</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background: #f5f5f5;
            font-family: Arial, Helvetica, sans-serif;
          "
        >

          <div
            style="
              max-width: 650px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid #e5e5e5;
            "
          >

            <!-- HEADER -->

            <div
              style="
                background: #000000;
                padding: 25px 30px;
              "
            >
              <h1
                style="
                  margin: 0;
                  color: #ffffff;
                  font-size: 24px;
                "
              >
                New Website Enquiry
              </h1>

              <p
                style="
                  margin: 8px 0 0;
                  color: #aaaaaa;
                  font-size: 14px;
                "
              >
                You have received a new enquiry from your website.
              </p>
            </div>

            <!-- CONTENT -->

            <div style="padding: 30px;">

              <table
                style="
                  width: 100%;
                  border-collapse: collapse;
                "
              >

                <tr>
                  <td
                    style="
                      padding: 12px 0;
                      width: 130px;
                      font-weight: bold;
                      color: #333333;
                      border-bottom: 1px solid #eeeeee;
                    "
                  >
                    Name
                  </td>

                  <td
                    style="
                      padding: 12px 0;
                      color: #555555;
                      border-bottom: 1px solid #eeeeee;
                    "
                  >
                    ${escapeHtml(name)}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 12px 0;
                      font-weight: bold;
                      color: #333333;
                      border-bottom: 1px solid #eeeeee;
                    "
                  >
                    Email
                  </td>

                  <td
                    style="
                      padding: 12px 0;
                      color: #555555;
                      border-bottom: 1px solid #eeeeee;
                    "
                  >
                    ${escapeHtml(email)}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 12px 0;
                      font-weight: bold;
                      color: #333333;
                      border-bottom: 1px solid #eeeeee;
                    "
                  >
                    Phone
                  </td>

                  <td
                    style="
                      padding: 12px 0;
                      color: #555555;
                      border-bottom: 1px solid #eeeeee;
                    "
                  >
                    ${escapeHtml(phone)}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 12px 0;
                      font-weight: bold;
                      color: #333333;
                      border-bottom: 1px solid #eeeeee;
                      vertical-align: top;
                    "
                  >
                    Message
                  </td>

                  <td
                    style="
                      padding: 12px 0;
                      color: #555555;
                      border-bottom: 1px solid #eeeeee;
                      white-space: pre-line;
                    "
                  >
                    ${escapeHtml(message)}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 12px 0;
                      font-weight: bold;
                      color: #333333;
                    "
                  >
                    Agreement
                  </td>

                  <td
                    style="
                      padding: 12px 0;
                      color: #555555;
                    "
                  >
                    ${agree ? "Yes" : "No"}
                  </td>
                </tr>

              </table>

              <div
                style="
                  margin-top: 30px;
                  padding: 15px;
                  background: #f7f7f7;
                  border-radius: 8px;
                  font-size: 13px;
                  color: #777777;
                "
              >
                This email was automatically generated from the
                Strap World website enquiry form.
              </div>

            </div>

          </div>

        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};


/**
 * Escape user-provided data before inserting it
 * into the HTML email.
 */
const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};