import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { api } from '../Api/Api';
import './AdminOneNotification.css'
import logo from '../../assets/images/logo.svg'
import { useParams } from 'react-router-dom';

const AdminOneNotification = () => {
  const { message } = useParams();
  const [notificationMessage, setNotificationMessage] = useState();
  const [regions, setRegions] = useState([]);
  const [district, setDistrict] = useState([]);
  const [balanceOrg, setBalanceOrg] = useState([]);

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
      const resultNewMessage = data.data.data.filter(e => e._id == message)

      setNotificationMessage(resultNewMessage[0])
    });

    // ! ALL REGIONS
    customFetch
    .get(`/regions/all`)
    .then((data) => {
      setRegions(data.data?.regions)
    });

    // ! ALL DISTRICT
    customFetch
    .get(`/districts/all`)
    .then((data) => {
      setDistrict(data.data.districts);
    });

    // ! ALL BALANS ORG
    customFetch
    .get(`/balance-organizations/all-find`)
    .then((data) => {
      setBalanceOrg(data.data.balanceOrganizations);
    });

    // ! READ MESSAGE
    customFetch
    .post(`/user-messages/updateIsRead`, {
      id:message
    })
    .then((data) => data);
  }, [])

  const foundRegionName = regionId => {
    const result = regions?.find(e => e.id == regionId)

    return result?.name
  }

  const foundDistrictName = districtId => {
    const result = district?.find(e => e.id == districtId)

    return result?.name
  }

  const foundBalansOrgName = balanceOrgId => {
    const result = balanceOrg?.find(e => e.id == balanceOrgId)

    return result?.name
  }

  return (
    <section className="py-3">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body m-auto d-flex flex-wrap align-items-start py-5">
            <img className='me-5' src={logo} alt="logo" width={200} height={200} />
            <ul className='list-unstyled m-0 p-0 m-auto'>
              <li className='one-message-item d-flex'>
                <p className='m-0 fw-semibold'>
                  Xabar:
                </p>
                <p className='m-0 ms-4 text-danger'>
                  {notificationMessage?.message}
                </p>
              </li>

              <li className='one-message-item d-flex mt-4'>
                <p className='m-0 fw-semibold'>
                  Stansiya:
                </p>
                <p className='m-0 ms-4'>
                  {notificationMessage?.station.name}
                </p>
              </li>

              <li className='one-message-item d-flex mt-4'>
                <p className='m-0 fw-semibold'>
                  Manzil:
                </p>
                <p className='m-0 ms-4'>
                  {notificationMessage?.station.location}
                </p>
              </li>

              <li className='one-message-item d-flex mt-4'>
                <p className='m-0 fw-semibold'>
                  User telefon raqami:
                </p>
                <p className='m-0 ms-4'>
                  <a href={`tel:${notificationMessage?.station.userPhoneNum}`}>
                    {notificationMessage?.station.userPhoneNum}
                  </a>
                </p>
              </li>
            </ul>

            <ul className='second-list list-unstyled m-0 p-0 ms-5'>
              <li className='one-message-item d-flex'>
                <p className='m-0 fw-semibold'>
                  Viloyat:
                </p>
                <p className='m-0 ms-4'>
                  {foundRegionName(notificationMessage?.station?.region_id)}
                </p>
              </li>

              <li className='one-message-item d-flex mt-4'>
                <p className='m-0 fw-semibold'>
                  Tuman:
                </p>
                <p className='m-0 ms-4'>
                  {foundDistrictName(notificationMessage?.station?.district_id)}
                </p>
              </li>

              <li className='one-message-item d-flex mt-4'>
                <p className='m-0 fw-semibold'>
                  Balans tashkiloti:
                </p>
                <p className='m-0 ms-4'>
                  {foundBalansOrgName(notificationMessage?.station?.balance_organization_id)}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminOneNotification;