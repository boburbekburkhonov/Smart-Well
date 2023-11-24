import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import circle from "../../assets/images/circle.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import moment from "moment";
import { api } from "../Api/Api";
import excel from "../../assets/images/excel.png";
import all from "../../assets/images/all.png";
import defective from "../../assets/images/defective.png";
import active from "../../assets/images/active.png";
import passive from "../../assets/images/passive.png";
import * as XLSX from "xlsx";
import axios from "axios";
import AliceCarousel from "react-alice-carousel";
import 'react-alice-carousel/lib/alice-carousel.css';
import "./AdminStation.css";

const AdminStation = () => {
  const [count, setCount] = useState(0);
  const [allBalansOrg, setAllBalansOrg] = useState([]);
  const [tableTitle, setTableTitle] = useState("Jami stansiyalar");
  const [tableTitleForStatus, setTableTitleForStatus] = useState("Jami ishlamayotganlar stansiyalar ro'yhati");
  const [allRegion, setAllRegion] = useState([]);
  const [allStation, setAllStation] = useState([]);
  const [allStationForBattery, setAllStationForBattery] = useState([]);
  const [notWorkingStation, setNotWorkingStation] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPagesForBattery, setTotalPagesForBattery] = useState(0);
  const [totalPagesForStatus, setTotalPagesForStatus] = useState(0);
  const [stationOne, setStationOne] = useState({});
  const [stationBattery, setStationBattery] = useState([]);
  const [stationStatistic, setStationStatistic] = useState([]);
  const [stationStatisticAll, setStationStatisticAll] = useState([]);
  const [stationRegionName, setStationRegionName] = useState();
  const [stationDistrictName, setStationDistrictName] = useState([]);
  const [stationBalansOrgName, setStationBalansOrgName] = useState([]);
  const [balansOrgId, setBalansOrgId] = useState();
  const [balansOrgIdForStatus, setBalansOrgIdForStatus] = useState();
  const [sensorType, setSensorType] = useState([]);
  const [whichData, setWhichData] = useState("allStation");
  const [minimumValue, setMinimumValue] = useState("");
  const [maximumValue, setMaximumValue] = useState("");
  const balanceOrgName = localStorage.getItem("balanceOrgName");
  const name = window.localStorage.getItem("name");
  const role = window.localStorage.getItem("role");

  // ! CUSTOM FETCH
  const customFetch = axios.create({
    baseURL: api,
    headers: {
      "Content-type": "application/json",
    },
  });

  // ! ADD HEADER TOKEN
  customFetch.interceptors.request.use(
    async (config) => {
      const token = window.localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = ` bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // ! REFRESH TOKEN
  const refreshToken = async () => {
    try {
      const requestToken = await fetch(`${api}/auth/signin`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: window.localStorage.getItem("username"),
          password: window.localStorage.getItem("password"),
        }),
      });

      const responToken = await requestToken.json();
      return responToken.data.accessToken;
    } catch (e) {
      console.log("refreshToken", "Error", e);
    }
  };

  // ! GET ACCESS TOKEN
  customFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (
        (error.response?.status === 403 && !originalRequest._retry) ||
        (error.response?.status === 401 && !originalRequest._retry)
      ) {
        originalRequest._retry = true;

        const resp = await refreshToken();

        const access_token = resp;

        window.localStorage.setItem("accessToken", access_token);

        customFetch.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;
        return customFetch(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      // ! ALL STATIONS
      const request = await customFetch.get(`/stations/all?page=1&perPage=10`);

      setAllStation(request.data.data.data);
      setTotalPages(request.data.data.metadata.lastPage);

      setAllStationForBattery(request.data.data.data);
      setTotalPagesForBattery(request.data.data.metadata.lastPage);
    };

    fetchData();

    // ! STATION SENSOR TYPE
    customFetch.get(`/sensorType/getAll`).then((data) => {
      if (data.data.statusCode == 200) {
        setSensorType(data.data.data);
      }
    });

    // ! NOT WORKING STATIONS
    customFetch
      .get(`/stations/all/statusOff?&page=1&perPage=10`)
      .then((data) => {
        setNotWorkingStation(data.data.data.data);
        setTotalPagesForStatus(data.data.data.metadata.lastPage);
      });

    // ! STATION STATISTIC
    customFetch
    .get(`/last-data/getStatisticStations`)
    .then((data) => {
      setStationStatistic(data.data.data)
    });

    // ! STATION STATISTIC ALL
    customFetch
    .get(`/stations/getAllStationsStatisic`)
    .then((data) => {
      setStationStatisticAll(data.data.data)
    });

      // ! ALL BALANS ORG
    customFetch
    .get(`/balance-organizations/all-find`)
    .then((data) => setAllBalansOrg(data.data.balanceOrganizations))

    // ! ALL REGION
    customFetch
    .get(`/regions/all`)
    .then((data) => {
      setAllRegion(data.data.regions)
    })
  }, []);

  const handlePageChange = (selectedPage) => {
    if(balansOrgId == undefined){
      customFetch
        .get(`/stations/all?page=${selectedPage.selected + 1}&perPage=10`)
        .then((data) => {
          setAllStation(data.data.data.data);
      });
    }else {
      customFetch
        .get(`/stations/all/balanceOrganization?balanceOrganizationNumber=${balansOrgId}&page=${selectedPage.selected + 1}&perPage=10`)
        .then((data) => {
          setAllStation(data.data.data.data);
      });
    }
  };

  const handlePageChangeForBattery = (selectedPage) => {
    if (
      nameOrImeiInputMax.value.length == 0 ||
      nameOrImeiInputMin.value.length == 0
    ) {
      customFetch
        .get(`/stations/all?page=${selectedPage.selected + 1}&perPage=10`)
        .then((data) => setAllStationForBattery(data.data.data.data));
    } else {
      customFetch
        .get(
          `/last-data/getGreaterAndLessByStations?great=${
            nameOrImeiInputMin.value
          }&page=${selectedPage.selected + 1}&perPage=10&less=${
            nameOrImeiInputMax.value
          }`
        )
        .then((data) => {
          setAllStationForBattery(data.data.data.data);
        });
    }
  };

  const handlePageChangeForStatus = (selectedPage) => {
    if(balansOrgIdForStatus == undefined){
      customFetch
      .get(
        `/stations/all/statusOff?&page=${selectedPage.selected + 1}&perPage=10`
      )
      .then((data) => {
        setNotWorkingStation(data.data.data.data);
      });
    }else {

      customFetch
      .get(
        `/stations/searchStatusFalseByBalance?balanceOrganizationNumber=${balansOrgIdForStatus}&page=${selectedPage.selected + 1}&perPage=10`
      )
      .then((data) => {
        setNotWorkingStation(data.data.data.data);
      });
    }
  };

  const getStationWithImei = async (imei) => {
    const requestStationOne = await customFetch.get(
      `/stations/searchImel?imel=${imei}`
    );

    setStationOne(requestStationOne.data?.data.data[0]);

    // * REGION NAME
    const requestRegionName = await customFetch.get(
      `/regions/getById?id=${requestStationOne.data?.data.data[0]?.region_id}`
    );

    setStationRegionName(requestRegionName.data.region.name);

    //* DISTRICT NAME
    const requestDistrictName = await customFetch.get(
      `/districts/${requestStationOne.data?.data.data[0].region_id}`
    );

    setStationDistrictName(requestDistrictName.data.district);

    //* BALANS ORGANIZATION NAME
    const requestBalansOrgName = await customFetch.get(
      `/balance-organizations/${requestStationOne.data?.data.data[0].region_id}`
    );

    setStationBalansOrgName(requestBalansOrgName.data.balanceOrganization);
  };

  const searchNameOrImei = (e) => {
    e.preventDefault();

    const { nameOrImeiInput } = e.target;

    if(nameOrImeiInput.value.length == 0){
      customFetch
        .get(`/stations/all?page=1&perPage=10`)
        .then((data) => {
          if (data.data.data.data.length > 0) {
            setAllStation(data.data.data.data);
            setTotalPages(data.data.data.metadata.lastPage);
          }
      });
    }else {
      customFetch
        .get(`/stations/searchByNameOrImel?search=${nameOrImeiInput.value}&page=1&perPage=10`)
        .then((data) => {
          if (data.data.data.data.length > 0) {
            setTotalPages(0);
            setAllStation(data.data.data.data);
          }
      });
    }
  };

  const searchByBattery = (e) => {
    e.preventDefault();

    const { nameOrImeiInputMin, nameOrImeiInputMax } = e.target;

    customFetch
      .get(
        `/last-data/getGreaterAndLessByStations?great=${nameOrImeiInputMin.value}&page=1&perPage=10&less=${nameOrImeiInputMax.value}`
      )
      .then((data) => {
        setAllStationForBattery(data.data.data.data);
        setTotalPagesForBattery(data.data.data.metadata.lastPage);
      });
  };

  // ! SAVE DATA EXCEL
  const exportDataToExcel = async () => {
    const fixedDate = new Date();

    const resultDate = `${fixedDate.getDate()}/${
      fixedDate.getMonth() + 1
    }/${fixedDate.getFullYear()} ${fixedDate.getHours()}:${
      String(fixedDate.getMinutes()).length == 1
        ? "0" + fixedDate.getMinutes()
        : fixedDate.getMinutes()
    }`;

    if (whichData == "allStation") {
      const resultExcelData = [];

      if(balansOrgId == undefined){
        const requestAllStation = await customFetch.get(
          `${api}/stations/all?page=1&perPage=${totalPages * 10}`
        );

        requestAllStation.data.data.data.forEach((e) => {
          resultExcelData.push({
            Nomi: e.name,
            Imei: e.imel,
            Lokatsiya: e.location,
            Qurilma_Telefon_Raqami: e.devicePhoneNum,
            User_Telefon_Raqami: e.userPhoneNum,
            Programma_Versiyasi: e.programVersion,
            Status: e.status == 1 ? "ishlayapti" : "ishlamayapti",
            Integratsiya: e?.isIntegration == true ? "Qilingan" : "Qilinmagan",
            Signal: e.signal,
            Temperture: e.temperture,
            Battereya: `${e.battery}%`,
            Datani_yuborish_vaqti: e.sendDataTime,
            Infoni_yuborish_vaqti: e.sendInfoTime,
            Sana: e.date,
          });
        });
      }else {
        const requestAllStation = await customFetch.get(
          `${api}/stations/all/balanceOrganization?balanceOrganizationNumber=${balansOrgId}&page=1&perPage=${totalPages * 10}`
        );

        requestAllStation.data.data.data.forEach((e) => {
          resultExcelData.push({
            Nomi: e.name,
            Imei: e.imel,
            Lokatsiya: e.location,
            Qurilma_Telefon_Raqami: e.devicePhoneNum,
            User_Telefon_Raqami: e.userPhoneNum,
            Programma_Versiyasi: e.programVersion,
            Status: e.status == 1 ? "ishlayapti" : "ishlamayapti",
            Integratsiya: e?.isIntegration == true ? "Qilingan" : "Qilinmagan",
            Signal: e.signal,
            Temperture: e.temperture,
            Battereya: `${e.battery}%`,
            Datani_yuborish_vaqti: e.sendDataTime,
            Infoni_yuborish_vaqti: e.sendInfoTime,
            Sana: e.date,
          });
        });
      }

      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(resultExcelData);

      XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

      if (allStation.length > 0) {
        XLSX.writeFile(
          workBook,
          `${tableTitle} ${resultDate}.xlsx`
        );
      }
    } else if (whichData == "StationForBattery") {
      const requestAllStationForBattery = await customFetch.get(
        `/last-data/getGreaterAndLessByStations?great=${
          minimumValue.length > 0 ? minimumValue : 0
        }&page=1&perPage=${totalPages * 10}&less=${
          maximumValue.length > 0 ? maximumValue : 100
        }`
      );

      const resultExcelData = [];

      requestAllStationForBattery.data.data.data.forEach((e) => {
        resultExcelData.push({
          Nomi: e.name,
          Imei: e.imel,
          Lokatsiya: e.location,
          Qurilma_Telefon_Raqami: e.devicePhoneNum,
          User_Telefon_Raqami: e.userPhoneNum,
          Programma_Versiyasi: e.programVersion,
          Status: e.status == 1 ? "ishlayapti" : "ishlamayapti",
          Integratsiya: e?.isIntegration == true ? "Qilingan" : "Qilinmagan",
          Signal: e.signal,
          Temperture: e.temperture,
          Battereya: `${e.battery}%`,
          Datani_yuborish_vaqti: e.sendDataTime,
          Infoni_yuborish_vaqti: e.sendInfoTime,
          Sana: e.date,
        });
      });

      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(resultExcelData);

      XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

      if (allStationForBattery.length > 0) {
        XLSX.writeFile(
          workBook,
          `Jami stansiyalari ${resultDate}.xlsx`
        );
      }
    } else if (whichData == "StationForStatus") {
      const resultExcelData = [];

      if(balansOrgIdForStatus == undefined){
        const requestAllStationForStatus = await customFetch.get(
          `/stations/all/statusOff?&page=1&perPage=${totalPagesForStatus * 10}`
        );

        requestAllStationForStatus.data.data.data.forEach((e) => {
          resultExcelData.push({
            Nomi: e.name,
            Imei: e.imel,
            Lokatsiya: e.location,
            Qurilma_Telefon_Raqami: e.devicePhoneNum,
            User_Telefon_Raqami: e.userPhoneNum,
            Programma_Versiyasi: e.programVersion,
            Status: e.status == 1 ? "ishlayapti" : "ishlamayapti",
            Integratsiya: e?.isIntegration == true ? "Qilingan" : "Qilinmagan",
            Signal: e.signal,
            Temperture: e.temperture,
            Battereya: `${e.battery}%`,
            Datani_yuborish_vaqti: e.sendDataTime,
            Infoni_yuborish_vaqti: e.sendInfoTime,
            Sana: e.date,
          });
        });
      }else {
        const requestAllStationForStatus = await customFetch.get(
          `/stations/searchStatusFalseByBalance?balanceOrganizationNumber=${balansOrgIdForStatus}&page=1&perPage=${totalPagesForStatus * 10}`
        );

        requestAllStationForStatus.data.data.data.forEach((e) => {
          resultExcelData.push({
            Nomi: e.name,
            Imei: e.imel,
            Lokatsiya: e.location,
            Qurilma_Telefon_Raqami: e.devicePhoneNum,
            User_Telefon_Raqami: e.userPhoneNum,
            Programma_Versiyasi: e.programVersion,
            Status: e.status == 1 ? "ishlayapti" : "ishlamayapti",
            Integratsiya: e?.isIntegration == true ? "Qilingan" : "Qilinmagan",
            Signal: e.signal,
            Temperture: e.temperture,
            Battereya: `${e.battery}%`,
            Datani_yuborish_vaqti: e.sendDataTime,
            Infoni_yuborish_vaqti: e.sendInfoTime,
            Sana: e.date,
          });
        });
      }

      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(resultExcelData);

      XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

      if (notWorkingStation.length > 0) {
        XLSX.writeFile(
          workBook,
          `${tableTitleForStatus} ${resultDate}.xlsx`
        );
      }
    }
  };

  const foundBalansOrgName = id => {
    const foundBalansOrg = allBalansOrg.find(i => i.id == id)

    return foundBalansOrg?.name
  }

  const foundRegionName = id => {
    const foundRegion = allRegion.find(i => i.id == id)

    return foundRegion?.name
  }

  const responsive = {
    0: { items: 1 },
    990: { items: 2 },
    1360: { items: 3 },
    1700: { items: 4 },
    2000: { items: 4 },
  };

  // ! STATION STATIC
  const getStationStatisByBalansOrg = id => {
    // ! STATISTIC STATION BY BALANS ORGANISATION
    if(id == undefined){
      // todo:  ALL STATIONS STATISTIC
      customFetch
      .get(`/last-data/getStatisticStations`)
      .then((data) => setStationStatistic(data.data.data));

      // todo:  ALL STATIONS
      customFetch
      .get(`/stations/all?page=1&perPage=10`)
      .then((data) => {
        setAllStation(data.data.data.data);
        setTotalPages(data.data.data.metadata.lastPage);
      });
    }else {
      // todo:  ALL STATIONS STATISTIC BY BALANS ORG
      customFetch
      .get(`/last-data/getStatisticStationsByOrganization?organization=${id}`)
      .then((data) => setStationStatistic(data.data.data));

      // todo: ALL STATIONS BY BALANS ORG
      customFetch
      .get(`/stations/all/balanceOrganization?balanceOrganizationNumber=${id}&page=1&perPage=10`)
      .then((data) => {
        setAllStation(data.data.data.data);
        setTotalPages(data.data.data.metadata.lastPage);
      });
    }
  }

  // ! STATION STATIC FOR STATUS
  const getStationStatisByBalansOrgForStatus = id => {
    // ! STATISTIC STATION BY BALANS ORGANISATION
    if(id == undefined){
      // todo:  ALL STATIONS STATIC
      customFetch
      .get(`/last-data/getStatisticStations`)
      .then((data) => setStationStatistic(data.data.data));

      // todo:  ALL STATIONS
      customFetch
      .get(`/stations/all/statusOff?&page=1&perPage=10`)
      .then((data) => {
        setNotWorkingStation(data.data.data.data);
        setTotalPagesForStatus(data.data.data.metadata.lastPage);
      });
    }else {
      // todo:  ALL STATIONS STATIC BY BALANS ORG
      customFetch
      .get(`/last-data/getStatisticStationsByOrganization?organization=${id}`)
      .then((data) => setStationStatistic(data.data.data));

      // todo: ALL STATIONS BY BALANS ORG
      customFetch
      .get(`/stations/searchStatusFalseByBalance?balanceOrganizationNumber=${id}&page=1&perPage=10`)
      .then((data) => {
        setNotWorkingStation(data.data.data.data);
        setTotalPagesForStatus(data.data.data.metadata.lastPage);
      });
    }
  }

  // ! ITEMS FOR STATION LIST
  const itemsForAllStation = stationStatisticAll?.gruopRegion?.map((e, i) => {
    return  <div className="sort-dashboard-list-item ms-3" onClick={(s) => {
      setBalansOrgId(e.balance_organization_id)
      getStationStatisByBalansOrg(e.balance_organization_id)
      setTableTitle(`${foundBalansOrgName(e.balance_organization_id)} ga tegishli stansiyalar`);
    }}>
       <div className="sort-dashboard-wrapper sort-dashboard-wrapper-last-data">
       <h6 className="carousel-region-heading">
       {
         foundRegionName(e.region_id)
       }
       </h6>

       <h6>
       {
         foundBalansOrgName(e.balance_organization_id)
       }
       </h6>
       <div className="d-flex flex-column justify-content-end">
         <div className="d-flex align-items-center m-0">
           <img src={all} alt="active" width={35} height={35} /> <span className="fs-6 ms-1">Jami</span> :<span className="fs-6 ms-1 fw-semibold">{e.countStations} ta</span>
         </div>
         <div className="d-flex align-items-center m-0">
           <img src={active} alt="active" width={30} height={30} /> <span className="fs-6 ms-1">Active</span>: <span className="fs-6 ms-1 fw-semibold">{e.countWorkStations} ta</span>
         </div>
         <div className="d-flex align-items-center m-0">
           <img src={passive} alt="active" width={35} height={35} /> <span className="fs-6 ms-1">Passive</span>: <span className="fs-6 ms-1 fw-semibold">{e.countNotWorkStations} ta</span>
         </div>
       </div>
     </div>
     </div>
  });

  // ! ITEMS FOR STATION STATUS
  const itemsForAllStationStatus = stationStatisticAll?.gruopRegion?.map((e, i) => {
    return  <div className="sort-dashboard-list-item ms-3" onClick={(s) => {
      setBalansOrgIdForStatus(e.balance_organization_id)
      getStationStatisByBalansOrgForStatus(e.balance_organization_id)
      setTableTitleForStatus(`${foundBalansOrgName(e.balance_organization_id)} ga tegishli ishlamayotganlar stansiyalar`);
    }}>
       <div className="sort-dashboard-wrapper sort-dashboard-wrapper-last-data">
       <h6 className="carousel-region-heading">
       {
         foundRegionName(e.region_id)
       }
       </h6>

       <h6>
       {
         foundBalansOrgName(e.balance_organization_id)
       }
       </h6>
       <div className="d-flex flex-column justify-content-end">
         <div className="d-flex align-items-center m-0">
           <img src={passive} alt="active" width={35} height={35} /> <span className="fs-6 ms-1">Passive</span>: <span className="fs-6 ms-1 fw-semibold">{e.countNotWorkStations} ta</span>
         </div>
       </div>
     </div>
     </div>
  });

  return (
    <HelmetProvider>
      <section>
        {allStation.length > 0 ? (
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
                                if (
                                  e.id == stationOne?.balance_organization_id
                                ) {
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
                            {stationOne?.status  == '1' ? "ishlayapti" : "ishlamayapti"}
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
                        data-bs-target="#profile-search"
                        onClick={() => setWhichData("StationForStatus")}
                      >
                        Ishlamayotganlar stansiyalar
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
                  </ul>
                  <div className="tab-content pt-4">
                    {/* ALL STATION */}
                    <div
                      className="tab-pane fade show active profile-users table-scroll"
                      id="profile-users"
                    >
                      <div className="dashboard-statis-top w-100 d-flex align-items-center justify-content-between flex-wrap">
                        <h1 className="dashboard-heading ms-2 dashboard-heading-role">
                        Jami balans tashkilotlari
                        </h1>
                        <div className="region-heading-statis-wrapper region-heading-statis-wrapper-last-data d-flex flex-wrap cursor" onClick={() => {
                          setBalansOrgId(undefined)
                          getStationStatisByBalansOrg()
                          setTableTitle("Jami stansiyalar");
                        }}>
                            <div className="d-flex align-items-center m-0">
                              <img src={all} alt="active" width={30} height={30} /> <span className="fs-6 ms-1">Jami</span>: <span className="fs-6 ms-1 fw-semibold">{stationStatisticAll.countStations} ta</span>
                            </div>
                            <div className="d-flex align-items-center m-0">
                              <img src={active} className="ms-3" alt="active" width={30} height={30} /> <span className="fs-6 ms-1">Active</span>: <span className="fs-6 ms-1 fw-semibold">{stationStatisticAll.countWorkingStations} ta</span>
                            </div>
                            <div className="d-flex align-items-center m-0">
                              <img src={passive} className="ms-3" alt="active" width={35} height={35} /> <span className="fs-6 ms-1">Passive</span>: <span className="fs-6 ms-1 fw-semibold">{stationStatisticAll.countNotWorkingStations} ta</span>
                            </div>
                            <div className="d-flex align-items-center m-0">
                              <img className="ms-3" src={defective} alt="active" width={35} height={35} /> <span className="fs-6 ms-1">No soz</span> :<span className="fs-6 ms-1 fw-semibold">{stationStatisticAll.countDefectiveStations} ta</span>
                            </div>
                        </div>
                    </div>
                  <ol className="list-unstyled sort-dashboard-list m-0 my-4 d-flex align-items-center justify-content-center">
                    <AliceCarousel
                      autoPlay={true}
                      // infinite={true}
                      autoPlayStrategy="all"
                      responsive={responsive}
                      disableButtonsControls={true}
                      animationDuration="900"
                      autoPlayInterval={10000}
                      mouseTracking
                      items={itemsForAllStation}
                      />
                  </ol>
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
                        />

                        <button className="btn btn-primary bg-btn">
                          Qidirish
                        </button>
                      </form>

                      <div className="d-flex align-items-center justify-content-between flex-wrap my-3 pt-3">
                        <h1 className="mb-3 user-lastdata-heading">
                          {tableTitle}
                        </h1>

                        <div className="region-heading-statis-wrapper region-heading-statis-wrapper-last-data d-flex flex-wrap cursor">
                            <div className="d-flex align-items-center m-0">
                              <img src={active} alt="active" width={30} height={30} /> <span className="fs-6 ms-1">Active</span>: <span className="fs-6 ms-1 fw-semibold">{stationStatistic.countWorkingStations} ta</span>
                            </div>
                            <div className="d-flex align-items-center m-0">
                              <img src={passive} className="ms-3" alt="active" width={35} height={35} /> <span className="fs-6 ms-1">Passive</span>: <span className="fs-6 ms-1 fw-semibold">{stationStatistic.countNotWorkingStations} ta</span>
                            </div>
                            <div className="d-flex align-items-center m-0">
                              <img className="ms-3" src={defective} alt="active" width={35} height={35} /> <span className="fs-6 ms-1">No soz</span> :<span className="fs-6 ms-1 fw-semibold">{stationStatistic.countDefectiveStations} ta</span>
                            </div>
                        </div>
                    </div>

                      <div
                        className="d-flex align-items-center justify-content-end cursor-pointer ms-auto user-station-save"
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
                        <table className="c-table my-4 w-100">
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
                                    <span>{e.status  == '1' ? "ishlayapti" : "ishlamayapti"}</span>
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

                    {/* STATUS */}
                    <div
                      className="tab-pane fade profile-search table-scroll"
                      id="profile-search"
                    >
                      <div className="dashboard-statis-top w-100 d-flex align-items-center justify-content-between flex-wrap">
                        <h1 className="dashboard-heading ms-2 dashboard-heading-role">
                        Jami balans tashkilotlari
                        </h1>
                        <div className="region-heading-statis-wrapper region-heading-statis-wrapper-last-data d-flex flex-wrap cursor" onClick={() => {
                          setBalansOrgIdForStatus(undefined)
                          getStationStatisByBalansOrgForStatus()
                          setTableTitleForStatus("Jami ishlamayotganlar stansiyalar ro'yhati");
                        }}>
                            <div className="d-flex align-items-center m-0">
                              <img src={passive} className="ms-3" alt="active" width={35} height={35} /> <span className="fs-6 ms-1">Passive</span>: <span className="fs-6 ms-1 fw-semibold">{stationStatisticAll.countNotWorkingStations} ta</span>
                            </div>
                            <div className="d-flex align-items-center m-0">
                              <img className="ms-3" src={defective} alt="active" width={35} height={35} /> <span className="fs-6 ms-1">No soz</span> :<span className="fs-6 ms-1 fw-semibold">{stationStatisticAll.countDefectiveStations} ta</span>
                            </div>
                        </div>
                      </div>
                      <ol className="list-unstyled sort-dashboard-list m-0 my-4 d-flex align-items-center justify-content-center">
                        <AliceCarousel
                          autoPlay={true}
                          // infinite={true}
                          autoPlayStrategy="all"
                          responsive={responsive}
                          disableButtonsControls={true}
                          animationDuration="900"
                          autoPlayInterval={10000}
                          mouseTracking
                          items={itemsForAllStationStatus}
                          />
                      </ol>

                      <div className="d-flex align-items-center justify-content-between flex-wrap my-3 pt-3">
                        <h3 className="mb-3 user-lastdata-heading">
                        {tableTitleForStatus}
                        </h3>

                        <div className="region-heading-statis-wrapper region-heading-statis-wrapper-last-data d-flex flex-wrap cursor">
                            <div className="d-flex align-items-center m-0">
                              <img src={passive} className="ms-3" alt="active" width={35} height={35} /> <span className="fs-6 ms-1">Passive</span>: <span className="fs-6 ms-1 fw-semibold">{stationStatistic.countNotWorkingStations} ta</span>
                            </div>
                            <div className="d-flex align-items-center m-0">
                              <img className="ms-3" src={defective} alt="active" width={35} height={35} /> <span className="fs-6 ms-1">No soz</span> :<span className="fs-6 ms-1 fw-semibold">{stationStatistic.countDefectiveStations} ta</span>
                            </div>
                        </div>
                    </div>

                      <div
                        className="text-end d-flex align-items-center justify-content-end cursor-pointer ms-auto user-station-save"
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
                        <table className="c-table my-4 w-100">
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
                                    {e.status  == '1' ? "ishlayapti" : "ishlamayapti"}
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
                            onChange={(e) => setMinimumValue(e.target.value)}
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
                            onChange={(e) => setMaximumValue(e.target.value)}
                          />
                        </div>
                        <button className="btn btn-primary bg-btn">
                          Qidirish
                        </button>
                      </form>

                      <div
                        className="text-end d-flex align-items-center justify-content-end cursor-pointer ms-auto user-station-save"
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
                        <table className="c-table my-4 w-100">
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
                                    {e.status  == '1' ? "ishlayapti" : "ishlamayapti"}
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
                  </div>
                </div>
              </div>

              <Helmet>
                <script src="../src/assets/js/table.js"></script>
              </Helmet>
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
      </section>
    </HelmetProvider>
  );
};

export default AdminStation;
