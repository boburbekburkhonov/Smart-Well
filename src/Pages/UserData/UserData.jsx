import React from "react";
import "./UserData.css";
import location from "../../assets/images/location-red.png";
import { Helmet, HelmetProvider } from "react-helmet-async";
import excel from "../../assets/images/excel.png";
import pdf from "../../assets/images/pdf.jpg";
import close from "../../assets/images/close-black.png";

const UserData = () => {
  return (
    <HelmetProvider>
      <div className="card-user-data card--open">
        <div className="card-body pt-3">
          <ul className="nav nav-tabs nav-tabs-bordered">
            <li className="nav-item">
              <button
                className="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#profile-hour"
              >
                Soatlik
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#profile-users"
              >
                Kunlik
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#profile-users-ten"
              >
                10 Kunlik
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#profile-overview"
              >
                Oylik
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#profile-search"
              >
                Yillik
              </button>
            </li>
          </ul>

          <div className="tab-content d-flex justify-content-between flex-wrap mt-4">
            <div
              className="tab-pane tab-pane-hour fade show active profile-hour "
              id="profile-hour"
            >
              <div className="containerr">
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <input
                      className="form-control user-lastdata-news-search"
                      type="text"
                      placeholder="Search..."
                    />
                    <div className="d-flex align-items-center ms-auto">
                      <input
                        type="date"
                        className="form-control"
                        id="dateMonth"
                        name="dateDaily"
                        required
                        defaultValue={new Date().toISOString().substring(0, 10)}
                      />
                      <a className="ms-4" href="#">
                        <img src={pdf} alt="pdf" width={23} height={30} />
                      </a>
                      <a className="ms-4" href="#">
                        <img src={excel} alt="excel" width={26} height={30} />
                      </a>
                    </div>
                  </div>
                  <div className="tableFlexible mt-3">
                    <div className="tableFlexible-width">
                      <table className="table-style">
                        <thead className="">
                          <tr>
                            <th rowSpan="2" className="sticky" style={{}}>
                              T/R
                            </th>
                            <th
                              rowSpan="2"
                              className="sticky"
                              style={{ left: "57px" }}
                            >
                              Stantsiya nomi
                            </th>
                            <th colSpan="24">2023-09-30</th>
                          </tr>
                          <tr>
                            <th>01</th>
                            <th>02</th>
                            <th>03</th>
                            <th>04</th>
                            <th>05</th>
                            <th>06</th>
                            <th>07</th>
                            <th>08</th>
                            <th>09</th>
                            <th>10</th>
                            <th>11</th>
                            <th>12</th>
                            <th>13</th>
                            <th>14</th>
                            <th>15</th>
                            <th>16</th>
                            <th>17</th>
                            <th>18</th>
                            <th>19</th>
                            <th>20</th>
                            <th>21</th>
                            <th>22</th>
                            <th>23</th>
                            <th>24</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="tr0">
                            <td className="sticky" style={{}}>
                              1
                            </td>
                            <td
                              className="text-start sticky fix-with"
                              style={{ left: "57px" }}
                            >
                              Bozsuv PK - 20+00
                            </td>
                            <td>-1</td>
                            <td>1.657</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>1.653</td>
                            <td>1.688</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>1.484</td>
                            <td>1.484</td>
                            <td>3</td>
                            <td>5</td>
                            <td>1.484</td>
                            <td>1</td>
                            <td>3</td>
                            <td>6</td>
                            <td></td>
                            <td>8</td>
                            <td>11</td>
                            <td>1.484</td>
                            <td>54</td>
                          </tr>
                          <tr className="tr0">
                            <td className="sticky" style={{}}>
                              2
                            </td>
                            <td
                              className="text-start sticky fix-with"
                              style={{ left: "57px" }}
                            >
                              Bozsuv PK - 20+00
                            </td>
                            <td>-1</td>
                            <td>1.657</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>1.653</td>
                            <td>1.688</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>1.484</td>
                            <td>1.484</td>
                            <td>3</td>
                            <td>5</td>
                            <td>1.484</td>
                            <td>1</td>
                            <td>3</td>
                            <td>6</td>
                            <td></td>
                            <td>8</td>
                            <td>11</td>
                            <td>1.484</td>
                            <td>54</td>
                          </tr>
                          <tr className="tr0">
                            <td className="sticky" style={{}}>
                              3
                            </td>
                            <td
                              className="text-start sticky fix-with"
                              style={{ left: "57px" }}
                            >
                              Qipchoq_arna_PK220+00
                            </td>
                            <td>-1</td>
                            <td>1.657</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>1.653</td>
                            <td>1.688</td>
                            <td>-1</td>
                            <td>-1</td>
                            <td>1.484</td>
                            <td>1.484</td>
                            <td>3</td>
                            <td>5</td>
                            <td>1.484</td>
                            <td>1</td>
                            <td>3</td>
                            <td>6</td>
                            <td></td>
                            <td>8</td>
                            <td>11</td>
                            <td>1.484</td>
                            <td>54</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tab-pane fade profile-users" id="profile-users">
              1
            </div>

            <div
              className="tab-pane fade profile-users-ten"
              id="profile-users-ten"
            >
              10
            </div>

            <div
              className="tab-pane fade profile-overview"
              id="profile-overview"
            >
              profile-overview
            </div>

            <div
              className="tab-pane fade profile-search profile-search-station"
              id="profile-search"
            >
              profile-search
            </div>

            <div>
              <div>
                <div className="smartwell-search-user-data d-flex align-items-center flex-wrap">
                  <input
                    id="bbr"
                    type="input"
                    placeholder="Kuzatuv stansiyasi..."
                    className="form-control search-user-data-input-observe"
                  />
                  <span className="ms-3 me-3 text-danger">
                    Soni: 481 / 208 ta
                  </span>
                  <label htmlFor="bbr">
                    <span
                      role="img"
                      aria-label="search"
                      className="anticon anticon-search"
                      style={{ color: "rgb(110, 139, 245)" }}
                    >
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="search"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
                      </svg>
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <ul className="list-group list-unstyled m-0 mt-3">
                  <li className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={location}
                        alt="location"
                        width={23}
                        height={20}
                      />

                      <p className="m-0 ms-2 fs-6">Qipchoq_arna_PK220+00</p>
                    </div>

                    <p className="m-0 text-danger">1</p>
                  </li>

                  <li className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={location}
                        alt="location"
                        width={23}
                        height={20}
                      />

                      <p className="m-0 ms-2 fs-6">Qipchoq_arna_PK220+00</p>
                    </div>

                    <p className="m-0 text-danger">1</p>
                  </li>

                  <li className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={location}
                        alt="location"
                        width={23}
                        height={20}
                      />

                      <p className="m-0 ms-2 fs-6">Qipchoq_arna_PK220+00</p>
                    </div>

                    <p className="m-0 text-danger">1</p>
                  </li>

                  <li className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={location}
                        alt="location"
                        width={23}
                        height={20}
                      />

                      <p className="m-0 ms-2 fs-6">Qipchoq_arna_PK220+00</p>
                    </div>

                    <p className="m-0 text-danger">1</p>
                  </li>

                  <li className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={location}
                        alt="location"
                        width={23}
                        height={20}
                      />

                      <p className="m-0 ms-2 fs-6">Qipchoq_arna_PK220+00</p>
                    </div>

                    <p className="m-0 text-danger">1</p>
                  </li>

                  <li className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={location}
                        alt="location"
                        width={23}
                        height={20}
                      />

                      <p className="m-0 ms-2 fs-6">Qipchoq_arna_PK220+00</p>
                    </div>

                    <p className="m-0 text-danger">1</p>
                  </li>

                  <li className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={location}
                        alt="location"
                        width={23}
                        height={20}
                      />

                      <p className="m-0 ms-2 fs-6">Qipchoq_arna_PK220+00</p>
                    </div>

                    <p className="m-0 text-danger">1</p>
                  </li>

                  <li className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={location}
                        alt="location"
                        width={23}
                        height={20}
                      />

                      <p className="m-0 ms-2 fs-6">Qipchoq_arna_PK220+00</p>
                    </div>

                    <p className="m-0 text-danger">1</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="userlast-data-bottom-modal">
            <div className="userlast-data-bottom-modal-header d-flex justify-content-end">
              <img
                className="ms-auto"
                src={close}
                alt="close"
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>

        <Helmet>
          <script src="../../src/assets/js/Admin.js"></script>
        </Helmet>
      </div>
    </HelmetProvider>
  );
};

export default UserData;
