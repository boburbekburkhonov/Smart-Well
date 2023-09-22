import React, { useState } from "react";
import "./UserLastData.css";

const UserLastData = () => {
  const [countNews, setCountNews] = useState(5);
  const [countStationName, setStationName] = useState();

  return (
    <div className="card">
      <div className="card-body pt-3">
        <ul className="nav nav-tabs nav-tabs-bordered">
          <li className="nav-item">
            <button
              className="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#profile-users"
            >
              Nomi bo'yicha qidirish
            </button>
          </li>

          <li className="nav-item">
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#profile-overview"
            >
              Viloyat bo'yicha qidirish
            </button>
          </li>

          <li className="nav-item">
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#profile-search"
            >
              Balans tashkiloti bo'yicha qidirish
            </button>
          </li>
        </ul>

        <h2 className="mt-4 mb-3 fs-4 user-lastdata-heading">
          218-Kuzatish Quduq
        </h2>
        <div className="d-flex align-items-center">
          <select
            className="user-lastdata-select-station-name form-select"
            name="stationName"
            onChange={(e) => setStationName(e.target.value)}
          >
            <option value="218-Kuzatish Quduq">218-Kuzatish Quduq</option>
            <option value="Sirdaryo Quduq">Sirdaryo Quduq</option>
          </select>

          <select
            className="user-lastdata-select-station-count form-select ms-4"
            name="count"
            onChange={(e) => setCountNews(e.target.value)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>

        <div className="tab-content">
          <div
            className="tab-pane fade show active profile-users table-scroll"
            id="profile-users"
          >
            <table className="table mt-4">
              <thead>
                <tr>
                  <th scope="col">Nomi</th>
                  <th scope="col">Daraja</th>
                  <th scope="col">O'tkazuvchanlik</th>
                  <th scope="col">Temperatura</th>
                </tr>
              </thead>
              <tbody>
                {countNews == 5 ? (
                  <>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                  </>
                ) : countNews == 10 ? (
                  <>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                  </>
                ) : countNews == 15 ? (
                  <>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>{" "}
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                    <tr>
                      <td>218-Kuzatish Quduq</td>
                      <td>45</td>
                      <td>3.709</td>
                      <td>21.3</td>
                    </tr>
                  </>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="tab-pane fade profile-overview" id="profile-overview">
            profile-overview
          </div>

          <div
            className="tab-pane fade profile-search profile-search-station"
            id="profile-search"
          >
            profile-search
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLastData;
