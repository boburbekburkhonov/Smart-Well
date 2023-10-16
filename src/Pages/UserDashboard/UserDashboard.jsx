import React, { useRef } from "react";
import { Chart as Chartjs, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, getElementsAtEvent } from "react-chartjs-2";
import "./UserDashboard.css";
import circleBlue from "../../assets/images/record.png";
import circleGreen from "../../assets/images/circle.png";
import circleGreenBlue from "../../assets/images/circle-green-blue.png";
import circleOrange from "../../assets/images/circle-orange.png";
import circleRed from "../../assets/images/circle-red.png";
import circleYellow from "../../assets/images/circle-yellow.png";
import fullScreen from "../../assets/images/fullscreen.png";
import { useEffect } from "react";
import { api } from "../Api/Api";
import { useState } from "react";

Chartjs.register(ArcElement, Tooltip, Legend);

const UserDashboard = (prop) => {
  const { balanceOrg } = prop;
  const name = window.localStorage.getItem("name");
  const role = window.localStorage.getItem("role");
  const [dataOrStation, setDataOrStation] = useState("data");
  const [stationBattery, setStationBattery] = useState([]);
  const [stationStatistic, settationStatistic] = useState([]);
  const [viewStation, setViewStation] = useState([]);
  const [viewStationLimit, setViewStationLimit] = useState([]);
  const [viewStationByChar, setViewStationByChar] = useState([]);
  const [viewStationByCharLimit, setViewStationByCharLimit] = useState([]);
  const [whichStation, setWhichStation] = useState("allStation");
  const [tableTitle, setTableTitle] = useState("Umumiy stansiyalar soni");
  const chartRef = useRef();

  useEffect(() => {
    const userDashboardFunc = async () => {
      // ! STATION STATISTIC
      const requestStationStatistic = await fetch(
        `${api}/last-data/getStatisticStations`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        }
      );

      const responseStationStatistic = await requestStationStatistic.json();

      settationStatistic(responseStationStatistic.data);

      if (responseStationStatistic.statusCode == 401) {
        const request = await fetch(`${api}/auth/signin`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            username: window.localStorage.getItem("username"),
            password: window.localStorage.getItem("password"),
          }),
        });

        const response = await request.json();

        if (response.statusCode == 200) {
          window.localStorage.setItem("accessToken", response.data.accessToken);
          window.localStorage.setItem(
            "refreshToken",
            response.data.refreshToken
          );
        }
      }
    };

    userDashboardFunc();

    fetch(`${api}/stations/getStatisticStationsByBattery`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => setStationBattery(data.data));
  }, []);

  useEffect(() => {
    if (whichStation == "allStation") {
      fetch(
        `${api}/last-data/allLastData?page=1&perPage=${stationStatistic?.totalStationsCount}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          role == "USER"
            ? setViewStation(data.data)
            : setViewStation(data.data);
        });

      // ! LIMIT
      fetch(`${api}/last-data/allLastData?page=1&perPage=8`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) =>
          role == "USER"
            ? setViewStationLimit(data.data)
            : setViewStationLimit(data.data)
        );
    } else if (whichStation == "todayStation") {
      fetch(
        `${api}/last-data/todayWorkStations?page=1&perPage=${stationStatistic?.totalTodayWorkStationsCount}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setViewStation(data.data.docs));

      // ! LIMIT

      fetch(`${api}/last-data/todayWorkStations?page=1&perPage=8`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => setViewStationLimit(data.data.docs));
    } else if (whichStation == "withinThreeDayStation") {
      fetch(
        `${api}/last-data/treeDaysWorkStations?page=1&perPage=${stationStatistic?.totalThreeDayWorkStationsCount}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setViewStation(data.data.docs));

      // ! LIMIT

      fetch(`${api}/last-data/treeDaysWorkStations?page=1&perPage=8`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => setViewStationLimit(data.data.docs));
    } else if (whichStation == "totalMonthWorkStation") {
      fetch(
        `${api}/last-data/lastMonthWorkStations?page=1&perPage=${stationStatistic?.totalMonthWorkStationsCount}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setViewStation(data.data.docs));

      // ! LIMIT

      fetch(`${api}/last-data/lastMonthWorkStations?page=1&perPage=8`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => setViewStationLimit(data.data.docs));
    } else if (whichStation == "totalMoreWorkStations") {
      fetch(
        `${api}/last-data/moreWorkStations?page=1&perPage=${stationStatistic?.totalMoreWorkStationsCount}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setViewStation(data.data.docs));

      // ! LIMIT

      fetch(`${api}/last-data/moreWorkStations?page=1&perPage=8`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => setViewStationLimit(data.data.docs));
    } else if (whichStation == "notWorkStation") {
      fetch(
        `${api}/last-data/getNotLastDataStations?page=1&perPage=${stationStatistic?.totalNotDataStationsCount}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setViewStation(data.data.docs));

      // ! LIMIT

      fetch(`${api}/last-data/getNotLastDataStations?page=1&perPage=8`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => setViewStationLimit(data.data.docs));
    }
  }, [stationStatistic, whichStation]);

  const data = {
    labels: ["90%", "75%", "50%", "25%", "25% dan pastlari"],
    datasets: [
      {
        label: "Batery",
        data: [
          stationBattery.totalStationsByBatteryLevel90,
          stationBattery.totalStationsByBatteryLevel75,
          stationBattery.totalStationsByBatteryLevel50,
          stationBattery.totalStationsByBatteryLevel25,
          stationBattery.totalStationsByBatteryLevel25Low,
        ],
        backgroundColor: ["#00B4E5", "#32D232", "#FCD401", "#FF8000", "red"],
      },
    ],
  };

  const options = {};

  const filteredStationDate = (item) => {
    const time = item?.split("T")[1].split(".")[0];
    const date = item?.split("T")[0].split("-");
    if (whichStation == "todayStation") {
      return time;
    } else if (time != undefined) {
      return `${date[1]}/${date[2]}/${date[0]} ${time}`;
    }
  };

  const filteredStationDateByChar = (item) => {
    const time = item?.split("T")[1].split(".")[0];
    const date = item?.split("T")[0].split("-");

    return `${date[1]}/${date[2]}/${date[0]} ${time}`;
  };

  const onClick = (event) => {
    setDataOrStation("station");
    const index = getElementsAtEvent(chartRef.current, event)[0].index;

    if (index == 0) {
      setTableTitle("Batareya quvvati 90% dan ko'p bo'lgan stansiyalar");
      // ! LIMIT
      fetch(
        `${api}/stations/batteryGreaterThen?batteryStatus=90&page=1&perPage=8`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setViewStationByCharLimit(data.data.data));

      // !----------------------------------------------------------------

      fetch(`${api}/stations/batteryGreaterThen?batteryStatus=90`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => setViewStationByChar(data.data.data));
    } else if (index == 1) {
      setTableTitle("Batareya quvvati 75% dan ko'p bo'lgan stansiyalar");

      // ! LIMIT
      fetch(
        `${api}/stations/batteryLessThen?batteryStatus=75&page=1&perPage=8`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setViewStationByCharLimit(data.data.data));

      // !----------------------------------------------------------------

      fetch(`${api}/stations/batteryLessThen?batteryStatus=75`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => setViewStationByChar(data.data.data));
    } else if (index == 2) {
      setTableTitle("Batareya quvvati 50% dan ko'p bo'lgan stansiyalar");

      // ! LIMIT
      fetch(
        `${api}/stations/batteryLessThen?batteryStatus=50&page=1&perPage=8`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setViewStationByCharLimit(data.data.data));

      // !----------------------------------------------------------------

      fetch(`${api}/stations/batteryLessThen?batteryStatus=50`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => setViewStationByChar(data.data.data));
    } else if (index == 3) {
      setTableTitle("Batareya quvvati 25% dan ko'p bo'lgan stansiyalar");

      // ! LIMIT
      fetch(
        `${api}/stations/batteryLessThen?batteryStatus=25&page=1&perPage=8`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setViewStationByCharLimit(data.data.data));

      // !----------------------------------------------------------------

      fetch(`${api}/stations/batteryLessThen?batteryStatus=25`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => setViewStationByChar(data.data.data));
    }
  };

  return (
    <section className="home-section p-0">
      <div className="container-fluid p-0">
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
                  <h1 className="modal-title fs-4" id="exampleModalLabel">
                    {tableTitle}
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {dataOrStation == "data" ? (
                    <table className="table mt-4">
                      <thead>
                        <tr>
                          <th scope="col" className="text-center">
                            Nomi
                          </th>
                          <th scope="col" className="text-center">
                            Sath (sm)
                          </th>
                          <th scope="col" className="text-center">
                            Sho'rlanish (g/l)
                          </th>
                          <th scope="col" className="text-center">
                            Temperatura (°C)
                          </th>
                          <th scope="col" className="text-center">
                            {whichStation == "todayStation" ? "Vaqt" : "Sana"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewStation?.map((e, i) => {
                          return (
                            <tr key={i}>
                              <td className="text-center">
                                {whichStation == "allStation" ||
                                whichStation == "notWorkStation"
                                  ? e?.name
                                  : e.stations?.name}
                              </td>
                              <td className="text-center">
                                {whichStation == "allStation" &&
                                e.lastData?.level != undefined
                                  ? Number(e.lastData?.level).toFixed(2)
                                  : e.level != undefined
                                  ? Number(e.level).toFixed(2)
                                  : "-"}
                              </td>
                              <td className="text-center">
                                {whichStation == "allStation" &&
                                e.lastData?.conductivity != undefined
                                  ? Number(e.lastData?.conductivity).toFixed(2)
                                  : e.conductivity != undefined
                                  ? Number(e.conductivity).toFixed(2)
                                  : "-"}
                              </td>
                              <td className="text-center">
                                {whichStation == "allStation" &&
                                e.lastData?.temp != undefined
                                  ? Number(e.lastData?.temp).toFixed(2)
                                  : e.temp != undefined
                                  ? Number(e.temp).toFixed(2)
                                  : "-"}
                              </td>
                              <td className="text-center">
                                {whichStation == "allStation"
                                  ? filteredStationDate(e.lastData?.date)
                                  : filteredStationDate(e?.date)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <table className="table mt-4">
                      <thead>
                        <tr>
                          <th scope="col" className="text-center">
                            Nomi
                          </th>
                          <th scope="col" className="text-center">
                            Imei
                          </th>
                          <th scope="col" className="text-center">
                            Batareya (%)
                          </th>
                          <th scope="col" className="text-center">
                            Signal
                          </th>
                          <th scope="col" className="text-center">
                            Status
                          </th>
                          <th scope="col" className="text-center">
                            {whichStation == "todayStation" ? "Vaqt" : "Sana"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewStationByChar?.map((e, i) => {
                          return (
                            <tr key={i}>
                              <td className="text-center">{e?.name}</td>
                              <td className="text-center">{e.imel}</td>
                              <td className="text-center">{e.battery}</td>
                              <td className="text-center">{e.signal}</td>
                              <td className="text-center">{e.status}</td>
                              <td className="text-center">
                                {filteredStationDateByChar(e?.date)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid p-0">
            <div className="user-dashboard-top-wrapper">
              <div className="d-flex align-items-center mb-3 pt-3">
                <h1 className="dashboard-heading ms-2">
                  {balanceOrg.length == 0
                    ? `${name} ga biriktirilgan qurilmalar`
                    : `${
                        balanceOrg.find((e) => {
                          if (e.id == name) {
                            return e.name;
                          }
                        })?.name
                      } ga biriktirilgan qurilmalar`}
                </h1>
              </div>

              <ul className="dashboard-list list-unstyled m-0 d-flex flex-wrap align-items-center justify-content-between">
                {stationStatistic?.totalStationsCount > 0 ? (
                  <li
                    className="dashboard-list-item mt-3 d-flex"
                    onClick={() => {
                      setWhichStation("allStation");
                      setTableTitle("Umumiy stansiyalar soni");
                      setDataOrStation("data");
                    }}
                  >
                    <img
                      src={circleBlue}
                      alt="circleBlue"
                      width={30}
                      height={30}
                    />
                    <div className="ms-2">
                      <p className="dashboard-list-number m-0">
                        {stationStatistic?.totalStationsCount} ta
                      </p>
                      <p className="dashboard-list-desc m-0">
                        Umumiy stansiyalar soni
                      </p>
                      <p className="dashboard-list-desc-percentage text-info m-0 text-end">
                        100%
                      </p>
                    </div>
                  </li>
                ) : null}

                {stationStatistic?.totalTodayWorkStationsCount > 0 ? (
                  <li
                    className="dashboard-list-item d-flex mt-3"
                    onClick={() => {
                      setWhichStation("todayStation");
                      setTableTitle("Bugun ishlayotganlar stansiyalar");
                      setDataOrStation("data");
                    }}
                  >
                    <img
                      src={circleGreen}
                      alt="circleGreen"
                      width={30}
                      height={30}
                    />
                    <div className="ms-2">
                      <p className="dashboard-list-number m-0">
                        {stationStatistic?.totalTodayWorkStationsCount} ta
                      </p>
                      <p className="dashboard-list-desc m-0">
                        Bugun ishlayotganlar stansiyalar
                      </p>
                      <p className="dashboard-list-desc-percentage text-info m-0 text-end">
                        {(
                          (stationStatistic?.totalTodayWorkStationsCount *
                            100) /
                          stationStatistic?.totalStationsCount
                        ).toFixed()}
                        %
                      </p>
                    </div>
                  </li>
                ) : null}

                {stationStatistic?.totalThreeDayWorkStationsCount > 0 ? (
                  <li
                    className="dashboard-list-item mt-3 d-flex"
                    onClick={() => {
                      setWhichStation("withinThreeDayStation");
                      setTableTitle("3 kun ichida ishlagan stansiyalar");
                      setDataOrStation("data");
                    }}
                  >
                    <img
                      src={circleGreenBlue}
                      alt="circleGreen"
                      width={30}
                      height={30}
                    />
                    <div className="ms-2">
                      <p className="dashboard-list-number m-0">
                        {stationStatistic?.totalThreeDayWorkStationsCount} ta
                      </p>
                      <p className="dashboard-list-desc m-0">
                        3 kun ichida ishlagan stansiyalar
                      </p>
                      <p className="dashboard-list-desc-percentage text-info m-0 text-end">
                        {(
                          (stationStatistic?.totalThreeDayWorkStationsCount *
                            100) /
                          stationStatistic?.totalStationsCount
                        ).toFixed()}
                        %
                      </p>
                    </div>
                  </li>
                ) : null}

                {stationStatistic?.totalMonthWorkStationsCount > 0 ? (
                  <li
                    className="dashboard-list-item mt-3 d-flex"
                    onClick={() => {
                      setWhichStation("totalMonthWorkStation");
                      setTableTitle("Oxirgi oy ishlagan stansiyalar");
                      setDataOrStation("data");
                    }}
                  >
                    <img
                      src={circleYellow}
                      alt="circleGreen"
                      width={30}
                      height={30}
                    />
                    <div className="ms-2">
                      <p className="dashboard-list-number m-0">
                        {stationStatistic?.totalMonthWorkStationsCount}
                        ta
                      </p>
                      <p className="dashboard-list-desc m-0">
                        Oxirgi oy ishlagan stansiyalar
                      </p>
                      <p className="dashboard-list-desc-percentage text-info m-0 text-end">
                        {(
                          (stationStatistic?.totalMonthWorkStationsCount *
                            100) /
                          stationStatistic?.totalStationsCount
                        ).toFixed()}
                        %
                      </p>
                    </div>
                  </li>
                ) : null}

                {stationStatistic?.totalMoreWorkStationsCount > 0 ? (
                  <li
                    className="dashboard-list-item mt-3 d-flex"
                    onClick={() => {
                      setWhichStation("totalMoreWorkStations");
                      setTableTitle("Uzoq vaqt ishlamagan qurilmalar");
                      setDataOrStation("data");
                    }}
                  >
                    <img
                      src={circleOrange}
                      alt="circleGreen"
                      width={30}
                      height={30}
                    />
                    <div className="ms-2">
                      <p className="dashboard-list-number m-0">
                        {stationStatistic?.totalMoreWorkStationsCount}
                        ta
                      </p>
                      <p className="dashboard-list-desc m-0">
                        Uzoq vaqt ishlamagan qurilmalar
                      </p>
                      <p className="dashboard-list-desc-percentage text-info m-0 text-end">
                        {(
                          (stationStatistic?.totalMoreWorkStationsCount * 100) /
                          stationStatistic?.totalStationsCount
                        ).toFixed()}
                        %
                      </p>
                    </div>
                  </li>
                ) : null}

                {stationStatistic?.totalNotDataStationsCount > 0 ? (
                  <li
                    className="dashboard-list-item mt-3 d-flex"
                    onClick={() => {
                      setWhichStation("notWorkStation");
                      setTableTitle("Umuman ishlamagan stansiyalar");
                      setDataOrStation("data");
                    }}
                  >
                    <img
                      src={circleRed}
                      alt="circleGreen"
                      width={30}
                      height={30}
                    />
                    <div className="ms-2">
                      <p className="dashboard-list-number m-0">
                        {stationStatistic?.totalNotDataStationsCount} ta
                      </p>
                      <p className="dashboard-list-desc m-0">
                        Umuman ishlamagan stansiyalar
                      </p>
                      <p className="dashboard-list-desc-percentage text-info m-0 text-end">
                        {(
                          (stationStatistic?.totalNotDataStationsCount * 100) /
                          stationStatistic?.totalStationsCount
                        ).toFixed()}
                        %
                      </p>
                    </div>
                  </li>
                ) : null}
              </ul>
            </div>

            <div className="table-char-wrapperlist d-flex flex-wrap justify-content-between">
              <div className="dashboard-table mt-5">
                <div className="d-flex justify-content-between align-items-center">
                  <h2>{tableTitle}</h2>
                  <span
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    className="dashboard-fullscreen-wrapper"
                  >
                    <img
                      src={fullScreen}
                      alt="fullScreen"
                      width={20}
                      height={20}
                    />
                  </span>
                </div>
                {dataOrStation == "data" ? (
                  <table className="table mt-4">
                    <thead>
                      <tr>
                        <th scope="col" className="text-center">
                          Nomi
                        </th>
                        <th scope="col" className="text-center">
                          Sath (sm)
                        </th>
                        <th scope="col" className="text-center">
                          Sho'rlanish (g/l)
                        </th>
                        <th scope="col" className="text-center">
                          Temperatura (°C)
                        </th>
                        <th scope="col" className="text-center">
                          {whichStation == "todayStation" ? "Vaqt" : "Sana"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewStationLimit?.map((e, i) => {
                        return (
                          <tr key={i}>
                            <td className="text-center">
                              {whichStation == "allStation" ||
                              whichStation == "notWorkStation"
                                ? e?.name
                                : e.stations?.name}
                            </td>
                            <td className="text-center">
                              {whichStation == "allStation" &&
                              e.lastData?.level != undefined
                                ? Number(e.lastData?.level).toFixed(2)
                                : e.level != undefined
                                ? Number(e.level).toFixed(2)
                                : "-"}
                            </td>
                            <td className="text-center">
                              {whichStation == "allStation" &&
                              e.lastData?.conductivity != undefined
                                ? Number(e.lastData?.conductivity).toFixed(2)
                                : e.conductivity != undefined
                                ? Number(e.conductivity).toFixed(2)
                                : "-"}
                            </td>
                            <td className="text-center">
                              {whichStation == "allStation" &&
                              e.lastData?.temp != undefined
                                ? Number(e.lastData?.temp).toFixed(2)
                                : e.temp != undefined
                                ? Number(e.temp).toFixed(2)
                                : "-"}
                            </td>
                            <td className="text-center">
                              {whichStation == "allStation"
                                ? filteredStationDate(e.lastData?.date)
                                : filteredStationDate(e?.date)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <table className="table mt-4">
                    <thead>
                      <tr>
                        <th scope="col" className="text-center">
                          Nomi
                        </th>
                        <th scope="col" className="text-center">
                          Batareya (%)
                        </th>
                        <th scope="col" className="text-center">
                          Signal
                        </th>
                        <th scope="col" className="text-center">
                          Status
                        </th>
                        <th scope="col" className="text-center">
                          {whichStation == "todayStation" ? "Vaqt" : "Sana"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewStationByCharLimit?.map((e, i) => {
                        return (
                          <tr key={i}>
                            <td className="text-center">{e?.name}</td>
                            <td className="text-center">{e.battery}</td>
                            <td className="text-center">{e.signal}</td>
                            <td className="text-center">{e.status}</td>
                            <td className="text-center">
                              {filteredStationDateByChar(e?.date)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="dashboard-dought-wrapper mt-5">
                <h3 className="dashboard-dought-wrapper-heading m-0">
                  Qurilmalarning batareya quvvatlari
                </h3>
                <Doughnut
                  className="mx-3"
                  data={data}
                  options={options}
                  onClick={onClick}
                  ref={chartRef}
                ></Doughnut>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default UserDashboard;
