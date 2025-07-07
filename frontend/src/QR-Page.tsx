import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
export default function QR_Page() {
  const [value, setValue] = useState<string>("");

  const [show, setShow] = useState<boolean>(false);
  function generateQRCode() {
    console.log("cicked");
    setValue(
      "otpauth://totp/Minecraft?secret=JEQGC3JAMEQGI5LDNM======&issuer=Lebron",
    );
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
    } catch (error: any) {
      console.log(error.message);
    }
  }

  return (
    <>
      {show && <QRCodeSVG value={value} size={200} />}
      <button onClick={registerUser}> Hello </button>
    </>
  );
}
