import { motion } from "motion/react";
import "./Login.css";
import { useState, type FormEvent } from "react";
interface Inputs {
  username: string;
  password: string
}
export default function Login() {
  const [inputs, setInputs] = useState<Inputs>({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const handleChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.target as HTMLInputElement; // Cast event.target to HTMLInputElement
    const name = target.name;
    const value = target.value;

    setInputs(values => ({ ...values, [name]: value }));
  }
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setMessage(null);
    setIsError(false);
    setLoading(true);
    const dataToSend = {
        ...inputs
    };

    try {
        const response = await fetch("http://localhost:8081/verify_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Parse error response body
            throw new Error(errorData.message || "Failed to submit form. Please try again.");
        }

        const result = await response.json(); // Parse successful response body
        console.log("Form submitted successfully:", result);

        // Set success message and clear the form
        setMessage("Your message has been sent successfully!");
        setIsError(false);
        setInputs({ username: "", password: "" }); // Clear form fields

    } catch (error: any) {
        console.error("Error submitting form:", error);
        // Set error message
        setMessage(error.message || "An unexpected error occurred. Please try again later.");
        setIsError(true);
    } finally {
        setLoading(false); // Set loading state to false regardless of success or failure
    }
}
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
            <form className="h-full w-full flex justify-center items-center flex-col gap-5" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="username"
                // value={inputs.username}
                // onChange={handleChange}
                size={40}
                className="border-solid border-2 border-white rounded-2xl p-2"
              />
              <input
                type="password"
                placeholder="password"
                // value={inputs.password}
                onChange={handleChange}
                className="border-solid border-2 border-white rounded-2xl p-2"
              />

              <input
                type="submit"
                value="Submit"
                disabled={loading}
                className="bg-emerald-300 p-3 rounded-3xl w-30 text-black"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
