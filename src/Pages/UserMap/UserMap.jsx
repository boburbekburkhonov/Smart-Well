import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
  MarkerClusterer,
} from "@react-google-maps/api";
import "./UserMap.css";
import circleBlue from "../../assets/images/record.png";
import circleRed from "../../assets/images/circle-red.png";
import locationRed from "../../assets/images/location-red.png";
import locationGreen from "../../assets/images/location-green.png";
import locationYellow from "../../assets/images/location-yellow.png";
import locationOrange from "../../assets/images/location-orange.png";
import { api } from "../Api/Api";

const UserMap = () => {
  const [lastData, setLastData] = useState([]);
  const [lastDataForList, setLastDataForList] = useState([]);
  const [oneLastData, setOneLastData] = useState([]);
  const [count, setCount] = useState(1);
  const [zoom, setZoom] = useState(6);
  const [active, setActive] = useState(-1);
  const [location, setLocation] = useState({
    lat: 42.00000000048624,
    lng: 63.999999999999986,
  });
  const [activeMarker, setActiveMarker] = useState();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey:
      "AIzaSyC57hT2pRJZ4Gh85ai0sUjP72i7VYJxTHc&region=UZ&language=uz",
  });
  const center = useMemo(() => location, [count]);

  useEffect(() => {
    const userMap = async () => {
      const request = await fetch(
        `${api}/last-data/allLastData?page=1&perPage=100`,
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

      setLastData(response[0].data);
      setLastDataForList(response[0].data);
    };

    userMap();
  }, []);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
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
    }
  };

  const changeDataWithInput = (inputValue) => {
    const search = lastData.filter((e) =>
      e.station.name.toLowerCase().includes(inputValue)
    );
    setLastDataForList(search);
    setActive(null);
  };

  const zoomLocation = (station) => {
    setOneLastData([station]);
    setCount(count + 1);
    const lat = Number(station.station.location.split("-")[0]);
    const lng = Number(station.station.location.split("-")[1]);
    setLocation({ lat: lat, lng: lng });
    setZoom(14);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <div className="card">
        <div className="d-flex justify-content-between">
          <GoogleMap
            zoom={zoom}
            center={center}
            mapContainerClassName="map-container"
          >
            {lastData?.length > 0 && (
              <MarkerClusterer>
                {(clusterer) =>
                  lastData?.map((e, i) => {
                    return (
                      <MarkerF
                        clusterer={clusterer}
                        key={i}
                        position={{
                          lat: Number(e.station.location?.split("-")[0]),
                          lng: Number(e.station.location?.split("-")[1]),
                        }}
                        title={e.station.name}
                        onClick={() => handleActiveMarker(e._id)}
                      >
                        {activeMarker == e._id ? (
                          <InfoWindowF
                            className="w-100"
                            onCloseClick={() => {
                              setActiveMarker(null);
                            }}
                            options={{ maxWidth: "240" }}
                          >
                            {e.level != undefined ? (
                              <div>
                                <h3 className="fw-semibold text-success fs-6">
                                  {e.station.name}
                                </h3>

                                <div className="d-flex align-items-center mb-1">
                                  <img
                                    src={circleBlue}
                                    alt="circleBlue"
                                    width={12}
                                    height={12}
                                  />
                                  <p className="m-0 infowindow-desc ms-1 me-1 ">
                                    Daraja:
                                  </p>{" "}
                                  <span className="infowindow-span">
                                    {e.level}
                                  </span>
                                </div>

                                <div className="d-flex align-items-center mb-1">
                                  <img
                                    src={circleBlue}
                                    alt="circleBlue"
                                    width={12}
                                    height={12}
                                  />
                                  <p className="infowindow-desc m-0 ms-1 me-1">
                                    O'tkazuvchanlik:
                                  </p>{" "}
                                  <span className="infowindow-span">
                                    {e.conductivity}
                                  </span>
                                </div>

                                <div className="d-flex align-items-center mb-1">
                                  <img
                                    src={circleBlue}
                                    alt="circleBlue"
                                    width={12}
                                    height={12}
                                  />
                                  <p className="m-0 infowindow-desc ms-1 me-1 ">
                                    Temperatura:
                                  </p>{" "}
                                  <span className="infowindow-span">
                                    {e.temp} °C
                                  </span>
                                </div>

                                <div className="d-flex align-items-center">
                                  <img
                                    src={circleBlue}
                                    alt="circleBlue"
                                    width={12}
                                    height={12}
                                  />
                                  <p className="m-0 infowindow-desc ms-1 me-1">
                                    Sana:
                                  </p>{" "}
                                  <span className="infowindow-span">
                                    {e.date.split("-")[0]}/
                                    {e.date.split("-")[1]}/
                                    {e.date.split("-")[2].slice(0, 2)}{" "}
                                    {e.date.split("T")[1].split(":")[0]}:
                                    {e.date.split("T")[1].split(":")[1]}:
                                    {e.date
                                      .split("T")[1]
                                      .split(":")[2]
                                      .slice(0, 2)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h3 className="fw-semibold text-success fs-6 text-center">
                                  {e.station.name}
                                </h3>
                                <div className="d-flex align-items-center justify-content-center">
                                  <img
                                    src={circleRed}
                                    alt="circleBlue"
                                    width={18}
                                    height={18}
                                  />
                                  <p className="m-0 infowindow-desc-not-last-data fs-6 ms-1 me-1 ">
                                    Ma'lumot kelmagan...
                                  </p>
                                </div>{" "}
                              </div>
                            )}
                          </InfoWindowF>
                        ) : null}
                      </MarkerF>
                    );
                  })
                }
              </MarkerClusterer>
            )}

            {oneLastData?.map((e, i) => {
              return (
                <MarkerF
                  key={i}
                  position={{
                    lat: Number(e.station.location?.split("-")[0]),
                    lng: Number(e.station.location?.split("-")[1]),
                  }}
                  title={e.station.name}
                  onClick={() => handleActiveMarker(e._id)}
                >
                  {activeMarker == e._id ? (
                    <InfoWindowF
                      className="w-100"
                      onCloseClick={() => {
                        setActiveMarker(null);
                      }}
                      options={{ maxWidth: "240" }}
                    >
                      {e.level != undefined ? (
                        <div>
                          <h3 className="fw-semibold text-success fs-6">
                            {e.station.name}
                          </h3>

                          <div className="d-flex align-items-center mb-1">
                            <img
                              src={circleBlue}
                              alt="circleBlue"
                              width={12}
                              height={12}
                            />
                            <p className="m-0 infowindow-desc ms-1 me-1 ">
                              Daraja:
                            </p>{" "}
                            <span className="infowindow-span">{e.level}</span>
                          </div>

                          <div className="d-flex align-items-center mb-1">
                            <img
                              src={circleBlue}
                              alt="circleBlue"
                              width={12}
                              height={12}
                            />
                            <p className="infowindow-desc m-0 ms-1 me-1">
                              O'tkazuvchanlik:
                            </p>{" "}
                            <span className="infowindow-span">
                              {e.conductivity}
                            </span>
                          </div>

                          <div className="d-flex align-items-center mb-1">
                            <img
                              src={circleBlue}
                              alt="circleBlue"
                              width={12}
                              height={12}
                            />
                            <p className="m-0 infowindow-desc ms-1 me-1 ">
                              Temperatura:
                            </p>{" "}
                            <span className="infowindow-span">{e.temp} °C</span>
                          </div>

                          <div className="d-flex align-items-center">
                            <img
                              src={circleBlue}
                              alt="circleBlue"
                              width={12}
                              height={12}
                            />
                            <p className="m-0 infowindow-desc ms-1 me-1">
                              Sana:
                            </p>{" "}
                            <span className="infowindow-span">
                              {e.date.split("-")[0]}/{e.date.split("-")[1]}/
                              {e.date.split("-")[2].slice(0, 2)}{" "}
                              {e.date.split("T")[1].split(":")[0]}:
                              {e.date.split("T")[1].split(":")[1]}:
                              {e.date.split("T")[1].split(":")[2].slice(0, 2)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="fw-semibold text-success fs-6 text-center">
                            {e.station.name}
                          </h3>
                          <div className="d-flex align-items-center justify-content-center">
                            <img
                              src={circleRed}
                              alt="circleBlue"
                              width={18}
                              height={18}
                            />
                            <p className="m-0 infowindow-desc-not-last-data fs-6 ms-1 me-1 ">
                              Ma'lumot kelmagan...
                            </p>
                          </div>{" "}
                        </div>
                      )}
                    </InfoWindowF>
                  ) : null}
                </MarkerF>
              );
            })}
          </GoogleMap>

          <div className="map-station-wrapper-list">
            <h5 className="m-0 text-center py-3 text-primary cite-main-color">
              Umumiy stansiyalar{" "}
              <span className="text-danger fw-semibold">
                {lastData?.length}
              </span>{" "}
              ta
            </h5>
            <div className="admin-map-search">
              <h5 className="text-primary cite-main-color">Qidiruv</h5>
              <input
                onChange={(e) =>
                  changeDataWithInput(e.target.value.toLowerCase())
                }
                type="text"
                className="form-control"
                placeholder="search..."
              />
            </div>
            <ul className="list-group list-unstyled m-0">
              {lastDataForList?.map((e, i) => {
                return (
                  <li
                    className={`list-group-item list-group-item-action d-flex align-items-center ${
                      active == i ? "active-user-map" : ""
                    }`}
                    key={i}
                    onClick={() => {
                      setActive(i);
                      zoomLocation(e);
                    }}
                  >
                    <img
                      src={
                        checkStationWorkingOrNot(e) == 0
                          ? locationGreen
                          : checkStationWorkingOrNot(e) <= 3
                          ? locationYellow
                          : checkStationWorkingOrNot(e) == 404
                          ? locationRed
                          : locationOrange
                      }
                      alt="circleBlue"
                      width={25}
                      height={25}
                    />
                    <p className="m-0 ms-2">{e.station.name}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMap;