import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.svg";
import weatherVideo from "../../assets/video/water.mp4";
import "./Login.css";
import { api } from "../Api/Api";

const Login = () => {
  const date = new Date();
  date.setMinutes(new Date().getMinutes() + 14);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [checkRemember, setCheckRemember] = useState("off");

  useEffect(() => {
    if (window.localStorage.getItem("checkRemember") == "on") {
      fetch(`${api}/auth/signIn`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: window.localStorage.getItem("username"),
          password: window.localStorage.getItem("password"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.statusCode == 200) {
            window.localStorage.setItem("minute", date.getMinutes());
            window.localStorage.setItem("accessToken", data.data.accessToken);
            window.localStorage.setItem("refreshToken", data.data.refreshToken);
            if (data.data.user?.role == "SUPERADMIN") {
              window.location.href = "/admin";
            } else if (data.data.user?.role == "USER") {
              window.location.href = "/user";
            } else {
              window.location.href = "/user";
            }
          }
        });
    }
  }, []);

  const loginUser = async (e) => {
    e.preventDefault();

    const { username, password } = e.target;

    const request = await fetch(`${api}/auth/signIn`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const response = await request.json();

    if (response.statusCode == 200) {
      window.localStorage.setItem("minute", date.getMinutes());
      window.localStorage.setItem("username", username.value);
      window.localStorage.setItem("password", password.value);
      window.localStorage.setItem("name", response.data.user.name);
      window.localStorage.setItem("role", response.data.user.role);
      window.localStorage.setItem("checkRemember", checkRemember);
      window.localStorage.setItem("accessToken", response.data.accessToken);
      window.localStorage.setItem("refreshToken", response.data.refreshToken);
      if (response.data.user?.role == "SUPERADMIN") {
        window.location.href = "/admin";
      } else if (response.data.user?.role == "USER") {
        window.location.href = "/user";
      } else if (response.data.user?.role == "Organization") {
        window.location.href = "/user";
      }
    } else {
      setError(true);
      setErrorMessage("Username yoki password noto'g'ri!");
    }

    username.value = "";
    password.value = "";
  };

  return (
    <div className="auth-page-wrapper pt-5">
      <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
        <div id="video-container">
          <video autoPlay loop muted>
            <source src={weatherVideo} type="video/mp4" />
          </video>
        </div>

        <div className="bg-overlay"></div>
        <div className="shape">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 1440 120"
          >
            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
          </svg>
        </div>
        <canvas
          className="particles-js-canvas-el"
          width="1349"
          height="380"
          style={{ width: "100%", height: "100%" }}
        ></canvas>
      </div>

      <div className="auth-page-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="card-login mt-5 login-bg">
                <div className="card-body-login p-4">
                  <div className="text-center">
                    <div className="d-inline-block auth-logo">
                      <img src={logo} alt="JSLPS image" height="80" />
                    </div>
                    <h3 className="mt-3 text-primary fw-semibold">
                      Smart Well
                    </h3>
                  </div>

                  <form onSubmit={loginUser} className="p-2 mt-3">
                    <div className="mb-3">
                      <label
                        htmlFor="username"
                        className="form-label-login mb-2"
                      >
                        Username
                      </label>
                      <input
                        name="username"
                        type="text"
                        id="username"
                        className="form-control"
                        placeholder="Enter username"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        className="form-label-login mb-2"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <div className="position-relative auth-pass-inputgroup mb-3">
                        <input
                          name="password"
                          type="password"
                          id="password"
                          className="form-control pe-5 password-input"
                          placeholder="Enter password"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="remember"
                        name="remember"
                        onChange={() =>
                          setCheckRemember(
                            checkRemember == "off" ? "on" : "off"
                          )
                        }
                      />
                      <label className="form-check-label" htmlFor="remember">
                        Eslab qolish
                      </label>
                    </div>

                    <p className="error-message text-danger m-0 mt-3 text-center fs-5">
                      {error ? errorMessage : ""}
                    </p>

                    <button className="btn btn-primary bg-primary mt-3">
                      Login
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
