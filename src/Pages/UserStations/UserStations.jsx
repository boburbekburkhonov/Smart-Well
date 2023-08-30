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
  const [allRegions, setAllRegions] = useState([]);
  const [allBalansOrg, setAllBalansOrg] = useState([]);
  const [allStationByBalansOrg, setAllStationByBalansOrg] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageRegion, setCurrentPageRegion] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPagesSearch, setTotalPagesSearch] = useState(0);
  const [stationOne, setStationOne] = useState({});
  const [stationRegionName, setStationRegionName] = useState();
  const [stationDistrictName, setStationDistrictName] = useState([]);
  const [stationBalansOrgName, setStationBalansOrgName] = useState([]);
  const [sensorType, setSensorType] = useState([]);
  const [balansOrgId, setBalansOrgId] = useState();
  const [selectedfile, SetSelectedFile] = useState("");

  useEffect(() => {
    const fetchData = async () => {
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

      setAllStation(response.data);
      setTotalPages(response.metadata.lastPage);
    };

    fetchData();
  }, [count]);

  useEffect(() => {
    const fetchDataRegion = async () => {
      const requestRegionAll = await fetch(`${api}/regions/all`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      });

      const responseRegionAll = await requestRegionAll.json();
      setAllRegions(responseRegionAll.regions);

      const request = await fetch(
        `${api}/balance-organizations/${responseRegionAll.regions[0].id}`,
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
      setAllBalansOrg(response.balanceOrganization);
      setBalansOrgId(response.balanceOrganization[0].id);

      fetch(
        `${api}/stations/all/balanceOrganization?balanceOrganizationNumber=${response.balanceOrganization[0].id}&page=1&perPage=10`,
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
          setTotalPagesSearch(data.metadata.lastPage);
          setAllStationByBalansOrg(data.data);
        });
    };

    fetchDataRegion();

    fetch(`${api}/stations/sensorType/all`, {
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
        setAllStation(data.data);
      });
  };

  const handlePageChangeSearch = (selectedPage) => {
    fetch(
      `${api}/stations/all/balanceOrganization?balanceOrganizationNumber=${balansOrgId}&page=${
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
        setAllStationByBalansOrg(data.data);
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
    setStationOne(responseStationOne?.data[0]);

    // REGION NAME
    const requestRegionName = await fetch(
      `${api}/regions/${responseStationOne?.data[0].region_id}`,
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
      `${api}/districts/${responseStationOne?.data[0].region_id}`,
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
      `${api}/balance-organizations/${responseStationOne?.data[0].region_id}`,
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

  const createStation = (e) => {
    e.preventDefault();

    const {
      imei,
      regionId,
      districtId,
      balansOrg,
      name,
      usernamePhone,
      devicephoneNumber,
      location,
      temperature,
      batery,
      signal,
      programVersion,
      sendDataTime,
      sendInfoTime,
      sensorTypeId,
      date,
    } = e.target;

    fetch(`${api}/stations/create`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        imel: imei.value,
        region_id: Number(regionId.value),
        district_id: Number(districtId.value),
        balance_organization_id: Number(balansOrg.value),
        name: name.value,
        userPhoneNum: usernamePhone.value,
        devicePhoneNum: devicephoneNumber.value,
        location: location.value,
        temperture: Number(temperature.value),
        battery: Number(batery.value),
        signal: Number(signal.value),
        programVersion: programVersion.value,
        sendDataTime: sendDataTime.value,
        sendInfoTime: sendInfoTime.value,
        sensorTypeId: sensorTypeId.value,
        date: date.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode == 200) {
          setCount(count + 1);
          toast.success("Stansiya muvaffaqqiyatli yaratildi!");
        }
      });

    imei.value = "";
    regionId.value = "";
    districtId.value = "";
    balansOrg.value = "";
    name.value = "";
    usernamePhone.value = "";
    devicephoneNumber.value = "";
    location.value = "";
    temperature.value = "";
    batery.value = "";
    signal.value = "";
    programVersion.value = "";
    sendDataTime.value = "";
    sendInfoTime.value = "";
    sensorTypeId.value = "";
    date.value = "";
  };

  const createStationByExcel = (e) => {
    e.preventDefault();

    const { excelFile } = e.target;

    const formData = new FormData();

    formData.append("file", excelFile.files[0]);

    fetch(`${api}/stations/create/upload`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode == 200) {
          setCount(count + 1);
          toast.success("Stansiya muvaffaqqiyatli yaratildi!");
          SetSelectedFile("");
        } else {
          toast.error(data.message);
        }
      });
  };

  const updateStation = (e) => {
    e.preventDefault();

    const {
      imei,
      regionId,
      districtId,
      balansOrg,
      name,
      usernamePhone,
      devicephoneNumber,
      location,
      temperature,
      batery,
      signal,
      programVersion,
      sendDataTime,
      sendInfoTime,
      sensorTypeId,
      date,
    } = e.target;

    const year = date.value.split("-")[0].slice(2, 4);
    const month = date.value.split("-")[1];
    const day = date.value.split("-")[2].slice(0, 2);
    const hour = date.value.split(":")[0].split("T")[1];
    const minute = date.value.split(":")[1];
    const second = date.value.split(":")[2].split(".")[0];
    const fixDate = `${year}/${month}/${day},${hour}:${minute}:${second}`;

    fetch(`${api}/stations/update`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        id: stationOne._id,
        imel: imei.value,
        region_id: Number(regionId.value),
        district_id: Number(districtId.value),
        balance_organization_id: Number(balansOrg.value),
        name: name.value,
        userPhoneNum: usernamePhone.value,
        devicePhoneNum: devicephoneNumber.value,
        location: location.value,
        temperture: Number(temperature.value),
        battery: Number(batery.value),
        signal: Number(signal.value),
        programVersion: programVersion.value,
        sendDataTime: sendDataTime.value,
        sendInfoTime: sendInfoTime.value,
        sensorTypeId: sensorTypeId.value,
        date: fixDate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode == 200) {
          setCount(count + 1);
          toast.success("Stansiya muvaffaqqiyatli o'zgartirildi!");
        }
      });
  };

  const deleteStation = () => {
    fetch(`${api}/stations/delete/${stationOne._id}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode == 200) {
          setCount(count + 1);
          toast.success("Stansiya muvaffaqqiyatli o'chirildi!");
        }
      });
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
          setAllStation(data.data);
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
          setAllStation(data.data);
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

  const searchByRegionAndBalansOrg = async (id) => {
    setAllBalansOrg([]);

    const request = await fetch(`${api}/balance-organizations/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
    });

    const response = await request.json();

    setAllBalansOrg(response.balanceOrganization);
    setBalansOrgId(response.balanceOrganization[0]?.id);

    fetch(
      `${api}/stations/all/balanceOrganization?balanceOrganizationNumber=${response.balanceOrganization[0]?.id}&page=1&perPage=10`,
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
        setTotalPagesSearch(data.metadata?.lastPage);
        setAllStationByBalansOrg(data.data);
      });
  };

  const searchStationByBalansOrg = (id) => {
    fetch(
      `${api}/stations/all/balanceOrganization?balanceOrganizationNumber=${id}&page=1&perPage=10`,
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
        setTotalPagesSearch(data.metadata.lastPage);
        setAllStationByBalansOrg(data.data);
      });
  };

  const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const InputChange = (e) => {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      SetSelectedFile({
        filename: e.target.files[0].name,
        filetype: e.target.files[0].type,
        fileimage: reader.result,
        datetime: e.target.files[0].lastModifiedDate.toLocaleString("en-IN"),
        filesize: filesizes(e.target.files[0].size),
      });
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <HelmetProvider>
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
                  {stationOne.name}
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
                    <p className="m-0 ms-2 fw-semibold">{stationOne.name}</p>
                  </div>

                  <div className="modal-item-wrapper d-flex align-items-center ">
                    <img src={circle} alt="name" width={20} height={20} />
                    <p className="m-0 ms-4">Imei:</p>
                    <p className="m-0 ms-2 fw-semibold">{stationOne.imel}</p>
                  </div>

                  <div className="modal-item-wrapper d-flex align-items-center ">
                    <img src={circle} alt="name" width={20} height={20} />
                    <p className="m-0 ms-4">Viloyat:</p>
                    <p className="m-0 ms-2 fw-semibold">{stationRegionName}</p>
                  </div>

                  <div className="modal-item-wrapper d-flex align-items-center ">
                    <img src={circle} alt="name" width={20} height={20} />
                    <p className="m-0 ms-4">Tuman:</p>
                    <p className="m-0 ms-2 fw-semibold">
                      {
                        stationDistrictName.find((e) => {
                          if (e.id == stationOne.district_id) {
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
                          if (e.id == stationOne.balance_organization_id) {
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
                      {stationOne.userPhoneNum}
                    </p>
                  </div>

                  <div className="modal-item-wrapper d-flex align-items-center ">
                    <img src={circle} alt="name" width={20} height={20} />
                    <p className="m-0 ms-4">Qurilma telefon raqami:</p>
                    <p className="m-0 ms-2 fw-semibold">
                      {stationOne.devicePhoneNum}
                    </p>
                  </div>

                  <div className="modal-item-wrapper d-flex align-items-center ">
                    <img src={circle} alt="name" width={20} height={20} />
                    <p className="m-0 ms-4">Lokatsiya:</p>
                    <p className="m-0 ms-2 fw-semibold">
                      {stationOne.location}
                    </p>
                  </div>

                  <div className="modal-item-wrapper d-flex align-items-center ">
                    <img src={circle} alt="name" width={20} height={20} />
                    <p className="m-0 ms-4">Datani yuborish vaqti:</p>
                    <p className="m-0 ms-2 fw-semibold">
                      {stationOne.sendDataTime}
                    </p>
                  </div>

                  <div className="modal-item-wrapper d-flex align-items-center ">
                    <img src={circle} alt="name" width={20} height={20} />
                    <p className="m-0 ms-4">Infoni yuborish vaqti:</p>
                    <p className="m-0 ms-2 fw-semibold">
                      {stationOne.sendInfoTime}
                    </p>
                  </div>

                  <div className="modal-item-wrapper d-flex align-items-center ">
                    <img src={circle} alt="name" width={20} height={20} />
                    <p className="m-0 ms-4">Programma versiyasi:</p>
                    <p className="m-0 ms-2 fw-semibold">
                      {stationOne.programVersion}
                    </p>
                  </div>

                  <div className="modal-item-wrapper d-flex align-items-center ">
                    <img src={circle} alt="name" width={20} height={20} />
                    <p className="m-0 ms-4">Temperatura:</p>
                    <p className="m-0 ms-2 fw-semibold">
                      {stationOne.temperture}
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
                          : stationOne.battery <= 77 && stationOne.battery >= 50
                          ? "text-warning"
                          : stationOne.battery < 50
                          ? "text-danger"
                          : "")
                      }
                    >
                      {stationOne.battery}%
                    </p>
                  </div>

                  <div className="modal-item-wrapper d-flex align-items-center ">
                    <img src={circle} alt="name" width={20} height={20} />
                    <p className="m-0 ms-4">Signal:</p>
                    <p className="m-0 ms-2 fw-semibold">{stationOne.signal}</p>
                  </div>

                  <div className="modal-item-wrapper d-flex align-items-center ">
                    <img src={circle} alt="name" width={20} height={20} />
                    <p className="m-0 ms-4">Status:</p>
                    <p className="m-0 ms-2 fw-semibold">{stationOne.status}</p>
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

        {/* MODAL UPDATE */}
        <div
          className="modal fade"
          id="exampleModalLong"
          tabIndex="-1"
          data-bs-backdrop="static"
          role="dialog"
          aria-labelledby="exampleModalLongTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog table-update-width modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title text-primary"
                  id="exampleModalLongTitle"
                >
                  Stansiyani o'zgartirish
                </h5>
                <button
                  className="btn-close btn-close-location"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form
                  className="pt-4 ps-4 form-user-create-wrapper d-flex flex-wrap align-items-center justify-content-center"
                  onSubmit={updateStation}
                >
                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="imei"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Imei
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="imei"
                        type="text"
                        className="form-control input-station"
                        id="imei"
                        required
                        defaultValue={stationOne.imel}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="regionId"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Viloyat id
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="regionId"
                        type="text"
                        className="form-control input-station"
                        id="regionId"
                        required
                        defaultValue={stationOne.region_id}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="districtId"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Tuman id
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="districtId"
                        type="text"
                        className="form-control input-station"
                        id="districtId"
                        required
                        defaultValue={stationOne.district_id}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="balansOrg"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Balans tashkiloti id
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="balansOrg"
                        type="text"
                        className="form-control input-station"
                        id="balansOrg"
                        required
                        defaultValue={stationOne.balance_organization_id}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="name"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Nomi
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="name"
                        type="text"
                        className="form-control input-station"
                        id="name"
                        required
                        defaultValue={stationOne.name}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="usernamePhone"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      User telefon raqami
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="usernamePhone"
                        type="text"
                        className="form-control input-station"
                        id="usernamePhone"
                        required
                        defaultValue={stationOne.userPhoneNum}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="devicephoneNumber"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Qurilma telefon raqami
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="devicephoneNumber"
                        type="text"
                        className="form-control input-station"
                        id="devicephoneNumber"
                        required
                        defaultValue={stationOne.devicePhoneNum}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="location"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Lokatsiya
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="location"
                        type="text"
                        className="form-control input-station"
                        id="location"
                        required
                        defaultValue={stationOne.location}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="temperature"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Temperatura
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="temperature"
                        type="text"
                        className="form-control input-station"
                        id="temperature"
                        required
                        defaultValue={stationOne.temperture}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="batery"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Batareya
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="batery"
                        type="text"
                        className="form-control input-station"
                        id="batery"
                        required
                        defaultValue={stationOne.battery}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="signal"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Signal
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="signal"
                        type="text"
                        className="form-control input-station"
                        id="signal"
                        required
                        defaultValue={stationOne.signal}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="programVersion"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Programma versiyasi
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="programVersion"
                        type="text"
                        className="form-control input-station"
                        id="programVersion"
                        required
                        defaultValue={stationOne.programVersion}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="sendDataTime"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Datani yuborish vaqti
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="sendDataTime"
                        type="text"
                        className="form-control input-station"
                        id="sendDataTime"
                        required
                        defaultValue={stationOne.sendDataTime}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="sendInfoTime"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Infoni yuborish vaqti
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="sendInfoTime"
                        type="text"
                        className="form-control input-station"
                        id="sendInfoTime"
                        required
                        defaultValue={stationOne.sendInfoTime}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="sensorTypeId"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Sensor type id
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="sensorTypeId"
                        type="text"
                        className="form-control input-station"
                        id="sensorTypeId"
                        required
                        defaultValue={stationOne.sensorTypeId}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-station-wrapper">
                    <label
                      htmlFor="date"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Sana
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="date"
                        type="text"
                        className="form-control input-station"
                        id="date"
                        required
                        defaultValue={stationOne.date}
                      />
                    </div>
                  </div>
                  <div className="w-100 text-center mt-3">
                    <button className="btn btn-primary btn-create-user w-25">
                      Saqlash
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL PERMISSION   */}
        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header modal-header-permission border-bottom-0 bg-danger pt-4 pb-4 d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-center w-100">
                  <p className="m-0 text-light fs-6 fw-bolder">
                    Haqiqatan ham o'chirmoqchimisiz?
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close-location btn-close-delete-devices p-0"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <img src={close} alt="cancel" width="18" height="18" />
                </button>
              </div>
              <div className="modal-body fw-semibold fs-5 text-dark text-center modal-delete-device">
                O'ylab ko'ring!
                <span className="text-primary"> stansiya </span>
                ni oʻchirish doimiy boʻladi.
              </div>
              <div className="modal-footer border-top-0">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  onClick={deleteStation}
                >
                  Ha
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                >
                  Yo'q
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL UPLOAD   */}
        <div
          className="modal fade"
          id="staticBackdrops"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog table-upload-width modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <h1
                    className="fs-4 fw-semibold text-success m-0"
                    id="staticBackdropLabel"
                  >
                    Excel
                  </h1>
                  <img
                    className="ms-2"
                    src={excelImage}
                    alt="excelImage"
                    width={25}
                    height={25}
                  />
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="fileupload-view">
                  <div className="row justify-content-center m-0">
                    <div className="upload-column">
                      <div className="card-upload mt-5">
                        <div className="card-body">
                          <div className="kb-data-box">
                            <div className="kb-modal-data-title">
                              <div className="kb-data-title d-flex align-items-center ">
                                <h6>
                                  <span className="text-success fs-5 fw-semibold">
                                    Excel file
                                  </span>{" "}
                                  kiriting
                                </h6>
                                <img
                                  className="ms-2"
                                  src={excelImage}
                                  alt="excelImage"
                                  width={20}
                                  height={20}
                                />
                              </div>
                            </div>
                            <form onSubmit={createStationByExcel}>
                              <div className="kb-file-upload">
                                <div className="file-upload-box">
                                  <input
                                    type="file"
                                    id="fileupload"
                                    className="file-upload-input"
                                    onChange={InputChange}
                                    name="excelFile"
                                    required
                                  />
                                  <span>
                                    Drag and drop or{" "}
                                    <span className="file-link">
                                      Choose your file
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div className="kb-attach-box mb-3">
                                {selectedfile !== "" ? (
                                  <div className="file-atc-box">
                                    {selectedfile.filename.match(
                                      /.(jpg|jpeg|png|gif|svg)$/i
                                    ) ? (
                                      <div className="file-image">
                                        {" "}
                                        <img src={excelFileImage} alt="" />
                                      </div>
                                    ) : (
                                      <div className="file-image">
                                        <img src={excelFileImage} alt="" />
                                      </div>
                                    )}
                                    <div className="file-detail">
                                      <h6>{selectedfile.filename}</h6>
                                      <p>
                                        <span>
                                          Size : {selectedfile.filesize}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>

                              <div className="kb-buttons-box">
                                <button
                                  type="submit"
                                  className="btn btn-success form-submit"
                                >
                                  Yuklash
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
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
                  Stansiya yaratish
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-search"
                >
                  Viloyat bo'yicha qidirish
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

                  <button className="btn btn-primary bg-btn">Qidirish</button>
                </form>

                {allStation?.length == 0 ? (
                  <h3 className="alert alert-dark text-center mt-5">
                    Hozircha bunday stansiya yo'q...
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
                  pageCount={totalPages}
                  onPageChange={handlePageChange}
                  forcePage={currentPage}
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  activeClassName={"pagination__link--active"}
                />
              </div>

              <div
                className="tab-pane fade profile-overview"
                id="profile-overview"
              >
                <div className="text-end">
                  <button
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrops"
                  >
                    Excel bilan qo'shish
                  </button>
                </div>
                <form
                  className="pt-4 ps-4 form-user-create-wrapper d-flex flex-wrap align-items-center"
                  onSubmit={createStation}
                >
                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="imeiCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Imei
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="imei"
                        type="text"
                        className="form-control input-user"
                        id="imeiCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="regionIdCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Viloyat id
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="regionId"
                        type="text"
                        className="form-control input-user"
                        id="regionIdCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="districtIdCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Tuman id
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="districtId"
                        type="text"
                        className="form-control input-user"
                        id="districtIdCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="balansOrgCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Balans tashkiloti id
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="balansOrg"
                        type="text"
                        className="form-control input-user"
                        id="balansOrgCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="nameCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Nomi
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="name"
                        type="text"
                        className="form-control input-user"
                        id="nameCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="usernamePhoneCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      User telefon raqami
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="usernamePhone"
                        type="text"
                        className="form-control input-user"
                        id="usernamePhoneCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="devicephoneNumberCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Qurilma telefon raqami
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="devicephoneNumber"
                        type="text"
                        className="form-control input-user"
                        id="devicephoneNumberCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="locationCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Lokatsiya
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="location"
                        type="text"
                        className="form-control input-user"
                        id="locationCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="temperatureCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Temperatura
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="temperature"
                        type="text"
                        id="temperatureCreate"
                        className="form-control input-user"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="bateryCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Batareya
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="batery"
                        type="text"
                        className="form-control input-user"
                        id="bateryCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="signalCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Signal
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="signal"
                        type="text"
                        className="form-control input-user"
                        id="signalCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="programVersionCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Programma versiyasi
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="programVersion"
                        type="text"
                        className="form-control input-user"
                        id="programVersionCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="sendDataTimeCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Datani yuborish vaqti
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="sendDataTime"
                        type="text"
                        className="form-control input-user"
                        id="sendDataTimeCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="sendInfoTimeCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Infoni yuborish vaqti
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="sendInfoTime"
                        type="text"
                        className="form-control input-user"
                        id="sendInfoTimeCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="sensorTypeIdCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Sensor type id
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="sensorTypeId"
                        type="text"
                        className="form-control input-user"
                        id="sensorTypeIdCreate"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="dateCreate"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Sana
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="date"
                        type="text"
                        className="form-control input-user"
                        id="dateCreate"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-50">
                    <button className="btn btn-primary btn-create-user w-25">
                      Saqlash
                    </button>
                  </div>
                </form>
              </div>

              <div
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
              </div>
            </div>
          </div>
        </div>

        <Helmet>
          <script src="../src/assets/js/table.js"></script>
        </Helmet>
      </div>
    </HelmetProvider>
  );
};

export default UserStations;
