import React, { useEffect } from "react";
import "./User.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import menuBar from "../../assets/images/menu-bar.png";
import dashboard from "../../assets/images/dashboard.png";
import dashboardBlack from "../../assets/images/dashboard-black.png";
import news from "../../assets/images/news.png";
import newsWhite from "../../assets/images/news-white.png";
import newsLastdata from "../../assets/images/lastdata.png";
import newsLastdataBlack from "../../assets/images/lastdata-black.png";
import stations from "../../assets/images/station.png";
import stationsWhite from "../../assets/images/station-white.png";
import map from "../../assets/images/map.png";
import mapBlack from "../../assets/images/map-black.png";
import userLogout from "../../assets/images/user-logout.png";
import logout from "../../assets/images/logout.png";
import UserDashboard from "../UserDashboard/UserDashboard";
import UserMap from "../UserMap/UserMap";
import UserStations from "../UserStations/UserStations";
import UserData from "../UserData/UserData";
import UserLastData from "../UserLastData/UserLastData";
import UserLastDataNews from "../UserLastDataNews/UserLastDataNews";
import { api } from "../Api/Api";
import { useState } from "react";
import { Badge } from "@mui/material";
import axios from "axios";
import UserNotification from "../UserNotification/UserNotification";
import UserOneNotification from "../UserOneNotification/UserOneNotification";

