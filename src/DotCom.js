import React, { useState, useEffect } from "react";
import JSpdf from "jspdf";
import QRCode from "qrcode.react";
import h2c from "html2canvas";
import info from "./img/info.png"
import pdf from "./img/pdf.png"
import qrico from "./img/qrico.png"
import copy from "./img/copy.png"
import homePin from "./img/home-pin.png"
import mapIcon from "./img/map.png"
import pinPin from "./img/pin.png"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from "leaflet";

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



function DotCom() {
  const [manifestBox, setManifestBox] = useState("");
  const [manifestData, setManifestData] = useState([{name:"pending...", address: "pending...", startTime: "pending...", endTime: "pending...", orderNumber: "pending..."}])
  const [routedData, setRoutedData] = useState([[{name:"Wait for it...", address: "", startTime: "", endTime: "", startTime24:"08:00", endTime24: "09:00", oldRoute: "", orderNumber: "pending...", coordinates:{lat:47.652690, lng:-122.688230}}]])
  const [storeNumber, setStoreNumber] = useState(["1508 (South Seattle MFC)", [47.5688609, -122.2879537]])
  const [initButton, setInitButton] = useState(true)
  const [newRouteLink, setNewRouteLink] = useState("http://localhost:4000/dotcom")
  const [showQr, setShowQr] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [timeWindows, setTimeWindows] = useState(true)
  const [status, setStatus] = useState({"m":"Initialize", "color":"status-normal", "display":false})

  function isNumeric(value) {
    return /^-?\d+$/.test(value);
  }

  function routeTab() {
    setInitButton(false)
  }

  function initTab() {
    setInitButton(true)
  }

  function handleTimeWindowsChange(){
    if (timeWindows===true){
      setTimeWindows(false)
    }
    if (timeWindows===false){
      setTimeWindows(true)
    }
  }

  function exportToPdf() {
    let elem = document.getElementById("toRender");
    elem.scrollIntoView();
    h2c(elem).then(canvas => {
      //document.body.appendChild(canvas)
      const img = canvas.toDataURL("image/png", 1);
      //console.log(`"data:image/png;base64,${img}"`)

      var imgWidth = 190;
      var pageHeight = 200;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const pdf = new JSpdf("p", "mm");
      var position = 10;

      pdf.addImage(img, "PNG", 10, position, imgWidth, imgHeight, 100);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(img, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      //pdf.addImage(img, 'PNG', 0, 0)
      pdf.save("new_route.pdf");
    });
  };


  const handleManifestChange = (event) => {
    const value = event.target.value;
    processData(value)
    setManifestBox(value);
  };

  const handleStoreChange = (event) => {
    const store = event.target.value;
    const storeCoordinates = {"1508 (South Seattle MFC)": [47.5688609,-122.2879537], "1143 (North Seattle)": [47.6901322,-122.3761618], "1142 (Kirkland)": [47.6787852, -122.1733922], "1798 (Puyallup)": [47.151927947998,-122.35523223877], "1680 (Silverdale)": [47.6527018,-122.6881439], "1803 (Lake Stevens)": [48.004510,-122.118270], "3545 (Milton)": [47.249360,-122.296190], "2645 (Everett)": [47.875460,-122.153910], "1624 (Issaquah)": [47.541620,-122.048290], "1966 (Kent)": [47.357130,-122.166860]}
    setStoreNumber([store, storeCoordinates[store]]);
  };


  function processData(secret) {
    setStatus({"m":"Awaitng Route Perameters", "color":"status-normal", "display":false})
    if (secret){
      var phone1508=[]
      const secretArray = secret.split("SIGNATURE");
      var secretArray2=[]
      for (var i of secretArray){
        var newd = i.split(" ");
        var nameBool=false
        var addressBool=false
        var instructionBool=false
        var phoneBool=false
        var name=""
        var address=""
        var instruction=""
        var phoneNumber=""
        var orderNumber=""
        var is1508=false
        var cnt=0
        for (let j = 0; j < newd.length; j++) {
          if (newd[j]==="001"){
            var routeLetter=newd[j-11]
          }
          if (newd[j] === "WINDOW:"){
            var startTime=newd[j+1]+" "+newd[j+2]
            var endTime=newd[j+4]+" "+newd[j+5]
            var oldRoute=routeLetter+"-"+newd[j-1]
          }
          if (newd[j] === "TIME:"){nameBool=true}
          if (nameBool===true && isNumeric(newd[j])===true){
            nameBool=false
            addressBool=true
            cnt=0}
          if (nameBool===true && isNumeric(newd[j])===false){
          cnt+=1
            if (cnt>2){name+=" "}
            if (cnt>1){name+=newd[j]}
          }

          if (newd[j+1]==="INSTRUCTIONS:"){
            is1508=true
            addressBool=false
          }
          if (newd[j-1]==="INSTRUCTIONS:"){
            instructionBool=true
            cnt=1
          }
          if (newd[j]==="ORDER"){
            orderNumber=newd[j+1]
          }
          if (newd[j+3]==="ORDER" && !is1508){
            addressBool=false;
            address+=" "
            address+=newd[j+1]
            phoneNumber=newd[j+2]
            orderNumber=newd[j+4]
          }
          if (addressBool===true){
            cnt+=1
            if (cnt>1){address+=" "}
            address+=newd[j]
          }
          if (newd[j]==="INSTRUCTIONS"){
          instructionBool=true;
          cnt=0}
          if (newd[j]==="DRIVER"){
          instructionBool=false
          }
          if (instructionBool===true){
            cnt+=1
            if (cnt>2){instruction+=" "}
            if (cnt>1){instruction+=newd[j]} ;
          }
          //phone number formatted badly at 1508. This is the fix
          if (newd[j].length===10 && isNumeric(newd[j])===true && instructionBool===false){
            phone1508.push(newd[j])
          }
        }
        if (address!==""){
          var secretObj={}
          secretObj["oldRoute"]=oldRoute
          secretObj["startTime"]=startTime
          secretObj["endTime"]=endTime
          secretObj["name"]=name
          secretObj["address"]=address
          if (instruction===""){
            secretObj["instruction"]=false
          }
          else{
            secretObj["instruction"]=instruction
          }
          secretObj["phoneNumber"]=phoneNumber
          secretObj["orderNumber"]=orderNumber
          secretArray2.push(secretObj)
        }
      }
      var phoneOffset=0
      for (let i = 0; i < secretArray2.length; i++) {
        var modulo=i+1
        if (modulo%9!==0){
          secretArray2[i]["phoneNumber"]=phone1508[phoneOffset]
          phoneOffset+=1
        }
        else{
          secretArray2[i]["phoneNumber"]="ErrorCode:1508"
        }
      }
      console.log(secretArray2)
      console.log(phone1508)
      console.log(storeNumber)
      setManifestData(secretArray2)
    }
  }

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

  function condenseLink(bigData){
    var condensedLink="https://jacobsz0.github.io/SafewayFront?data="
    for (var i of bigData[0]){
    	var start=i["startTime24"].split(":")
      var end=i["endTime24"].split(":")
      var names=i["name"].split(" ")
      var dashedName=""
      for(var j of names){
      	dashedName+=j
        dashedName+="_"
      }
      var address=i["address"].split(" ")

      var dashedAddress=""
      for (var j of address){
      	dashedAddress+=j
        dashedAddress+="_"
      }

    	var condensedPart=i["oldRoute"]+"_"+start[0]+"_"+end[0]+"_"+i["phoneNumber"]+"_"+i["orderNumber"]+"_"+dashedName+"5z1_"+dashedAddress

      if (i["instruction"]===false){}
      else{
      	var instruction=i["instruction"].split(" ")
        var dashedInstruction="5z2_"
        for (var j of instruction){
        	dashedInstruction+=j
          dashedInstruction+="_"
        }
        condensedPart+=dashedInstruction
      }
      condensedPart+="5z3"
      condensedLink+=condensedPart
    }
    console.log(condensedLink)
    setNewRouteLink(condensedLink)
  }

  async function Route(){
    routeTab()
    setStatus({"m":"Geolocating Data...", "color":"status-normal", "display":false})
    var coordinateManifest=manifestData
    var cnt=0
    var coordinateComplete=[]
    for (var i of coordinateManifest){
      i["startTime24"]=convertTime(i.startTime)
      i["endTime24"]=convertTime(i.endTime)
      const response = await fetch("https://geocode.search.hereapi.com/v1/geocode?q="+i.address+"&apiKey=DqS4NCThFlPj61WbL-TLX-hqnzz28loSxsvmZ4TCdoc");
      if (response.ok) {
        const data = await response.json();
        if (data["items"]){
          cnt+=1
          i["coordinates"]=data["items"][0]["position"]
          coordinateComplete.push(i)
        }
      }
    }
    console.log(coordinateComplete)
    if (cnt===coordinateManifest.length){
      setStatus({"m":"Routing data...", "color":"status-normal", "display":false})

      const storeCoordinates = {"1508": "47.5688609,-122.2879537", "1143": "47.6901322,-122.3761618", "1142": "47.6787852, -122.1733922", "1798": "47.151927947998,-122.35523223877", "1680": "47.6527018,-122.6881439", "1803": "48.004510,-122.118270", "3545": "47.249360,-122.296190", "2645": "47.875460,-122.153910", "1624": "47.541620,-122.048290", "1966": "47.357130,-122.166860"}

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
        if (timeWindows===true){
          console.log("Time Windows")
          var stop="&destination"+cnt+"="+i["orderNumber"]+";"+i["coordinates"]["lat"]+","+i["coordinates"]["lng"]+";acc:mo"+i["startTime24"]+":00-0"+offset+":00%7cmo"+i["endTime24"]+":00-0"+offset+":00;st:420" // The 420 is the amount of seconds between stops on average
        }
        else{
          var stop="&destination"+cnt+"="+i["orderNumber"]+";"+i["coordinates"]["lat"]+","+i["coordinates"]["lng"]+";st:300"
        }
        routerLink+=stop
      }
      routerLink=routerLink+"&end="+11177777484+";"+storeCoordinates[storeNumber[0]]+"&improveFor=TIME"+"&apikey=DqS4NCThFlPj61WbL-TLX-hqnzz28loSxsvmZ4TCdoc"
      console.log(routerLink)

      const routeResponse = await fetch(routerLink);
      if (routeResponse.ok) {
        const routeData = await routeResponse.json();
        console.log(routeData)
        console.log(coordinateComplete[4]["orderNumber"])
        if (routeData.results[0]?.waypoints){
          var newRoute=[]
          for (var h of routeData.results){
          	var newOne=[]
            for (var i of h["waypoints"])
              for (var j of coordinateComplete){
                if (i["id"]===j["orderNumber"]){
                  console.log(i["estimatedArrival"])
                  if (i["sequence"]===1){
                    j["ETA"]=j["startTime"]
                  }
                  else{
                    var splitETA=i["estimatedArrival"].split("T")
                    var splitETA2=splitETA[1].split(":")
                    j["ETA"]=splitETA2[0]+":"+splitETA2[1]
                  }
                  newOne.push(j)
                }
              }
              newRoute.push(newOne)
            }
          console.log(newRoute)
          setStatus({"m":"Success!", "color":"status-green", "display":true})
          setRoutedData(newRoute)
          //link maker for qr code
          condenseLink(newRoute)
        }
        else{setStatus({"m":"An Error occored: Try deselecting time windows", "color":"status-red"})}
      }

    }
  }

  const storeList=["1142 (Kirkland)", "1143 (North Seattle)", "1508 (South Seattle MFC)", "1624 (Issaquah)", "1680 (Silverdale)", "1798 (Puyallup)", "1803 (Lake Stevens)", "1966 (Kent)", "2645 (Everett)", "3545 (Milton)"]

  useEffect(() => {
    processData()
  }, [manifestBox]);

  function qrToggle(){
    if (showQr===false){setShowQr(true); setShowMap(false)}
    else if (showQr===true){setShowQr(false)}
  }

  function mapToggle(){
    if (showMap===false){setShowMap(true); setShowQr(false)}
    else if (showMap===true){setShowMap(false)}
  }


  return (
    <div>
      <div className="center">
        <button onClick={initTab}>Initialize Tab</button>
        <button onClick={routeTab}>Routed Tab</button>
        <span className={status.color}> Status: {status.m}</span>
      </div>
      {initButton ? (
        <div>
        <div>
          <span className="text">Please highlight the ENTIRE manifest and paste it into here. </span>
          <span className="text">Be sure to press Enter in the text box before adding another manifest. </span>
          <span className="text">This data only exsits in your browser. If you refresh the browser, your progress will be lost. </span>
        </div>
        <div className="textarea">
          <textarea rows={5}
            cols={50}
            onChange={handleManifestChange}
            value={manifestBox}>
          </textarea>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <td className="text">Route ID</td>
                <td className="text">Name</td>
                <td className="text">Address</td>
                <td className="text">Time Window</td>
                <td className="text">Phone #</td>
                <td className="text">Order #</td>
              </tr>
            </thead>
            <tbody>
            {manifestData.map((i) => {
              return(
                <tr key={i.orderNumber}>
                  <td className="text">{i.oldRoute}</td>
                  <td className="text">{i.name}</td>
                  <td><a className="text" href={"https://maps.google.com/?q=" + i.address}>{i.address}</a></td>
                  <td className="text">{i.startTime} - {i.endTime}</td>
                  <td className="text">{i.phoneNumber}</td>
                  <td className="text">{i.orderNumber}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
        <div className="center">
        <span className="text">Store Number:   </span>
          <select value={storeNumber[0]} onChange={handleStoreChange}>
            {storeList.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <span>--</span>
          <label className="text">
            Time Windows Included?....
            <input
              type="checkbox"
              checked={timeWindows}
              onChange={handleTimeWindowsChange}
            />
          </label>
          <span>--</span>
          <button className="glass-green glass" onClick={Route}>ROUTE!</button>
        </div>
        </div>
      ) : null}


      {!initButton ? (
      <div>
        <p className="text">Routing Tab</p>
        <div>
          <button className="glass-red" onClick={exportToPdf}>
            <div className="tooltip-wrap">
              <img className="icon-image" src={pdf} alt="" />
                <div className="tooltip-content">
                  Download PDF of these results
                </div>
              </div>
          </button>
          <button className="tooltip-wrap glass-green" onClick={mapToggle}>
            <img className="icon-image" src={mapIcon} alt="" />
            <div className="tooltip-content">
              Display Map
            </div>
          </button>
          <button className="glass-lblue" onClick={qrToggle}>
            <div className="tooltip-wrap">
              <img className="icon-image" src={qrico} alt="" />
                <div className="tooltip-content">
                  Display GIANT QR code for driver
                </div>
              </div>
            </button>
          <button className="tooltip-wrap glass-lblue" onClick={() => {navigator.clipboard.writeText(newRouteLink)}}>
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
                  {routedData[0].map((i) => {
                    return (
                        <Marker
                          key={i["orderNumber"]}
                          position={[i.coordinates["lat"], i.coordinates["lng"]]}
                          icon={pinIcon}
                        >
                          <Popup>{i.oldRoute}</Popup>
                        </Marker>
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
                <td className="text">Name</td>
                <td className="text">Address</td>
                <td className="text">Time Window</td>
                <td className="text">Instruction</td>
                <td className="text">Phone #</td>
                <td className="text">ETA</td>
                <td className="text">Order #</td>
              </tr>
            </thead>
            <tbody>
            {routedData[0].map((i) => {
              return(
                <tr key={i.orderNumber}>
                  <td>{i.oldRoute}</td>
                  <td>{i.name}</td>
                  <td><a href={"https://maps.google.com/?q=" + i.address}>{i.address}</a></td>
                  <td>{i.startTime} - {i.endTime}</td>
                  <td className="text-center">
                    {i.instruction ? (
                      <div className="tooltip-wrap">
                          <img className="information-image"src={info} alt="" />
                          <div className="tooltip-content">
                            {i.instruction}
                          </div>
                      </div>
                    ) : null}
                  </td>
                  <td className="text-center"><a href={`tel:${i.phoneNumber}`}>{i.phoneNumber}</a></td>
                  <td>{i["ETA"]}</td>
                  <td>{i.orderNumber}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      </div>
      ) : null}
    </div>
  );
};

export default DotCom;
