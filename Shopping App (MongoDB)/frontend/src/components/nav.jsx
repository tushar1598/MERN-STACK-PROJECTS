import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/usercontext";
import { useContext, useState } from "react";
import CartContext from "../contexts/cartcontext";

function Nav() {
  const { data, authLoading } = useContext(UserContext);
  let { cartItems, cartLoading } = useContext(CartContext);

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/users/search?query=${searchQuery}`);
    }
  };

  if (authLoading) {
    return null;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link style={{ textDecoration: "none" }} to="/">
            <h4 id="nav-head">E-Commerce</h4>
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
                    <form
                      className="d-flex"
                      role="search"
                      onSubmit={handleSearchSubmit}
                    >
                      <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchQuery}
                        required
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button className="btn btn-outline-success" type="submit">
                        Search
                      </button>
                    </form>
                  </li>
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
                      to="/users/my-orders"
                    >
                      My Orders
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
                        src={`http://localhost:9000${data.profileImage}`}
                        alt=""
                      />
                      {data.name}
                    </NavLink>
                  </li>

                  <li className="nav-item" id="cart">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "nav-link active-link" : "nav-link"
                      }
                      to="/users/cart"
                    >
                      <div className="cart-link">
                        <i className="fas fa-shopping-cart"></i>
                        <span className="item-count">{cartItems.length}</span>
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/1170/1170576.png"
                          alt=""
                        />
                      </div>
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
                    <form
                      className="d-flex"
                      role="search"
                      onSubmit={handleSearchSubmit}
                    >
                      <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchQuery}
                        required
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button className="btn btn-outline-success" type="submit">
                        Search
                      </button>
                    </form>
                  </li>
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
