import logo from "../images/pantryaccess.png";
import { Link } from "react-router-dom";

/**
 * Makes a header for all pages for the web app
 * @returns Header component
 */
const Header = () => (
  <div>
    <div className="App-header">
      <Link to="/">
        <img src={logo} className="App-logo" alt="logo" />
      </Link>
      <Link to="/" className="keep-right no-underline-link">
        <p>Pantry Access</p>
      </Link>
    </div>
    <hr
      style={{
        color: "black",
        background: "black",
        borderColor: "black",
        height: "0.5px",
      }}
    />
  </div>
);

export default Header;
