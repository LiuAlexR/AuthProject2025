import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useLocation } from "react-router";
import waves from "../../assets/layered-waves-haikei.png";

export default function DisplayQR() {
  const key: string = useLocation().state.key;
  const [value, setValue] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);

  const [code, setCode] = useState<number>(0);
  const PINK: string = "#f1b6d2";

  async function get_code(username: string) {
    const payload: string = username;

    const response = await fetch("http://localhost:8081/get_codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });

    const data = await response.json();
    console.log("Code");
    console.log(data);
  }

  function generateQRCode(key: string) {
    const LABEL = "LEBRON";
    const URI: string[] = [];

    URI.push("otpauth://totp/");
    URI.push(LABEL);
    URI.push("?secret=");
    URI.push(key);
    URI.push("&issuer=Life360");
    const finalURI = URI.join("");

    setValue(finalURI);
    setShow(true);
  }

  useEffect(() => {
    generateQRCode(key);
  }, []);

  useEffect(() => {
    get_code("USERNAME");
  });

  return (
    <div
      className="w-full h-full grid grid-rows-[1fr_8fr_1fr]"
      style={{ backgroundImage: `url(${waves})`, backgroundSize: "cover" }}
    >
      <div className="row-start-1 flex items-center justify-center mt-6">
        <p className="text-white font-extrabold text-5xl">
          {" "}
          Scan this with Duo!{" "}
        </p>
      </div>

      <div className="row-start-2 row-end-2 flex items-center justify-center">
        {show && <QRCodeSVG value={value} size={200} />}
      </div>
    </div>
  );
}