const User = () => {
  const [notificationMessage, setNotificationMessage] = useState([]);
  const [balanceOrg, setBalanceOrg] = useState([]);
  const token = window.localStorage.getItem("accessToken");
  const role = window.localStorage.getItem("role");
  const username = window.localStorage.getItem("username");
  const location = useLocation();
  const navigate = useNavigate();

  // ! CUSTOM FETCH
  const customFetch = axios.create({
    baseURL: api,
    headers: {
      "Content-type": "application/json",
    },
  });

  // ! ADD HEADER TOKEN
  customFetch.interceptors.request.use(
    async (config) => {
      const token = window.localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = ` bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // ! REFRESH TOKEN
  const refreshToken = async () => {
    try {
      const requestToken = await fetch(`${api}/auth/signin`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: window.localStorage.getItem("username"),
          password: window.localStorage.getItem("password"),
        }),
      });

      const responToken = await requestToken.json();
      return responToken.data.accessToken;
    } catch (e) {
      console.log("refreshToken", "Error", e);
    }
  };

  // ! GET ACCESS TOKEN
  customFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (
        (error.response?.status === 403 && !originalRequest._retry) ||
        (error.response?.status === 401 && !originalRequest._retry)
      ) {
        originalRequest._retry = true;

        const resp = await refreshToken();

        const access_token = resp;

        window.localStorage.setItem("accessToken", access_token);

        customFetch.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;
        return customFetch(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    }

    if (role == "Organization") {
      const balansOrgName = async () => {
        const requst = await fetch(`${api}/balance-organizations/all-find`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        });

        const response = await requst.json();

        setBalanceOrg(response.balanceOrganizations);
      };

      balansOrgName();
    }

    // ! NOTIFICATION MESSAGE
    customFetch
    .get(`/user-messages/getAllUserMessages`)
    .then((data) => {
      const result = data.data.data.filter(e => e.isRead != true)
      setNotificationMessage(result)
    });
  }, []);

  function logoutFunction() {
    window.localStorage.removeItem("name");
    window.localStorage.removeItem("role");
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
                className={
                  location.pathname == "/user"
                    ? "sidebar-active sidebar-style cursor-pointer"
                    : "sidebar-style cursor-pointer"
                }
                onClick={() => navigate("/user")}
              >
                <img
                  className="bx bx-menu"
                  src={
                    location.pathname == "/user" ? dashboardBlack : dashboard
                  }
                  alt="menuBar"
                  width={26}
                  height={26}
                />
                <span className="link_name ms-3">Dashboard</span>
              </a>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name cursor-pointer">Dashboard</a>
                </li>
              </ul>
            </li>

            <li className="mt-3">
              <a
                className={
                  location.pathname == "/user/lastdata"
                    ? "sidebar-active sidebar-style cursor-pointer"
                    : "sidebar-style cursor-pointer"
                }
                onClick={() => navigate("/user/lastdata")}
              >
                <img
                  className="bx bx-menu"
                  src={
                    location.pathname == "/user/lastdata"
                      ? newsLastdataBlack
                      : newsLastdata
                  }
                  alt="menuBar"
                  width={36}
                  height={33}
                />
                <span className="link_name ms-3">Oxirgi ma'lumotlar</span>
              </a>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name cursor-pointer">Oxirgi ma'lumotlar</a>
                </li>
              </ul>
            </li>

            <li className="mt-3">
              <a
                className={
                  location.pathname == "/user/data"
                    ? "sidebar-active sidebar-style cursor-pointer"
                    : "sidebar-style cursor-pointer"
                }
                onClick={() => navigate("/user/data")}
              >
                <img
                  className="bx bx-menu"
                  src={location.pathname == "/user/data" ? news : newsWhite}
                  alt="menuBar"
                  width={26}
                  height={26}
                />
                <span className="link_name ms-3">Ma'lumotlar</span>
              </a>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name cursor-pointer">Ma'lumotlar</a>
                </li>
              </ul>
            </li>

            <li className="mt-3">
              <a
                className={
                  location.pathname == "/user/map"
                    ? "sidebar-active sidebar-style cursor-pointer"
                    : "sidebar-style cursor-pointer"
                }
                onClick={() => navigate("/user/map")}
              >
                <img
                  className="bx bx-menu"
                  src={location.pathname == "/user/map" ? mapBlack : map}
                  alt="menuBar"
                  width={26}
                  height={26}
                />
                <span className="link_name ms-3">Xarita</span>
              </a>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name cursor-pointer">Xarita</a>
                </li>
              </ul>
            </li>

            <li className="mt-3">
              <div className="icon-link">
                <a
                  className={
                    location.pathname == "/user/stations"
                      ? "sidebar-active sidebar-style cursor-pointer"
                      : "sidebar-style cursor-pointer"
                  }
                  onClick={() => navigate("/user/stations")}
                >
                  <img
                    className="bx bx-menu"
                    src={
                      location.pathname == "/user/stations"
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
                  <a className="link_name cursor-pointer">Stansiyalar</a>
                </li>
              </ul>
            </li>

            <li className="mt-3 logout-item-admin">
              <a
                className="sidebar-style cursor-pointer"
                onClick={logoutFunction}
              >
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
                  <a className="link_name cursor-pointer">Logout</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <header className="home-section-header">
          <div className="container-fluid p-3">
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
                <Badge className="notification-message cursor-pointer me-3" color="warning" badgeContent={notificationMessage.length}  type="button" onClick={() => navigate("/user/notification")}>
                  <NotificationsNoneIcon />
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <Routes>
          <Route
            path="/*"
            element={<UserDashboard balanceOrg={balanceOrg} />}
          />
          <Route
            path="/notification"
            element={<UserNotification />}
          />
          <Route
            path="/notification/:message"
            element={<UserOneNotification />}
          />
          <Route
            path="/lastdata"
            element={<UserLastData balanceOrg={balanceOrg} />}
          />
          <Route
            path="/lastdata/:news"
            element={<UserLastDataNews balanceOrg={balanceOrg} />}
          />
          <Route path="/data" element={<UserData balanceOrg={balanceOrg} />} />
          <Route path="/map" element={<UserMap balanceOrg={balanceOrg} />} />
          <Route
            path="/stations"
            element={<UserStations balanceOrg={balanceOrg} />}
          />
        </Routes>
      </div>

      <Helmet>
        <script src="../src/assets/js/Admin.js"></script>
      </Helmet>
    </HelmetProvider>
  );
};

export default User;
