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
import circleRed from "../../assets/images/circle-red.png";
import circleYellow from "../../assets/images/circle-yellow.png";
import "./UserLastData.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../Api/Api";
import ReactPaginate from "react-paginate";

const UserLastData = (prop) => {
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

      if (response.statusCode == 401) {
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
    const date = `${new Date(item).getDate()}/${
      new Date(item).getMonth() + 1
    }/${new Date(item).getFullYear()} ${new Date(item).getHours()}:${
      String(new Date(item).getMinutes()).length == 1
        ? "0" + new Date(item).getMinutes()
        : new Date(item).getMinutes()
    }`;

    return date;
  };

  return (
    <section className="home-section py-3">
      <div className="container-fluid">
        <div className="card">
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

                    {/* {stationStatistic?.totalNotDataStationsCount > 0 ? (
                      <li
                        className="dashboard-list-item mt-3 d-flex border-red"
                        onClick={() => {
                          setWhichStation("notWorkStation");
                          setTableTitle("Umuman ishlamagan stansiyalar");
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
                              (stationStatistic?.totalNotDataStationsCount *
                                100) /
                              stationStatistic?.totalStationsCount
                            ).toFixed()}
                            %
                          </p>
                        </div>
                      </li>
                    ) : null} */}
                  </ul>
                </div>

                <h3 className="m-0 mt-5">{tableTitle} ning ma'lumotlari</h3>
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
                                    : e.stations?.battery) > 70
                                    ? "text-success"
                                    : (whichStation == "allStation"
                                        ? e.battery
                                        : e.stations?.battery) <= 70 &&
                                      whichStation == "allStation"
                                    ? e.battery
                                    : e.stations?.battery >= 50
                                    ? "text-warning"
                                    : whichStation == "allStation"
                                    ? e.battery
                                    : e.stations?.battery < 50
                                    ? "text-danger"
                                    : "")
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
                                        : e.stations?.battery >= 30) &
                                      (whichStation == "allStation"
                                        ? e.battery
                                        : e.stations?.battery < 70)
                                    ? batteryLow
                                    : (whichStation == "allStation"
                                        ? e.battery
                                        : e.stations?.battery) < 30
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

                          <span className="">
                            <div className="text-end mt-2">
                              <p className="m-0">
                                Sath:{" "}
                                <span className="fw-bold">
                                  {whichStation == "allStation"
                                    ? Number(e.lastData?.level).toFixed()
                                    : Number(e?.level).toFixed()}{" "}
                                  sm
                                </span>
                              </p>
                              <p className="m-0">
                                Sho'rlanish:{" "}
                                <span className="fw-bold">
                                  {whichStation == "allStation"
                                    ? Number(e.lastData?.conductivity).toFixed()
                                    : Number(e?.conductivity).toFixed()}{" "}
                                  g/l
                                </span>
                              </p>
                              <p className="m-0">
                                Temperatura:{" "}
                                <span className="fw-bold">
                                  {whichStation == "allStation"
                                    ? Number(e.lastData?.temp).toFixed()
                                    : Number(e?.temp).toFixed()}{" "}
                                  °C
                                </span>
                              </p>
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

                <ReactPaginate
                  pageCount={totalPages}
                  onPageChange={handlePageChange}
                  forcePage={currentPage}
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  activeClassName={"pagination__link--active"}
                />
              </div>

              {/* <div className="tab-pane fade profile-overview" id="profile-overview">
            profile-overview
          </div>

          <div
            className="tab-pane fade profile-search profile-search-station"
            id="profile-search"
          >
            profile-search
          </div> */}
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
        </div>
      </div>
    </section>
  );
};

export default UserLastData;
