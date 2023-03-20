import logo from "../images/pantryaccess.png";

const Header = () => (
  <div>
    <div className="App-header">
      <a href="/">
        <img src={logo} className="App-logo" alt="logo" />
      </a>
      <a href="/" className="keep-right no-underline-link">
        <p>Pantry Access</p>
      </a>
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
