import React, { useState } from "react";
import battery from "../../assets/images/battery.png";
import batteryPow from "../../assets/images/battery-70.png";
import batteryLow from "../../assets/images/battery-40.png";
import batteryRed from "../../assets/images/battery-30.png";
import close from "../../assets/images/close-black.png";
import "./UserLastData.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../Api/Api";
import ReactPaginate from "react-paginate";

const UserLastData = (prop) => {
  const [countNews, setCountNews] = useState(5);
  const [countStationName, setStationName] = useState();
  const [charge, setCharge] = useState(82);
  const [modalMap, setModalMap] = useState(false);
  const [allStation, setAllStation] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const { balanceOrg } = prop;
  const name = window.localStorage.getItem("name");

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

  const handlePageChange = (selectedPage) => {
    fetch(
      `${api}/last-data/allLastData?page=${
        selectedPage.selected + 1
      }&perPage=12`,
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
        console.log(data.data);
        setAllStation(data.data);
      });
  };

  const returnFixdDate = (item) => {
    const date = `${new Date(item).getDate()}/${
      new Date(item).getMonth() + 1
    }/${new Date(item).getFullYear()} ${new Date(item).getHours()}:${new Date(
      item
    ).getMinutes()}`;

    console.log(date);
    return date;
  };

  console.log(allStation);
  return (
    <div className="card">
      <div className="card-body pt-3">
        <div className="tab-content">
          <div
            className="tab-pane fade show active profile-users user-last-data-table-wrapper"
            id="profile-users"
          >
            <h1 className="mt-4 mb-3 user-lastdata-heading">
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
            <ol className="user-last-data-list list-unstyled m-0 mt-4 mb-4 d-flex align-items-center justify-content-between flex-wrap">
              {allStation.map((e, i) => {
                return (
                  <li className="user-last-data-list-item mt-4" key={i}>
                    <a onClick={() => navigate("/user/lastdata/news")}>
                      <div className="user-last-data-list-item-top d-flex align-items-center justify-content-between">
                        <h3 className="fs-5 m-0">{e.name}</h3>
                        <div className="d-flex align-items-center justify-content-between">
                          <p
                            className={
                              "m-0 me-1 " +
                              (e.battery > 70
                                ? "text-success"
                                : e.battery <= 70 && e.battery >= 50
                                ? "text-warning"
                                : e.battery < 50
                                ? "text-danger"
                                : "")
                            }
                          >
                            {e.battery}%
                          </p>
                          <img
                            src={
                              e.battery >= 70
                                ? batteryPow
                                : (e.battery >= 30) & (e.battery < 70)
                                ? batteryLow
                                : e.battery < 30
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

                      <span className="d-flex justify-content-between">
                        <div>
                          <p className="m-0">
                            Sath: {Number(e.lastData?.level).toFixed()} sm
                          </p>
                          <p className="m-0">
                            Sho'rlanish:{" "}
                            {Number(e.lastData?.conductivity).toFixed()} g/l
                          </p>
                          <p className="m-0">
                            Temperatura: {Number(e.lastData?.temp).toFixed()} °C
                          </p>
                        </div>

                        <div className="d-flex align-items-end">
                          <p className="m-0 user-last-data-desc-date">{returnFixdDate(e.date)}</p>
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
  );
};

export default UserLastData;
