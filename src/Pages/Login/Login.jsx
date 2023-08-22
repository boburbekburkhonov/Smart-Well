import React from 'react';
import logo from '../../assets/images/logo.svg';
import weatherVideo from '../../assets/video/weather.mp4';
import './Login.css'

const Login = () => {
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
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 120">
                <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
            </svg>
        </div>
        <canvas className="particles-js-canvas-el" width="1349" height="380" style={{width: "100%", height: '100%'}}></canvas>
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
                                <h3 className="mt-3 text-primary fw-semibold">Smart Well</h3>
                            </div>

                            <form className="p-2 mt-3">
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label-login mb-2">Username</label>
                                    <input name="username" type="text" id="username" className="form-control" placeholder="Enter username" required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label-login mb-2" htmlFor="password">Password</label>
                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                        <input name="password" type="password" id="password" className="form-control pe-5 password-input" placeholder="Enter password" required />
                                    </div>
                                </div>

                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                    <label className="form-check-label" htmlFor="auth-remember-check">Eslab qolish</label>
                                </div>

                                <button className='btn btn-primary bg-primary mt-3'>
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
  )
};

export default Login;