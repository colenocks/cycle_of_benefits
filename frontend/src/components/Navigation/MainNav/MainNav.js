import React from "react";
import "./MainNav.css";
// import Logo from "../../../cyobLogo.png";

const navLinks = [
  { text: "Home", link: "/", auth: "" },
  { text: "About", link: "/about", auth: "" },
  { text: "Projects", link: "/projects", auth: "" },
  { text: "Dashboard", link: "/dashboard", auth: true },
  { text: "Login", link: "/login", auth: false },
  { text: "Signup", link: "/signup", auth: false },
];

const MainNav = (props) => {
  const navItems = [...navLinks];
  return (
    <React.Fragment>
      <nav className='cyan darken-3 z-depth-2'>
        <div className='container'>
          <div className='nav-wrapper'>
            <a href='/' className='brand-logo'>
              <img
                id='logo'
                src='https://res.cloudinary.com/icardi/image/upload/v1608351096/cyob_images/cyobLogo_lgviwg.png'
                alt='Logo'
                height='80px'
                width='100px'
              />
            </a>
            <a href='/' data-target='mobile-menu' className='sidenav-trigger'>
              <i className='material-icons'>menu</i>
            </a>
            <ul id='nav-mobile' className='right hide-on-med-and-down'>
              {navItems
                .filter(
                  (item) => item.auth === props.isAuth || item.auth === ""
                )
                .map((item) => (
                  <li key={item.text}>
                    <a href={item.link}>{item.text}</a>
                  </li>
                ))}
              {props.isAuth && (
                <li>
                  <a href='/' onClick={() => props.logoutHandler()}>
                    Logout
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {/* Mobile Menu Sidenav */}
      <ul className='sidenav' id='mobile-menu'>
        {navItems
          .filter((item) => item.auth === props.isAuth || item.auth === "")
          .map((item) => (
            <li key={item.text}>
              <a href={item.link} className='sidenav-close'>
                {item.text}
              </a>
            </li>
          ))}
        {props.isAuth && (
          <li>
            <a href='/login' onClick={() => props.logoutHandler()}>
              Logout
            </a>
          </li>
        )}
      </ul>
    </React.Fragment>
  );
};
export default MainNav;
