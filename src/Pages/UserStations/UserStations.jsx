import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./UserStations.css";
import circle from "../../assets/images/circle.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import close from "../../assets/images/close.png";
import { Helmet, HelmetProvider } from "react-helmet-async";
import excelImage from "../../assets/images/excel.png";
import excelFileImage from "../../assets/images/excel-file.png";
import moment from "moment";
import { api } from "../Api/Api";

const UserStations = () => {
  const [count, setCount] = useState(0);
  const [allStation, setAllStation] = useState([]);
  const [allStationForBattery, setAllStationForBattery] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageRegion, setCurrentPageRegion] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPagesForBattery, setTotalPagesForBattery] = useState(0);
  const [stationOne, setStationOne] = useState({});
  const [stationRegionName, setStationRegionName] = useState();
  const [stationDistrictName, setStationDistrictName] = useState([]);
  const [stationBalansOrgName, setStationBalansOrgName] = useState([]);
  const [sensorType, setSensorType] = useState([]);

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
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setAllStationForBattery(data.data.data);
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

    console.log(nameOrImeiInputMin.value, nameOrImeiInputMax.value);

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
                    >
                      Stansiyalar ro'yhati
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-overview"
                    >
                      Batareya bo'yicha qidirish
                    </button>
                  </li>

                  {/* <li className="nav-item">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-search"
                >
                  Viloyat bo'yicha qidirish
                </button>
              </li> */}
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
                          placeholder="25"
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
                          placeholder="75"
                          required
                        />
                      </div>
                      <button className="btn btn-primary bg-btn">
                        Qidirish
                      </button>
                    </form>

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
                    {console.log(totalPagesForBattery)}
                    <ReactPaginate
                      pageCount={totalPagesForBattery}
                      onPageChange={handlePageChangeForBattery}
                      forcePage={currentPage}
                      previousLabel={"<<"}
                      nextLabel={">>"}
                      activeClassName={"pagination__link--active"}
                    />
                  </div>

                  {/* <div
                className="tab-pane fade profile-search profile-search-station"
                id="profile-search"
              >
                <form className="search-region-wrapper d-flex align-items-end justify-content-between">
                  <div className="search-region">
                    <label
                      htmlFor="region-select"
                      className="search-label-region mb-2 cite-main-color"
                    >
                      Viloyat
                    </label>
                    <select
                      className="form-select"
                      name="nameOrImeiSelect"
                      required
                      onChange={(e) =>
                        searchByRegionAndBalansOrg(e.target.value)
                      }
                    >
                      {allRegions?.map((e, i) => {
                        return (
                          <option value={e.id} key={i}>
                            {e.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="search-region">
                    <label
                      htmlFor="region-select"
                      className="search-label-region mb-2 cite-main-color"
                    >
                      Balans tashkiloti
                    </label>
                    <select
                      className="form-select"
                      name="nameOrImeiSelect"
                      required
                      onChange={(e) => {
                        setBalansOrgId(e.target.value);
                        searchStationByBalansOrg(e.target.value);
                      }}
                    >
                      {allBalansOrg?.length &&
                        allBalansOrg?.map((e, i) => {
                          return (
                            <option value={e.id} key={i}>
                              {e.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </form>

                {allStationByBalansOrg?.length == 0 ? (
                  <h3 className="alert alert-dark text-center mt-5">
                    Hozircha stansiya yo'q...
                  </h3>
                ) : (
                  <table className="c-table mt-4">
                    <thead className="c-table__header">
                      <tr>
                        <th className="c-table__col-label text-center">Nomi</th>
                        <th className="c-table__col-label text-center">Imei</th>
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
                        <th className="c-table__col-label text-center">
                          O'zgartirish
                        </th>
                        <th className="c-table__col-label text-center">
                          O'chirish
                        </th>
                      </tr>
                    </thead>
                    <tbody className="c-table__body">
                      {allStationByBalansOrg?.map((e, i) => {
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
                            <td className="c-table__cell text-center">
                              <button
                                className="btn-devices-edit"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalLong"
                              >
                                <img
                                  src="https://cdn-icons-png.flaticon.com/128/9458/9458280.png"
                                  alt="update"
                                  width="16"
                                  height="16"
                                />
                              </button>
                            </td>
                            <td className="c-table__cell text-center">
                              <button
                                className="btn-devices-edit"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                              >
                                <img
                                  src="https://cdn-icons-png.flaticon.com/128/9713/9713380.png"
                                  alt="update"
                                  width="16"
                                  height="16"
                                />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                <ReactPaginate
                  pageCount={totalPagesSearch}
                  onPageChange={handlePageChangeSearch}
                  forcePage={currentPageRegion}
                  previousLabel={"<<"}
                  nextLabel={">>"}
                />
              </div> */}
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
