import { NavLink } from "react-router-dom";

function Nav() {

  return (
    <nav className="navbar navbar-expand-lg nav-bar-green">
      <div className="container-fluid">
        <NavLink className="nav-main" to="/">
          Main
        </NavLink>
        <NavLink className="nav-redirect" to="/qr">
          <h5>QR</h5>
        </NavLink>
        <NavLink className="nav-redirect" to="/dotcom">
          <h5>DotCom</h5>
        </NavLink>
        <NavLink className="nav-redirect" to="/driver">
          <h5>Driver</h5>
        </NavLink>

      </div>
    </nav>
  );
}

export default Nav;
