import styles from './CSS/User.module.css';
import { useAuth } from '../Contexts/FakeAuthContext';
import { useNavigate } from 'react-router-dom';

function User() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleClick(e) {
    e.preventDefault();
    logout();
    navigate('/');
  }

  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.name} />
      <span>Welcome, {user.name}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;
