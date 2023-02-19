import './App.css';
import Map, { Marker, Popup } from 'react-map-gl';
import ReactMapGL from "react-map-gl";

import 'mapbox-gl/dist/mapbox-gl.css';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { format } from 'timeago.js'
import Register from './components/Register';
import Login from './components/Login';
// import { Room } from "@material-ui/icons";



function App() {

  const MAPBOX_TOKEN = 'pk.eyJ1IjoiamFja29iYSIsImEiOiJjbGEzdm5lamEwd2V3M3FxdjR6ZDd1NHJhIn0.Z9Z9lcCDEOVIwHiulcLoJQ'


  const myStorage = window.localStorage
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem('user'))
  const [pins, setPins] = useState([])
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [viewport, setViewport] = useState({

    latitude: 20,
    longitude: 73,
    zoom: 5,
  })
  // let currentUsername = 'johns'

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('/api/pins')
        setPins(res.data)
      } catch (err) {
        console.log(err);
      }
    }

    getPins()
  }, [])

  const handelMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id)
    setViewport({ ...viewport, latitude: lat, longitude: long })
  }

  const handleAddClick = (e) => {
    const [long, lat] = [e.lngLat.lng, e.lngLat.lat]

    setNewPlace({
      lat,
      long
    })
    // console.log(lat, long);

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem('user')
    setCurrentUsername(null)
  }

  return (
    <div className='app'>

      <Map
        initialViewState={{
          ...viewport,
          // latitude: 20,
          // longitude: 73,
          // zoom: 5

        }}
        style={{ width: "100vw", height: '105vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        //mapbox://styles/safak/cknndpyfq268f17p53nmpwira
        mapboxAccessToken={MAPBOX_TOKEN}
        onClick={handleAddClick}
      >

        {/* <ReactMapGL
        mapboxApiAccessToken={MAPBOX_TOKEN}
        width="100%"
        height="100%"
        transitionDuration="200"
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onDblClick={ handleAddClick}
      > */}

        {pins.map((p) => {

          return <>
           

              <Marker longitude={p.long} latitude={p.lat} color={p.username === currentUsername ? "lawngreen" : "#0088ff"}
                onClick={() => { handelMarkerClick(p._id, p.lat, p.long) }} >
              </Marker>
            

            {p._id === currentPlaceId && (
              <Popup
                key={p._id}
                longitude={p.long}
                latitude={p.lat}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label >Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label >Review</label>
                  <p className='desc'>{p.desc}</p>
                  <label >Rating</label>
                  <div className="star">
                    {Array(p.rating).fill(<StarIcon className="star" />)}

                  </div>
                  <label >Information</label>
                  <span className="username">Created by <b>{p.username}</b></span>
                  <span className="date">{format(p.createdAt)}</span>

                </div> </Popup>
            )}

          </>
        })}

        {newPlace && <Popup
          longitude={newPlace.long}
          latitude={newPlace.lat}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
          onClose={() => setNewPlace(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                placeholder="Enter a title"
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Description</label>
              <textarea
                placeholder="Say us something about this place."
                onChange={(e) => setDesc(e.target.value)}
              />
              <label>Rating</label>
              <select onChange={(e) => setStar(e.target.value)}>
                <option value="0">please select rating</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button type="submit" className="submitButton">
                Add Pin
              </button>
            </form>
          </div>
        </Popup>
        }
        {/* </ReactMapGL> */}

        {currentUsername ? (<button className='button logout' onClick={handleLogout}>Log out</button>
        ) : (<div className="buttons">
          <button className='button login' onClick={() => setShowLogin(true)}>Login</button>
          <button className='button register' onClick={() => setShowRegister(true)} >Register</button>
        </div>)}

        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && <Login
          setShowLogin={setShowLogin}
          setCurrentUsername={setCurrentUsername}
          myStorage={myStorage}
        />
        }


      </Map>
    </div>
  );
}

export default App;
