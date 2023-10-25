import React, { useState } from "react";
import batteryFull from "../../assets/images/battery-100.svg";
import batteryNo from "../../assets/images/battery-0.svg";
import batteryPow from "../../assets/images/battery-70.svg";
import batteryLow from "../../assets/images/battery-40.svg";
import batteryRed from "../../assets/images/battery-30.svg";
import circleBlue from "../../assets/images/record.png";
import circleGreen from "../../assets/images/circle.png";
import circleGreenBlue from "../../assets/images/circle-green-blue.png";
import circleOrange from "../../assets/images/circle-orange.png";
import circleYellow from "../../assets/images/circle-yellow.png";
import "./UserLastData.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../Api/Api";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import excel from "../../assets/images/excel.png";

const UserLastData = (prop) => {
  const [loader, setLoader] = useState(false);
  const [allStation, setAllStation] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const { balanceOrg } = prop;
  const name = window.localStorage.getItem("name");
  const role = window.localStorage.getItem("role");
  const [stationStatistic, settationStatistic] = useState([]);
  const [whichStation, setWhichStation] = useState("allStation");
  const [tableTitle, setTableTitle] = useState("Umumiy stansiyalar soni");
  const [colorCard, setColorCard] = useState(
    "user-last-data-list-item-href-blue"
  );

  // ! REFRESH TOKEN
  const minuteLimit = window.localStorage.getItem("minute") * 1;
  const minuteNow = new Date().getMinutes();
  const minute = 60 * 1000;
  let responseLimit;
  if (minuteLimit > minuteNow) {
    if (minuteLimit - minuteNow <= 1) {
      responseLimit = 10000;
    } else {
      responseLimit = minute * (minuteLimit - minuteNow);
    }
  } else if (minuteLimit < minuteNow) {
    if (minuteLimit + 60 - minuteNow <= 1) {
      responseLimit = 10000;
    } else {
      responseLimit = minute * (minuteLimit + 60 - minuteNow);
    }
  }

  setTimeout(() => {
    fetch(`${api}/auth/signin`, {
      method: "POST",
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
          let date = new Date();
          date.setMinutes(new Date().getMinutes() + 14);
          window.localStorage.setItem("minute", date.getMinutes());
          window.localStorage.setItem("accessToken", data.data.accessToken);
          window.localStorage.setItem("refreshToken", data.data.refreshToken);
        }
      });
  }, responseLimit);

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
  }, []);

  useEffect(() => {
    const userLastDataFunc = async () => {
      const request = await fetch(
        `${api}/last-data/allLastData?page=1&perPage=12`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        }
      );

      const response = await request.json();

      setAllStation(response.data);
      setTotalPages(response.totalPages);
    };

    userLastDataFunc();
  }, []);

  useEffect(() => {
    if (whichStation == "allStation") {
      // ! LIMIT
      fetch(`${api}/last-data/allLastData?page=1&perPage=12`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          role == "USER"
            ? `${setAllStation(data.data)} ${setTotalPages(data.totalPages)}`
            : `${setAllStation(data.data)} ${setTotalPages(data.totalPages)}`;
        });
    } else if (whichStation == "todayStation") {
      // ! LIMIT

      fetch(`${api}/last-data/todayWorkStations?page=1&perPage=12`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          role == "USER"
            ? `${setAllStation(data.data.docs)} ${setTotalPages(
                data.totalPages
              )}`
            : `${setAllStation(data.data.docs)} ${setTotalPages(
                data.data.totalPages
              )}`;
        });
    } else if (whichStation == "withinThreeDayStation") {
      // ! LIMIT

      fetch(`${api}/last-data/treeDaysWorkStations?page=1&perPage=12`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          role == "USER"
            ? `${setAllStation(data.data.docs)} ${setTotalPages(
                data.totalPages
              )}`
            : `${setAllStation(data.data.docs)} ${setTotalPages(
                data.data.totalPages
              )}`;
        });
    } else if (whichStation == "totalMonthWorkStation") {
      // ! LIMIT

      fetch(`${api}/last-data/lastMonthWorkStations?page=1&perPage=12`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          role == "USER"
            ? `${setAllStation(data.data.docs)} ${setTotalPages(
                data.totalPages
              )}`
            : `${setAllStation(data.data.docs)} ${setTotalPages(
                data.data.totalPages
              )}`;
        });
    } else if (whichStation == "totalMoreWorkStations") {
      // ! LIMIT

      fetch(`${api}/last-data/moreWorkStations?page=1&perPage=12`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          role == "USER"
            ? `${setAllStation(data.data.docs)} ${setTotalPages(
                data.totalPages
              )}`
            : `${setAllStation(data.data.docs)} ${setTotalPages(
                data.data.totalPages
              )}`;
        });
    } else if (whichStation == "notWorkStation") {
      // ! LIMIT

      fetch(`${api}/last-data/getNotLastDataStations?page=1&perPage=12`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          role == "USER"
            ? `${setAllStation(data.data.docs)} ${setTotalPages(
                data.totalPages
              )}`
            : `${setAllStation(data.data.docs)} ${setTotalPages(
                data.data.totalPages
              )}`;
        });
    }
  }, [stationStatistic, whichStation]);

  const handlePageChange = (selectedPage) => {
    if (whichStation == "allStation") {
      // ! LIMIT
      fetch(
        `${api}/last-data/allLastData?page=${
          selectedPage.selected + 1
        }&perPage=12`,
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
        .then((data) =>
          role == "USER"
            ? `${setAllStation(data.data)}`
            : `${setAllStation(data.data)}`
        );
    } else if (whichStation == "todayStation") {
      // ! LIMIT

      fetch(
        `${api}/last-data/todayWorkStations?page=${
          selectedPage.selected + 1
        }&perPage=12`,
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
          setAllStation(data.data.docs);
        });
    } else if (whichStation == "withinThreeDayStation") {
      // ! LIMIT

      fetch(
        `${api}/last-data/treeDaysWorkStations?page=${
          selectedPage.selected + 1
        }&perPage=12`,
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
          setAllStation(data.data.docs);
        });
    } else if (whichStation == "totalMonthWorkStation") {
      // ! LIMIT

      fetch(
        `${api}/last-data/lastMonthWorkStations?page=${
          selectedPage.selected + 1
        }&perPage=12`,
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
          setAllStation(data.data.docs);
        });
    } else if (whichStation == "totalMoreWorkStations") {
      // ! LIMIT

      fetch(
        `${api}/last-data/moreWorkStations?page=${
          selectedPage.selected + 1
        }&perPage=12`,
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
          setAllStation(data.data.docs);
        });
    }
  };

  const returnFixdDate = (item) => {
    const fixedDate = new Date(item);
    fixedDate.setHours(fixedDate.getHours() - 5);

    const date = `${fixedDate.getDate()}/${
      fixedDate.getMonth() + 1
    }/${fixedDate.getFullYear()} ${fixedDate.getHours()}:${
      String(fixedDate.getMinutes()).length == 1
        ? "0" + fixedDate.getMinutes()
        : fixedDate.getMinutes()
    }`;

    return date;
  };

  const checkStationWorkingOrNot = (value) => {
    const presentDate = new Date();
    let startDate = new Date(value?.date);
    startDate.setHours(startDate.getHours() - 5);

    if (value?.level == undefined) {
      return 404;
    } else if (
      startDate.getFullYear() == presentDate.getFullYear() &&
      startDate.getMonth() == presentDate.getMonth()
    ) {
      return presentDate.getDate() - startDate.getDate();
    } else if (
      (startDate.getFullYear() == presentDate.getFullYear() &&
        presentDate.getMonth() - startDate.getMonth() == 1 &&
        presentDate.getDate() == 2 &&
        30 <= startDate.getDate() &&
        startDate.getDate() <= 31) ||
      (startDate.getFullYear() == presentDate.getFullYear() &&
        presentDate.getMonth() - startDate.getMonth() == 1 &&
        presentDate.getDate() == 1 &&
        29 <= startDate.getDate() &&
        startDate.getDate() <= 31)
    ) {
      return 1;
    } else if (
      (startDate.getFullYear() == presentDate.getFullYear() &&
        presentDate.getMonth() == startDate.getMonth() &&
        presentDate.getDate() - startDate.getDate() > 3) ||
      (startDate.getFullYear() == presentDate.getFullYear() &&
        presentDate.getMonth() - startDate.getMonth() == 1 &&
        presentDate.getDate() - startDate.getDate() <= 0)
    ) {
      return "one month";
    } else if (
      startDate.getFullYear() == presentDate.getFullYear() &&
      presentDate.getMonth() - startDate.getMonth() == 1 &&
      presentDate.getDate() - startDate.getDate() >= 0
    ) {
      return "after one month";
    }
  };

  // ! SAVE DATA EXCEL
  const exportDataToExcel = () => {
    const resultExcelData = [];

    allStation.forEach((e) => {
      resultExcelData.push({
        nomi: whichStation == "allStation" ? e.name : e.stations.name,
        imei: whichStation == "allStation" ? e.imel : e.stations.imel,
        battery: whichStation == "allStation" ? e.battery : e.stations.battery,
        sath:
          whichStation == "allStation"
            ? Number(e?.lastData.level).toFixed(2)
            : Number(e.level).toFixed(2),
        shurlanish:
          whichStation == "allStation"
            ? Number(e?.lastData.conductivity).toFixed(2)
            : Number(e.conductivity).toFixed(2),
        temperatura:
          whichStation == "allStation"
            ? Number(e?.lastData.temp).toFixed(2)
            : Number(e.temp).toFixed(2),
        Sana: whichStation == "allStation" ? e?.lastData.date : e.date,
        Integratsiya:
          whichStation == "allStation"
            ? e?.isIntegration == true
              ? "true"
              : "false"
            : e.stations.isIntegration == true
            ? "true"
            : "false",
      });
    });

    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(resultExcelData);

    XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

    const fixedDate = new Date();

    const resultDate = `${fixedDate.getDate()}/${
      fixedDate.getMonth() + 1
    }/${fixedDate.getFullYear()} ${fixedDate.getHours()}:${
      String(fixedDate.getMinutes()).length == 1
        ? "0" + fixedDate.getMinutes()
        : fixedDate.getMinutes()
    }`;

    if (resultExcelData.length > 0 && whichStation == "allStation") {
      XLSX.writeFile(
        workBook,
        `${name} ning umumiy stansiya ma'lumotlari ${resultDate}.xlsx`
      );
    } else if (resultExcelData.length > 0 && whichStation == "todayStation") {
      XLSX.writeFile(
        workBook,
        `${name} ning bugun kelgan ma'lumotlari ${resultDate}.xlsx`
      );
    } else if (
      resultExcelData.length > 0 &&
      whichStation == "withinThreeDayStation"
    ) {
      XLSX.writeFile(
        workBook,
        `${name} ning 3 ichida kelgan ma'lumotlari ${resultDate}.xlsx`
      );
    } else if (
      resultExcelData.length > 0 &&
      whichStation == "totalMonthWorkStation"
    ) {
      XLSX.writeFile(
        workBook,
        `${name} ning so'ngi oy kelgan ma'lumotlari ${resultDate}.xlsx`
      );
    } else if (
      resultExcelData.length > 0 &&
      whichStation == "totalMoreWorkStations"
    ) {
      XLSX.writeFile(
        workBook,
        `${name} ning uzoq ishlamagan stansiya ma'lumotlari ${resultDate}.xlsx`
      );
    }
  };

  const searchStationByInput = (value) => {
    if (whichStation == "allStation") {
      fetch(
        `${api}/last-data/searchLastDataByStation?search=${value}&page=1&perPage=12`,
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
        .then((data) => setAllStation(data.data.data));
    } else if (whichStation == "todayStation") {
      fetch(
        `${api}/last-data/searchTodayWorkingStations?search=${value}&page=1&perPage=12`,
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
        .then((data) => setAllStation(data.data.docs));
    } else if (whichStation == "withinThreeDayStation") {
      fetch(
        `${api}/last-data/searchThreeDaysWorkingStations?search=${value}&page=1&perPage=12`,
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
        .then((data) => setAllStation(data.data.docs));
    } else if (whichStation == "totalMonthWorkStation") {
      fetch(
        `${api}/last-data/searchLastMonthWorkingStations?search=${value}&page=1&perPage=12`,
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
        .then((data) => setAllStation(data.data.docs));
    } else if (whichStation == "totalMoreWorkStations") {
      fetch(
        `${api}/last-data/searchMoreWorkingStations?search=${value}&page=1&perPage=12`,
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
        .then((data) => setAllStation(data.data.docs));
    }
  };

  const loaderFunc = () => {
    setLoader(true);

    setTimeout(() => {
      setLoader(false);
    }, 700);
  };

  return (
    <section className="home-section py-3">
      <div className="container-fluid">
        <div className="card">
          {allStation.length > 0 ? (
            <div className="card-body">
              <div className="tab-content">
                <div
                  className="tab-pane container-fluid fade show active profile-users user-last-data-table-wrapper"
                  id="profile-users"
                >
                  <div className="user-last-data-top-wrapper pt-5">
                    <h1 className="mb-3 user-lastdata-heading">
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

                    <ul className="dashboard-list list-unstyled m-0 d-flex flex-wrap align-items-center justify-content-between mt-4">
                      {stationStatistic?.totalStationsCount > 0 ? (
                        <li
                          className="dashboard-list-item mt-3 d-flex border-blue"
                          onClick={() => {
                            setWhichStation("allStation");
                            setTableTitle("Umumiy stansiyalar soni");
                            setColorCard("user-last-data-list-item-href-blue");
                            loaderFunc();
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
                          className="dashboard-list-item d-flex mt-3 border-green"
                          onClick={() => {
                            setWhichStation("todayStation");
                            setTableTitle("Bugun ishlayotganlar stansiyalar");
                            setColorCard("user-last-data-list-item-href-green");
                            loaderFunc();
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
                          className="dashboard-list-item mt-3 d-flex border-azeu"
                          onClick={() => {
                            setWhichStation("withinThreeDayStation");
                            setTableTitle("3 kun ichida ishlagan stansiyalar");
                            setColorCard(
                              "user-last-data-list-item-href-lime-green"
                            );
                            loaderFunc();
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
                              {stationStatistic?.totalThreeDayWorkStationsCount}{" "}
                              ta
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
                          className="dashboard-list-item mt-3 d-flex border-yellow"
                          onClick={() => {
                            setWhichStation("totalMonthWorkStation");
                            setTableTitle("Oxirgi oy ishlagan stansiyalar");
                            setColorCard(
                              "user-last-data-list-item-href-yellow"
                            );
                            loaderFunc();
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
                          className="dashboard-list-item mt-3 d-flex border-orange"
                          onClick={() => {
                            setWhichStation("totalMoreWorkStations");
                            setTableTitle("Uzoq vaqt ishlamagan qurilmalar");
                            setColorCard(
                              "user-last-data-list-item-href-orange"
                            );
                            loaderFunc();
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
                                (stationStatistic?.totalMoreWorkStationsCount *
                                  100) /
                                stationStatistic?.totalStationsCount
                              ).toFixed()}
                              %
                            </p>
                          </div>
                        </li>
                      ) : null}
                    </ul>
                  </div>

                  <h3 className="m-0 mt-5">{tableTitle} ning ma'lumotlari</h3>

                  <div className="d-flex align-items-center user-last-data-sort-wrapper justify-content-end">
                    <input
                      onChange={(e) => searchStationByInput(e.target.value)}
                      type="text"
                      className="form-control user-last-data-search-input"
                      placeholder="Search..."
                    />

                    <button
                      onClick={() => exportDataToExcel()}
                      className="ms-4 border border-0"
                    >
                      <img src={excel} alt="excel" width={26} height={30} />
                    </button>
                  </div>
                  {loader ? (
                    <div className="d-flex align-items-center justify-content-center hour-spinner-wrapper">
                      <span className="loader"></span>
                    </div>
                  ) : (
                    <ol className="user-last-data-list list-unstyled m-0 mt-4 mb-4 d-flex align-items-center justify-content-between flex-wrap">
                      {allStation?.map((e, i) => {
                        return (
                          <li className="user-last-data-list-item mt-4" key={i}>
                            <a
                              onClick={() => {
                                navigate(
                                  `/user/lastdata/${
                                    whichStation == "allStation"
                                      ? e._id
                                      : e.stationsId
                                  }`
                                );
                                localStorage.setItem(
                                  "stationName",
                                  whichStation == "allStation"
                                    ? e.name
                                    : e.stations?.name
                                );
                                localStorage.setItem(
                                  "location",
                                  whichStation == "allStation"
                                    ? e.location
                                    : e.stations?.location
                                );
                              }}
                            >
                              <div className="user-last-data-list-item-top d-flex align-items-center justify-content-between">
                                <h3 className="fs-5 m-0">
                                  {whichStation == "allStation"
                                    ? e.name
                                    : e.stations?.name}
                                </h3>
                                <div className="d-flex align-items-center justify-content-between">
                                  <p
                                    className={
                                      "m-0 me-1 fw-semibold fs-5 " +
                                      ((whichStation == "allStation"
                                        ? e.battery
                                        : e.stations?.battery) >= 70
                                        ? "text-success"
                                        : (whichStation == "allStation"
                                            ? e.battery
                                            : e.stations?.battery) < 70 &&
                                          (whichStation == "allStation"
                                            ? e.battery
                                            : e.stations?.battery) >= 30
                                        ? "text-warning"
                                        : (whichStation == "allStation"
                                            ? e.battery
                                            : e.stations?.battery) < 30
                                        ? "text-danger"
                                        : " ")
                                    }
                                  >
                                    {whichStation == "allStation"
                                      ? e.battery
                                      : e.stations?.battery}
                                    %
                                  </p>
                                  <img
                                    src={
                                      (whichStation == "allStation"
                                        ? e.battery
                                        : e.stations?.battery) == 100
                                        ? batteryFull
                                        : (whichStation == "allStation"
                                            ? e.battery
                                            : e.stations?.battery) == 0
                                        ? batteryNo
                                        : (whichStation == "allStation"
                                            ? e.battery
                                            : e.stations?.battery) >= 70 &&
                                          (whichStation == "allStation"
                                            ? e.battery
                                            : e.stations?.battery) < 100
                                        ? batteryPow
                                        : (whichStation == "allStation"
                                            ? e.battery
                                            : e.stations?.battery) < 30
                                        ? batteryRed
                                        : (whichStation == "allStation"
                                            ? e.battery
                                            : e.stations?.battery >= 30) &&
                                          (whichStation == "allStation"
                                            ? e.battery
                                            : e.stations?.battery < 70)
                                        ? batteryLow
                                        : null
                                    }
                                    alt="battery"
                                    width={35}
                                    height={35}
                                  />
                                </div>
                              </div>
                              {whichStation == "allStation" ? (
                                <span
                                  className={
                                    checkStationWorkingOrNot(e.lastData) == 0
                                      ? "user-last-data-list-item-href-green"
                                      : checkStationWorkingOrNot(e.lastData) <=
                                        3
                                      ? "user-last-data-list-item-href-lime-green"
                                      : checkStationWorkingOrNot(e.lastData) ==
                                        "one month"
                                      ? "user-last-data-list-item-href-yellow"
                                      : checkStationWorkingOrNot(e.lastData) ==
                                        "after one month"
                                      ? "user-last-data-list-item-href-orange"
                                      : "user-last-data-list-item-href-orange"
                                  }
                                ></span>
                              ) : (
                                <span className={colorCard}></span>
                              )}

                              <span className="">
                                <div className="text-end mt-2">
                                  <div className="d-flex align-items-center">
                                    <p className="m-0 user-lastdata-level-desc">
                                      Sath:{" "}
                                    </p>
                                    <span className="fw-bold text-end w-100 user-lastdata-level-desc">
                                      {whichStation == "allStation"
                                        ? Number(e.lastData?.level).toFixed()
                                        : Number(e?.level).toFixed()}{" "}
                                      sm
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <p className="m-0 user-lastdata-level-desc">
                                      Sho'rlanish:{" "}
                                    </p>
                                    <span className="fw-bold text-end w-100 user-lastdata-level-desc">
                                      {whichStation == "allStation"
                                        ? Number(
                                            e.lastData?.conductivity
                                          ).toFixed()
                                        : Number(
                                            e?.conductivity
                                          ).toFixed()}{" "}
                                      g/l
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <p className="m-0 user-lastdata-level-desc">
                                      Temperatura:{" "}
                                    </p>
                                    <span className="fw-bold text-end w-100 user-lastdata-level-desc">
                                      {whichStation == "allStation"
                                        ? Number(e.lastData?.temp).toFixed()
                                        : Number(e?.temp).toFixed()}{" "}
                                      °C
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-2">
                                  <p className="m-0">
                                    {returnFixdDate(
                                      whichStation == "allStation"
                                        ? e?.lastData?.date
                                        : e.date
                                    )}
                                  </p>
                                </div>
                              </span>
                            </a>
                          </li>
                        );
                      })}
                    </ol>
                  )}

                  <ReactPaginate
                    pageCount={totalPages}
                    onPageChange={handlePageChange}
                    forcePage={currentPage}
                    previousLabel={"<<"}
                    nextLabel={">>"}
                    activeClassName={"pagination__link--active"}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="user-map-animation-wrapper">
              <div id="box">
                <div id="tile01">
                  <div id="mask">Smart Solutions System</div>
                </div>
              </div>

              <div className="wrap">
                <div className="drop-outer">
                  <svg
                    className="drop"
                    viewBox="0 0 40 40"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="20" cy="20" r="20" />
                  </svg>
                </div>
                <div className="ripple ripple-1">
                  <svg
                    className="ripple-svg"
                    viewBox="0 0 60 60"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="30" cy="30" r="24" />
                  </svg>
                </div>
                <div className="ripple ripple-2">
                  <svg
                    className="ripple-svg"
                    viewBox="0 0 60 60"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="30" cy="30" r="24" />
                  </svg>
                </div>
                <div className="ripple ripple-3">
                  <svg
                    className="ripple-svg"
                    viewBox="0 0 60 60"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="30" cy="30" r="24" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserLastData;
