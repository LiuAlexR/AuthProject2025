import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useLocation } from "react-router";
import waves from "../../assets/layered-waves-haikei.png";

export default function DisplayQR() {
  const key: string = useLocation().state.key;
  console.log(key);
  const email: string = useLocation().state.user;
  console.log("EMAIL: " + email);
  const [value, setValue] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);

  const [code, setCode] = useState<number[]>([]);
  const PINK: string = "#f1b6d2";

  async function get_code(username: string) {
    console.log("payload: " + username);
    const payload: string = username;

    const response = await fetch("http://localhost:8081/get_codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });

    const data = await response.json();
    console.log("Code");
    console.log(data);
    setCode(data);
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
    get_code(email);
  }, []);

  return (
    <div
      className="w-full h-full grid grid-rows-[1fr_8fr_1fr]"
      style={{ backgroundImage: `url(${waves})`, backgroundSize: "cover" }}
    >
      <div className="row-start-1 flex items-center justify-center mt-6 flex-col">
        <p className="text-white font-extrabold text-5xl">
          Scan this with Duo!{" "}
        </p>
        <div className="text-white font-extrabold text-5xl">
          {code.map((code, idx) => (
            <p key={idx}> {code} </p>
          ))}
        </div>
      </div>

      <div className="row-start-2 row-end-2 flex items-center justify-center">
        {show && <QRCodeSVG value={value} size={500} />}
      </div>
    </div>
  );
}
