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
import "./AdminLastData.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../Api/Api";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import excel from "../../assets/images/excel.png";
import axios from "axios";
import all from "../../assets/images/all.png";
import defective from "../../assets/images/defective.png";
import active from "../../assets/images/active.png";
import passive from "../../assets/images/passive.png";
import AliceCarousel from "react-alice-carousel";
import warning from "../../assets/images/warning.png";
import warningMessage from "../../assets/images/warning-message.png";

const AdminLastData = () => {
  const [loader, setLoader] = useState(false);
  const [allBalansOrg, setAllBalansOrg] = useState([]);
  const [allRegion, setAllRegion] = useState([]);
  const [allStation, setAllStation] = useState([]);
  const [stationStatisticAll, setStationStatisticAll] = useState([]);
  const [balansOrgId, setBalansOrgId] = useState();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const name = window.localStorage.getItem("name");
  const role = window.localStorage.getItem("role");
  const [stationStatistic, setStationStatistic] = useState([]);
  const [whichStation, setWhichStation] = useState("allStation");
  const [tableTitle, setTableTitle] = useState("Umumiy stansiyalar soni");
  const [colorCard, setColorCard] = useState(
    "user-last-data-list-item-href-blue"
  );
  const balanceOrgName = localStorage.getItem("balanceOrgName");

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
    const userDashboardFunc = async () => {
      // ! STATION STATISTIC
      const requestStationStatistic = await customFetch.get(
        `/last-data/getStatisticStations`
      );

      setStationStatistic(requestStationStatistic.data.data);
    };

    userDashboardFunc();

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

  useEffect(() => {
    if(balansOrgId == undefined){
      if (whichStation == "allStation") {
        // ! LIMIT
        customFetch
          .get(`/last-data/allLastData?page=1&perPage=12`)
          .then((data) => {
            setAllStation(data.data.data)
            setTotalPages(
              data.data.totalPages
            )
          });
      } else if (whichStation == "todayStation") {
        // ! LIMIT
        customFetch
          .get(`/last-data/todayWorkStations?page=1&perPage=12`)
          .then((data) => {
            setAllStation(data.data.data.docs)
            setTotalPages(
              data.data.data.totalPages
            )
          });
      } else if (whichStation == "withinThreeDayStation") {
        // ! LIMIT
        customFetch
          .get(`/last-data/treeDaysWorkStations?page=1&perPage=12`)
          .then((data) => {
            setAllStation(data.data.data.docs)
            setTotalPages(
              data.data.data.totalPages
            )
          });
      } else if (whichStation == "totalMonthWorkStation") {
        // ! LIMIT
        customFetch
          .get(`/last-data/lastMonthWorkStations?page=1&perPage=12`)
          .then((data) => {
            setAllStation(data.data.data.docs)
            setTotalPages(
              data.data.data.totalPages
            )
          });
      } else if (whichStation == "totalMoreWorkStations") {
        // ! LIMIT
        customFetch
          .get(`/last-data/moreWorkStations?page=1&perPage=12`)
          .then((data) => {
            setAllStation(data.data.data.docs)
            setTotalPages(
              data.data.data.totalPages
            )
          });
      }
    }else {
      if (whichStation == "allStation") {
        // ! LIMIT
        customFetch
          .get(`/last-data/allLastDataByOrganization?page=1&perPage=12&organization=${balansOrgId}`)
          .then((data) => {
            setAllStation(data.data.data)
            setTotalPages(
              data.data.totalPages
            )
          });
      } else if (whichStation == "todayStation") {
        // ! LIMIT
        customFetch
          .get(`/last-data/todayWorkStationsByOrganization?page=1&perPage=12&organization=${balansOrgId}`)
          .then((data) => {
            setAllStation(data.data.data.docs)
            setTotalPages(
              data.data.data.totalPages
            )
          });
      } else if (whichStation == "withinThreeDayStation") {
        // ! LIMIT
        customFetch
          .get(`/last-data/treeDaysWorkStationsByOrganization?page=1&perPage=12&organization=${balansOrgId}`)
          .then((data) => {
            setAllStation(data.data.data.docs)
            setTotalPages(
              data.data.data.totalPages
            )
          });
      } else if (whichStation == "totalMonthWorkStation") {
        // ! LIMIT
        customFetch
          .get(`/last-data/lastMonthWorkStationsByOrganization?page=1&perPage=12&organization=${balansOrgId}`)
          .then((data) => {
            setAllStation(data.data.data.docs)
            setTotalPages(
              data.data.data.totalPages
            )
          });
      } else if (whichStation == "totalMoreWorkStations") {
        // ! LIMIT
        customFetch
          .get(`/last-data/moreWorkStationsByOrganization?page=1&perPage=12&organization=${balansOrgId}`)
          .then((data) => {
            setAllStation(data.data.data.docs)
            setTotalPages(
              data.data.data.totalPages
            )
          });
      }
    }
  }, [stationStatistic, whichStation]);

  const handlePageChange = (selectedPage) => {
    if(balansOrgId == undefined){
      if (whichStation == "allStation") {
        // ! LIMIT
        customFetch
          .get(
            `/last-data/allLastData?page=${selectedPage.selected + 1}&perPage=12`
          )
          .then((data) => setAllStation(data.data.data));
      } else if (whichStation == "todayStation") {
        // ! LIMIT
        customFetch
          .get(
            `/last-data/todayWorkStations?page=${
              selectedPage.selected + 1
            }&perPage=12`
          )
          .then((data) => {
            setAllStation(data.data.data.docs);
          });
      } else if (whichStation == "withinThreeDayStation") {
        // ! LIMIT
        customFetch
          .get(
            `/last-data/treeDaysWorkStations?page=${
              selectedPage.selected + 1
            }&perPage=12`
          )
          .then((data) => {
            setAllStation(data.data.data.docs);
          });
      } else if (whichStation == "totalMonthWorkStation") {
        // ! LIMIT
        customFetch
          .get(
            `/last-data/lastMonthWorkStations?page=${
              selectedPage.selected + 1
            }&perPage=12`
          )
          .then((data) => {
            setAllStation(data.data.data.docs);
          });
      } else if (whichStation == "totalMoreWorkStations") {
        // ! LIMIT
        customFetch
          .get(
            `/last-data/moreWorkStations?page=${
              selectedPage.selected + 1
            }&perPage=12`
          )
          .then((data) => {
            setAllStation(data.data.data.docs);
          });
      }
    } else {
      if (whichStation == "allStation") {
        // ! LIMIT
        customFetch
          .get(
            `/last-data/allLastDataByOrganization?page=${selectedPage.selected + 1}&perPage=12&organization=${balansOrgId}`
          )
          .then((data) => setAllStation(data.data.data));
      } else if (whichStation == "todayStation") {
        // ! LIMIT
        customFetch
          .get(
            `/last-data/todayWorkStationsByOrganization?page=${
              selectedPage.selected + 1
            }&perPage=12&organization=${balansOrgId}`
          )
          .then((data) => {
            setAllStation(data.data.data.docs);
          });
      } else if (whichStation == "withinThreeDayStation") {
        // ! LIMIT
        customFetch
          .get(
            `/last-data/treeDaysWorkStationsByOrganization?page=${
              selectedPage.selected + 1
            }&perPage=12&organization=${balansOrgId}`
          )
          .then((data) => {
            setAllStation(data.data.data.docs);
          });
      } else if (whichStation == "totalMonthWorkStation") {
        // ! LIMIT
        customFetch
          .get(
            `/last-data/lastMonthWorkStationsByOrganization?page=${
              selectedPage.selected + 1
            }&perPage=12&organization=${balansOrgId}`
          )
          .then((data) => {
            setAllStation(data.data.data.docs);
          });
      } else if (whichStation == "totalMoreWorkStations") {
        // ! LIMIT
        customFetch
          .get(
            `/last-data/moreWorkStationsByOrganization?page=${
              selectedPage.selected + 1
            }&perPage=12&organization=${balansOrgId}`
          )
          .then((data) => {
            setAllStation(data.data.data.docs);
          });
      }
    }
  };

  const returnFixdDate = (item) => {
    if(item == undefined){
      return "Ma'lumot kelmagan"
    }else {
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
    }
  };

  const checkStationWorkingOrNot = (value) => {
    const presentDate = new Date();
    let startDate = new Date(Array.isArray(value) ? value[0]?.date : value?.date);
    startDate.setHours(startDate.getHours() - 5);

    if (Array.isArray(value) ? value[0]?.level : value?.level == undefined) {
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
    let sath = "sath (sm)";
    let shurlanish = "shurlanish (g/l)";
    let temperatura = "temperatura (°C)";
    const fixedDate = new Date();

    const resultDate = `${fixedDate.getDate()}/${
      fixedDate.getMonth() + 1
    }/${fixedDate.getFullYear()} ${fixedDate.getHours()}:${
      String(fixedDate.getMinutes()).length == 1
        ? "0" + fixedDate.getMinutes()
        : fixedDate.getMinutes()
    }`;

    if (whichStation == "allStation") {
      const userAllDataFunc = async () => {
        const resultExcelData = [];

        if(balansOrgId == undefined){
          const request = await customFetch.get(
            `/last-data/allLastData?page=1&perPage=${stationStatistic.totalStationsCount}`
          );

          request.data.data.forEach((e) => {
            resultExcelData.push({
              nomi: e.name,
              imei: e.imel,
              battery: e.battery,
              lokatsiya: e.location,
              programma_versiyasi: e.programVersion,
              qurilma_telefon_raqami: e.devicePhoneNum,
              status: e.status == 1 ? "ishlayapti" : "ishlamayapti",
              integratsiya: e?.isIntegration == true ? "Qilingan" : "Qilinmagan",
              [sath]: Array.isArray(e.lastData) ? Number(e.lastData[0]?.level).toFixed(2) : Number(e.lastData?.level).toFixed(2),
              [shurlanish]: Array.isArray(e.lastData) ? Number(e.lastData[0]?.conductivity).toFixed(2) : Number(e.lastData?.conductivity).toFixed(2),
              [temperatura]: Array.isArray(e.lastData) ? Number(e.lastData[0]?.temp).toFixed(2) : Number(e.lastData?.temp).toFixed(2),
              sana: Array.isArray(e.lastData) ? e.lastData[0]?.date : e.lastData?.date,
            });
          });
        }else {
          const request = await customFetch.get(
            `/last-data/allLastDataByOrganization?page=1&perPage=${stationStatistic.totalStationsCount}&organization=${balansOrgId}`
          );

          request.data.data.forEach((e) => {
            resultExcelData.push({
              nomi: e.name,
              imei: e.imel,
              battery: e.battery,
              lokatsiya: e.location,
              programma_versiyasi: e.programVersion,
              qurilma_telefon_raqami: e.devicePhoneNum,
              status: e.status == 1 ? "ishlayapti" : "ishlamayapti",
              integratsiya: e?.isIntegration == true ? "Qilingan" : "Qilinmagan",
              [sath]: Array.isArray(e.lastData) ? Number(e.lastData[0]?.level).toFixed(2) : Number(e.lastData?.level).toFixed(2),
              [shurlanish]: Array.isArray(e.lastData) ? Number(e.lastData[0]?.conductivity).toFixed(2) : Number(e.lastData?.conductivity).toFixed(2),
              [temperatura]: Array.isArray(e.lastData) ? Number(e.lastData[0]?.temp).toFixed(2) : Number(e.lastData?.temp).toFixed(2),
              sana: Array.isArray(e.lastData) ? e.lastData[0]?.date : e.lastData?.date,
            });
          });
        }

        const workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.json_to_sheet(resultExcelData);

        XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

        if (resultExcelData.length > 0) {
          XLSX.writeFile(
            workBook,
            `${foundBalansOrgName(balansOrgId) != undefined ? foundBalansOrgName(balansOrgId) : 'Jami'} umumiy stansiya ma'lumotlari ${resultDate}.xlsx`
          );
        }
      };

      userAllDataFunc();
    } else if (whichStation == "todayStation") {
      const userTodayDataFunc = async () => {
        const resultExcelData = [];

        if(balansOrgId == undefined){
          const request = await customFetch.get(
            `/last-data/todayWorkStations?page=1&perPage=${stationStatistic.totalTodayWorkStationsCount}`
          );

          request.data.data.docs.forEach((e) => {
            resultExcelData.push({
              nomi: e.stations.name,
              imei: e.stations.imel,
              battery: e.stations.battery,
              lokatsiya: e.stations.location,
              programma_versiyasi: e.stations.programVersion,
              qurilma_telefon_raqami: e.stations.devicePhoneNum,
              status: e.stations.status == 1 ? "ishlayapti" : "ishlamayapti",
              integratsiya:
                e?.stations.isIntegration == true ? "Qilingan" : "Qilinmagan",
              [sath]: Number(e.level).toFixed(2),
              [shurlanish]: Number(e.conductivity).toFixed(2),
              [temperatura]: Number(e.temp).toFixed(2),
              sana: e.date,

            });
          });
        }else {
          const request = await customFetch.get(
            `/last-data/todayWorkStationsByOrganization?page=1&perPage=${stationStatistic.totalTodayWorkStationsCount}&organization=${balansOrgId}`
          );

          request.data.data.docs.forEach((e) => {
            resultExcelData.push({
              nomi: e.stations.name,
              imei: e.stations.imel,
              battery: e.stations.battery,
              lokatsiya: e.stations.location,
              programma_versiyasi: e.stations.programVersion,
              qurilma_telefon_raqami: e.stations.devicePhoneNum,
              status: e.stations.status == 1 ? "ishlayapti" : "ishlamayapti",
              integratsiya:
                e?.stations.isIntegration == true ? "Qilingan" : "Qilinmagan",
              [sath]: Number(e.level).toFixed(2),
              [shurlanish]: Number(e.conductivity).toFixed(2),
              [temperatura]: Number(e.temp).toFixed(2),
              sana: e.date,
            });
          });
        }

        const workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.json_to_sheet(resultExcelData);

        XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

        if (resultExcelData.length > 0) {
          XLSX.writeFile(
            workBook,
            `${foundBalansOrgName(balansOrgId) != undefined ? foundBalansOrgName(balansOrgId) : 'Jami'} bugun kelgan ma'lumotlari ${resultDate}.xlsx`
          );
        }
      };

      userTodayDataFunc();
    } else if (whichStation == "withinThreeDayStation") {
      const userThreeDayDataFunc = async () => {
        const resultExcelData = [];

        if(balansOrgId == undefined){
          const request = await customFetch.get(
            `/last-data/treeDaysWorkStations?page=1&perPage=${stationStatistic.totalThreeDayWorkStationsCount}`
          );

          request.data.data.docs.forEach((e) => {
            resultExcelData.push({
              nomi: e.stations.name,
              imei: e.stations.imel,
              battery: e.stations.battery,
              lokatsiya: e.stations.location,
              programma_versiyasi: e.stations.programVersion,
              qurilma_telefon_raqami: e.stations.devicePhoneNum,
              status: e.stations.status == 1 ? "ishlayapti" : "ishlamayapti",
              integratsiya:
                e?.stations.isIntegration == true ? "Qilingan" : "Qilinmagan",
              [sath]: Number(e.level).toFixed(2),
              [shurlanish]: Number(e.conductivity).toFixed(2),
              [temperatura]: Number(e.temp).toFixed(2),
              sana: e.date,
            });
          });
        }else {
          const request = await customFetch.get(
            `/last-data/treeDaysWorkStationsByOrganization?page=1&perPage=${stationStatistic.totalThreeDayWorkStationsCount}&organization=${balansOrgId}`
          );

          request.data.data.docs.forEach((e) => {
            resultExcelData.push({
              nomi: e.stations.name,
              imei: e.stations.imel,
              battery: e.stations.battery,
              lokatsiya: e.stations.location,
              programma_versiyasi: e.stations.programVersion,
              qurilma_telefon_raqami: e.stations.devicePhoneNum,
              status: e.stations.status == 1 ? "ishlayapti" : "ishlamayapti",
              integratsiya:
                e?.stations.isIntegration == true ? "Qilingan" : "Qilinmagan",
              [sath]: Number(e.level).toFixed(2),
              [shurlanish]: Number(e.conductivity).toFixed(2),
              [temperatura]: Number(e.temp).toFixed(2),
              sana: e.date,
            });
          });
        }

        const workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.json_to_sheet(resultExcelData);

        XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

        if (resultExcelData.length > 0) {
          XLSX.writeFile(
            workBook,
            `${foundBalansOrgName(balansOrgId) != undefined ? foundBalansOrgName(balansOrgId) : 'Jami'} 3 ichida kelgan ma'lumotlari ${resultDate}.xlsx`
          );
        }
      };

      userThreeDayDataFunc();
    } else if (whichStation == "totalMonthWorkStation") {
      const userLastMonthDataFunc = async () => {
        const resultExcelData = [];

        if(balansOrgId == undefined){
          const request = await customFetch.get(
            `/last-data/lastMonthWorkStations?page=1&perPage=${stationStatistic.totalMonthWorkStationsCount}`
          );

          request.data.data.docs.forEach((e) => {
            resultExcelData.push({
              nomi: e.stations.name,
              imei: e.stations.imel,
              battery: e.stations.battery,
              lokatsiya: e.stations.location,
              programma_versiyasi: e.stations.programVersion,
              qurilma_telefon_raqami: e.stations.devicePhoneNum,
              status: e.stations.status == 1 ? "ishlayapti" : "ishlamayapti",
              integratsiya:
                e?.stations.isIntegration == true ? "Qilingan" : "Qilinmagan",
              [sath]: Number(e.level).toFixed(2),
              [shurlanish]: Number(e.conductivity).toFixed(2),
              [temperatura]: Number(e.temp).toFixed(2),
              sana: e.date,
            });
          });
        }else {
          const request = await customFetch.get(
            `/last-data/lastMonthWorkStationsByOrganization?page=1&perPage=${stationStatistic.totalMonthWorkStationsCount}&organization=${balansOrgId}`
          );

          request.data.data.docs.forEach((e) => {
            resultExcelData.push({
              nomi: e.stations.name,
              imei: e.stations.imel,
              battery: e.stations.battery,
              lokatsiya: e.stations.location,
              programma_versiyasi: e.stations.programVersion,
              qurilma_telefon_raqami: e.stations.devicePhoneNum,
              status: e.stations.status == 1 ? "ishlayapti" : "ishlamayapti",
              integratsiya:
                e?.stations.isIntegration == true ? "Qilingan" : "Qilinmagan",
              [sath]: Number(e.level).toFixed(2),
              [shurlanish]: Number(e.conductivity).toFixed(2),
              [temperatura]: Number(e.temp).toFixed(2),
              sana: e.date,
            });
          });
        }

        const workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.json_to_sheet(resultExcelData);

        XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

        if (resultExcelData.length > 0) {
          XLSX.writeFile(
            workBook,
            `${foundBalansOrgName(balansOrgId) != undefined ? foundBalansOrgName(balansOrgId) : 'Jami'} so'ngi oy kelgan ma'lumotlari ${resultDate}.xlsx`
          );
        }
      };

      userLastMonthDataFunc();
    } else if (whichStation == "totalMoreWorkStations") {
      const userMoreMonthDataFunc = async () => {
        const resultExcelData = [];

        if(balansOrgId == undefined){
          const request = await customFetch.get(
            `/last-data/moreWorkStations?page=1&perPage=${stationStatistic.totalMoreWorkStationsCount}`
          );

          request.data.data.docs.forEach((e) => {
            resultExcelData.push({
              nomi: e.stations.name,
              imei: e.stations.imel,
              battery: e.stations.battery,
              lokatsiya: e.stations.location,
              programma_versiyasi: e.stations.programVersion,
              qurilma_telefon_raqami: e.stations.devicePhoneNum,
              status: e.stations.status == 1 ? "ishlayapti" : "ishlamayapti",
              integratsiya:
                e?.stations.isIntegration == true ? "Qilingan" : "Qilinmagan",
              [sath]: Number(e.level).toFixed(2),
              [shurlanish]: Number(e.conductivity).toFixed(2),
              [temperatura]: Number(e.temp).toFixed(2),
              sana: e.date,
            });
          });
        }else {
          const request = await customFetch.get(
            `/last-data/moreWorkStationsByOrganization?page=1&perPage=${stationStatistic.totalMoreWorkStationsCount}&organization=${balansOrgId}`
          );

          request.data.data.docs.forEach((e) => {
            resultExcelData.push({
              nomi: e.stations.name,
              imei: e.stations.imel,
              battery: e.stations.battery,
              lokatsiya: e.stations.location,
              programma_versiyasi: e.stations.programVersion,
              qurilma_telefon_raqami: e.stations.devicePhoneNum,
              status: e.stations.status == 1 ? "ishlayapti" : "ishlamayapti",
              integratsiya:
                e?.stations.isIntegration == true ? "Qilingan" : "Qilinmagan",
              [sath]: Number(e.level).toFixed(2),
              [shurlanish]: Number(e.conductivity).toFixed(2),
              [temperatura]: Number(e.temp).toFixed(2),
              sana: e.date,
            });
          });
        }

        const workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.json_to_sheet(resultExcelData);

        XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

        if (resultExcelData.length > 0) {
          XLSX.writeFile(
            workBook,
            `${foundBalansOrgName(balansOrgId) != undefined ? foundBalansOrgName(balansOrgId) : 'Jami'} uzoq vaqt ishlamagan stansiya ma'lumotlari ${resultDate}.xlsx`
          );
        }
      };

      userMoreMonthDataFunc();
    }
  };

  const searchStationByInput = (value) => {
    if (whichStation == "allStation") {
      customFetch
        .get(
          `/last-data/searchLastDataByStation?search=${value}&page=1&perPage=12`
        )
        .then((data) => {
          if (data.data.data.data.length > 0) {
            setAllStation(data.data.data.data);
            setTotalPages(data.data.data.totalPages);
          }
        });
    } else if (whichStation == "todayStation") {
      customFetch
        .get(
          `/last-data/searchTodayWorkingStations?search=${value}&page=1&perPage=12`
        )
        .then((data) => {
          if (data.data.data.docs.length > 0) {
            setAllStation(data.data.data.docs);
            setTotalPages(data.data.data.totalPages);
          }
        });
    } else if (whichStation == "withinThreeDayStation") {
      customFetch
        .get(
          `/last-data/searchThreeDaysWorkingStations?search=${value}&page=1&perPage=12`
        )
        .then((data) => {
          if (data.data.data.docs.length > 0) {
            setAllStation(data.data.data.docs);
            setTotalPages(data.data.data.totalPages);
          }
        });
    } else if (whichStation == "totalMonthWorkStation") {
      customFetch
        .get(
          `/last-data/searchLastMonthWorkingStations?search=${value}&page=1&perPage=12`
        )
        .then((data) => {
          if (data.data.data.docs.length > 0) {
            setAllStation(data.data.data.docs);
            setTotalPages(data.data.data.totalPages);
          }
        });
    } else if (whichStation == "totalMoreWorkStations") {
      customFetch
        .get(
          `/last-data/searchMoreWorkingStations?search=${value}&page=1&perPage=12`
        )
        .then((data) => {
          if (data.data.data.docs.length > 0) {
            setAllStation(data.data.data.docs);
            setTotalPages(data.data.data.totalPages);
          }
        });
    }
  };

  const loaderFunc = () => {
    setLoader(true);

    setTimeout(() => {
      setLoader(false);
    }, 700);
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

  const getStationStatisByBalansOrg = id => {
    // ! STATISTIC STATION BY BALANS ORGANISATION
    if(id == undefined){
      customFetch
      .get(`/last-data/getStatisticStations`)
      .then((data) => setStationStatistic(data.data.data));
    }else {
      customFetch
      .get(`/last-data/getStatisticStationsByOrganization?organization=${id}`)
      .then((data) => setStationStatistic(data.data.data));
    }
  }

  const items = stationStatisticAll?.gruopRegion?.map((e, i) => {
    return  <div className="sort-dashboard-list-item ms-3" onClick={(s) => {
      setBalansOrgId(e.balance_organization_id)
      getStationStatisByBalansOrg(e.balance_organization_id)
      setWhichStation('allStation')
      setTableTitle("Umumiy stansiyalar soni");
      loaderFunc()
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

  const fixedStationName = name => {
    const fixedName = name.split('_')
    if(fixedName.length >= 2){
      return `${fixedName[0]} ${fixedName[1]}`
    }else {
      return fixedName
    }
  }

  return (
    <section className="py-3">
      {/* MODAL DEFECT */}
      <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
        <div className="modal-dialog modal-warning modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header modal-header-warning">
              <div className="m-auto">
                <img  src={warning} width={100} height={100} alt="warning" />
              </div>
            </div>
            <div className="modal-body">
              <h4 className="heading-modal-warning text-center">
                Qurilmaning no sozligining sabablari!
              </h4>
              <ul className="m-0 p-0 ps-3">
                <li className="d-flex align-items-center mt-4">
                  <img src={warningMessage} width={25} height={25} alt="warningMessage" />
                  <p className="m-0 ms-2">
                    Qurilmaning sozlamalari noto'g'ri qilingan bo'lishi mumkin
                  </p>
                </li>
                <li className="d-flex align-items-center mt-3">
                  <img src={warningMessage} width={25} height={25} alt="warningMessage" />
                  <p className="m-0 ms-2">
                  Qurilmaga suv kirgan bo'lishi mumkin
                  </p>
                </li>
              </ul>
            </div>
            <div className="modal-footer modal-footer-warning">
              <button className="btn btn-warning text-light w-25" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="card">
          {allStation.length > 0 ? (
            <div className="card-body">
              <div className="tab-content">
                <div
                  className="tab-pane container-fluid fade show active profile-users user-last-data-table-wrapper"
                  id="profile-users"
                >
                  <div className="user-last-data-top-wrapper pt-3">
                  <div className="d-flex align-items-center mb-4 pt-3">
                    <div className="dashboard-statis-top w-100 d-flex align-items-center justify-content-between flex-wrap">
                      <h1 className="dashboard-heading ms-2 dashboard-heading-role">
                      Jami balans tashkilotlari
                      </h1>
                      <div className="region-heading-statis-wrapper region-heading-statis-wrapper-last-data d-flex flex-wrap cursor" onClick={() => {
                        setBalansOrgId(undefined)
                        getStationStatisByBalansOrg()
                        setWhichStation("allStation");
                        setTableTitle("Umumiy stansiyalar soni");
                        loaderFunc()
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
                </div>
                  <ol className="list-unstyled sort-dashboard-list m-0 mb-4 d-flex align-items-center justify-content-center">
                    <AliceCarousel
                      autoPlay={true}
                      // infinite={true}
                      autoPlayStrategy="all"
                      responsive={responsive}
                      disableButtonsControls={true}
                      animationDuration="900"
                      autoPlayInterval={10000}
                      mouseTracking
                      items={items}
                      />
                  </ol>

                    <div className="d-flex align-items-center justify-content-between flex-wrap mb-3 pt-3">
                      <h1 className="mb-3 user-lastdata-heading">
                        Jami stansiyalar
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
                            <a>
                              <div className="user-last-data-list-item-top d-flex align-items-center justify-content-between">
                                <h3 className="fs-5 m-0">
                                  {whichStation == "allStation"
                                    ?
                                    <>
                                      <span>
                                        {fixedStationName(e.name)}
                                      </span>
                                      {
                                        e.status == 1 && e.defective == true ?
                                        <img className="cursor-pointer" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" src={warning} alt="warning" width={35} height={35} />
                                        : null
                                      }
                                    </>
                                    :
                                    <>
                                    <span>
                                      {fixedStationName(e.stations?.name)}
                                    </span>
                                    {
                                      e.stations?.status == 1 && e.stations?.defective == true ?
                                      <img className="cursor-pointer" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" src={warning} alt="warning" width={35} height={35} />
                                      : null
                                    }
                                    </>}
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

                              <span
                                onClick={() => {
                                  navigate(
                                    `/admin/lastdata/${
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
                                <div className="text-end mt-2">
                                  <div className="d-flex align-items-center">
                                    <p className="m-0 user-lastdata-level-desc">
                                      Sath:{" "}
                                    </p>
                                    <span className="fw-bold text-end w-100 user-lastdata-level-desc">
                                      {whichStation == "allStation"
                                      ?
                                        Array.isArray(e.lastData) && e.lastData.length > 0
                                        ? `${Number(e.lastData[0]?.level).toFixed()} sm`
                                        : Array.isArray(e.lastData) == false && e.lastData != undefined
                                        ? `${Number(e.lastData?.level).toFixed()} sm`
                                        : '-'
                                      :
                                      `${Number(e?.level).toFixed()} sm`
                                      }
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <p className="m-0 user-lastdata-level-desc">
                                      Sho'rlanish:{" "}
                                    </p>
                                    <span className="fw-bold text-end w-100 user-lastdata-level-desc">
                                      {whichStation == "allStation"
                                        ?
                                          Array.isArray(e.lastData) && e.lastData.length > 0
                                          ? `${Number(
                                            e.lastData[0]?.conductivity
                                          ).toFixed()} g/l`
                                          : Array.isArray(e.lastData) == false && e.lastData != undefined
                                          ? `${Number(
                                            e.lastData?.conductivity
                                          ).toFixed()} g/l`
                                          : '-'
                                        : `${Number(
                                          e?.conductivity
                                        ).toFixed()} g/l`
                                          }
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <p className="m-0 user-lastdata-level-desc">
                                      Temperatura:{" "}
                                    </p>
                                    <span className="fw-bold text-end w-100 user-lastdata-level-desc">
                                      {whichStation == "allStation"
                                        ?
                                          Array.isArray(e.lastData) && e.lastData.length > 0
                                          ? `${Number(e.lastData[0]?.temp).toFixed()} °C`
                                          : Array.isArray(e.lastData) == false && e.lastData != undefined
                                          ? `${Number(e.lastData?.temp).toFixed()} °C`
                                          : '-'
                                        :
                                        `${Number(e?.temp).toFixed()} °C`
                                        }
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-2">
                                  <p className="m-0">
                                    {returnFixdDate(
                                      whichStation == "allStation"
                                        ? Array.isArray(e.lastData) ? e?.lastData[0]?.date : e?.lastData?.date
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

export default AdminLastData;