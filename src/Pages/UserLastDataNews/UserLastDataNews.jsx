import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import excel from "../../assets/images/excel.png";
import statistic from "../../assets/images/stats.png";
import pdf from "../../assets/images/pdf.jpg";
import location from "../../assets/images/location-google.png";
import "./UserLastDataNews.css";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { useParams } from "react-router-dom";
import { api } from "../Api/Api";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import circleRed from "../../assets/images/circle-red.png";
import circleBlue from "../../assets/images/record.png";
import autoTable from "jspdf-autotable";

const UserLastDataNews = () => {
  const [todayData, setTodayData] = useState([]);
  const [valueStatistic, setValueStatistic] = useState("level");
  const [activeMarker, setActiveMarker] = useState();
  const { news } = useParams();
  const stationName = localStorage.getItem("stationName");
  const locationStation = localStorage.getItem("location");

  useEffect(() => {
    fetch(`${api}/mqttDataWrite/getTodayDataByStationId?stationId=${news}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => setTodayData(data.data));
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey:
      "AIzaSyC57hT2pRJZ4Gh85ai0sUjP72i7VYJxTHc&region=UZ&language=uz",
  });

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  if (!isLoaded) return <div>Loading...</div>;

  const labels = todayData.map((e) => e.date.split(" ")[1]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Bugungi ma'lumotlar",
        data: todayData.map((e) => e[valueStatistic]),
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

  const exportNewsByPdf = () => {
    const doc = new jsPDF();

    doc.text(`${stationName} qurilmadan kelgan ma'lumotlar`, 20, 10);

    doc.autoTable({
      theme: "grid",
      columns: [
        { header: "Sath (sm)", dataKey: "level" },
        { header: "Sho'rlanish (g/l)", dataKey: "conductivity" },
        { header: "Temperatura (°C)", dataKey: "temp" },
        { Sana: "Temperatura (°C)", dataKey: "date" },
      ],
      body: todayData,
    });

    if (todayData.length > 0) {
      doc.save(`${stationName} ning ma'lumotlari.pdf`);
    }
  };

  // ! SAVE DATA
  const exportDataToExcel = (data) => {
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(todayData);

    XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

    if (todayData.length > 0) {
      XLSX.writeFile(workBook, `${stationName} ning ma'lumotlari.xlsx`);
    }
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
              <select
                onChange={(e) => setValueStatistic(e.target.value)}
                className="form-select select-user-last-data"
              >
                <option value="level">Sathi</option>
                <option value="conductivity">Sho'rlanish</option>
                <option value="temp">Temperatura </option>
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
        className="modal fade"
        id="modalMapId"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="modalMap"
        aria-hidden="true"
      >
        <div className="modal-dialog table-location-width-map modal-dialog-centered">
          <div className="modal-content modal-content-user-last-data-map">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modalMap">
                {stationName} qurilmaning manzili
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="user-last-data-map-wrapper h-100">
                <GoogleMap
                  zoom={15}
                  center={{
                    lat: locationStation.split("-")[0] * 1,
                    lng: locationStation.split("-")[1] * 1,
                  }}
                  mapContainerclassName="user-last-data-map"
                >
                  <MarkerF
                    position={{
                      lat: locationStation.split("-")[0] * 1,
                      lng: locationStation.split("-")[1] * 1,
                    }}
                    title={stationName}
                    onClick={() => handleActiveMarker(1)}
                  >
                    {activeMarker == 1 ? (
                      <InfoWindowF
                        className="w-100"
                        onCloseClick={() => {
                          setActiveMarker(null);
                        }}
                        options={{ maxWidth: "240" }}
                      >
                        {todayData.length > 0 ? (
                          <div>
                            <h3 className="fw-semibold text-success fs-6">
                              {stationName}
                            </h3>

                            <div className="d-flex align-items-center mb-1">
                              <img
                                src={circleBlue}
                                alt="circleBlue"
                                width={12}
                                height={12}
                              />
                              <p className="infowindow-desc m-0 ms-1 me-1">
                                Sath:
                              </p>{" "}
                              <span className="infowindow-span">
                                {Number(todayData[0].level).toFixed(2)} sm
                              </span>
                            </div>

                            <div className="d-flex align-items-center mb-1">
                              <img
                                src={circleBlue}
                                alt="circleBlue"
                                width={12}
                                height={12}
                              />
                              <p className="m-0 infowindow-desc ms-1 me-1 ">
                                Sho'rlanish:
                              </p>{" "}
                              <span className="infowindow-span">
                                {Number(todayData[0].conductivity).toFixed(2)}{" "}
                                g/l
                              </span>
                            </div>

                            <div className="d-flex align-items-center mb-1">
                              <img
                                src={circleBlue}
                                alt="circleBlue"
                                width={12}
                                height={12}
                              />
                              <p className="m-0 infowindow-desc ms-1 me-1 ">
                                Temperatura:
                              </p>{" "}
                              <span className="infowindow-span">
                                {Number(todayData[0].temp).toFixed(2)} °C
                              </span>
                            </div>

                            <div className="d-flex align-items-center">
                              <img
                                src={circleBlue}
                                alt="circleBlue"
                                width={12}
                                height={12}
                              />
                              <p className="m-0 infowindow-desc ms-1 me-1">
                                Sana:
                              </p>{" "}
                              <span className="infowindow-span">
                                {todayData[0].date?.split(" ")[1]}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h3 className="fw-semibold text-success fs-6 text-center">
                              {stationName}
                            </h3>
                            <div className="d-flex align-items-center justify-content-center">
                              <img
                                src={circleRed}
                                alt="circleBlue"
                                width={18}
                                height={18}
                              />
                              <p className="m-0 infowindow-desc-not-last-data fs-6 ms-1 me-1 ">
                                Ma'lumot kelmagan...
                              </p>
                            </div>{" "}
                          </div>
                        )}
                      </InfoWindowF>
                    ) : null}
                  </MarkerF>
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
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#profile-users-ten"
              >
                Kecha
              </button>
            </li>

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
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="m-0 mb-3">{stationName}</h2>
                  <div className="d-flex align-items-center ms-auto">
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
                    <button
                      onClick={() => exportNewsByPdf()}
                      className="ms-4 border border-0"
                    >
                      <img src={pdf} alt="pdf" width={23} height={30} />
                    </button>
                    <button
                      onClick={() => exportDataToExcel()}
                      className="ms-4 border border-0"
                    >
                      <img src={excel} alt="excel" width={26} height={30} />
                    </button>
                  </div>
                </div>
                <table className="table mt-4">
                  <thead>
                    <tr>
                      <th scope="col">Sath (sm)</th>
                      <th scope="col">Sho'rlanish (g/l) </th>
                      <th scope="col">Temperatura (°C)</th>
                      <th scope="col">Sana</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayData.map((e, i) => {
                      return (
                        <tr key={i}>
                          <td>{Number(e.level).toFixed(2)}</td>
                          <td>{Number(e.conductivity).toFixed(2)}</td>
                          <td>{Number(e.temp).toFixed(2)}</td>
                          <td>{e.date?.split(" ")[1]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tab-pane fade profile-users" id="profile-users">
              <div className="dashboard-table dashboard-table-user-last-data-news mt-2">
                <h2 className="m-0 mb-3">{stationName}</h2>
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
                      <th scope="col">Sath (sm)</th>
                      <th scope="col">Sho'rlanish (g/l) </th>
                      <th scope="col">Temperatura (°C)</th>
                      <th scope="col">Sana</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayData.map((e, i) => {
                      return (
                        <tr key={i}>
                          <td>{e.level}</td>
                          <td>{Number(e.conductivity).toFixed(2)}</td>
                          <td>{e.temp}</td>
                          <td>{e.date?.split(" ")[1]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
