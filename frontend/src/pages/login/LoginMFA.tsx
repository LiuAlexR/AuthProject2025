import { useRef, useState, type ChangeEvent } from "react";
import React from "react";
import { useLocation } from "react-router";

interface MFARequest {
  jwt: string;
  password: number;
}

export default function LoginMFA() {
  const jwt: string = useLocation().state.jwt;
  const NUMBERS = RegExp("^[0-9]+$");
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const digitRefs = Array(6).fill(React.createRef());

  const makeRequest = async () => {
    const req: MFARequest = {
      jwt: jwt,
      password: Number.parseInt(digits.join("")),
    };

    try {
      const response = await fetch("http://localhost:8081/verify_login_2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });

      const data = await response.json();
      console.log(data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const changeHandler = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const input = e.target.value;
    if (!NUMBERS.test(input)) {
      e.target.value = "";
      return;
    }
    digits[idx] = input;
    setDigits(digits);

    if (idx < 5) {
      const next: HTMLInputElement = digitRefs[idx + 1];
      next.focus();
    }
  };

  const backspaceHandler = (e, index: number) => {
    if (e.key == "Backspace") {
      const x: HTMLInputElement = digitRefs[index];
      if (x.value == "" && index !== 0) {
        const prev: HTMLInputElement = digitRefs[index - 1];
        prev.focus();
      }
    }
  };

  return (
    <div className="grid grid-rows-[1fr_5fr_1fr] h-full w-full bg-black">
      <div />
      <div className="flex items-center justify-evenly">
        {digits.map((digit, idx) => (
          <input
            ref={(el) => (digitRefs[idx] = el)}
            type="text"
            maxLength={1}
            key={idx}
            className="text-center text-5xl h-40 w-40 rounded-3xl bg-white"
            onChange={(e) => changeHandler(e, idx)}
            onKeyDown={(e) => backspaceHandler(e, idx)}
          />
        ))}

        <button className="bg-red-400" onClick={makeRequest}>
          Click me!
        </button>
      </div>
    </div>
  );
}
