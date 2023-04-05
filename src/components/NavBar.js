import { useNavigate, useLocation } from "react-router-dom";
/**
 * Makes a navigation bar with the profile, home, and my requests tabs.
 * @returns the navigation bar
 */
export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex-container">
      <button
        className={
          location.pathname === "/profile"
            ? "navbar-tab-selected"
            : "navbar-tab-unselected"
        }
        onClick={() => navigate("/profile")}
      >
        Profile
      </button>
      <button
        className={
          location.pathname === "/"
            ? "navbar-tab-selected"
            : "navbar-tab-unselected"
        }
        onClick={() => navigate("/")}
      >
        Home
      </button>
      <button
        className={
          location.pathname === "/myrequests"
            ? "navbar-tab-selected"
            : "navbar-tab-unselected"
        }
        onClick={() => navigate("/myrequests")}
      >
        My Requests
      </button>
      <button
        className={
          location.pathname === "/login"
          ? "navbar-tab-selected"
          : "navbar-tab-unselected"
        }
        onClick={() => navigate("/login")}
      >
        Log In
      </button>
    </div>
  );
}
