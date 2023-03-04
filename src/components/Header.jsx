import React from "react";
import { NavLink, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();
import { connect } from "react-redux";
function Header({
  setNavMenu,
  navMenu,
  basket,
  favorite,
  company,
  category,
  movement,
  functionality,
  setAsidebasket,
  showPicture = { showPicture },
}) {
  return (
    <section
      className="header"
      data-aos="fade-down"
      data-aos-easing="linear"
      data-aos-duration="1500"
      style={showPicture ? { zIndex: "1" } : { zIndex: "3" }}
    >
      <div className="container">
        <header>
          <NavLink to="/" className="logo">
            <img src="/logo/WatchesMoonLast.png" alt="" />
          </NavLink>
          <ul>
            <li>
              <NavLink to="/">Ana səhifə</NavLink>
            </li>
            <li>
              <NavLink to="/about">Haqqımızda</NavLink>
            </li>
            <li>
              Mağaza
              <div className="dropdown">
                <ul>
                  <li>
                    Məhsullar
                    <ul className="dropdown_category">
                      {category.map((a) => (
                        <NavLink
                          key={a.id}
                          to={`/${a.name.toLowerCase()}/${a.id}`}
                        >
                          <li>{a.title}</li>
                        </NavLink>
                      ))}
                    </ul>
                  </li>
                  <li>
                    Brendlər
                    <ul className="dropdown_company">
                      {company.map((a) => (
                        <NavLink
                          key={a.id}
                          to={`/products/${a.title.toLowerCase()}/${a.id}`}
                        >
                          <li>{a.name}</li>
                        </NavLink>
                      ))}
                    </ul>
                  </li>
                  <li>
                    Mexanizm
                    <ul className="dropdown_movement">
                      {movement.map((a) => (
                        <NavLink
                          key={a.id}
                          to={`/movement/${a.name.toLowerCase()}/${a.id}`}
                        >
                          <li>{a.title}</li>
                        </NavLink>
                      ))}
                    </ul>
                  </li>
                  <li>
                    Funksionallıq
                    <ul className="dropdown_func">
                      {functionality.map((a) => (
                        <NavLink
                          key={a.id}
                          to={`/functionality/${a.name.toLowerCase()}/${a.id}`}
                        >
                          <li>{a.title}</li>
                        </NavLink>
                      ))}
                    </ul>
                  </li>
                  <ul className="dropdown_img">
                    <img
                      src="https://images.unsplash.com/photo-1526648856597-c2b6745ad7bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0Y2glMjB3YWxscGFwZXJ8ZW58MHx8MHx8&w=1000&q=80"
                      alt=""
                    />
                  </ul>
                </ul>
              </div>
            </li>
            <li>
              <NavLink to="/blog">Blog</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Əlaqə</NavLink>
            </li>
          </ul>
          <div className="favorites">
            <div className="user">
              <button>
                <i className="fa-regular fa-user"></i>
              </button>
            </div>
            <div className="heart">
              <button>
                <Link to="/favorites">
                  <i className="fa-regular fa-heart"></i>
                </Link>
              </button>
              {favorite.length ? (
                <div className="heart_count">{favorite.length}</div>
              ) : null}
            </div>
            <div className="basket">
              <button onClick={() => setAsidebasket(true)}>
                <i className="fa-solid fa-cart-shopping"></i>
              </button>
              {basket.length ? (
                <div className="basket_count">{basket.length}</div>
              ) : null}
            </div>
          </div>
          <div onClick={() => setNavMenu(!navMenu)} className="bars">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </header>
      </div>
    </section>
  );
}
const t = (a) => a;
export default connect(t)(Header);
