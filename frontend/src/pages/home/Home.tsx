import { Link } from "react-router";
import "./Home.css";
export default function Home() {
  return (
    <>
      <h1>This is the home page!</h1>
      <h2>
        <Link title={"Login"} to={"/login"} className="link">
          Login here
        </Link>
      </h2>
    </>
  );
}

