import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
/**
 * Makes a navigation bar with the profile, home, and my requests tabs.
 * @returns the navigation bar
 */
export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, loading, error] = useAuthState(auth);

  return (
    <div className="flex-container" style={{
      // marginRight:"8px", marginLeft:"8px"
      }}>
      {user && (<button
        className={
          location.pathname === "/profile"
            ? "navbar-tab-selected"
            : "navbar-tab-unselected"
        }
        onClick={() => navigate("/profile")}
      >
        Profile
      </button>)}
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
      {user && (<button
        className={
          location.pathname === "/myrequests"
            ? "navbar-tab-selected"
            : "navbar-tab-unselected"
        }
        onClick={() => navigate("/myrequests")}
      >
        My Requests
      </button>)}
      {!user && (
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
      )}
    </div>
  );
}
