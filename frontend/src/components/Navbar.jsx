import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return <header className="site-header">
    <div className="header-inner">
      <NavLink className="brand" to="/">Assemblea</NavLink>
      <nav className="main-nav" aria-label="Main navigation">
        <NavLink end to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
        <NavLink to="/add-event" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Add Event</NavLink>
      </nav>
    </div>
  </header>;
}
