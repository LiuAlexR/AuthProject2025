import { motion } from "motion/react";
import "./Login.css";
export default function Login() {
  return (
    <>
      <div
        className="w-full h-full grid grid-rows-[1fr_5fr] gap-5"
        style={{
          backgroundImage:
            "linear-gradient(to right top, #0091cd, #5c95d9, #8c99e0, #b49ce1, #d5a0dd, #d7a9e8, #d9b1f4, #dbbaff, #b3cbff, #80dbff, #4ae9ff, #3af3ff)",
        }}
      >
        <div className="row-start-1 flex justify-center items-center">
          <p className="text-white font-bold text-6xl"> Login </p>
        </div>

        <div className="row-start-2 flex justify-center ">
          <div className="bg-purple-100 h-1/2 w-100 rounded-3xl m-15 shadow-pink-300 shadow-lg">
            <form className="h-full w-full flex justify-center items-center flex-col gap-5">
              <input
                type="email"
                placeholder="email"
                size={40}
                className="border-solid border-2 border-white rounded-2xl p-2"
              />
              <input
                type="password"
                placeholder="password"
                className="border-solid border-2 border-white rounded-2xl p-2"
              />

              <input
                type="submit"
                value="Submit"
                className="bg-emerald-300 p-3 rounded-3xl w-30 text-black"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
