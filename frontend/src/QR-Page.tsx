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

  return (
    <>
      {show && <QRCodeSVG value={value} size={200} />}
      <button onClick={generateQRCode}> Hello </button>
    </>
  );
}
