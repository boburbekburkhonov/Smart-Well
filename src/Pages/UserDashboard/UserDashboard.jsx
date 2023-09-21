import React from "react";
import { Chart as Chartjs, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./UserDashboard.css";
import circleBlue from "../../assets/images/record.png";
import circleGreen from "../../assets/images/circle.png";
import circleOrange from "../../assets/images/circle-orange.png";
import circleRed from "../../assets/images/circle-red.png";
import fullScreen from "../../assets/images/fullscreen.png";

Chartjs.register(ArcElement, Tooltip, Legend);

const UserDashboard = () => {
  const data = {
    labels: ["70% dan balandlari", "30% dan balandlari", "30% dan kichiklari"],
    datasets: [
      {
        label: "Batery",
        data: [3, 6, 7],
        backgroundColor: ["lawnGreen", "yellow", "red"],
      },
    ],
  };

  const options = {};

  return (
    <section className="section-dashboard">
      {/* MODAL */}
      <div
        className="modal fade"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog table-dashboard-width modal-dialog-centered  modal-dialog-scrollable">
          <div className="modal-content table-location-scroll">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Umumiy stansiyalar soni
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Nomi</th>
                    <th scope="col">Daraja</th>
                    <th scope="col">O'tkazuvchanlik</th>
                    <th scope="col">Temperatura</th>
                  </tr>
                </thead>
                <tbody>
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
                  <tr>
                    <td>218-Kuzatish Quduq</td>
                    <td>45</td>
                    <td>3.709</td>
                    <td>21.3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="d-flex align-items-center mb-4 pt-3">
          <img
            src="https://img.icons8.com/?size=512&id=7880&format=png"
            alt="location"
            width="35"
            height="35"
          />
          <h1 className="dashboard-heading ms-2">
            Smart Solutions System tomonidan o'rnatilgan qurilmalar
          </h1>
        </div>

        <ul className="dashboard-list list-unstyled m-0 d-flex flex-wrap align-items-center justify-content-between">
          <li className="dashboard-list-item d-flex mt-3">
            <img src={circleBlue} alt="circleBlue" width={30} height={30} />
            <div className="ms-3">
              <p className="dashboard-list-number m-0">124 ta</p>
              <p className="dashboard-list-desc m-0">Umumiy stansiyalar soni</p>
              <p className="dashboard-list-desc-percentage text-info m-0">
                100%
              </p>
            </div>
          </li>

          <li className="dashboard-list-item d-flex mt-3">
            <img src={circleGreen} alt="circleGreen" width={30} height={30} />
            <div className="ms-3">
              <p className="dashboard-list-number m-0">80 ta</p>
              <p className="dashboard-list-desc m-0">
                Bugun ishlayotganlar stansiyalar
              </p>
              <p className="dashboard-list-desc-percentage text-info m-0">
                72%
              </p>
            </div>
          </li>

          <li className="dashboard-list-item d-flex mt-3">
            <img src={circleOrange} alt="circleGreen" width={30} height={30} />
            <div className="ms-3">
              <p className="dashboard-list-number m-0">20 ta</p>
              <p className="dashboard-list-desc m-0">
                3 kun ichida Ishlagan stansiyalar
              </p>
              <p className="dashboard-list-desc-percentage text-info m-0">
                32%
              </p>
            </div>
          </li>

          <li className="dashboard-list-item d-flex mt-3">
            <img src={circleRed} alt="circleGreen" width={30} height={30} />
            <div className="ms-3">
              <p className="dashboard-list-number m-0">24 ta</p>
              <p className="dashboard-list-desc m-0">
                Umuman ishlamagan stansiyalar
              </p>
              <p className="dashboard-list-desc-percentage text-info m-0">
                36%
              </p>
            </div>
          </li>
        </ul>

        <div className="d-flex flex-wrap justify-content-between">
          <div className="dashboard-table mt-5">
            <div className="d-flex justify-content-between align-items-center">
              <h2>Umumiy stansiyalar soni</h2>
              <span
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                className="dashboard-fullscreen-wrapper"
              >
                <img src={fullScreen} alt="fullScreen" width={20} height={20} />
              </span>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th scope="col">Nomi</th>
                  <th scope="col">Daraja</th>
                  <th scope="col">O'tkazuvchanlik</th>
                  <th scope="col">Temperatura</th>
                </tr>
              </thead>
              <tbody>
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
              </tbody>
            </table>
          </div>

          <div className="dashboard-dought-wrapper mt-5">
            <h3 className="dashboard-dought-wrapper-heading m-0">
              Qurilmalarning batareya quvvatlari
            </h3>
            <Doughnut className="mx-3" data={data} options={options}></Doughnut>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;
