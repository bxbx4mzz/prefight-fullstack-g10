import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="container" style={{ marginTop: "3rem" }}>
      <nav>
        <ul>
          <li>
            <strong>Dashboard</strong>
          </li>
        </ul>
        <ul>
          <li>
            <button className="secondary" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <h1>Hello, you're logged in! 🎉</h1>
      <p>This is a protected page — only visible with a valid token.</p>
    </div>
  );
}

export default Dashboard;