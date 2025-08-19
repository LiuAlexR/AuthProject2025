import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useLocation } from "react-router";

export default function DisplayQR() {
  const key: string = useLocation().state.key;
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

    // console.log(finalURI);

    setValue(finalURI);
    setShow(true);
  }

  useEffect(() => {
    generateQRCode(key);
  }, []);

  return <>{show && <QRCodeSVG value={value} size={200} />}</>;
}
