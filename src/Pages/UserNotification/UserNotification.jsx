import React, { useEffect, useState } from 'react';
import messageRead from '../../assets/images/email-read.png'
import messageNotRead from '../../assets/images/email-not-read.png'
import './UserNotification.css'
import axios from 'axios';
import { api } from '../Api/Api';
import { useNavigate } from 'react-router-dom';

const UserNotification = () => {
  const [notificationMessage, setNotificationMessage] = useState([]);
  const [lengthNewMessage, setLengthNewMessage] = useState();
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
    // ! NOTIFICATION MESSAGE
    customFetch
    .get(`/user-messages/getAllUserMessages`)
    .then((data) => {
      const resultNewMessage = data.data.data.filter(e => e.isRead != true)

      setLengthNewMessage(resultNewMessage.length)
      data.data.data.filter(e => {
        if(e.isRead == true){
          resultNewMessage.push(e)
        }
      })
      setNotificationMessage(resultNewMessage)
    });
  }, [])

  const fixDate = time => {
    const fixedTime = new Date(time)
    fixedTime.setHours(fixedTime.getHours() - 5);

    const date = `${fixedTime.getDate()}.${
      fixedTime.getMonth() + 1
    }.${fixedTime.getFullYear()} ${fixedTime.getHours()}:${
      String(fixedTime.getMinutes()).length == 1
        ? "0" + fixedTime.getMinutes()
        : fixedTime.getMinutes()
    }`;

    return date
  }

  return (
    <section className="home-section py-3">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <ul className='m-0 p-0 list-unstyled notification-wrapper'>
              <li className='d-flex align-items-center justify-content-between notification-wrapper-item-first'>
                <p className='m-0 fw-bold'>
                  Xatlar({lengthNewMessage})
                </p>
                <p className='m-0 fw-bold'>
                  Sana
                </p>
              </li>

              {
                notificationMessage.map((e, i) => {
                  return <li className='d-flex align-items-center justify-content-between cursor-pointer' key={i}
                  onClick={() => navigate(`/user/notification/${e._id}`)}
                  >
                  <div className='d-flex align-items-center'>
                    <img src={e.isRead == true ? messageRead : messageNotRead} alt="messageRead" width={24} height={24} />
                    <p className='m-0 ms-3 text-primary'>
                      {e?.station.name} stansiyadan kelgan xabar
                    </p>
                  </div>
                  <p className='m-0 text-primary'>
                  {fixDate(e?.station.updatedAt)}
                  </p>
                </li>
                })
              }
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserNotification;