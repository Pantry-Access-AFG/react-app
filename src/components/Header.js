import logo from "../images/pantryaccess.png";

const Header = () => (
    
  <div>
    <div className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <p className="keep-right"> Pantry Access </p>
    </div>
    <hr
  style={{
    color: 'black',
    background: "black",
    borderColor: 'black',
    height: '0.5px',
  }} />
  </div>
  );


export default Header;