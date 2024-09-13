import { Link, Outlet, NavLink } from "react-router-dom";
import { UserContext } from "../contexts/usercontext";
import { useContext } from "react";

function Nav() {
  const { data, authLoading } = useContext(UserContext);
  if (authLoading) {
    return null;
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link style={{ textDecoration: "none" }} to="/">
            <h4 id="nav-head">Placement Cell</h4>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {data ? (
                <>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "nav-link active-link" : "nav-link"
                      }
                      to="/"
                    >
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "nav-link active-link" : "nav-link"
                      }
                      to="/users/add-expense"
                    >
                      Add Expense
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "nav-link active-link" : "nav-link"
                      }
                      to="/users/profile"
                    >
                      <img
                        id="profile-photo"
                        src="https://cdn-icons-png.flaticon.com/128/149/149071.png"
                        alt=""
                      />
                      {data.name}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "nav-link active-link" : "nav-link"
                      }
                      to="/users/sign-out"
                    >
                      Log-out
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "nav-link active-link" : "nav-link"
                      }
                      to="/"
                    >
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "nav-link active-link" : "nav-link"
                      }
                      to="/users/sign-in"
                    >
                      Sign-in
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "nav-link active-link" : "nav-link"
                      }
                      to="/users/sign-up"
                    >
                      Sign-up
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}
export default Nav;
