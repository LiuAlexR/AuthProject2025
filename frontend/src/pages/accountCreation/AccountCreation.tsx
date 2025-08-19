import vid from "../../assets/background_video.mp4";
import { useNavigate } from "react-router";

interface User {
  username: string;
  password: string;
}

export default function AccountCreation() {
  const nav = useNavigate();
  async function sendData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email: string = formData.get("email") as string;
    const password: string = formData.get("password") as string;

    const user: User = { username: email, password: password };

    const response = await fetch("http://localhost:8081/register_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    console.log(data);

    nav("/display-qr", { state: { key: data } });
  }

  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-screen h-screen object-cover "
      >
        <source src={vid} type="video/mp4" />
      </video>

      <div className="font-serif absolute grid grid-rows-3 w-full h-full">
        <div className="row-start-1 flex justify-center items-center">
          <p className="text-white font-extrabold text-6xl"> Sign up </p>
        </div>

        <form
          className="text-white font-bold font-serif text-4xl row-start-2 flex flex-col items-center gap-5 "
          onSubmit={sendData}
        >
          <input
            name="email"
            type="email"
            placeholder="example@gmail.com"
            className="placeholder:text-white bg-transparent "
          />

          <input
            name="password"
            type="password"
            placeholder="password time"
            className="placeholder:text-white"
          />

          <input
            type="submit"
            className="p-3 text-white cursor-pointer rounded-full hover:bg-gradient-to-r from-emerald-400 to-blue-400"
          />
        </form>
      </div>
    </>
  );
}
