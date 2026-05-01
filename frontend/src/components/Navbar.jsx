import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-name">TaskFlow</span>
      </div>
      <div className="navbar-user">
        {user && (
          <>
            <div className="user-info">
              <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className={`user-role role-${user.role}`}>{user.role}</span>
              </div>
            </div>
            <button className="btn btn-ghost logout-btn" onClick={handleLogout} id="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
