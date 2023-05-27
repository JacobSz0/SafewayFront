import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import "./Driver.css"
import JSpdf from "jspdf";
import QRCode from "qrcode.react";
import h2c from "html2canvas";
import info from "./img/info.png"
import pdf from "./img/pdf.png"
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


function Driver() {
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const [typingData, setTypingData] = useState([]);
  const [routedData, setRoutedData] = useState([[{name:"Wait for it...", address: "", startTime: "", endTime: "", oldRoute: "", orderNumber: "pending...", coordinates:{lat:47.652690, lng:-122.688230}}]])
  const [storeNumber, setStoreNumber] = useState(["1508", [47.5688609, -122.2879537]])
  const [initButton, setInitButton] = useState(true)
  const [newRouteLink, setNewRouteLink] = useState("http://localhost:4000/dotcom")
  const [showQr, setShowQr] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [timeWindows, setTimeWindows] = useState(true)
  const [status, setStatus] = useState({"m":"Initialize", "color":"status-normal", "display":false})
  const [helpfulTips, setHelpfulTips] = useState(false)
  const [timePreset] = useState(["", "8-12", "12-4", "1-5", "5-9", "6-10"])

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

  function isExclusivelyNumeric(value) {
    return /^-?\d+$/.test(value);
  }

  function isNumeric(value) {
    return /\d/.test(value);
  }

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

  function handleTimePresetChange(num, event){
    const preset = event.target.value;
    const olderData = [...typingData]
    console.log(preset)
    if (preset==="8-12"){
      typingData[num].startTime = "8:00 AM"
      typingData[num].endTime = "12:00 PM"
      console.log(typingData[0], num, preset)
    }
    if (preset==="12-4"){
      olderData[0].startTime = "12:00 PM"
      olderData[0].endTime = "4:00 PM"
    }
    if (preset==="1-5"){
      olderData[0].startTime = "1:00 PM"
      olderData[0].endTime = "5:00 PM"
    }
    if (preset==="5-9"){
      olderData[0].startTime = "5:00 PM"
      olderData[0].endTime = "9:00 PM"
    }
    if (preset==="6-10"){
      olderData[0].startTime = "6:00 PM"
      olderData[0].endTime = "10:00 PM"
    }
    setTypingData(olderData)
  }

  function handleTimeWindowsChange(){
    if (timeWindows===true){
      setTimeWindows(false)
    }
    if (timeWindows===false){
      setTimeWindows(true)
    }
  }

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

  function decipherText(secret){
    var secretArray=secret.split("SIGNATURE")
    console.log(secretArray)
    var secretArray2=typingData
    for (var i of secretArray){
       var spaceSplits = i.split("\n").join(" ").split(" ")

       var addressBool=false
       var instructionBool=false
       var name=""
       var address=""
       var instruction=""
       var phoneNumber=""
       var orderNumber=""
       var is1508=false
       var cnt=0
       for (let j = 0; j < spaceSplits.length; j++) {
        if (spaceSplits[j]==="FLEET" || spaceSplits[j]==="VAN"){
            var fleetVan=spaceSplits[j+1]
            var routeCnt=0
        }

        if (spaceSplits[j]==="|" || spaceSplits[j]==="}" || spaceSplits[j]==="{" || spaceSplits[j]==="i" || spaceSplits[j]==="l" || spaceSplits[j]==="/" || spaceSplits[j]==="=" || spaceSplits[j]==="`" || spaceSplits[j]==="’" || spaceSplits[j]==="'"){
            spaceSplits.splice(j, 1);  // Removes characters we don't like
        }
       }
       for (let j = 0; j < spaceSplits.length; j++) {
         if (spaceSplits[j]==="ORDER" && isNumeric(spaceSplits[j+1])){
            orderNumber=spaceSplits[j+1]
            name=spaceSplits[j-3]+" "+spaceSplits[j-2]+" "+spaceSplits[j-1]
         }
         if (spaceSplits[j]==="WINDOW:"){
            var startTime=spaceSplits[j+1]+" "+spaceSplits[j+2]
            var endTime=spaceSplits[j+4]+" "+spaceSplits[j+5]
        }
         if (spaceSplits[j-6]==="WINDOW:"){
            addressBool=true

         }
         if (spaceSplits[j]==="RESTRICTED"){
            addressBool=false
         }
         if (addressBool===true){
            cnt+=1
            if (cnt>3 && isExclusivelyNumeric(spaceSplits[j+1]) && spaceSplits[j+1].length===5){
                address+="WA, "+spaceSplits[j+1]
                addressBool=false
            }
            else{address+=spaceSplits[j]+" "}
         }

         if (spaceSplits[j].length===10 && isExclusivelyNumeric(spaceSplits[j])){
            phoneNumber=spaceSplits[j]
         }

         if (spaceSplits[j-1]==="NOTES"){
            instructionBool=true
         }
         if (spaceSplits[j]==="CUSTOMER"){
            instructionBool=false
         }
         if (instructionBool===true){
            instruction+=spaceSplits[j]+" "
         }

       }
        routeCnt+=1
        var secretObj={}
        secretObj["oldRoute"]=fleetVan+"-00"+routeCnt
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
        if (orderNumber!==""){
          secretArray2.push(secretObj)
        }
    }
    console.log(secretArray2)
    setTypingData(secretArray2)
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

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const convertToPng = (file) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          const pngFile = new File([blob], 'converted.png', { type: 'image/png' });
          console.log(pngFile)
          setStatus({"m":"Converting to Text...", "color":"status-normal", "display":false})
          Tesseract.recognize(pngFile, "eng", {
            logger: (m) => {
                if (m.status === "recognizing text") {
                setProgress(m.progress);
                }
            },
            }).then(({ data: { text } }) => {
                setStatus({"m":"Succesfully Converted Image", "color":"status-green", "display":false})
            decipherText(text)
            });
          // Use the `pngFile` for further processing, such as sending it to the server or displaying it in the UI
        }, 'image/png');
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };


  const processImage = () => {
    setStatus({"m":"Processing Image...", "color":"status-normal", "display":false})
    setProgress(0);
    console.log(file)
    if (file.type!=="image/png"){
        console.log("Convert to PNG")
        setStatus({"m":"Converting to PNG format...", "color":"status-normal", "display":false})
        convertToPng(file)
    }
    else{
        Tesseract.recognize(file, "eng", {
        logger: (m) => {
            if (m.status === "recognizing text") {
            setProgress(m.progress);
            }
        },
        }).then(({ data: { text } }) => {
            setStatus({"m":"Succesfully Converted Image", "color":"status-green", "display":false})
        decipherText(text)
        });
    }
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

  function condenseLink(bigData){
    console.log(bigData)
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
    var coordinateManifest=typingData
    var cnt=0
    var coordinateComplete=[]
    for (var i of coordinateManifest){
      i["startTime24"]=convertTime(i.startTime)
      i["endTime24"]=convertTime(i.endTime)
      const response = await fetch("https://geocode.search.hereapi.com/v1/geocode?q="+i.address+"&apiKey=DqS4NCThFlPj61WbL-TLX-hqnzz28loSxsvmZ4TCdoc");
      if (response.ok) {
        const data = await response.json();
        console.log(data)
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
        if (routeData.results[0]?.waypoints){
          var newRoute=[]
          for (var h of routeData.results){
          	var newOne=[]
            for (var i of h["waypoints"])
              for (var j of coordinateComplete){
                if (i["id"]===j["orderNumber"]){
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
          setStatus({"m":"Routing Success!", "color":"status-green", "display":true})
          setRoutedData(newRoute)
          //link maker for qr code
          condenseLink(newRoute)
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
      <input className="text" type="file" onChange={onFileChange} />
      {helpfulTips ? (
      <p className="text">When uploading image, please make sure the paper is as clear, as well-lit, and as flat as possible. Please wait until the text is loaded before adding another image. Please make sure the pages are in order otherwise the Route ID will be incorrect. For mobile users: It is recommended that you turn your device horizontal for easy viewing/editing of data. Unfortunatly, .PNG files preferred. Some images may not be accepted. Please reload page if any errors occor. MOST IMPORTANTLY: Please check to verify the data is correct! Image to text conversion will never be perfect. So always, always, always check before routing.</p>
      ) : null}
      <div style={{ marginTop: 10 }}>
        <input className="glass-blue glass" type="button" value="Convert" onClick={processImage} />
      </div>
      <div>
        <progress value={progress} max={1} />
      </div>
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
        {typingData.map((data, index) => (
          <tr key={index}>
            <td>
              <input className="oldRoute" name="oldRoute" value={data.oldRoute || ""} onChange={(e) => handleDataChange(index, e)} />
            </td>
            <td>
              <input className="name" name="name" value={data.name || ""} onChange={(e) => handleDataChange(index, e)} />
            </td>
            <td>
              <input className="address" name="address" value={data.address || ""} onChange={(e) => handleDataChange(index, e)} />
            </td>
            <td className="text">
              <input className="timeWindow" name="startTime" value={data.startTime || ""} onChange={(e) => handleDataChange(index, e)} />
              <input className="timeWindow" name="endTime" value={data.endTime || ""} onChange={(e) => handleDataChange(index, e)} />
              <select value={timePreset[0]} onChange={(e) => handleTimePresetChange(index, e)}>
                {timePreset.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </td>
            <td>
              <input className="phoneNumber" name="phoneNumber" value={data.phoneNumber || ""} onChange={(e) => handleDataChange(index, e)} />
            </td>
            <td>
              <input className="orderNumber" name="orderNumber" value={data.orderNumber || ""} onChange={(e) => handleDataChange(index, e)} />
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
  </>
  );
}

export default Driver;
