import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
export default function QR_Page() {
  const [value, setValue] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);

  function generateQRCode(key: string) {
    const LABEL = "LEBRON";
    const URI: string[] = [];

    URI.push("otpauth://totp/");
    URI.push(LABEL);
    URI.push("?secret=");
    URI.push(key);
    URI.push("&issuer=Life360");
    const finalURI = URI.join("");

    console.log(finalURI);

    setValue(finalURI);
    setShow(true);
  }
  interface User {
    username: string;
    password: string;
  }

  async function registerUser() {
    let x: User = { username: "Lebron", password: "idk" };
    try {
      const response = await fetch("http://localhost:8080/register_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(x),
      });
      const data = await response.json();
      console.log(data);
      generateQRCode(data);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async function getCodes() {
    const username = "Lebron";
    console.log(JSON.stringify(username));
    try {
      const response = await fetch("http://localhost:8080/get_codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: username,
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {show && <QRCodeSVG value={value} size={200} />}
      <button onClick={registerUser}> Hello </button>

      <button onClick={getCodes}> GET CODES </button>
    </>
  );
}
