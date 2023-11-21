import React, { useEffect } from "react";
import "./Admin.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import menuBar from "../../assets/images/menu-bar.png";
import dashboard from "../../assets/images/dashboard.png";
import dashboardBlack from "../../assets/images/dashboard-black.png";
import news from "../../assets/images/news.png";
import newsWhite from "../../assets/images/news-white.png";
import stations from "../../assets/images/station.png";
import stationsWhite from "../../assets/images/station-white.png";
import map from "../../assets/images/map.png";
import mapBlack from "../../assets/images/map-black.png";
import userLogout from "../../assets/images/user-logout.png";
import user from "../../assets/images/user.png";
import userWhite from "../../assets/images/user-white.png";
import logout from "../../assets/images/logout.png";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import AdminMap from "../AdminMap/AdminMap";
import AdminStation from "../AdminStation/AdminStation";
import AdminNews from "../AdminNews/AdminNews";
import AdminLastData from "../AdminLastData/AdminLastData";
import AdminLastDataNews from "../AdminLastDataNews/AdminLastDataNews";

const Admin = () => {
  const token = window.localStorage.getItem("accessToken");
  const location = useLocation();
  const username = window.localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    }
  }, []);

  function logoutFunction() {
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("password");
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    window.location.reload();
  }

  return (
    <HelmetProvider>
      <div className="admin-wrapper">
        <div className="sidebar">
          <div className="logo-details">
            <img
              className="bx bx-menu"
              src={menuBar}
              alt="menuBar"
              width={55}
              height={39}
            />
          </div>
          <ul className="nav-links">
            <li>
              <a
                href="#"
                className={
                  location.pathname == "/admin"
                    ? "sidebar-active sidebar-style"
                    : "sidebar-style"
                }
                onClick={() => navigate("/admin")}
              >
                <img
                  className="bx bx-menu"
                  src={
                    location.pathname == "/admin" ? dashboardBlack : dashboard
                  }
                  alt="menuBar"
                  width={26}
                  height={26}
                />
                <span className="link_name ms-3">Dashboard</span>
              </a>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name" href="#">
                    Dashboard
                  </a>
                </li>
              </ul>
            </li>

            <li className="mt-3">
              <a
                href="#"
                className={
                  location.pathname == "/admin/lastdata"
                    ? "sidebar-active sidebar-style"
                    : "sidebar-style"
                }
                onClick={() => navigate("/admin/lastdata")}
              >
                <img
                  className="bx bx-menu"
                  src={location.pathname == "/admin/lastdata" ? user : userWhite}
                  alt="menuBar"
                  width={26}
                  height={26}
                />
                <span className="link_name ms-3">Oxirgi ma'lumotlar</span>
              </a>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name" href="#">
                  Oxirgi ma'lumotlar
                  </a>
                </li>
              </ul>
            </li>

            <li className="mt-3">
              <div className="icon-link">
                <a
                  href="#"
                  className={
                    location.pathname == "/admin/news"
                      ? "sidebar-active sidebar-style"
                      : "sidebar-style"
                  }
                  onClick={() => navigate("/admin/news")}
                >
                  <img
                    className="bx bx-menu"
                    src={location.pathname == "/admin/news" ? news : newsWhite}
                    alt="menuBar"
                    width={26}
                    height={26}
                  />
                  <span className="link_name ms-3">Ma'lumotlar</span>
                </a>
              </div>
              <ul className="sub-menu">
                <li>
                  <a className="link_name" href="#">
                    Ma'lumotlar
                  </a>
                </li>
              </ul>
            </li>

            <li className="mt-3">
              <a
                href="#"
                className={
                  location.pathname == "/admin/map"
                    ? "sidebar-active sidebar-style"
                    : "sidebar-style"
                }
                onClick={() => navigate("/admin/map")}
              >
                <img
                  className="bx bx-menu"
                  src={location.pathname == "/admin/map" ? mapBlack : map}
                  alt="menuBar"
                  width={26}
                  height={26}
                />
                <span className="link_name ms-3">Xarita</span>
              </a>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name" href="#">
                    Xarita
                  </a>
                </li>
              </ul>
            </li>

            <li className="mt-3">
              <div className="icon-link">
                <a
                  href="#"
                  className={
                    location.pathname == "/admin/stations"
                      ? "sidebar-active sidebar-style"
                      : "sidebar-style"
                  }
                  onClick={() => navigate("/admin/stations")}
                >
                  <img
                    className="bx bx-menu"
                    src={
                      location.pathname == "/admin/stations"
                        ? stations
                        : stationsWhite
                    }
                    alt="menuBar"
                    width={33}
                    height={35}
                  />
                  <span className="link_name ms-3">Stansiyalar</span>
                </a>
              </div>
              <ul className="sub-menu">
                <li>
                  <a className="link_name" href="#">
                    Stansiyalar
                  </a>
                </li>
              </ul>
            </li>

            <li className="mt-3 logout-item-admin">
              <a href="#" className="sidebar-style" onClick={logoutFunction}>
                <img
                  className="bx bx-menu"
                  src={logout}
                  alt="menuBar"
                  width={26}
                  height={26}
                />
                <span className="link_name ms-3">Logout</span>
              </a>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name" href="#">
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <header className="home-section-header">
          <div className="container-fluid py-3">
            <div className="dropdown text-end d-flex align-items-center justify-content-between">
              <h2 className="admin-page-heading m-0">Smart Well</h2>

              <div>
                <img
                  className="bx bx-menu"
                  src={userLogout}
                  alt="menuBar"
                  width={30}
                  height={30}
                />
                <span className="mx-2">{username}</span>
              </div>
            </div>
          </div>
        </header>

        <section className="home-section py-3">
          <div className="container-fluid">
            <Routes>
              <Route path="/*" element={<AdminDashboard />} />
              <Route path="/lastdata" element={<AdminLastData />} />
              <Route
                path="/lastdata/:news"
                element={<AdminLastDataNews />}
              />
              <Route path="/news" element={<AdminNews />} />
              <Route path="/map" element={<AdminMap />} />
              <Route path="/stations" element={<AdminStation />} />
            </Routes>
          </div>
        </section>
      </div>

      <Helmet>
        <script src="../src/assets/js/Admin.js"></script>
      </Helmet>
    </HelmetProvider>
  );
};

export default Admin;
