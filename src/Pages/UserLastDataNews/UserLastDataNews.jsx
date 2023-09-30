import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import excel from "../../assets/images/excel.png";
import statistic from "../../assets/images/stats.png";
import pdf from "../../assets/images/pdf.jpg";
import location from "../../assets/images/location-google.png";
import "./UserLastDataNews.css";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const UserLastDataNews = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey:
      "AIzaSyC57hT2pRJZ4Gh85ai0sUjP72i7VYJxTHc&region=UZ&language=uz",
  });

  if (!isLoaded) return <div>Loading...</div>;

  const labels = [
    2, 4546, 65, 65, 4, 2, 3, 8, 6, 5, 4, 2, 4546, 65, 65, 4, 2, 3, 8, 6, 5, 4,
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Bugungi ma'lumotlar",
        data: [
          1, 2, 1, 4, 1, 6, 5, 3, 1, 11, 24, 1, 2, 1, 4, 1, 6, 5, 3, 1, 11, 24,
        ],
        fill: true,
        borderColor: "#0CC0CE",
        backgroundColor: "#85e6ec",
        tension: 0.4,
      },
    ],
  };

  const option = {
    plugins: {
      tooltip: {
        boxHeight: 25,
        boxWidth: 40,
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 16,
        },
        callbacks: {
          label: function (context) {
            return `Ko'rsatgich: ${context.formattedValue}`;
          },
        },
      },
    },
  };

  return (
    <HelmetProvider>
      {/* MODAL CHAR */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog table-location-width modal-dialog-centered">
          <div className="modal-content modal-content-user-last-data">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                218-Kuzatish Quduq
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <select className="form-select select-user-last-data">
                <option value="Sathi">Sathi</option>
              </select>

              <div className="char-statistic-frame m-auto">
                <Line
                  className="char-statistic-wrapper"
                  data={data}
                  options={option}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL MAP */}
      <div
        class="modal fade"
        id="modalMapId"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="modalMap"
        aria-hidden="true"
      >
        <div class="modal-dialog table-location-width-map modal-dialog-centered">
          <div class="modal-content modal-content-user-last-data-map">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="modalMap">
                Modal title
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="user-last-data-map-wrapper">
                <GoogleMap
                  zoom={6}
                  center={{ lat: 42.00000000048624, lng: 63.999999999999986 }}
                  mapContainerClassName="user-last-data-map"
                >
                  <MarkerF
                    position={{
                      lat: 42.00000000048624,
                      lng: 63.999999999999986,
                    }}
                  />
                </GoogleMap>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body pt-3">
          <ul className="nav nav-tabs nav-tabs-bordered">
            <li className="nav-item">
              <button
                className="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#profile-hour"
              >
                Soatlik
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#profile-users"
              >
                Kunlik
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#profile-users-ten"
              >
                10 Kunlik
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#profile-overview"
              >
                Oylik
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#profile-search"
              >
                Yillik
              </button>
            </li>
          </ul>

          <div className="tab-content">
            <div
              className="tab-pane fade show active profile-hour"
              id="profile-hour"
            >
              <div className="dashboard-table dashboard-table-user-last-data-news mt-2">
                <h2 className="m-0 mb-3">218-Kuzatish Quduq</h2>
                <div className="d-flex justify-content-between align-items-center">
                  <input
                    className="form-control user-lastdata-news-search"
                    type="text"
                    placeholder="Search..."
                  />
                  <div className="d-flex align-items-center ms-auto">
                    <input
                      type="date"
                      className="form-control"
                      id="dateMonth"
                      name="dateDaily"
                      required
                      defaultValue={new Date().toISOString().substring(0, 10)}
                    />
                    <a
                      className="ms-4"
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop"
                    >
                      <img src={statistic} alt="pdf" width={25} height={30} />
                    </a>
                    <a
                      className="ms-4"
                      data-bs-toggle="modal"
                      data-bs-target="#modalMapId"
                      href="#"
                    >
                      <img src={location} alt="pdf" width={30} height={30} />
                    </a>
                    <a className="ms-4" href="#">
                      <img src={pdf} alt="pdf" width={23} height={30} />
                    </a>
                    <a className="ms-4" href="#">
                      <img src={excel} alt="excel" width={26} height={30} />
                    </a>
                  </div>
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
            </div>

            <div className="tab-pane fade profile-users" id="profile-users">
              1
            </div>

            <div
              className="tab-pane fade profile-users-ten"
              id="profile-users-ten"
            >
              10
            </div>

            <div
              className="tab-pane fade profile-overview"
              id="profile-overview"
            >
              profile-overview
            </div>

            <div
              className="tab-pane fade profile-search profile-search-station"
              id="profile-search"
            >
              profile-search
            </div>
          </div>
          {/* <div className="userlast-data-bottom-modal">
            <div className="userlast-data-bottom-modal-header d-flex justify-content-end">
              <img
                className="ms-auto"
                src={close}
                alt="close"
                width={20}
                height={20}
              />
            </div>
          </div> */}
        </div>

        <Helmet>
          <script src="../../src/assets/js/Admin.js"></script>
        </Helmet>
      </div>
    </HelmetProvider>
  );
};

export default UserLastDataNews;
