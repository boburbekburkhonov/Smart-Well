import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminUser.css";
import close from "../../assets/images/close.png";
import attach from "../../assets/images/attach.png";
import { api } from "../Api/Api";

const AdminUser = () => {
  const [role, setRole] = useState([]);
  const [users, setUsers] = useState([]);
  const [allStations, setAllStations] = useState([]);
  const [allStationsForUser, setAllStationsForUser] = useState([]);
  const [allUserStations, setAllUserStations] = useState([]);
  const [userStationsIdList, setUserStationsIdList] = useState([]);
  const [allRegions, setAllRegions] = useState([]);
  let [stationIndexForAttach, setStationIndexForAttach] = useState([]);
  const [count, setCount] = useState(0);
  const [countForRegion, setCountForRegion] = useState(0);
  const [userOneWithId, setUserOneWithId] = useState({});
  const [roleOneWithId, setRoleOneWithId] = useState({});
  const [changeUserId, setChangeUserId] = useState();
  const [changeRoleId, setChangeRoleId] = useState();
  const [changeRoleName, setChangeRoleName] = useState();

  useEffect(() => {
    const findAllRoles = async () => {
      const request = await fetch(`${api}/users/find-all-roles`, {
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

      setRole(response.data);
    };

    findAllRoles();
  }, [count]);

  useEffect(() => {
    fetch(`${api}/users/find-all-users`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode == 200) {
          setUsers(data.data);
        }
      });

    fetch(`${api}/stations/all`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode == 200) {
          setAllStationsForUser(data.data);
        }
      });
  }, [count]);

  useEffect(() => {
    const fetchStationByRegion = async () => {
      setAllRegions([]);
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
        `${api}/stations/all/regions?regionNumber=${responseRegionAll.regions[0].id}`,
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
      setAllStations(response.data);
    };

    fetchStationByRegion();
  }, [countForRegion]);

  // !USER CREATE
  const createUser = (e) => {
    e.preventDefault();

    const {
      nameCreate,
      usernameCreate,
      passwordCreate,
      phoneNumberCreate,
      roleCreate,
    } = e.target;

    fetch(`${api}/users/create-user`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        name: nameCreate.value,
        phoneNumber: phoneNumberCreate.value,
        login: usernameCreate.value,
        password: passwordCreate.value,
        role: roleCreate.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode == 200) {
          setCount(count + 1);
          toast.success("User muvaffaqqiyatli yaratildi!");
        }
      });

    nameCreate.value = "";
    phoneNumberCreate.value = "";
    usernameCreate.value = "";
    passwordCreate.value = "";
  };

  // !USER UPDATE
  const updateUser = (e) => {
    e.preventDefault();

    const { nameUser, usernameUser, phoneNumberUser, roleUser } = e.target;

    fetch(`${api}/users/update-user`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        id: changeUserId,
        name: nameUser.value,
        login: usernameUser.value,
        phoneNumber: phoneNumberUser.value,
        roleId: roleUser.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode == 200) {
          setCount(count + 1);
          toast.success("User muvaffaqqiyatli yaratildi!");
        }
      });
  };

  // !USER DELETE
  const deleteUser = () => {
    fetch(`${api}/users/delete-user`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        id: changeUserId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode == 200) {
          setCount(count + 1);
          toast.error("User muvaffaqqiyatli o'chirildi!");
        }
      });
  };

  //! USER WITH ID
  const getUserWithId = (userId) => {
    const foundUser = users.find((e) => e._id == userId);
    setUserOneWithId(foundUser);
  };

  // !ROLE CREATE
  const createRole = (e) => {
    e.preventDefault();

    const { roleCreate } = e.target;

    fetch(`${api}/users/create-role`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        name: roleCreate.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode == 200) {
          setCount(count + 1);
          toast.success("Role muvaffaqqiyatli yaratildi");
        }
      });

    roleCreate.value = "";
  };

  // !ROLE UPDATE
  const updateRole = (e) => {
    e.preventDefault();

    const { roleUpdate } = e.target;

    fetch(`${api}/users/update-role`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        id: changeRoleId,
        name: roleUpdate.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode == 200) {
          setCount(count + 1);
          toast.success("Role muvaffaqqiyatli o'zgartirildi!");
        }
      });
  };

  // !USER DELETE
  const deleteRole = () => {
    fetch(`${api}/users/delete-role`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        id: changeRoleId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode == 200) {
          setCount(count + 1);
          toast.error("Role muvaffaqqiyatli o'chirildi!");
        }
      });
  };

  //! ROLE WITH ID
  const getRoleWithId = (roleId) => {
    const foundRole = role.find((e) => e._id == roleId);
    setRoleOneWithId(foundRole);
  };

  //! SEARCH STATION BY REGION ID
  const searchStationByReionId = async (e) => {
    const requestStation = await fetch(
      `${api}/stations/all/regions?regionNumber=${e}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      }
    );

    const responseStation = await requestStation.json();

    let resultStation = [];
    for (let e of responseStation.data) {
      const existingStation = allUserStations.find((s) => s._id == e._id);

      if (!existingStation) {
        resultStation.push(e);
      }
    }
    setAllStations(resultStation);
  };

  //! USER ATTACH STATIONS
  const getUserAttachStation = (userId) => {
    const userAttachStations = async () => {
      try {
        const request = await fetch(
          `${api}/user-join-stations/getByUserId?id=${userId}`,
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
        setUserStationsIdList(response.data.stationsIdList);
        if (response.statusCode == 200) {
          let resultUserStation = [];
          response.data.stationsIdList.forEach((e) => {
            allStationsForUser.forEach((s) => {
              if (s._id == e) {
                resultUserStation.push(s);
              }
            });
          });
          resultUserStation.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });

          setAllUserStations(resultUserStation);
        }
      } catch (err) {
        setAllUserStations([]);
      }
    };

    userAttachStations();
  };

  //! ATTACH STATION USER
  const attachStation = (e) => {
    e.preventDefault();

    const { attachStationValue } = e.target;

    if (allUserStations.length == 0) {
      let stationIdList = [];
      stationIndexForAttach.forEach((e) => {
        stationIdList.push(attachStationValue[e].value);
      });

      fetch(`${api}/user-join-stations/create`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
          userId: changeUserId,
          stationsIdList: stationIdList,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.statusCode == 200) {
            window.location.reload();
          }
        });
    } else if (allUserStations.length > 0) {
      const userAttachStations = async () => {
        const request = await fetch(
          `${api}/user-join-stations/getByUserId?id=${changeUserId}`,
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

        if (allStations.length == 1 && stationIndexForAttach.length == 1) {
          stationIndexForAttach.forEach((e) => {
            if (!userStationsIdList.includes(attachStationValue.value)) {
              userStationsIdList.push(attachStationValue.value);
            }
          });
        } else {
          stationIndexForAttach.forEach((e) => {
            if (!userStationsIdList.includes(attachStationValue[e].value)) {
              userStationsIdList.push(attachStationValue[e].value);
            }
          });
        }

        fetch(`${api}/user-join-stations/update`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
          body: JSON.stringify({
            id: response.data._id,
            userId: changeUserId,
            stationsIdList: userStationsIdList,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.statusCode == 200) {
              window.location.reload();
            }
          });
      };

      userAttachStations();
    }
  };

  return (
    <HelmetProvider>
      <div>
        {/* Modal USER EDIT */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          data-bs-backdrop="static"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1
                  className="modal-title text-primary fs-5"
                  id="exampleModalLabel"
                >
                  Userni o'zgartirish
                </h1>
                <button
                  type="button"
                  className="btn-close btn-close-location"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={updateUser}>
                  <div className="row mb-3">
                    <label
                      htmlFor="name"
                      className="col-md-4 col-lg-3 col-form-label modal-label"
                    >
                      Ism
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <input
                        name="nameUser"
                        type="text"
                        className="form-control"
                        id="nameUpdate"
                        defaultValue={userOneWithId.name}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label
                      htmlFor="username"
                      className="col-md-4 col-lg-3 col-form-label modal-label"
                    >
                      Username
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <input
                        name="usernameUser"
                        type="text"
                        className="form-control"
                        id="username"
                        defaultValue={userOneWithId.username}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label
                      htmlFor="district"
                      className="col-md-4 col-lg-3 col-form-label modal-label"
                    >
                      Telefon raqam
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <input
                        name="phoneNumberUser"
                        type="text"
                        className="form-control"
                        id="district"
                        defaultValue={userOneWithId.phoneNumber}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label
                      htmlFor="imei"
                      className="col-md-4 col-lg-3 col-form-label modal-label"
                    >
                      Role
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <select
                        className="form-select select-user-create"
                        required
                        id="role"
                        name="roleUser"
                      >
                        {role?.map((e, i) => {
                          return (
                            <option key={i} value={e._id}>
                              {e.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="text-end">
                    <button className="btn btn-primary devices-btn">
                      Saqlash
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL USER PERMISSION   */}
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
                O'ylab ko'ring! <span className="text-primary"> user </span> ni
                oʻchirish doimiy boʻladi.
              </div>
              <div className="modal-footer border-top-0">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  onClick={deleteUser}
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

        {/* Modal ROLE EDIT */}
        <div
          className="modal fade"
          id="exampleModalLabelRole"
          tabIndex="-1"
          data-bs-backdrop="static"
          aria-labelledby="exampleModalLabelRole"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1
                  className="modal-title text-primary fs-5"
                  id="exampleModalLabel"
                >
                  Roleni o'zgartirish
                </h1>
                <button
                  type="button"
                  className="btn-close btn-close-location"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={updateRole}>
                  <div className="row mb-3">
                    <label
                      htmlFor="roleName"
                      className="col-md-4 col-lg-3 col-form-label modal-label"
                    >
                      Nomi
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <input
                        name="roleUpdate"
                        type="text"
                        className="form-control"
                        id="roleName"
                        defaultValue={roleOneWithId.name}
                      />
                    </div>
                  </div>

                  <div className="text-end">
                    <button className="btn btn-primary devices-btn">
                      Saqlash
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL ROLE PERMISSION   */}
        <div
          className="modal fade"
          id="staticBackdropRole"
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
                O'ylab ko'ring! <span className="text-primary"> role </span> ni
                oʻchirish doimiy boʻladi.
              </div>
              <div className="modal-footer border-top-0">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  onClick={deleteRole}
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

        {/* Modal USER ATTACH STATION */}
        <div
          className="modal fade"
          id="exampleModalAttach"
          tabIndex="-1"
          data-bs-backdrop="static"
          aria-labelledby="exampleModalAttach"
          aria-hidden="true"
        >
          <div className="modal-dialog table-attach-width modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1
                  className="modal-title text-primary fs-5"
                  id="exampleModalLabel"
                >
                  Userga stansiya biriktirish
                </h1>
                <button
                  onClick={() => {
                    setCountForRegion(countForRegion + 1);
                    setStationIndexForAttach([]);
                  }}
                  type="button"
                  className="btn-close btn-close-location"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="wrapper-attach d-flex justify-content-between flex-wrap">
                  <div>
                    <form className="attach-user-region-wrapper">
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
                            searchStationByReionId(e.target.value)
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
                    </form>
                    <div className="attach-form-wrapper">
                      <form onSubmit={attachStation}>
                        {allStations?.map((e, i) => {
                          return (
                            <div
                              key={i}
                              className="d-flex align-items-center mb-3"
                            >
                              <input
                                className="attach-input"
                                type="checkbox"
                                id={e._id}
                                name="attachStationValue"
                                value={e._id}
                                onChange={() => {
                                  if (!stationIndexForAttach.includes(i)) {
                                    stationIndexForAttach.push(i);
                                  } else if (
                                    stationIndexForAttach.includes(i)
                                  ) {
                                    stationIndexForAttach =
                                      stationIndexForAttach?.filter(
                                        (e) => e != i
                                      );
                                  }
                                  setStationIndexForAttach(
                                    stationIndexForAttach
                                  );
                                }}
                              />
                              <label className="attach-label" htmlFor={e._id}>
                                {e.name}
                              </label>
                            </div>
                          );
                        })}

                        <button className="btn btn-primary bg-btn">
                          Biriktirish
                        </button>
                      </form>
                    </div>
                  </div>

                  <span className="user-attach-station-border"></span>

                  <div className="user-station-attach">
                    <h4 className="mb-3 cite-main-color">
                      Foydalanuvchiga tegishli stansiyalar
                    </h4>

                    <ol className="user-attach-station-wrapper m-0 list-group list-group-numbered">
                      {allUserStations?.map((e, i) => {
                        return (
                          <li key={i} className="list-group-item">
                            {e.name}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
        <div className="card">
          <div className="card-body pt-3">
            <ul className="nav nav-tabs nav-tabs-bordered">
              <li className="nav-item">
                <button
                  className="nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-users"
                >
                  Userlar ro'yhati
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-overview"
                >
                  User yaratish
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-edit"
                >
                  Role yaratish
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#station-add"
                >
                  Stansiya biriktirish
                </button>
              </li>
            </ul>
            <div className="tab-content pt-2">
              <div
                className="tab-pane fade show active profile-users"
                id="profile-users"
              >
                <div className="table-scrol">
                  <table className="c-table mt-4">
                    <thead className="c-table__header">
                      <tr>
                        <th className="c-table__col-label text-center">Ism</th>
                        <th className="c-table__col-label text-center">
                          Username
                        </th>
                        <th className="c-table__col-label text-center">
                          Telefon raqam
                        </th>
                        <th className="c-table__col-label text-center">Role</th>
                        <th className="c-table__col-label text-center">
                          O'zgartirish
                        </th>
                        <th className="c-table__col-label text-center">
                          O'chirish
                        </th>
                      </tr>
                    </thead>
                    <tbody className="c-table__body">
                      {users?.map((e, i) => {
                        return (
                          <tr className="fs-6" key={i}>
                            <td className="c-table__cell text-center">
                              {e.name}
                            </td>
                            <td className="c-table__cell text-center">
                              {e.username}
                            </td>
                            <td className="c-table__cell text-center">
                              {e.phoneNumber}
                            </td>
                            <td className="c-table__cell text-center">
                              {
                                role.find((r) => {
                                  if (r._id == e.roleId) {
                                    return r.name;
                                  }
                                })?.name
                              }
                            </td>
                            <td className="c-table__cell text-center">
                              <button
                                className="btn-devices-edit"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() => {
                                  setChangeUserId(e._id);
                                  getUserWithId(e._id);
                                }}
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
                                onClick={() => setChangeUserId(e._id)}
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
                </div>
              </div>

              <div
                className="tab-pane fade profile-overview"
                id="profile-overview"
              >
                <form
                  className="pt-4 ps-4 form-user-create-wrapper d-flex flex-wrap align-items-center"
                  onSubmit={createUser}
                >
                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="name"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Ism
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="nameCreate"
                        type="text"
                        className="form-control input-user"
                        id="name"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="username"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Username
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="usernameCreate"
                        type="text"
                        className="form-control input-user"
                        id="username"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="password"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Parol
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="passwordCreate"
                        type="text"
                        className="form-control input-user"
                        id="password"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="phoneNumber"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Telefon raqam
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <input
                        name="phoneNumberCreate"
                        type="text"
                        className="form-control input-user"
                        id="phoneNumber"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3 d-flex flex-column input-label-wrapper">
                    <label
                      htmlFor="role"
                      className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                    >
                      Role
                    </label>
                    <div className="col-md-8 input-wrapper col-lg-9">
                      <select
                        className="form-select select-user-create"
                        required
                        id="role"
                        name="roleCreate"
                      >
                        {role?.map((e, i) => {
                          return (
                            <option key={i} value={e._id}>
                              {e.name}
                            </option>
                          );
                        })}
                      </select>
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
                className="tab-pane fade profile-edit pt-3"
                id="profile-edit"
              >
                <div className="d-flex align-items-start justify-content-between flex-wrap role-create-list-wrapper">
                  <form
                    className=" form-role-create-wrapper d-flex align-items-end"
                    onSubmit={createRole}
                  >
                    <div className="row d-flex flex-column input-label-wrapper">
                      <label
                        htmlFor="rol"
                        className="col-md-4 col-lg-3 col-form-label profile-heading fw-bold w-100"
                      >
                        Role yaratish
                      </label>
                      <div className="col-md-8 input-role-wrapper col-lg-9">
                        <input
                          name="roleCreate"
                          type="text"
                          className="form-control input-user"
                          id="rol"
                          required
                        />
                      </div>
                    </div>
                    <div className="w-50">
                      <button className="btn btn-primary btn-create-role">
                        Saqlash
                      </button>
                    </div>
                  </form>

                  <table className="c-table mt-4 table-role-width">
                    <thead className="c-table__header">
                      <tr>
                        <th className="c-table__col-label text-center">Nomi</th>
                        <th className="c-table__col-label text-center">
                          O'zgartirish
                        </th>
                        <th className="c-table__col-label text-center">
                          O'chirish
                        </th>
                      </tr>
                    </thead>
                    <tbody className="c-table__body">
                      {role?.map((e, i) => {
                        return (
                          <tr className="fs-6" key={i}>
                            <td className="c-table__cell text-center">
                              {e.name}
                            </td>
                            <td className="c-table__cell text-center">
                              <button
                                className="btn-devices-edit"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalLabelRole"
                                onClick={() => {
                                  setChangeRoleId(e._id);
                                  getRoleWithId(e._id);
                                }}
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
                                data-bs-target="#staticBackdropRole"
                                onClick={() => {
                                  setChangeRoleName(e.name);
                                  setChangeRoleId(e._id);
                                }}
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
                </div>
              </div>

              <div className="tab-pane fade station-add pt-3" id="station-add">
                <div className="d-flex align-items-start justify-content-between flex-wrap role-create-list-wrapper">
                  <div className="table-scrol w-100">
                    <table className="c-table mt-4">
                      <thead className="c-table__header">
                        <tr>
                          <th className="c-table__col-label text-center">
                            Ism
                          </th>
                          <th className="c-table__col-label text-center">
                            Username
                          </th>
                          <th className="c-table__col-label text-center">
                            Telefon raqam
                          </th>
                          <th className="c-table__col-label text-center">
                            Role
                          </th>
                          <th className="c-table__col-label text-center">
                            Biriktirish
                          </th>
                        </tr>
                      </thead>
                      <tbody className="c-table__body">
                        {users?.map((e, i) => {
                          return (
                            <tr className="fs-6" key={i}>
                              <td className="c-table__cell text-center">
                                {e.name}
                              </td>
                              <td className="c-table__cell text-center">
                                {e.username}
                              </td>
                              <td className="c-table__cell text-center">
                                {e.phoneNumber}
                              </td>
                              <td className="c-table__cell text-center">
                                {
                                  role.find((r) => {
                                    if (r._id == e.roleId) {
                                      return r.name;
                                    }
                                  })?.name
                                }
                              </td>
                              <td className="c-table__cell text-center">
                                <button
                                  className="btn-devices-edit"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModalAttach"
                                  onClick={() => {
                                    setChangeUserId(e._id);
                                    getUserAttachStation(e._id);
                                  }}
                                >
                                  <img
                                    src={attach}
                                    alt="update"
                                    width="20"
                                    height="20"
                                  />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Helmet>
        <script src="../src/assets/js/table.js"></script>
      </Helmet>
    </HelmetProvider>
  );
};

export default AdminUser;
