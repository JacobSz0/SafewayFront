import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import "./Driver.css"
import QRCode from "qrcode.react";
import qrico from "./img/qrico.png"
import copy from "./img/copy.png"
import homePin from "./img/home-pin.png"
import pinPin from "./img/pin.png"
import mapIcon from "./img/map.png"
import deleteIcon from "./img/Delete.png"
import plusIcon from "./img/plus.png"
import imageIcon from "./img/imageIcon.png"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from "leaflet";
import { Tooltip } from "react-leaflet";

export const homeIcon = new L.Icon({
    iconUrl: homePin,
    iconSize: [30, 35],
    iconAnchor: [15, 33],

  });

  export const pinIcon = new L.Icon({
    iconUrl: pinPin,
    iconSize: [30, 35],
    iconAnchor: [15, 33],
  });


function JustAddresses() {
  const [typingData, setTypingData] = useState([]);
  const [routedData, setRoutedData] = useState([[{name:"Wait for it...", address: "", startTime: "", endTime: "", oldRoute: "", orderNumber: "pending...", coordinates:{lat:47.652690, lng:-122.688230}}]])
  const [storeNumber, setStoreNumber] = useState(["1508", [47.5688609, -122.2879537]])
  const [initButton, setInitButton] = useState(true)
  const [newRouteLink, setNewRouteLink] = useState("http://localhost:4000/dotcom")
  const [showQr, setShowQr] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [status, setStatus] = useState({"m":"Initialize", "color":"status-normal", "display":false})
  const [helpfulTips, setHelpfulTips] = useState(false)

  const storeList=["1142 (Kirkland)", "1143 (North Seattle)", "1508 (South Seattle MFC)", "1624 (Issaquah)", "1680 (Silverdale)", "1798 (Puyallup)", "1803 (Lake Stevens)", "1966 (Kent)", "2645 (Everett)", "3545 (Milton)"]

  const handleDataChange = (index, event) => {
    const { name, value } = event.target;
    const updatedData = [...typingData];
    updatedData[index][name] = value;
    setTypingData(updatedData);
  };

  const handleDeleteEntry = (index) => {
    const toBeDeleted = [...typingData]
    toBeDeleted.splice(index, 1)
    setTypingData(toBeDeleted);
  };

  const handleAddEntry = () => {
    setTypingData([...typingData, {"instruction":false, "startTime":"", "endTime":""}]);
  };

  function routeTab() {
    setInitButton(false)
  }

  function initTab() {
    setInitButton(true)
  }

  function helpfulSwitch(){
    if (helpfulTips===true){setHelpfulTips(false)}
    else{setHelpfulTips(true)}
  }

  const handleStoreChange = (event) => {
    const store = event.target.value;
    const storeCoordinates = {"1508 (South Seattle MFC)": [47.5688609,-122.2879537], "1143 (North Seattle)": [47.6901322,-122.3761618], "1142 (Kirkland)": [47.6787852, -122.1733922], "1798 (Puyallup)": [47.151927947998,-122.35523223877], "1680 (Silverdale)": [47.6527018,-122.6881439], "1803 (Lake Stevens)": [48.004510,-122.118270], "3545 (Milton)": [47.249360,-122.296190], "2645 (Everett)": [47.875460,-122.153910], "1624 (Issaquah)": [47.541620,-122.048290], "1966 (Kent)": [47.357130,-122.166860]}
    setStoreNumber([store, storeCoordinates[store]]);
  };

  function qrToggle(){
    if (showQr===false){setShowQr(true); setShowMap(false)}
    else if (showQr===true){setShowQr(false)}
  }

  function mapToggle(){
    if (showMap===false){setShowMap(true); setShowQr(false)}
    else if (showMap===true){setShowMap(false)}
  }

  const numberIcon = (number) => {
    return L.divIcon({
      html: `<div>${number}</div>`,
      iconUrl: homePin,
      iconSize: [16, 20],
      iconAnchor: [0, 0],
    });
  };

  const convertTime = timeStr => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
       hours = '00';
    }
    if (modifier === 'PM') {
       hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  };



  async function Route(){
    routeTab()
    setStatus({"m":"Geolocating Data...", "color":"status-normal", "display":false})
    var coordinateManifest=typingData
    var cnt=0
    var coordinateComplete=[]
    var count=0
    var apiKey="DqS4NCThFlPj61WbL-TLX-hqnzz28loSxsvmZ4TCdoc"
    for (var i of coordinateManifest){
      count+=1
      if (count>=15){apiKey="Ro31-eiio5_3jiAkLjhooW45-wehqAykvpA8G1Ek3U0"}
      const response = await fetch("https://geocode.search.hereapi.com/v1/geocode?q="+i.address+"&apiKey="+apiKey);
      if (response.ok) {
        const data = await response.json();
        if (data["items"]){
          cnt+=1
          i["coordinates"]=data["items"][0]["position"]
          coordinateComplete.push(i)
        }
      }
    }
    if (cnt===coordinateManifest.length){
      setStatus({"m":"Routing data...", "color":"status-normal", "display":false})

      const storeCoordinates = {"1508 (South Seattle MFC)": "47.5688609,-122.2879537", "1143 (North Seattle)": "47.6901322,-122.3761618", "1142 (Kirkland)": "47.6787852, -122.1733922", "1798 (Puyallup)": "47.151927947998,-122.35523223877", "1680 (Silverdale)": "47.6527018,-122.6881439", "1803 (Lake Stevens)": "48.004510,-122.118270", "3545 (Milton)": "47.249360,-122.296190", "2645 (Everett)": "47.875460,-122.153910", "1624 (Issaquah)": "47.541620,-122.048290", "1966 (Kent)": "47.357130,-122.166860"}

      var year = new Date().getFullYear()
      var month = new Date().getMonth()+1
      if (month<10){month="0"+month}
      var day = new Date().getDate()
      if (day<10){day="0"+day}
      var beginTime = coordinateComplete[0]["startTime24"]
      var offset = new Date().getTimezoneOffset();
      offset=offset/60

      var routerLink="https://wps.hereapi.com/v8/findsequence2?departure="+year+"-"+month+"-"+day+"T"+beginTime+":00-0"+offset+":00"+"&mode=fastest;car;traffic:enabled&start="+storeNumber[0]+";"+storeCoordinates[storeNumber[0]]
      var cnt=0
      for (var i of coordinateComplete){
        cnt+=1
        var stop="&destination"+cnt+"="+i["oldRoute"]+";"+i["coordinates"]["lat"]+","+i["coordinates"]["lng"]+";st:300"
        routerLink+=stop
      }
      routerLink=routerLink+"&end="+11177777484+";"+storeCoordinates[storeNumber[0]]+"&improveFor=TIME"+"&apikey=DqS4NCThFlPj61WbL-TLX-hqnzz28loSxsvmZ4TCdoc"
      console.log(routerLink)

      const routeResponse = await fetch(routerLink);
      if (routeResponse.ok) {
        const routeData = await routeResponse.json();
        console.log(routeData)
        if (routeData.results[0]?.waypoints){
          console.log(routeData)
          setStatus({"m":"Routing Success!", "color":"status-green", "display":true})
          setRoutedData(routedData)
          //link maker for qr code
        }
        else{setStatus({"m":"An Error occored: Try deselecting time windows", "color":"status-red"})}
      }

    }
	}


  useEffect(() => {

  }, [typingData]);


  return (
		<>
    <div className="center">
      <button onClick={initTab}>Initialize Tab</button>
      <button onClick={routeTab}>Routed Tab</button>
      <span className={status.color}> Status: {status.m}</span>
    </div>
    {initButton ? (
    <div>
    <div className="App">
      <button onClick={helpfulSwitch}>Helpful tips</button>
      {helpfulTips ? (
      <p className="text">When uploading image, please make sure the paper is as clear, as well-lit, and as flat as possible. Please wait until the text is loaded before adding another image. Please make sure the pages are in order otherwise the Route ID will be incorrect. For mobile users: It is recommended that you turn your device horizontal for easy viewing/editing of data. Unfortunatly, .PNG files preferred. Some images may not be accepted. Please reload page if any errors occor. MOST IMPORTANTLY: Please check to verify the data is correct! Image to text conversion will never be perfect. So always, always, always check before routing.</p>
      ) : null}
    </div>
    <div>
    <table className="table">
      <thead>
        <tr>
          <td className="text">Route ID</td>
          <td className="text">Address</td>
        </tr>
      </thead>
      <tbody>
        {typingData.map((data, index) => (
          <tr key={index}>
            <td>
              <input className="oldRoute" name="oldRoute" value={data.oldRoute || ""} onChange={(e) => handleDataChange(index, e)} />
            </td>
            <td>
              <input className="address" name="address" value={data.address || ""} onChange={(e) => handleDataChange(index, e)} />
            </td>
            <td><button className="minus" onClick={() => handleDeleteEntry(index)}><img className="deleteImage" src={deleteIcon}></img></button></td>
          </tr>
        ))}
      </tbody>
    </table>
    <button className="plusy" onClick={handleAddEntry}><img className="icon-image" src={plusIcon}></img></button>
  </div>
    <div className="center">
      <span className="text">Store Number:   </span>
        <select value={storeNumber[0]} onChange={handleStoreChange}>
        {storeList.map((option) => (
            <option key={option} value={option}>{option}</option>
        ))}
        </select>
        <button className="glass-green glass" onClick={Route}>ROUTE!</button>
    </div>
  </div>
  ) : null}

  {!initButton ? (
      <div>
        <p className="text">Routing Tab</p>
        <div>
          <button className="tooltip-wrap glass-green" onClick={mapToggle}>
            <img className="icon-image" src={mapIcon} alt="" />
            <div className="tooltip-content">
              Display Map
            </div>
          </button>
          <button className="glass-blue" onClick={qrToggle}>
            <div className="tooltip-wrap">
              <img className="icon-image" src={qrico} alt="" />
                <div className="tooltip-content">
                  Display GIANT QR code for driver
                </div>
              </div>
            </button>
          <button className="tooltip-wrap glass-blue" onClick={() => {navigator.clipboard.writeText(newRouteLink)}}>
            <img className="icon-image" src={copy} alt="" />
            <div className="tooltip-content">
              Copy Link
            </div>
          </button>
          {showMap ? (
            <div>
              <MapContainer center={storeNumber[1]} zoom={11} style={{height: "400px", width: "100%"}}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                />
                <Marker position={storeNumber[1]} icon={homeIcon}></Marker>
                  {routedData[0].map((i, num) => {
                    return (
                        <Marker
                          key={i["orderNumber"]}
                          position={[i.coordinates["lat"], i.coordinates["lng"]]}
                          icon={numberIcon(num+1)}
                        ><Tooltip>{i.oldRoute}</Tooltip></Marker>
                    );
                  })}

              </MapContainer>
          </div>
          ) : null}
          {showQr ? (
          <div className="qr">
            <QRCode value={newRouteLink} size={512} />
          </div>
          ) : null}
          <table className="table bg-lite" id="toRender">
            <thead className="blue-background">
              <tr>
              <td className="text">Route ID</td>
              <td className="text">Address</td>
              </tr>
            </thead>
            <tbody>
            {routedData[0].map((i) => {
              return(
                <tr key={i.oldRoute}>
                  <td>{i.oldRoute}</td>
                  <td><a href={"https://maps.google.com/?q=" + i.address}>{i.address}</a></td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      </div>
      ) : null}
  </>
  );
}

export default JustAddresses;
