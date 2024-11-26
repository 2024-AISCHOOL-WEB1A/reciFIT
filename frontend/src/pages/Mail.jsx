import React from "react";

const Mail = () => {
  return (
    <table
      style={{
        backgroundColor: "white",
        width: "600px",
        height: "200px",
        borderRadius: "25px",
        padding: "25px",
        fontFamily: "Pretendard-Regular",
        letterSpacing: "0.5px",
        borderCollapse: "collapse",
      }}
    >
      <tbody>
        <tr>
          <td
            style={{
              height: "100%",
              width: "100%",
              backgroundImage: "linear-gradient(to bottom, #fdf0e8, #ffffff)",
              borderRadius: "10px",
              border: "3px solid #dddddd",
              padding: "30px",
            }}
          >
            <table
              style={{
                width: "100%",
                display: "table",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <tr>
                  <td>
                    <div
                      style={{
                        position: "relative",
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        boxShadow: "0 0 15px 3px #fcd5b7",
                        textAlign: "center",
                        verticalAlign: "middle",
                        padding: "12px 15px 15px 13px",
                      }}
                    >
                      <img
                        src="https://ns-sugarguard.s3.ap-northeast-2.amazonaws.com/images/recifit/logo192.png"
                        alt="reciFIT-logo"
                        style={{
                          width: "45px",
                          height: "45px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <table style={{ width: "100%" }}>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              fontSize: "24px",
                              fontWeight: "700",
                            }}
                          >
                            reciFIT 유통기한 임박 알림
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              color: "gray",
                              marginTop: "10px",
                              fontSize: "18px",
                              paddingTop: "10px",
                            }}
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
          <td style={{ textAlign: "center", paddingTop: "30px" }}>
            <img
              src="https://ns-sugarguard.s3.ap-northeast-2.amazonaws.com/images/recifit/logo.png"
              alt="reciFIT"
            />
          </td>
        </tr>
      </tbody>
    </table>
    // <div
    //   style={{
    //     backgroundColor: "white",
    //     width: "600px",
    //     height: "200px",
    //     borderRadius: "25px",
    //     display: "flex",
    //     flexDirection: "column",
    //     alignContent: "center",
    //     padding: "25px",
    //     letterSpacing: "0.5px",
    //     fontFamily: "Pretendard-Regular",
    //   }}
    // >
    //   <div
    //     style={{
    //       height: "100%",
    //       width: "100%",
    //       backgroundImage: "linear-gradient(to bottom, #fdf0e8, #ffffff)",
    //       borderRadius: "10px",
    //       border: "#dddddd 3px solid",
    //       display: "flex",
    //       padding: "30px",
    //     }}
    //   >
    //     <div
    //       style={{
    //         position: "relative",
    //         width: "50px",
    //         height: "50px",
    //         borderRadius: "50%",
    //         overflow: "hidden",
    //         boxShadow: "0 0 15px 3px #fcd5b7",
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         marginRight: "40px",
    //       }}
    //     >
    //       <img
    //         src="https://ns-sugarguard.s3.ap-northeast-2.amazonaws.com/images/recifit/logo192.png"
    //         alt="reciFIT-logo"
    //         style={{
    //           width: "60%",
    //           height: "60%",
    //           objectFit: "cover",
    //         }}
    //       />
    //     </div>
    //     <div style={{ display: "flex", flexDirection: "column" }}>
    //       <span style={{ fontSize: "24px", fontWeight: "700" }}>
    //         reciFIT 유통기한 임박 알림
    //       </span>
    //       <span style={{ color: "gray", marginTop: "10px", fontSize: "18px" }}>
    //         감자의 유통기한이 3일 이내입니다.
    //         <br />
    //         서둘러 소비해주세요!
    //       </span>
    //     </div>
    //   </div>
    //   <div style={{ marginTop: "30px" }}>
    //     <img
    //       src="https://ns-sugarguard.s3.ap-northeast-2.amazonaws.com/images/recifit/logo.png"
    //       alt="reciFIT"
    //     />
    //   </div>
    // </div>
  );
};

export default Mail;
