import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { JavaServer, QR } from "./Technicals";
import { useLocation } from "react-router";
export default function QR_Page() {
  const [value, setValue] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);

  const user = useLocation().state.email;
  const pw = useLocation().state.password;

  function generateQRCode(key: string) {
    const URI: string[] = [];

    URI.push("otpauth://totp/");
    URI.push(QR.VENDOR);
    URI.push("?secret=");
    URI.push(key);
    URI.push("&issuer=Life360");
    const finalURI = URI.join("");

    setValue(finalURI);
    setShow(true);
  }
  interface User {
    username: string;
    password: string;
  }

  async function registerUser() {
    let x: User = { username: user, password: pw };
    const CONNECTION: string = JavaServer.PORT + JavaServer.REGISTER;

    try {
      const response = await fetch(CONNECTION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(x),
      });
      const data = await response.json();
      generateQRCode(data);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  // async function getCodes() {
  //   const CONNECTION: string = JavaServer.PORT + JavaServer.GET_CODE;
  //
  //   try {
  //     const response = await fetch(CONNECTION, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: QR.VENDOR,
  //     });
  //
  //     const data = await response.json();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <>
      {show && <QRCodeSVG value={value} size={200} />}
      <button onClick={registerUser}> Hello </button>

      {/* <button onClick={getCodes}> GET CODES </button> */}
    </>
  );
}
