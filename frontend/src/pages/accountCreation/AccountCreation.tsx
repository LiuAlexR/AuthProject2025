import vid from "../../assets/background_video.mp4";

export default function AccountCreation() {
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

        <form className="text-white font-bold font-serif text-4xl row-start-2 flex flex-col items-center gap-5 ">
          <input
            name="email"
            type="email"
            placeholder="example@gmail.com"
            className="placeholder:text-white "
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
