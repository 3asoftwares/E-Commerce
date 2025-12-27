import { Button } from '../Button/Button';
import './header.css';
import logo from '../../assets/3A.png';

type User = {
  name: string;
};

export interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
}

export const Header = ({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) => (
  <header>
    <div className="storybook-header">
      <div>
  <img src={logo} alt="3A Softwares" width={32} height={32} />
        <h1>3A Softwares</h1>
      </div>
      <div>
        {user ? (
          <>
            <span className="welcome">
              Welcome, <b>{user.name}</b>!
            </span>
            <Button size="sm" onClick={onLogout} >Log Out </Button>
          </>
        ) : (
          <>
            <Button size="sm" onClick={onLogin} >Log In</Button>
            <Button variant="primary" size="sm" onClick={onCreateAccount} >Sign Up</Button>
          </>
        )}
      </div>
    </div>
  </header>
);
