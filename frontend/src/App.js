
import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import './styles.css';
import Register from './components/Register';
import Login from './components/Login';
import axios from "axios";
import { format } from "timeago.js";


function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"))
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle,] = useState([]);
  const [desc, setDesc] = useState([]);
  const [rating, setRating] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({

    width: "100vw",
    height: "100vh",
    latitude: -13.6626955,
    longitude: -69.6479019,
    zoom: 4
  });
  console.log(currentUser)
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('/pins');
        setPins(res.data);
      } catch (err) {
        console.log(err)
      }
    }
    getPins();
  }, [])

  const handleMarkClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long })
  }

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    }

    try {
      const res = await axios.post('/pins', newPin)
      setPins([...pins, res.data]);
      setNewPlace(null)
    } catch (err) {
      console.log(err);
    }

  }

  const handleLogout = () => {
    myStorage.removeItem('user');
    setCurrentUser(null);
  }

  return (
    <div className="App">
      <ReactMapGL
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        {...viewport}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle='mapbox://styles/sandro-servo/ckxw3hmqwwyiq15nsmgu09cg2'
        onDblClick={handleAddClick}
        transitionDuration="200"
      >
        {pins.map(p => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}
            >
              <Room
                style={{
                  fontSize: viewport.zoom * 7,
                  color: p.username === currentUser ? 'tomato' : 'slateblue',
                  cursor: "pointer"

                }}
                onClick={() => handleMarkClick(p._id, p.lat, p.long)}

              />

            </Marker>

            {p._id === currentPlaceId &&
              <Popup
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >

                <div
                  className="card"
                >
                  <label>Place</label>
                  <h4 className="palce"> {p.title}</h4>
                  <label>Riview</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="star">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="usename">Created by<b> {p.username}</b> </span>
                  <span className="date">{format(p.createdAt, 'pt-BR')}</span>
                </div>
              </Popup>
            }
          </>
        ))}

        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor="left"
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
                <label>Review</label>
                <textarea placeholder="Say us something about this place"
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)} >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">Add Pin</button>
              </form>
            </div>

          </Popup>
        )}

        {currentUser ? (<button className="button logout" onClick={handleLogout}>LOGOUT</button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>LOGIN</button>
            <button className="button register" onClick={() => setShowRegister(true)}>REGISTER</button>
          </div>
        )}

        {showRegister && <Register setShowRegister={setShowRegister}/>}
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}
      </ReactMapGL>
    </div>
  );
}

export default App;
