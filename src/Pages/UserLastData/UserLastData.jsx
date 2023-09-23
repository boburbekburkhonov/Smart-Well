import React, { useState } from "react";
import battery from "../../assets/images/battery.png";
import batteryPow from "../../assets/images/battery-70.png";
import batteryLow from "../../assets/images/battery-40.png";
import batteryRed from "../../assets/images/battery-30.png";
import close from "../../assets/images/close-black.png";
import "./UserLastData.css";

const UserLastData = () => {
  const [countNews, setCountNews] = useState(5);
  const [countStationName, setStationName] = useState();
  const [charge, setCharge] = useState(82);
  const [modalMap, setModalMap] = useState(false);

  return (
    <div className={modalMap == true ? "card  card--open" : "card"}>
      <div className="card-body pt-3">
        <ul className="nav nav-tabs nav-tabs-bordered">
          <li className="nav-item">
            <button
              className="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#profile-users"
            >
              Nomi bo'yicha qidirish
            </button>
          </li>

          <li className="nav-item">
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#profile-overview"
            >
              Viloyat bo'yicha qidirish
            </button>
          </li>

          <li className="nav-item">
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#profile-search"
            >
              Balans tashkiloti bo'yicha qidirish
            </button>
          </li>
        </ul>

        <div className="tab-content">
          <div
            className="tab-pane fade show active profile-users"
            id="profile-users"
          >
            <h2 className="mt-4 mb-3 fs-4 user-lastdata-heading">
              218-Kuzatish Quduq
            </h2>
            <div className="d-flex align-items-center">
              <select
                className="user-lastdata-select-station-name form-select"
                name="stationName"
                onChange={(e) => setStationName(e.target.value)}
              >
                <option value="218-Kuzatish Quduq">218-Kuzatish Quduq</option>
                <option value="Sirdaryo Quduq">Sirdaryo Quduq</option>
              </select>

              <select
                className="user-lastdata-select-station-count form-select ms-4"
                name="count"
                onChange={(e) => setCountNews(e.target.value)}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>
            <ul className="user-last-data-list list-unstyled m-0 mt-4">
              <li
                className="user-last-data-list-item"
                onClick={() => setModalMap(true)}
              >
                <div className="user-last-data-list-item-top d-flex align-items-center justify-content-between">
                  <h3 className="fs-5 m-0">Kuzatish Quduq</h3>
                  <div className="d-flex align-items-center justify-content-between">
                    <p
                      className={
                        "m-0 me-1 " +
                        (charge > 70
                          ? "text-success"
                          : charge <= 70 && charge >= 50
                          ? "text-warning"
                          : charge < 50
                          ? "text-danger"
                          : "")
                      }
                    >
                      {charge}%
                    </p>
                    <img
                      src={
                        charge >= 70
                          ? batteryPow
                          : (charge >= 30) & (charge < 70)
                          ? batteryLow
                          : charge < 30
                          ? batteryRed
                          : null
                      }
                      alt="battery"
                      width={35}
                      height={35}
                    />
                  </div>
                </div>

                <span className="user-last-data-list-item-href"></span>

                <span className="d-flex justify-content-between">
                  <div>
                    <p className="m-0">Daraja: 15</p>
                    <p className="m-0">O'tkazuvchanlik: 23</p>
                    <p className="m-0">Temperatura: 33</p>
                  </div>

                  <div className="d-flex align-items-end">
                    <p className="m-0">12.04.2022</p>
                  </div>
                </span>
              </li>

              <li
                className="user-last-data-list-item"
                onClick={() => setModalMap(true)}
              >
                <div className="user-last-data-list-item-top d-flex align-items-center justify-content-between">
                  <h3 className="fs-5 m-0">Kuzatish Quduq</h3>
                  <div className="d-flex align-items-center justify-content-between">
                    <p
                      className={
                        "m-0 me-1 " +
                        (charge > 70
                          ? "text-success"
                          : charge <= 70 && charge >= 50
                          ? "text-warning"
                          : charge < 50
                          ? "text-danger"
                          : "")
                      }
                    >
                      {charge}%
                    </p>
                    <img
                      src={
                        charge >= 70
                          ? batteryPow
                          : (charge >= 30) & (charge < 70)
                          ? batteryLow
                          : charge < 30
                          ? batteryRed
                          : null
                      }
                      alt="battery"
                      width={35}
                      height={35}
                    />
                  </div>
                </div>

                <span className="user-last-data-list-item-href"></span>

                <span className="d-flex justify-content-between">
                  <div>
                    <p className="m-0">Daraja: 15</p>
                    <p className="m-0">O'tkazuvchanlik: 23</p>
                    <p className="m-0">Temperatura: 33</p>
                  </div>

                  <div className="d-flex align-items-end">
                    <p className="m-0">12.04.2022</p>
                  </div>
                </span>
              </li>

              <li
                className="user-last-data-list-item"
                onClick={() => setModalMap(true)}
              >
                <div className="user-last-data-list-item-top d-flex align-items-center justify-content-between">
                  <h3 className="fs-5 m-0">Kuzatish Quduq</h3>
                  <div className="d-flex align-items-center justify-content-between">
                    <p
                      className={
                        "m-0 me-1 " +
                        (charge > 70
                          ? "text-success"
                          : charge <= 70 && charge >= 50
                          ? "text-warning"
                          : charge < 50
                          ? "text-danger"
                          : "")
                      }
                    >
                      {charge}%
                    </p>
                    <img
                      src={
                        charge >= 70
                          ? batteryPow
                          : (charge >= 30) & (charge < 70)
                          ? batteryLow
                          : charge < 30
                          ? batteryRed
                          : null
                      }
                      alt="battery"
                      width={35}
                      height={35}
                    />
                  </div>
                </div>

                <span className="user-last-data-list-item-href"></span>

                <span className="d-flex justify-content-between">
                  <div>
                    <p className="m-0">Daraja: 15</p>
                    <p className="m-0">O'tkazuvchanlik: 23</p>
                    <p className="m-0">Temperatura: 33</p>
                  </div>

                  <div className="d-flex align-items-end">
                    <p className="m-0">12.04.2022</p>
                  </div>
                </span>
              </li>

              <li
                className="user-last-data-list-item"
                onClick={() => setModalMap(true)}
              >
                <div className="user-last-data-list-item-top d-flex align-items-center justify-content-between">
                  <h3 className="fs-5 m-0">Kuzatish Quduq</h3>
                  <div className="d-flex align-items-center justify-content-between">
                    <p
                      className={
                        "m-0 me-1 " +
                        (charge > 70
                          ? "text-success"
                          : charge <= 70 && charge >= 50
                          ? "text-warning"
                          : charge < 50
                          ? "text-danger"
                          : "")
                      }
                    >
                      {charge}%
                    </p>
                    <img
                      src={
                        charge >= 70
                          ? batteryPow
                          : (charge >= 30) & (charge < 70)
                          ? batteryLow
                          : charge < 30
                          ? batteryRed
                          : null
                      }
                      alt="battery"
                      width={35}
                      height={35}
                    />
                  </div>
                </div>

                <span className="user-last-data-list-item-href"></span>

                <span className="d-flex justify-content-between">
                  <div>
                    <p className="m-0">Daraja: 15</p>
                    <p className="m-0">O'tkazuvchanlik: 23</p>
                    <p className="m-0">Temperatura: 33</p>
                  </div>

                  <div className="d-flex align-items-end">
                    <p className="m-0">12.04.2022</p>
                  </div>
                </span>
              </li>

              <li
                className="user-last-data-list-item"
                onClick={() => setModalMap(true)}
              >
                <div className="user-last-data-list-item-top d-flex align-items-center justify-content-between">
                  <h3 className="fs-5 m-0">Kuzatish Quduq</h3>
                  <div className="d-flex align-items-center justify-content-between">
                    <p
                      className={
                        "m-0 me-1 " +
                        (charge > 70
                          ? "text-success"
                          : charge <= 70 && charge >= 50
                          ? "text-warning"
                          : charge < 50
                          ? "text-danger"
                          : "")
                      }
                    >
                      {charge}%
                    </p>
                    <img
                      src={
                        charge >= 70
                          ? batteryPow
                          : (charge >= 30) & (charge < 70)
                          ? batteryLow
                          : charge < 30
                          ? batteryRed
                          : null
                      }
                      alt="battery"
                      width={35}
                      height={35}
                    />
                  </div>
                </div>

                <span className="user-last-data-list-item-href"></span>

                <span className="d-flex justify-content-between">
                  <div>
                    <p className="m-0">Daraja: 15</p>
                    <p className="m-0">O'tkazuvchanlik: 23</p>
                    <p className="m-0">Temperatura: 33</p>
                  </div>

                  <div className="d-flex align-items-end">
                    <p className="m-0">12.04.2022</p>
                  </div>
                </span>
              </li>

              <li
                className="user-last-data-list-item"
                onClick={() => setModalMap(true)}
              >
                <div className="user-last-data-list-item-top d-flex align-items-center justify-content-between">
                  <h3 className="fs-5 m-0">Kuzatish Quduq</h3>
                  <div className="d-flex align-items-center justify-content-between">
                    <p
                      className={
                        "m-0 me-1 " +
                        (charge > 70
                          ? "text-success"
                          : charge <= 70 && charge >= 50
                          ? "text-warning"
                          : charge < 50
                          ? "text-danger"
                          : "")
                      }
                    >
                      {charge}%
                    </p>
                    <img
                      src={
                        charge >= 70
                          ? batteryPow
                          : (charge >= 30) & (charge < 70)
                          ? batteryLow
                          : charge < 30
                          ? batteryRed
                          : null
                      }
                      alt="battery"
                      width={35}
                      height={35}
                    />
                  </div>
                </div>

                <span className="user-last-data-list-item-href"></span>

                <span className="d-flex justify-content-between">
                  <div>
                    <p className="m-0">Daraja: 15</p>
                    <p className="m-0">O'tkazuvchanlik: 23</p>
                    <p className="m-0">Temperatura: 33</p>
                  </div>

                  <div className="d-flex align-items-end">
                    <p className="m-0">12.04.2022</p>
                  </div>
                </span>
              </li>
            </ul>
            {/* <table className="table mt-4">
              <thead>
                <tr>
                  <th scope="col">Nomi</th>
                  <th scope="col">Daraja</th>
                  <th scope="col">O'tkazuvchanlik</th>
                  <th scope="col">Temperatura</th>
                </tr>
              </thead>
              <tbody>
                {countNews == 5 ? (
                  <>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                  </>
                ) : countNews == 10 ? (
                  <>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                  </>
                ) : countNews == 15 ? (
                  <>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                  </>
                ) : null}
              </tbody>
            </table> */}
          </div>

          <div className="tab-pane fade profile-overview" id="profile-overview">
            profile-overview
          </div>

          <div
            className="tab-pane fade profile-search profile-search-station"
            id="profile-search"
          >
            profile-search
          </div>
        </div>
        <div className="userlast-data-bottom-modal">
          <div
            className="userlast-data-bottom-modal-header d-flex justify-content-end"
            onClick={() => setModalMap(false)}
          >
            <img
              className="ms-auto"
              src={close}
              alt="close"
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLastData;
