import { NavLink } from "react-router-dom";

function Nav() {

  return (
    <nav className="navbar navbar-expand-lg nav-bar-green">
      <div className="container-fluid">
        <NavLink className="nav-main" to="/">
          Main
        </NavLink>
      </div>
    </nav>
  );
}

export default Nav;
