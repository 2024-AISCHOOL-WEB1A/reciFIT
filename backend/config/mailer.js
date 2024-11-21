const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = (email, ingredientName) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"reciFIT" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "유통기한 임박 알림",
      html: `
        <html>
          <head>
            <style>
              @font-face {
                font-family: "Pretendard-Regular";
                src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff") format("woff");
                font-weight: 400;
                font-style: normal;
              }
            </style>
          </head>
          <body>
            <table
              style="background-color: white; width: 600px; height: 200px; border-radius: 25px; padding: 25px; font-family: Pretendard-Regular; letter-spacing: 0.5px; border-collapse: collapse;"
            >
              <tbody>
                <tr>
                  <td
                    style="height: 100%; width: 100%; background-image: linear-gradient(to bottom, #fdf0e8, #ffffff); border-radius: 10px; border: 3px solid #dddddd; padding: 30px;"
                  >
                    <table style="width: 100%; display: table; border-collapse: collapse;">
                      <tbody>
                        <tr>
                          <td>
                            <div
                              style="position: relative; width: 70px; height: 70px; border-radius: 50%; overflow: hidden; box-shadow: 0 0 15px 3px #fcd5b7; text-align: center; vertical-align: middle; padding: 12px 15px 15px 13px;"
                            >
                              <img
                                src="https://ns-sugarguard.s3.ap-northeast-2.amazonaws.com/images/recifit/logo192.png"
                                alt="reciFIT-logo"
                                style="width: 45px; height: 45px; object-fit: cover;"
                              />
                            </div>
                          </td>
                          <td>
                            <table style="width: 100%;">
                              <tbody>
                                <tr>
                                  <td style="font-size: 24px; font-weight: 700;">
                                    reciFIT 유통기한 임박 알림
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style="color: gray; margin-top: 10px; font-size: 18px; padding-top: 10px;"
                                  >
                                    감자의 유통기한이 3일 이내입니다.
                                    <br />
                                    서둘러 소비해주세요!
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 30px;">
                    <img
                      src="https://ns-sugarguard.s3.ap-northeast-2.amazonaws.com/images/recifit/logo.png"
                      alt="reciFIT"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      console.log("메일 전송: %s", info.response);
      resolve(info.response);
    });
  });
};

module.exports = { sendEmail };
