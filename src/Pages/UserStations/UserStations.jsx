import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./UserStations.css";
import circle from "../../assets/images/circle.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import moment from "moment";
import { api } from "../Api/Api";
import excel from "../../assets/images/excel.png";
import * as XLSX from "xlsx";

const UserStations = () => {
  const [count, setCount] = useState(0);
  const [allStation, setAllStation] = useState([]);
  const [allStationForBattery, setAllStationForBattery] = useState([]);
  const [notWorkingStation, setNotWorkingStation] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPagesForBattery, setTotalPagesForBattery] = useState(0);
  const [totalPagesForStatus, setTotalPagesForStatus] = useState(0);
  const [stationOne, setStationOne] = useState({});
  const [stationRegionName, setStationRegionName] = useState();
  const [stationDistrictName, setStationDistrictName] = useState([]);
  const [stationBalansOrgName, setStationBalansOrgName] = useState([]);
  const [sensorType, setSensorType] = useState([]);
  const [whichData, setWhichData] = useState("allStation");
  const name = window.localStorage.getItem("name");

  useEffect(() => {
    const fetchData = async () => {
      // ! ALL STATIONS
      const request = await fetch(`${api}/stations/all?page=1&perPage=10`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      });

      const response = await request.json();

      if (response.statusCode == 401) {
        const request = await fetch(`${api}/auth/signIn`, {
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

      setAllStation(response.data.data);
      setTotalPages(response.data.metadata.lastPage);

      setAllStationForBattery(response.data.data);
      setTotalPagesForBattery(response.data.metadata.lastPage);
    };

    fetchData();
  }, [count]);

  useEffect(() => {
    fetch(`${api}/sensorType/getAll`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode == 200) {
          setSensorType(data.data);
        }
      });
    // ! NOT WORKING STATIONS
    fetch(`${api}/stations/all/statusOff?&page=1&perPage=10`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotWorkingStation(data.data.data);
        setTotalPagesForStatus(data.data.metadata.lastPage);
      });
  }, []);

  const handlePageChange = (selectedPage) => {
    fetch(`${api}/stations/all?page=${selectedPage.selected + 1}&perPage=10`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllStation(data.data.data);
      });
  };

  const handlePageChangeForBattery = (selectedPage) => {
    if (
      nameOrImeiInputMax.value.length == 0 ||
      nameOrImeiInputMin.value.length == 0
    ) {
      fetch(
        `${api}/stations/all?page=${selectedPage.selected + 1}&perPage=10`,
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
        .then((data) => setAllStationForBattery(data.data.data));
    } else {
      fetch(
        `${api}/last-data/getGreaterAndLessByStations?great=${
          nameOrImeiInputMin.value
        }&page=${selectedPage.selected + 1}&perPage=10&less=${
          nameOrImeiInputMax.value
        }`,
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
          setAllStationForBattery(data.data.data);
        });
    }
  };

  const handlePageChangeForStatus = (selectedPage) => {
    fetch(
      `${api}/stations/all/statusOff?&page=${
        selectedPage.selected + 1
      }&perPage=10`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setNotWorkingStation(data.data.data);
      });
  };

  const getStationWithImei = async (imei) => {
    const requestStationOne = await fetch(
      `${api}/stations/searchImel?imel=${imei}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      }
    );
    const responseStationOne = await requestStationOne.json();
    setStationOne(responseStationOne?.data.data[0]);

    // REGION NAME
    const requestRegionName = await fetch(
      `${api}/regions/getById?id=${responseStationOne?.data.data[0]?.region_id}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      }
    );
    const responseRegionName = await requestRegionName.json();

    setStationRegionName(responseRegionName.region.name);

    // DISTRICT NAME
    const requestDistrictName = await fetch(
      `${api}/districts/${responseStationOne?.data.data[0].region_id}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      }
    );

    const responseDistrictName = await requestDistrictName.json();

    setStationDistrictName(responseDistrictName.district);

    // BALANS ORGANIZATION NAME
    const requestBalansOrgName = await fetch(
      `${api}/balance-organizations/${responseStationOne?.data.data[0].region_id}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      }
    );

    const responseBalansOrgName = await requestBalansOrgName.json();
    setStationBalansOrgName(responseBalansOrgName.balanceOrganization);
  };

  const searchNameOrImei = (e) => {
    e.preventDefault();

    const { nameOrImeiInput, nameOrImeiSelect } = e.target;

    if (nameOrImeiSelect.value == "name") {
      fetch(`${api}/stations/searchByName?name=${nameOrImeiInput.value}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTotalPages(0);
          setAllStation(data.data.data);
        });
    } else if (nameOrImeiSelect.value == "imei") {
      fetch(`${api}/stations/searchImel?imel=${nameOrImeiInput.value}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTotalPages(0);
          setAllStation(data.data.data);
        });
    } else if (nameOrImeiSelect.value == "all") {
      fetch(`${api}/stations/all?page=1&perPage=10`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTotalPages(data.metadata.lastPage);
          setAllStation(data.data);
        });
    }
  };

  const searchByBattery = (e) => {
    e.preventDefault();

    const { nameOrImeiInputMin, nameOrImeiInputMax } = e.target;

    fetch(
      `${api}/last-data/getGreaterAndLessByStations?great=${nameOrImeiInputMin.value}&page=1&perPage=10&less=${nameOrImeiInputMax.value}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setAllStationForBattery(data.data.data);
        setTotalPagesForBattery(data.data.metadata.lastPage);
      });
  };

  // ! SAVE DATA EXCEL
  const exportDataToExcel = () => {
    if (whichData == "allStation") {
      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(allStation);

      XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

      const fixedDate = new Date();

      const resultDate = `${fixedDate.getDate()}/${
        fixedDate.getMonth() + 1
      }/${fixedDate.getFullYear()} ${fixedDate.getHours()}:${
        String(fixedDate.getMinutes()).length == 1
          ? "0" + fixedDate.getMinutes()
          : fixedDate.getMinutes()
      }`;

      if (allStation.length > 0) {
        XLSX.writeFile(
          workBook,
          `${name} ning umumiy stansiyalari ${resultDate}.xlsx`
        );
      }
    } else if (whichData == "StationForBattery") {
      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(allStationForBattery);

      XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

      const fixedDate = new Date();

      const resultDate = `${fixedDate.getDate()}/${
        fixedDate.getMonth() + 1
      }/${fixedDate.getFullYear()} ${fixedDate.getHours()}:${
        String(fixedDate.getMinutes()).length == 1
          ? "0" + fixedDate.getMinutes()
          : fixedDate.getMinutes()
      }`;

      if (allStationForBattery.length > 0) {
        XLSX.writeFile(
          workBook,
          `${name} ning umumiy stansiyalari ${resultDate}.xlsx`
        );
      }
    } else if (whichData == "StationForStatus") {
      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(notWorkingStation);

      XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

      const fixedDate = new Date();

      const resultDate = `${fixedDate.getDate()}/${
        fixedDate.getMonth() + 1
      }/${fixedDate.getFullYear()} ${fixedDate.getHours()}:${
        String(fixedDate.getMinutes()).length == 1
          ? "0" + fixedDate.getMinutes()
          : fixedDate.getMinutes()
      }`;

      if (notWorkingStation.length > 0) {
        XLSX.writeFile(
          workBook,
          `${name} ning ishlamagan stansiyalari ${resultDate}.xlsx`
        );
      }
    }
  };

  return (
    <HelmetProvider>
      <section className="home-section py-3">
        <div className="container-fluid">
          <div>
            {/* ToastContainer */}
            <ToastContainer
              position="top-center"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

            {/*! Modal LIST ONE  */}
            <div
              className="modal fade"
              id="exampleModal"
              data-bs-backdrop="static"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog table-location-width modal-dialog-centered">
                <div className="modal-content table-location-scrol">
                  <div className="modal-header lastdata-close pb-3 pb-0">
                    <h3 className="m-0 text-primary fs-3 cite-main-color">
                      {stationOne?.name}
                    </h3>

                    <button
                      type="button"
                      className="btn-close btn-close-location"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body pt-0 pt-2 pb-4">
                    <div className="modal-body-item m-auto d-flex align-items-center justify-content-between flex-wrap">
                      <div className="modal-item-wrapper d-flex align-items-center  mt-3">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Nomi:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {stationOne?.name}
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Imei:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {stationOne?.imel}
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Viloyat:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {stationRegionName}
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Tuman:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {
                            stationDistrictName.find((e) => {
                              if (e.id == stationOne?.district_id) {
                                return e.name;
                              }
                            })?.name
                          }
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Balans tashkiloti:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {
                            stationBalansOrgName.find((e) => {
                              if (e.id == stationOne?.balance_organization_id) {
                                return e.name;
                              }
                            })?.name
                          }
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">User telefon raqami:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {stationOne?.userPhoneNum}
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Qurilma telefon raqami:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {stationOne?.devicePhoneNum}
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Lokatsiya:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {stationOne?.location}
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Datani yuborish vaqti:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {stationOne?.sendDataTime}
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Infoni yuborish vaqti:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {stationOne?.sendInfoTime}
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Programma versiyasi:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {stationOne?.programVersion}
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Temperatura:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {stationOne?.temperture}
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Batareya:</p>
                        <p
                          className={
                            "m-0 ms-2 fw-semibold " +
                            (stationOne.battery > 77
                              ? "text-success"
                              : stationOne.battery <= 77 &&
                                stationOne.battery >= 50
                              ? "text-warning"
                              : stationOne.battery < 50
                              ? "text-danger"
                              : "")
                          }
                        >
                          {stationOne?.battery}%
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Signal:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {stationOne?.signal}
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Status:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {stationOne?.status}
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Sensor type:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {
                            sensorType.find((e) => {
                              if (e._id == stationOne.sensorTypeId) {
                                return e.name;
                              }
                            })?.name
                          }
                        </p>
                      </div>

                      <div className="modal-item-wrapper d-flex align-items-center ">
                        <img src={circle} alt="name" width={20} height={20} />
                        <p className="m-0 ms-4">Sana:</p>
                        <p className="m-0 ms-2 fw-semibold">
                          {moment(stationOne.date).format("L")}{" "}
                          {stationOne.date?.split("T")[1]?.slice(0, 8)}
                        </p>
                      </div>
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
                      data-bs-target="#profile-users"
                      onClick={() => setWhichData("allStation")}
                    >
                      Stansiyalar ro'yhati
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-overview"
                      onClick={() => setWhichData("StationForBattery")}
                    >
                      Batareya bo'yicha qidirish
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-search"
                      onClick={() => setWhichData("StationForStatus")}
                    >
                      Ishlamayotganlar stansiyalar
                    </button>
                  </li>
                </ul>
                <div className="tab-content pt-4">
                  <div
                    className="tab-pane fade show active profile-users table-scroll"
                    id="profile-users"
                  >
                    <h3 className="stations-search-heading">Qidirish</h3>
                    <form
                      onSubmit={searchNameOrImei}
                      className="search-name-wrapper d-flex align-items-center justify-content-between"
                    >
                      <input
                        name="nameOrImeiInput"
                        type="text"
                        className="form-control w-50"
                        placeholder="Qidiruv..."
                        required
                      />

                      <select
                        className="form-select w-25"
                        name="nameOrImeiSelect"
                        required
                      >
                        <option value="name">Nomi</option>
                        <option value="imei">Imei</option>
                        <option value="all">All</option>
                      </select>

                      <button className="btn btn-primary bg-btn">
                        Qidirish
                      </button>
                    </form>

                    <div
                      className="d-flex align-items-center justify-content-end cursor-pointer"
                      onClick={() => exportDataToExcel()}
                    >
                      <p className="m-0 p-0 user-station-save-data-desc">
                        Ma'lumotni saqlash
                      </p>
                      <button
                        onClick={() => exportDataToExcel()}
                        className="ms-3 border border-0"
                      >
                        <img src={excel} alt="excel" width={26} height={30} />
                      </button>
                    </div>

                    {allStation?.length == 0 ? (
                      <h3 className="alert alert-dark text-center mt-5">
                        Hozircha bunday stansiya yo'q...
                      </h3>
                    ) : (
                      <table className="c-table mt-4">
                        <thead className="c-table__header">
                          <tr>
                            <th className="c-table__col-label text-center">
                              Nomi
                            </th>
                            <th className="c-table__col-label text-center">
                              Imei
                            </th>
                            <th className="c-table__col-label text-center">
                              Status
                            </th>
                            <th className="c-table__col-label text-center">
                              Temperatura
                            </th>
                            <th className="c-table__col-label text-center">
                              Batareya
                            </th>
                            <th className="c-table__col-label text-center">
                              Signal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="c-table__body">
                          {allStation?.map((e, i) => {
                            return (
                              <tr
                                className="fs-6 column-admin-station"
                                key={i}
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() => {
                                  getStationWithImei(e.imel);
                                }}
                              >
                                <td className="c-table__cell text-center">
                                  {e.name}
                                </td>
                                <td className="c-table__cell text-center">
                                  {e.imel}
                                </td>
                                <td className="c-table__cell text-center">
                                  {e.status}
                                </td>
                                <td className="c-table__cell text-center">
                                  {e.temperture}
                                </td>
                                <td
                                  className={
                                    "c-table__cell text-center " +
                                    (e.battery > 77
                                      ? "text-success"
                                      : e.battery <= 77 && e.battery >= 50
                                      ? "text-warning"
                                      : e.battery < 50
                                      ? "text-danger"
                                      : "")
                                  }
                                >
                                  {e.battery}%
                                </td>
                                <td className="c-table__cell text-center">
                                  {e.signal}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
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

                  {/* BATTERY */}
                  <div
                    className="tab-pane fade profile-overview table-scroll"
                    id="profile-overview"
                  >
                    <h3 className="stations-search-heading">
                      Batareya quvvati oralig'ini kiriting
                    </h3>
                    <form
                      onSubmit={searchByBattery}
                      className="search-name-wrapper d-flex align-items-center justify-content-between"
                    >
                      <div className="w-25">
                        <label
                          className="user-station-search-battery-label"
                          htmlFor="nameOrImeiInputMin"
                        >
                          Minimum
                        </label>
                        <input
                          id="nameOrImeiInputMin"
                          name="nameOrImeiInputMin"
                          type="text"
                          className="form-control"
                          placeholder="0"
                          required
                        />
                      </div>

                      <div className="w-25">
                        <label
                          className="user-station-search-battery-label"
                          htmlFor="nameOrImeiInputMax"
                        >
                          Maximum
                        </label>
                        <input
                          id="nameOrImeiInputMax"
                          name="nameOrImeiInputMax"
                          type="text"
                          className="form-control"
                          placeholder="100"
                          required
                        />
                      </div>
                      <button className="btn btn-primary bg-btn">
                        Qidirish
                      </button>
                    </form>

                    <div
                      className="text-end d-flex align-items-center justify-content-end cursor-pointer"
                      onClick={() => exportDataToExcel()}
                    >
                      <p className="m-0 p-0 user-station-save-data-desc">
                        Ma'lumotni saqlash
                      </p>

                      <button className="ms-3 border border-0">
                        <img src={excel} alt="excel" width={26} height={30} />
                      </button>
                    </div>

                    {allStationForBattery?.length == 0 ? (
                      <h3 className="alert alert-dark text-center mt-5">
                        Hozircha bunday stansiya yo'q...
                      </h3>
                    ) : (
                      <table className="c-table mt-4">
                        <thead className="c-table__header">
                          <tr>
                            <th className="c-table__col-label text-center">
                              Nomi
                            </th>
                            <th className="c-table__col-label text-center">
                              Imei
                            </th>
                            <th className="c-table__col-label text-center">
                              Status
                            </th>
                            <th className="c-table__col-label text-center">
                              Temperatura
                            </th>
                            <th className="c-table__col-label text-center">
                              Batareya
                            </th>
                            <th className="c-table__col-label text-center">
                              Signal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="c-table__body">
                          {allStationForBattery?.map((e, i) => {
                            return (
                              <tr
                                className="fs-6 column-admin-station"
                                key={i}
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() => {
                                  getStationWithImei(e.imel);
                                }}
                              >
                                <td className="c-table__cell text-center">
                                  {e.name}
                                </td>
                                <td className="c-table__cell text-center">
                                  {e.imel}
                                </td>
                                <td className="c-table__cell text-center">
                                  {e.status}
                                </td>
                                <td className="c-table__cell text-center">
                                  {e.temperture}
                                </td>
                                <td
                                  className={
                                    "c-table__cell text-center " +
                                    (e.battery > 77
                                      ? "text-success"
                                      : e.battery <= 77 && e.battery >= 50
                                      ? "text-warning"
                                      : e.battery < 50
                                      ? "text-danger"
                                      : "")
                                  }
                                >
                                  {e.battery}%
                                </td>
                                <td className="c-table__cell text-center">
                                  {e.signal}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                    <ReactPaginate
                      pageCount={totalPagesForBattery}
                      onPageChange={handlePageChangeForBattery}
                      forcePage={currentPage}
                      previousLabel={"<<"}
                      nextLabel={">>"}
                      activeClassName={"pagination__link--active"}
                    />
                  </div>

                  {/* STATUS */}
                  <div
                    className="tab-pane fade profile-search table-scroll"
                    id="profile-search"
                  >
                    <h3 className="stations-search-heading">
                      Ishlamayotganlar stansiyalar ro'yhati
                    </h3>

                    <div
                      className="text-end d-flex align-items-center justify-content-end cursor-pointer"
                      onClick={() => exportDataToExcel()}
                    >
                      <p className="m-0 p-0 user-station-save-data-desc">
                        Ma'lumotni saqlash
                      </p>
                      <button className="ms-4 border border-0">
                        <img src={excel} alt="excel" width={26} height={30} />
                      </button>
                    </div>
                    {notWorkingStation?.length == 0 ? (
                      <h3 className="alert alert-dark text-center mt-5">
                        Hozircha bunday stansiya yo'q...
                      </h3>
                    ) : (
                      <table className="c-table mt-4">
                        <thead className="c-table__header">
                          <tr>
                            <th className="c-table__col-label text-center">
                              Nomi
                            </th>
                            <th className="c-table__col-label text-center">
                              Imei
                            </th>
                            <th className="c-table__col-label text-center">
                              Status
                            </th>
                            <th className="c-table__col-label text-center">
                              Temperatura
                            </th>
                            <th className="c-table__col-label text-center">
                              Batareya
                            </th>
                            <th className="c-table__col-label text-center">
                              Signal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="c-table__body">
                          {notWorkingStation?.map((e, i) => {
                            return (
                              <tr
                                className="fs-6 column-admin-station"
                                key={i}
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() => {
                                  getStationWithImei(e.imel);
                                }}
                              >
                                <td className="c-table__cell text-center">
                                  {e.name}
                                </td>
                                <td className="c-table__cell text-center">
                                  {e.imel}
                                </td>
                                <td className="c-table__cell text-center">
                                  {e.status}
                                </td>
                                <td className="c-table__cell text-center">
                                  {e.temperture}
                                </td>
                                <td
                                  className={
                                    "c-table__cell text-center " +
                                    (e.battery > 77
                                      ? "text-success"
                                      : e.battery <= 77 && e.battery >= 50
                                      ? "text-warning"
                                      : e.battery < 50
                                      ? "text-danger"
                                      : "")
                                  }
                                >
                                  {e.battery}%
                                </td>
                                <td className="c-table__cell text-center">
                                  {e.signal}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}

                    <ReactPaginate
                      pageCount={totalPagesForStatus}
                      onPageChange={handlePageChangeForStatus}
                      forcePage={currentPage}
                      previousLabel={"<<"}
                      nextLabel={">>"}
                      activeClassName={"pagination__link--active"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Helmet>
              <script src="../src/assets/js/table.js"></script>
            </Helmet>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};

export default UserStations;
