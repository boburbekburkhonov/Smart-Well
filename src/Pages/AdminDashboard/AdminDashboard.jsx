import React, { useRef } from "react";
import { Chart as Chartjs, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, getElementsAtEvent } from "react-chartjs-2";
import "./AdminDashboard.css";
import circleBlue from "../../assets/images/record.png";
import circleGreen from "../../assets/images/circle.png";
import circleGreenBlue from "../../assets/images/circle-green-blue.png";
import circleOrange from "../../assets/images/circle-orange.png";
import circleRed from "../../assets/images/circle-red.png";
import circleYellow from "../../assets/images/circle-yellow.png";
import all from "../../assets/images/all.png";
import defective from "../../assets/images/defective.png";
import active from "../../assets/images/active.png";
import passive from "../../assets/images/passive.png";
import fullScreen from "../../assets/images/fullscreen.png";
import { useEffect } from "react";
import { api } from "../Api/Api";
import { useState } from "react";
import excel from "../../assets/images/excel.png";
import warning from "../../assets/images/warning.png";
import warningMessage from "../../assets/images/warning-message.png";
import * as XLSX from "xlsx";
import axios from "axios";
import AliceCarousel from "react-alice-carousel";
import 'react-alice-carousel/lib/alice-carousel.css';

Chartjs.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const name = window.localStorage.getItem("name");
  const role = window.localStorage.getItem("role");
  const [loader, setLoader] = useState(false);
  const [allBalansOrg, setAllBalansOrg] = useState([]);
  const [allRegion, setAllRegion] = useState([]);
  const [stationStatisticAll, setStationStatisticAll] = useState([]);
  const [balansOrgId, setBalansOrgId] = useState();
  const [dataOrStation, setDataOrStation] = useState("data");
  const [stationBattery, setStationBattery] = useState([]);
  const [stationStatistic, setStationStatistic] = useState([]);
  const [viewStation, setViewStation] = useState([]);
  const [viewStationLimit, setViewStationLimit] = useState([]);
  const [viewStationByChar, setViewStationByChar] = useState([]);
  const [viewStationByCharLimit, setViewStationByCharLimit] = useState([]);
  const [whichStation, setWhichStation] = useState("allStation");
  const [tableTitle, setTableTitle] = useState("Umumiy stansiyalar soni");
  const [tableTitleStation, setTableTitleStation] = useState("Jami stansiyalar");
  const chartRef = useRef();

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
    const adminDashboardFunc = async () => {
      // ! LAST DATA STATISTIC BY BALANS ORG
      const requestStationStatistic = await customFetch.get(
        `/last-data/getStatisticStations`
      );
      setStationStatistic(requestStationStatistic.data.data);
    };

    adminDashboardFunc();

    // ! STATION STATISTIC BATTERY
    customFetch
      .get(`/stations/getStatisticStationsByBattery`)
      .then((data) => setStationBattery(data.data.data));

    // ! STATION STATISTIC
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
        customFetch
          .get(
            `last-data/allLastData?page=1&perPage=${stationStatistic?.totalStationsCount}`
          )
          .then((data) => {
            setViewStation(data.data.data)
          });

        // ! LIMIT
        customFetch
          .get(`/last-data/allLastData?page=1&perPage=8`)
          .then((data) => {
            setViewStationLimit(data.data.data)
          });
      } else if (whichStation == "todayStation") {
        customFetch
          .get(
            `/last-data/todayWorkStations?page=1&perPage=${stationStatistic?.totalTodayWorkStationsCount}`
          )
          .then((data) => {
            setViewStation(data.data.data.docs)
          });

        // ! LIMIT
        customFetch
          .get(`/last-data/todayWorkStations?page=1&perPage=8`)
          .then((data) => setViewStationLimit(data.data.data.docs));
      } else if (whichStation == "withinThreeDayStation") {
        customFetch
          .get(
            `/last-data/treeDaysWorkStations?page=1&perPage=${stationStatistic?.totalThreeDayWorkStationsCount}`
          )
          .then((data) => setViewStation(data.data.data.docs));

        // ! LIMIT

        customFetch
          .get(`${api}/last-data/treeDaysWorkStations?page=1&perPage=8`)
          .then((data) => setViewStationLimit(data.data.data.docs));
      } else if (whichStation == "totalMonthWorkStation") {
        customFetch
          .get(
            `/last-data/lastMonthWorkStations?page=1&perPage=${stationStatistic?.totalMonthWorkStationsCount}`
          )
          .then((data) => setViewStation(data.data.data.docs));

        // ! LIMIT
        customFetch
          .get(`/last-data/lastMonthWorkStations?page=1&perPage=8`)
          .then((data) => setViewStationLimit(data.data.data.docs));
      } else if (whichStation == "totalMoreWorkStations") {
        customFetch
          .get(
            `/last-data/moreWorkStations?page=1&perPage=${stationStatistic?.totalMoreWorkStationsCount}`
          )
          .then((data) => setViewStation(data.data.data.docs));

        // ! LIMIT
        customFetch
          .get(`/last-data/moreWorkStations?page=1&perPage=8`)
          .then((data) => setViewStationLimit(data.data.data.docs));
      } else if (whichStation == "notWorkStation") {
        customFetch
          .get(
            `/last-data/getNotLastDataStations?page=1&perPage=${stationStatistic?.totalNotDataStationsCount}`
          )
          .then((data) => setViewStation(data.data.data.docs));

        // ! LIMIT
        customFetch
          .get(`${api}/last-data/getNotLastDataStations?page=1&perPage=8`)
          .then((data) => setViewStationLimit(data.data.data.docs));
      }
    }else {
      if (whichStation == "allStation") {
        customFetch
          .get(
            `last-data/allLastDataByOrganization?page=1&perPage=${stationStatistic?.totalStationsCount}&organization=${balansOrgId}`
          )
          .then((data) => {
            setViewStation(data.data.data)
          });

        // ! LIMIT
        customFetch
          .get(`/last-data/allLastDataByOrganization?page=1&perPage=8&organization=${balansOrgId}`)
          .then((data) => {
            setViewStationLimit(data.data.data)
          });
      } else if (whichStation == "todayStation") {
        customFetch
          .get(
            `/last-data/todayWorkStationsByOrganization?page=1&perPage=${stationStatistic?.totalTodayWorkStationsCount}&organization=${balansOrgId}`
          )
          .then((data) => {
            setViewStation(data.data.data.docs)
          });

        // ! LIMIT
        customFetch
          .get(`/last-data/todayWorkStationsByOrganization?page=1&perPage=8&organization=${balansOrgId}`)
          .then((data) => setViewStationLimit(data.data.data.docs));
      } else if (whichStation == "withinThreeDayStation") {
        customFetch
          .get(
            `/last-data/treeDaysWorkStationsByOrganization?page=1&perPage=${stationStatistic?.totalThreeDayWorkStationsCount}&organization=${balansOrgId}`
          )
          .then((data) => setViewStation(data.data.data.docs));

        // ! LIMIT

        customFetch
          .get(`${api}/last-data/treeDaysWorkStationsByOrganization?page=1&perPage=8&organization=${balansOrgId}`)
          .then((data) => setViewStationLimit(data.data.data.docs));
      } else if (whichStation == "totalMonthWorkStation") {
        customFetch
          .get(
            `/last-data/lastMonthWorkStationsByOrganization?page=1&perPage=${stationStatistic?.totalMonthWorkStationsCount}&organization=${balansOrgId}`
          )
          .then((data) => setViewStation(data.data.data.docs));

        // ! LIMIT
        customFetch
          .get(`/last-data/lastMonthWorkStationsByOrganization?page=1&perPage=8&organization=${balansOrgId}`)
          .then((data) => setViewStationLimit(data.data.data.docs));
      } else if (whichStation == "totalMoreWorkStations") {
        customFetch
          .get(
            `/last-data/moreWorkStationsByOrganization?page=1&perPage=${stationStatistic?.totalMoreWorkStationsCount}&organization=${balansOrgId}`
          )
          .then((data) => setViewStation(data.data.data.docs));

        // ! LIMIT
        customFetch
          .get(`/last-data/moreWorkStationsByOrganization?page=1&perPage=8&organization=${balansOrgId}`)
          .then((data) => setViewStationLimit(data.data.data.docs));
      } else if (whichStation == "notWorkStation") {
        customFetch
          .get(
            `/last-data/getNotLastDataStationsByOrganization?page=1&perPage=${stationStatistic?.totalNotDataStationsCount}&organization=${balansOrgId}`
          )
          .then((data) => setViewStation(data.data.data.docs));

        // ! LIMIT
        customFetch
          .get(`${api}/last-data/getNotLastDataStationsByOrganization?page=1&perPage=8&organization=${balansOrgId}`)
          .then((data) => setViewStationLimit(data.data.data.docs));
      }
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
    if (item == undefined) {
      return "-";
    } else {
      const time = item?.split("T")[1].split(".")[0];
      const date = item?.split("T")[0].split("-");
      if (whichStation == "todayStation") {
        return time;
      } else if (time != undefined) {
        return `${date[1]}/${date[2]}/${date[0]} ${time}`;
      }
    }
  };

  const filteredStationDateByChar = (item) => {
    const time = item?.split("T")[1].split(".")[0];
    const date = item?.split("T")[0].split("-");

    return `${date[1]}/${date[2]}/${date[0]} ${time}`;
  };

  const onClick = (event) => {
    setDataOrStation("station");
    const index = getElementsAtEvent(chartRef.current, event)[0]?.index;

    if(balansOrgId == undefined){
      if (index == 0) {
        setTableTitle("Batareya quvvati 90% dan ko'p bo'lgan stansiyalar");
        // ! LIMIT
        customFetch
          .get(
          `/last-data/getGreaterAndLessByStations?great=89&page=1&perPage=10&less=101`)
          .then((data) => setViewStationByCharLimit(data.data.data.data));

        // !----------------------------------------------------------------

        customFetch
          .get(`/last-data/getGreaterAndLessByStations?great=89&less=101`)
          .then((data) => setViewStationByChar(data.data.data.data));
      } else if (index == 1) {
        setTableTitle("Batareya quvvati 75% dan ko'p bo'lgan stansiyalar");

        // ! LIMIT
        customFetch
          .get(
          `/last-data/getGreaterAndLessByStations?great=74&page=1&perPage=10&less=90`)
          .then((data) => setViewStationByCharLimit(data.data.data.data));

        // !----------------------------------------------------------------

        customFetch
          .get(`/last-data/getGreaterAndLessByStations?great=74&less=90`)
          .then((data) => setViewStationByChar(data.data.data.data));
      } else if (index == 2) {
        setTableTitle("Batareya quvvati 50% dan ko'p bo'lgan stansiyalar");

        // ! LIMIT
        customFetch
          .get(
          `/last-data/getGreaterAndLessByStations?great=49&page=1&perPage=10&less=75`)
          .then((data) => setViewStationByCharLimit(data.data.data.data));

        // !----------------------------------------------------------------

        customFetch
          .get(`/last-data/getGreaterAndLessByStations?great=49&less=75`)
          .then((data) => setViewStationByChar(data.data.data.data));
      } else if (index == 3) {
        setTableTitle("Batareya quvvati 25% dan ko'p bo'lgan stansiyalar");

        // ! LIMIT
        customFetch
          .get(
          `/last-data/getGreaterAndLessByStations?great=24&page=1&perPage=10&less=50`)
          .then((data) => setViewStationByCharLimit(data.data.data.data));

        // !----------------------------------------------------------------

        customFetch
          .get(`/last-data/getGreaterAndLessByStations?great=24&less=50`)
          .then((data) => setViewStationByChar(data.data.data.data));
      } else if (index == 4) {
        setTableTitle("Batareya quvvati 25% dan kam bo'lgan stansiyalar");

        // ! LIMIT
        customFetch
          .get(
          `/last-data/getGreaterAndLessByStations?great=-1&page=1&perPage=10&less=25`)
          .then((data) => setViewStationByCharLimit(data.data.data.data));

        // !----------------------------------------------------------------

        customFetch
          .get(`/last-data/getGreaterAndLessByStations?great=-1&less=25`)
          .then((data) => setViewStationByChar(data.data.data.data));
      }
    }else {
      if (index == 0) {
        setTableTitle("Batareya quvvati 90% dan ko'p bo'lgan stansiyalar");
        // ! LIMIT
        customFetch
          .get(
          `/last-data/getGreaterAndLessByOrganization?great=89&page=1&perPage=10&less=101&organization=${balansOrgId}`)
          .then((data) => setViewStationByCharLimit(data.data.data.data));

        // !----------------------------------------------------------------

        customFetch
          .get(`/last-data/getGreaterAndLessByOrganization?great=89&less=101&organization=${balansOrgId}`)
          .then((data) => setViewStationByChar(data.data.data.data));
      } else if (index == 1) {
        setTableTitle("Batareya quvvati 75% dan ko'p bo'lgan stansiyalar");

        // ! LIMIT
        customFetch
          .get(
          `/last-data/getGreaterAndLessByOrganization?great=74&page=1&perPage=10&less=90&organization=${balansOrgId}`)
          .then((data) => setViewStationByCharLimit(data.data.data.data));

        // !----------------------------------------------------------------

        customFetch
          .get(`/last-data/getGreaterAndLessByOrganization?great=74&less=90&organization=${balansOrgId}`)
          .then((data) => setViewStationByChar(data.data.data.data));
      } else if (index == 2) {
        setTableTitle("Batareya quvvati 50% dan ko'p bo'lgan stansiyalar");

        // ! LIMIT
        customFetch
          .get(
          `/last-data/getGreaterAndLessByOrganization?great=49&page=1&perPage=10&less=75&organization=${balansOrgId}`)
          .then((data) => setViewStationByCharLimit(data.data.data.data));

        // !----------------------------------------------------------------

        customFetch
          .get(`/last-data/getGreaterAndLessByOrganization?great=49&less=75&organization=${balansOrgId}`)
          .then((data) => setViewStationByChar(data.data.data.data));
      } else if (index == 3) {
        setTableTitle("Batareya quvvati 25% dan ko'p bo'lgan stansiyalar");

        // ! LIMIT
        customFetch
          .get(
          `/last-data/getGreaterAndLessByOrganization?great=24&page=1&perPage=10&less=50&organization=${balansOrgId}`)
          .then((data) => setViewStationByCharLimit(data.data.data.data));

        // !----------------------------------------------------------------

        customFetch
          .get(`/last-data/getGreaterAndLessByOrganization?great=24&less=50&organization=${balansOrgId}`)
          .then((data) => setViewStationByChar(data.data.data.data));
      } else if (index == 4) {
        setTableTitle("Batareya quvvati 25% dan kam bo'lgan stansiyalar");

        // ! LIMIT
        customFetch
          .get(
          `/last-data/getGreaterAndLessByOrganization?great=-1&page=1&perPage=10&less=25&organization=${balansOrgId}`)
          .then((data) => setViewStationByCharLimit(data.data.data.data));

        // !----------------------------------------------------------------

        customFetch
          .get(`/last-data/getGreaterAndLessByOrganization?great=-1&less=25&organization=${balansOrgId}`)
          .then((data) => setViewStationByChar(data.data.data.data));
      }
    }
  };

  //! SAVE DATA EXCEL
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

    if (dataOrStation == "data") {
      const resultExcelData = [];

      viewStation.forEach((e) => {
        resultExcelData.push({
          nomi:
            whichStation == "allStation" || whichStation == "notWorkStation"
              ? e.name
              : e.stations.name,
          imei:
            whichStation == "allStation" || whichStation == "notWorkStation"
              ? e.imel
              : e.stations.imel,
          battery:
            whichStation == "allStation" || whichStation == "notWorkStation"
              ? e.battery
              : e.stations.battery,
          lokatsiya:
            whichStation == "allStation" || whichStation == "notWorkStation"
              ? e.location
              : e.stations.location,
          programma_versiyasi:
            whichStation == "allStation" || whichStation == "notWorkStation"
              ? e.programVersion
              : e.stations.programVersion,
          qurilma_telefon_raqami:
            whichStation == "allStation" || whichStation == "notWorkStation"
              ? e.devicePhoneNum
              : e.stations.devicePhoneNum,
          status:
            whichStation == "allStation" || whichStation == "notWorkStation"
              ? e.status == 1
                ? "ishlayapti"
                : "ishlamayapti"
              : e.stations.status == 1
              ? "ishlayapti"
              : "ishlamayapti",
          integratsiya:
            whichStation == "allStation" || whichStation == "notWorkStation"
              ? e?.isIntegration == true
                ? "Qilingan"
                : "Qilinmagan"
              : e.stations.isIntegration == true
              ? "Qilingan"
              : "Qilinmagan",
          [sath]:
            whichStation == "allStation" || whichStation == "notWorkStation"
              ? Array.isArray(e.lastData) && e.lastData[0]?.level == undefined
                ? "-"
                : Array.isArray(e.lastData) && e.lastData[0]?.level != undefined
                ? Number(e.lastData[0]?.level).toFixed(2)
                : Array.isArray(e.lastData) == false && e.lastData?.level == undefined
                ? "-"
                : Array.isArray(e.lastData) == false && e.lastData?.level != undefined
                ? Number(e.lastData?.level).toFixed(2)
                : null
              : Number(e.level).toFixed(2),
          [shurlanish]:
            whichStation == "allStation" || whichStation == "notWorkStation"
              ? Array.isArray(e.lastData) && e.lastData[0]?.conductivity == undefined
                ? "-"
                : Array.isArray(e.lastData) && e.lastData[0]?.conductivity != undefined
                ? Number(e.lastData[0]?.conductivity).toFixed(2)
                : Array.isArray(e.lastData) == false && e.lastData?.conductivity == undefined
                ? "-"
                : Array.isArray(e.lastData) == false && e.lastData?.conductivity != undefined
                ? Number(e.lastData?.conductivity).toFixed(2)
                : null
              : Number(e.conductivity).toFixed(2),
          [temperatura]:
            whichStation == "allStation" || whichStation == "notWorkStation"
              ? Array.isArray(e.lastData) && e.lastData[0]?.temp == undefined
                ? "-"
                : Array.isArray(e.lastData) && e.lastData[0]?.temp != undefined
                ? Number(e.lastData[0]?.temp).toFixed(2)
                : Array.isArray(e.lastData) == false && e.lastData?.temp == undefined
                ? '-'
                : Array.isArray(e.lastData) == false && e.lastData?.temp != undefined
                ? Number(e.lastData?.temp).toFixed(2)
                : null
              : Number(e.temp).toFixed(2),
          sana:
            whichStation == "allStation" || whichStation == "notWorkStation"
              ? Array.isArray(e.lastData) && e.lastData[0]?.date == undefined
                ? "-"
                : Array.isArray(e.lastData) && e.lastData[0]?.date != undefined
                ? e.lastData[0]?.date
                : Array.isArray(e.lastData) == false && e.lastData?.date == undefined
                ? '-'
                : Array.isArray(e.lastData) == false && e.lastData?.date != undefined
                ? e.lastData?.date
                : null
              : e.date,
        });
      });

      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(resultExcelData);

      XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

      if (viewStation.length > 0) {
        XLSX.writeFile(
          workBook,
          `${tableTitleStation} ${tableTitle} ${resultDate}.xlsx`
        );
      }
    } else if (dataOrStation == "station") {
      const resultExcelData = [];

      viewStationByChar.forEach((e) => {
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
          date: e.date,
        });
      });

      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(resultExcelData);

      XLSX.utils.book_append_sheet(workBook, workSheet, "MySheet1");

      if (viewStationByChar.length > 0) {
        XLSX.writeFile(
          workBook,
          `${tableTitleStation} ${tableTitle} ${resultDate}.xlsx`
        );
      }
    }
  };

  const checkStationWorkingOrNot = (value) => {
    const presentDate = new Date();
    let startDate = new Date(value);
    startDate.setHours(startDate.getHours() - 5);

    if (value == undefined) {
      return "undefined";
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
      startDate.getFullYear() == presentDate.getFullYear() &&
      presentDate.getMonth() - startDate.getMonth() == 1 &&
      presentDate.getDate() - startDate.getDate() <= 0
    ) {
      return 5;
    } else if (
      (startDate.getFullYear() == presentDate.getFullYear() &&
        presentDate.getMonth() - startDate.getMonth() >= 1 &&
        presentDate.getDate() - startDate.getDate() >= 0) ||
      startDate.getFullYear() <= presentDate.getFullYear()
    ) {
      return "after one month";
    }
  };

  const loaderFunc = () => {
    setLoader(true);

    setTimeout(() => {
      setLoader(false);
    }, 500);
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
    setTableTitleStation(`${foundBalansOrgName(id)}ga tegishli stansiyalar`)
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

    // ! STATISTIC STATION BATTERY BY BALANS ORGANISATION
    if(id == undefined){
      customFetch
      .get(`/stations/getStatisticStationsByBattery`)
      .then((data) => setStationBattery(data.data.data));
    }else {
      customFetch
      .get(`/stations/getStatisticStationsBatteryByOrganization?organization=${id}`)
      .then((data) => setStationBattery(data.data.data));
    }
  }

  const items = stationStatisticAll?.gruopRegion?.map((e, i) => {
    return  <div className="sort-dashboard-list-item ms-3" onClick={(s) => {
      setBalansOrgId(e.balance_organization_id)
      getStationStatisByBalansOrg(e.balance_organization_id)
      setWhichStation('allStation')
      setTableTitle("Umumiy stansiyalar soni");
      setDataOrStation('data')
      loaderFunc()
    }}>
       <div className="sort-dashboard-wrapper">
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

  return (
    <section className="p-0">
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
            <div className="modal-header d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between w-100">
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
              <div
                className="ms-auto d-flex align-items-center justify-content-end cursor-pointer mt-2"
                onClick={() => exportDataToExcel()}
              >
                <p className="m-0 p-0 user-station-save-data-desc">
                  Ma'lumotni saqlash
                </p>
                <button className="ms-3 border border-0">
                  <img src={excel} alt="excel" width={26} height={30} />
                </button>
              </div>
            </div>
            <div className="modal-body mb-5">
              {dataOrStation == "data" ? (
                <table className="table mt-4">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        Nomi
                      </th>
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        Batareya (%)
                      </th>
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        Sath (sm)
                      </th>
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        Sho'rlanish (g/l)
                      </th>
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        Temperatura (°C)
                      </th>
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        {whichStation == "todayStation" ? "Vaqt" : "Sana"}
                      </th>
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        Vazirlik bilan integratsiya
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewStation?.map((e, i) => {
                      return whichStation == "allStation" ||
                        whichStation == "notWorkStation" ? (
                          Array.isArray(e.lastData) == true ?
                        <tr key={i}>
                          <td className={`text-center fw-bold`}>
                            <span>
                              {e?.name}
                            </span>
                            {
                              e.status == 1 && e.defective == true ?
                              <img className="cursor-pointer" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" src={warning} alt="warning" width={35} height={35} />
                              : null
                            }
                          </td>
                          <td className={`text-center fw-bold`}>
                            {e?.battery}
                          </td>
                          <td className={`text-center fw-bold`}>
                            {
                              whichStation != 'notWorkStation'
                              ?
                              e.lastData[0]?.level != undefined
                              ? Number(e.lastData[0]?.level).toFixed(2)
                              : "-"
                              : '-'
                            }
                          </td>
                          <td className={`text-center fw-bold`}>
                            {
                              whichStation != 'notWorkStation'
                              ?
                              e.lastData[0]?.conductivity != undefined
                              ? Number(e.lastData[0]?.conductivity).toFixed(2)
                              : "-"
                              :
                              '-'
                            }
                          </td>
                          <td className={`text-center fw-bold`}>
                            {
                              whichStation != 'notWorkStation'
                              ?
                              e.lastData[0]?.temp != undefined
                              ? Number(e.lastData[0]?.temp).toFixed(2)
                              : "-"
                              : '-'
                            }
                          </td>
                          {
                            whichStation != 'notWorkStation'
                            ?
                            <td
                              className={`text-center fw-bold ${
                                checkStationWorkingOrNot(e.lastData[0]?.date) == 0
                                  ? "color-green"
                                  : checkStationWorkingOrNot(e.lastData[0]?.date) <=
                                    3
                                  ? "color-azeu"
                                  : checkStationWorkingOrNot(e.lastData[0]?.date) > 3
                                  ? "color-yellow"
                                  : checkStationWorkingOrNot(e.lastData[0]?.date) ==
                                    "after one month"
                                  ? "text-danger"
                                  : checkStationWorkingOrNot(e.lastData[0]?.date) ==
                                    "undefined"
                                  ? "text-danger"
                                  : "text-danger"
                              }`}
                            >
                              {filteredStationDate(e.lastData[0]?.date)}
                            </td>
                          :
                          <td
                            className='text-center fw-bold text-danger'
                          >
                            -
                          </td>
                          }
                          <td
                            className={`text-center fw-bold ${
                              e?.isIntegration == false ? "text-danger" : null
                            }`}
                          >
                            {e?.isIntegration == true ? "Ha" : "Yo'q"}
                          </td>
                        </tr>
                        :
                        <tr key={i}>
                          <td className={`text-center fw-bold`}>
                            <span>
                              {e?.name}
                            </span>
                            {
                              e.status == 1 && e.defective == true ?
                              <img className="cursor-pointer" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" src={warning} alt="warning" width={35} height={35} />
                              : null
                            }
                          </td>
                          <td className={`text-center fw-bold`}>
                            {e?.battery}
                          </td>
                          <td className={`text-center fw-bold`}>
                            {
                              whichStation != 'notWorkStation'
                              ?
                              e.lastData?.level != undefined
                              ? Number(e.lastData?.level).toFixed(2)
                              : "-"
                              : '-'
                            }
                          </td>
                          <td className={`text-center fw-bold`}>
                            {
                              whichStation != 'notWorkStation'
                              ?
                              e.lastData?.conductivity != undefined
                              ? Number(e.lastData?.conductivity).toFixed(2)
                              : "-"
                              :
                              '-'
                            }
                          </td>
                          <td className={`text-center fw-bold`}>
                            {
                              whichStation != 'notWorkStation'
                              ?
                              e.lastData?.temp != undefined
                              ? Number(e.lastData?.temp).toFixed(2)
                              : "-"
                              : '-'
                            }
                          </td>
                          {
                            whichStation != 'notWorkStation'
                            ?
                            <td
                            className={`text-center fw-bold ${
                              checkStationWorkingOrNot(e.lastData?.date) == 0
                                ? "color-green"
                                : checkStationWorkingOrNot(e.lastData?.date) <=
                                  3
                                ? "color-azeu"
                                : checkStationWorkingOrNot(e.lastData?.date) > 3
                                ? "color-yellow"
                                : checkStationWorkingOrNot(e.lastData?.date) ==
                                  "after one month"
                                ? "text-danger"
                                : checkStationWorkingOrNot(e.lastData?.date) ==
                                  "undefined"
                                ? "text-danger"
                                : "text-danger"
                            }`}
                          >
                            {filteredStationDate(e.lastData?.date)}
                          </td>
                          :
                          <td
                            className='text-center fw-bold text-danger'
                          >
                            -
                          </td>
                          }
                          <td
                            className={`text-center fw-bold ${
                              e?.isIntegration == false ? "text-danger" : null
                            }`}
                          >
                            {e?.isIntegration == true ? "Ha" : "Yo'q"}
                          </td>
                        </tr>

                      ) : (
                        <tr key={i}>
                          <td className={`text-center fw-bold`}>
                            <span>
                            {e?.stations?.name}
                            </span>

                            {
                              e?.stations?.status == 1 && e?.stations?.defective == true ?
                              <img className="cursor-pointer" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" src={warning} alt="warning" width={35} height={35} />
                              : null
                            }
                          </td>
                          <td className={`text-center fw-bold`}>
                            {e?.stations?.battery}
                          </td>
                          <td className={`text-center fw-bold`}>
                            {e?.level != undefined
                              ? Number(e?.level).toFixed(2)
                              : "-"}
                          </td>
                          <td className={`text-center fw-bold`}>
                            {e?.conductivity != undefined
                              ? Number(e?.conductivity).toFixed(2)
                              : "-"}
                          </td>
                          <td className={`text-center fw-bold`}>
                            {e?.temp != undefined
                              ? Number(e?.temp).toFixed(2)
                              : "-"}
                          </td>
                          <td
                            className={`text-center fw-bold ${
                              whichStation == "todayStation"
                                ? "text-success"
                                : whichStation == "withinThreeDayStation"
                                ? "color-azeu"
                                : whichStation == "totalMonthWorkStation"
                                ? "color-yellow"
                                : whichStation == "totalMoreWorkStations"
                                ? "color-orange"
                                : null
                            }`}
                          >
                            {filteredStationDate(e?.date)}
                          </td>
                          <td
                            className={`text-center fw-bold ${
                              e?.stations?.isIntegration == false
                                ? "text-danger"
                                : null
                            }`}
                          >
                            {e?.stations?.isIntegration == true ? "Ha" : "Yo'q"}
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
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        Nomi
                      </th>
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        Imei
                      </th>
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        Batareya (%)
                      </th>
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        Signal
                      </th>
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        {whichStation == "todayStation" ? "Vaqt" : "Sana"}
                      </th>
                      <th
                        scope="col"
                        className="text-center user-dashboard-table-thead fw-bold"
                      >
                        Vazirlik bilan integratsiya
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewStationByChar?.map((e, i) => {
                      return (
                        <tr key={i}>
                          <td className="text-center fw-bold">
                            <span>
                             {e?.name}
                            </span>
                            {
                              e.status == 1 && e.defective == true ?
                              <img className="cursor-pointer" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" src={warning} alt="warning" width={35} height={35} />
                              : null
                            }
                          </td>
                          <td className="text-center fw-bold">{e.imel}</td>
                          <td className="text-center fw-bold">{e.battery}</td>
                          <td className="text-center fw-bold">{e.signal}</td>
                          <td className="text-center fw-bold">{e.status}</td>
                          <td className="text-center fw-bold">
                            {filteredStationDateByChar(e?.date)}
                          </td>
                          <td
                            className={`text-center fw-bold ${
                              e.isIntegration == false ? "text-danger" : null
                            }`}
                          >
                            {e.isIntegration == true ? "Ha" : "Yo'q"}
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

      <div className="container-fluid p-0">
        <section className="section-dashboard">
          {viewStation?.length > 0 ? (
            <div className="container-fluid p-0">
              <div className="user-dashboard-top-wrapper">
              <div className="d-flex align-items-center mb-4 pt-3">
                    <div className="dashboard-statis-top w-100 d-flex align-items-center justify-content-between flex-wrap">
                      <h1 className="dashboard-heading ms-2 dashboard-heading-role">
                        Jami balans tashkilotlari
                      </h1>
                      <div className="region-heading-statis-wrapper d-flex flex-wrap cursor" onClick={() => {
                        setBalansOrgId(undefined)
                        getStationStatisByBalansOrg()
                        setWhichStation("allStation");
                        setTableTitle("Umumiy stansiyalar soni");
                        setTableTitleStation("Jami stansiyalar");
                        setDataOrStation('data')
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
                  <h1 className="dashboard-heading ms-2">
                    {tableTitleStation}
                  </h1>

                      <div className="region-heading-statis-wrapper d-flex flex-wrap cursor">
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

                <ul className="dashboard-list list-unstyled m-0 d-flex flex-wrap align-items-center justify-content-between">
                  {stationStatistic?.totalStationsCount > 0 ? (
                    <li
                      className="dashboard-list-item mt-3 d-flex"
                      onClick={() => {
                        setWhichStation("allStation");
                        setTableTitle("Umumiy stansiyalar soni");
                        setDataOrStation("data");
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
                      className="dashboard-list-item d-flex mt-3"
                      onClick={() => {
                        setWhichStation("todayStation");
                        setTableTitle("Bugun ishlayotganlar stansiyalar");
                        setDataOrStation("data");
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
                      className="dashboard-list-item mt-3 d-flex"
                      onClick={() => {
                        setWhichStation("withinThreeDayStation");
                        setTableTitle("3 kun ichida ishlagan stansiyalar");
                        setDataOrStation("data");
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
                      className="dashboard-list-item mt-3 d-flex"
                      onClick={() => {
                        setWhichStation("totalMoreWorkStations");
                        setTableTitle("Uzoq vaqt ishlamagan qurilmalar");
                        setDataOrStation("data");
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

                  {stationStatistic?.totalNotDataStationsCount > 0 ? (
                    <li
                      className="dashboard-list-item mt-3 d-flex"
                      onClick={() => {
                        setWhichStation("notWorkStation");
                        setTableTitle("Umuman ishlamagan stansiyalar");
                        setDataOrStation("data");
                        loaderFunc();
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
                  ) : null}
                </ul>
              </div>

              {loader ? (
                <div className="d-flex align-items-center justify-content-center hour-spinner-wrapper">
                  <span className="loader"></span>
                </div>
              ) : (
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
                            <th
                              scope="col"
                              className="text-center user-dashboard-table-thead"
                            >
                              Nomi
                            </th>
                            <th
                              scope="col"
                              className="text-center user-dashboard-table-thead"
                            >
                              Sath (sm)
                            </th>
                            <th
                              scope="col"
                              className="text-center user-dashboard-table-thead"
                            >
                              Sho'rlanish (g/l)
                            </th>
                            <th
                              scope="col"
                              className="text-center user-dashboard-table-thead"
                            >
                              Temperatura (°C)
                            </th>
                            <th
                              scope="col"
                              className="text-center user-dashboard-table-thead"
                            >
                              {whichStation == "todayStation" ? "Vaqt" : "Sana"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewStationLimit?.map((e, i) => {
                            return (
                              Array.isArray(e.lastData) == true ?
                              <tr key={i}>
                                <td className="text-center fw-bold">
                                  <span>
                                  {whichStation == "allStation" ||
                                  whichStation == "notWorkStation"
                                    ?
                                    <>
                                      <span>
                                        {e?.name}
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
                                        {e.stations?.name}
                                      </span>
                                      {
                                        e.stations?.status == 1 && e.stations?.defective == true ?
                                        <img className="cursor-pointer" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" src={warning} alt="warning" width={35} height={35} />
                                        : null
                                      }
                                    </>
                                    }
                                  </span>

                                </td>
                                <td className="text-center fw-bold">
                                  {whichStation == "allStation" &&
                                  e.lastData[0]?.level != undefined
                                    ? Number(e.lastData[0]?.level).toFixed(2)
                                    : e.level != undefined
                                    ? Number(e.level).toFixed(2)
                                    : "-"}
                                </td>
                                <td className="text-center fw-bold">
                                  {whichStation == "allStation" &&
                                  e.lastData[0]?.conductivity != undefined
                                    ? Number(e.lastData[0]?.conductivity).toFixed(
                                        2
                                      )
                                    : e.conductivity != undefined
                                    ? Number(e.conductivity).toFixed(2)
                                    : "-"}
                                </td>
                                <td className="text-center fw-bold">
                                  {whichStation == "allStation" &&
                                  e.lastData[0]?.temp != undefined
                                    ? Number(e.lastData[0]?.temp).toFixed(2)
                                    : e.temp != undefined
                                    ? Number(e.temp).toFixed(2)
                                    : "-"}
                                </td>
                                {whichStation == "allStation" ||
                                whichStation == "notWorkStation" ? (
                                  <td
                                    className={`text-center fw-bold ${
                                      checkStationWorkingOrNot(
                                        e.lastData[0]?.date
                                      ) == 0
                                        ? "color-green"
                                        : checkStationWorkingOrNot(
                                            e.lastData[0]?.date
                                          ) <= 3
                                        ? "color-azeu"
                                        : checkStationWorkingOrNot(
                                            e.lastData[0]?.date
                                          ) > 3
                                        ? "color-yellow"
                                        : checkStationWorkingOrNot(
                                            e.lastData[0]?.date
                                          ) == "after one month"
                                        ? "text-danger"
                                        : checkStationWorkingOrNot(
                                            e.lastData[0]?.date
                                          ) == "undefined"
                                        ? "text-danger"
                                        : "text-danger"
                                    }`}
                                  >
                                    {filteredStationDate(e.lastData[0]?.date)}
                                  </td>
                                ) : (
                                  <td
                                    className={`text-center fw-bold ${
                                      whichStation == "todayStation"
                                        ? "text-success"
                                        : whichStation ==
                                          "withinThreeDayStation"
                                        ? "color-azeu"
                                        : whichStation ==
                                          "totalMonthWorkStation"
                                        ? "color-yellow"
                                        : whichStation ==
                                          "totalMoreWorkStations"
                                        ? "color-orange"
                                        : whichStation == "notWorkStation"
                                        ? "text-danger"
                                        : null
                                    }`}
                                  >
                                    {filteredStationDate(e?.date)}
                                  </td>
                                )}
                              </tr>
                              :
                              <tr key={i}>
                                <td className="text-center fw-bold">
                                  {whichStation == "allStation" ||
                                  whichStation == "notWorkStation"
                                    ?
                                    <>
                                      <span>
                                        {e?.name}
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
                                        {e.stations?.name}
                                      </span>
                                      {
                                        e.stations?.status == 1 && e.stations?.defective == true ?
                                        <img className="cursor-pointer" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" src={warning} alt="warning" width={35} height={35} />
                                        : null
                                      }
                                    </>

                                    }
                                </td>
                                <td className="text-center fw-bold">
                                  {whichStation == "allStation" &&
                                  e.lastData?.level != undefined
                                    ? Number(e.lastData?.level).toFixed(2)
                                    : e.level != undefined
                                    ? Number(e.level).toFixed(2)
                                    : "-"}
                                </td>
                                <td className="text-center fw-bold">
                                  {whichStation == "allStation" &&
                                  e.lastData?.conductivity != undefined
                                    ? Number(e.lastData?.conductivity).toFixed(
                                        2
                                      )
                                    : e.conductivity != undefined
                                    ? Number(e.conductivity).toFixed(2)
                                    : "-"}
                                </td>
                                <td className="text-center fw-bold">
                                  {whichStation == "allStation" &&
                                  e.lastData?.temp != undefined
                                    ? Number(e.lastData?.temp).toFixed(2)
                                    : e.temp != undefined
                                    ? Number(e.temp).toFixed(2)
                                    : "-"}
                                </td>
                                {whichStation == "allStation" ||
                                whichStation == "notWorkStation" ? (
                                  <td
                                    className={`text-center fw-bold ${
                                      checkStationWorkingOrNot(
                                        e.lastData?.date
                                      ) == 0
                                        ? "color-green"
                                        : checkStationWorkingOrNot(
                                            e.lastData?.date
                                          ) <= 3
                                        ? "color-azeu"
                                        : checkStationWorkingOrNot(
                                            e.lastData?.date
                                          ) > 3
                                        ? "color-yellow"
                                        : checkStationWorkingOrNot(
                                            e.lastData?.date
                                          ) == "after one month"
                                        ? "text-danger"
                                        : checkStationWorkingOrNot(
                                            e.lastData?.date
                                          ) == "undefined"
                                        ? "text-danger"
                                        : "text-danger"
                                    }`}
                                  >
                                    {filteredStationDate(e.lastData?.date)}
                                  </td>
                                ) : (
                                  <td
                                    className={`text-center fw-bold ${
                                      whichStation == "todayStation"
                                        ? "text-success"
                                        : whichStation ==
                                          "withinThreeDayStation"
                                        ? "color-azeu"
                                        : whichStation ==
                                          "totalMonthWorkStation"
                                        ? "color-yellow"
                                        : whichStation ==
                                          "totalMoreWorkStations"
                                        ? "color-orange"
                                        : whichStation == "notWorkStation"
                                        ? "text-danger"
                                        : null
                                    }`}
                                  >
                                    {filteredStationDate(e?.date)}
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <table className="table mt-4">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="text-center user-dashboard-table-thead"
                            >
                              Nomi
                            </th>
                            <th
                              scope="col"
                              className="text-center user-dashboard-table-thead"
                            >
                              Batareya (%)
                            </th>
                            <th
                              scope="col"
                              className="text-center user-dashboard-table-thead"
                            >
                              Signal
                            </th>
                            <th
                              scope="col"
                              className="text-center user-dashboard-table-thead"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="text-center user-dashboard-table-thead"
                            >
                              {whichStation == "todayStation" ? "Vaqt" : "Sana"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewStationByCharLimit?.map((e, i) => {
                            return (
                              <tr key={i}>
                                <td className="text-center fw-bold">
                                  <span>
                                    {e?.name}
                                  </span>
                                  {
                                    e.status == 1 && e.defective == true ?
                                    <img className="cursor-pointer" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" src={warning} alt="warning" width={35} height={35} />
                                    : null
                                  }
                                </td>
                                <td className="text-center fw-bold">
                                  {e.battery}
                                </td>
                                <td className="text-center fw-bold">
                                  {e.signal}
                                </td>
                                <td className="text-center fw-bold">
                                  {e.status}
                                </td>
                                <td className="text-center fw-bold">
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
              )}
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
      </div>
    </section>
  );
};

export default AdminDashboard;
