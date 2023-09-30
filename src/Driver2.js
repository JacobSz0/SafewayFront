import React, { useState, useEffect } from "react";
import Routed from "./Routed";


function Driver2() {
  const [manifestBox, setManifestBox] = useState("");
  const [manifestData, setManifestData] = useState([{name:"pending...", address: "pending...", startTime: "pending...", endTime: "pending...", orderNumber: "pending..."}])
  const [routedData, setRoutedData] = useState([[{name:"Wait for it...", address: "", startTime: "", endTime: "", startTime24:"08:00", endTime24: "09:00", oldRoute: "", orderNumber: "pending...", instruction: "", coordinates:{lat:47.652690, lng:-122.688230}}]])
  const [storeNumber, setStoreNumber] = useState(["1508", [47.5688609, -122.2879537]])
  const [initButton, setInitButton] = useState(true)
  const [timeWindows, setTimeWindows] = useState(false)
  const [quantity, setQantity] = useState(false)
  const [disabled, setDisabled] = useState(true)
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

  function handleQuantityChange(){
    if (quantity===true){
      setQantity(false)
    }
    if (quantity===false){
      setQantity(true)
    }
  }

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
			setDisabled(false)
      var phone1508=[]
      const secretArray = secret.split("SIGNATURE");
      var secretArray2=[]
      var is1508=false
      for (var i of secretArray){
        var newd = i.split("\n").join(" ").split(" ")
        var nameBool=false
        var addressBool=false
        var trueAddressBool=false
        var instructionBool=false
        var phoneBool=true
        var stopBool=true
        var nameArr=[]
        var name=""
        var address=""
        var instruction=""
        var phoneNumber=""
        var orderNumber=""
        var cnt=0
        for (let j = 0; j < newd.length; j++) {
      //Route Letter/Number
          if (newd[j]==="FLEET"){
            var fleet=newd[j+1].split("-")
            var routeLetter=fleet[0]
          }
          if (stopBool===true && newd[j].length===3 && isNumeric(newd[j])){
            oldRoute=routeLetter+"-"+newd[j]
            stopBool=false
            nameBool=true
          }
          if (newd[2].length===3){
            var oldRoute=routeLetter+"-"+newd[2]
          }
      //Order Number
          if (newd[j]==="ORDER"){
            orderNumber=newd[j+1]
          }
      //Phone Number
          if (newd[j]==="DELIVERY" && newd[j-1]!=="EST"){
            phoneBool=false
          }
          if (phoneBool===true &&
            newd[j].length===10 &&
            isNumeric(newd[j])
          ){
            phoneNumber=newd[j]
          }
      //Time Window
          if (newd[j] === "WINDOW:"){
            stopBool=false
            nameBool=false
            cnt=0
            for (var k of nameArr){
              if (k!=="ORDER" && !isNumeric(k)){
                if (cnt<1){
                  name+=k
                }
                if (cnt>0){
                  name+=" "+k
                }
                cnt+=1
              }
            }
            var startTime=newd[j+1]+" "+newd[j+2]
            var endTime=newd[j+3]+" "+newd[j+4]
          }
      //Name
          if (nameBool===true){
            nameArr.push(newd[j])
          }
      //Address
          if (newd[j]==="ORDER"){
            addressBool=true
          }
          if (newd[j]==="RESTRICTED" || newd[j]==="EST" || newd[j].includes("AM") || newd[j].includes("FZ") || newd[j].includes("CH")){
            addressBool=false
          }
          if (addressBool===true){
            if (isNumeric(newd[j]) && newd[j].length<8){
              trueAddressBool=true
              var addressFresh=true
            }
            if (trueAddressBool===true){
              address+=newd[j]+" "
              if (newd[j]==="PM" || newd[j]==="WINDOW:" || newd[j]==="WINDOW" || newd[j]==="001" || newd[j]==="002" || newd[j]==="003" || newd[j]==="004" || newd[j]==="005" || newd[j]==="006" || newd[j]==="007" || newd[j]==="008" || newd[j]==="009" || newd[j]==="010" || newd[j]==="011" || newd[j]==="012" || newd[j]==="013" || newd[j]==="014" || newd[j]==="015"){
                address=""
              }
            }
            console.log(newd[j], newd[j].length===5 && isNumeric(newd[j]))
            if (newd[j].length===5 && isNumeric(newd[j]) && addressFresh===false){
              trueAddressBool=false
            }
            addressFresh=false
          }


          if (newd[j-1]==="INSTRUCTIONS:"){
            instructionBool=true
            cnt=1
          }
          if (newd[j]==="ORDER"){
            orderNumber=newd[j+1]
          }
          if (newd[j]==="INSTRUCTIONS"){
          instructionBool=true;
          cnt=0}
          if (newd[j]==="DRIVER" || newd[j]==="CUSTOMER"){
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
      if (is1508===true){
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
      }
        console.log(secretArray2)
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

  async function Route(){
    setStatus({"m":"Geolocating Data...", "color":"status-normal", "display":false})
		setDisabled(true)
    var coordinateManifest=manifestData
    var cnt=0
    var coordinateComplete=[]
    var count=0
    var apiKey="DqS4NCThFlPj61WbL-TLX-hqnzz28loSxsvmZ4TCdoc"
    for (var i of coordinateManifest){
      count+=1
      i["startTime24"]=convertTime(i.startTime)
      i["endTime24"]=convertTime(i.endTime)
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
    console.log(coordinateComplete)
    if (cnt===coordinateManifest.length){
      setStatus({"m":"Routing data...", "color":"status-normal", "display":false})

      const storeCoordinates2 = {"1508 (South Seattle MFC)": "47.5688609,-122.2879537", "1143 (North Seattle)": "47.6901322,-122.3761618", "1142 (Kirkland)": "47.6787852, -122.1733922", "1798 (Puyallup)": "47.151927947998,-122.35523223877", "1680 (Silverdale)": "47.6527018,-122.6881439", "1803 (Lake Stevens)": "48.004510,-122.118270", "3545 (Milton)": "47.249360,-122.296190", "2645 (Everett)": "47.875460,-122.153910", "1624 (Issaquah)": "47.541620,-122.048290", "1966 (Kent)": "47.357130,-122.166860"}

      var year = new Date().getFullYear()
      var month = new Date().getMonth()+1
      if (month<10){month="0"+month}
      var day = new Date().getDate()
      if (day<10){day="0"+day}
      var beginTime = coordinateComplete[0]["startTime24"]
      var offset = new Date().getTimezoneOffset();
      offset=offset/60

      var routerLink="https://wps.hereapi.com/v8/findsequence2?departure="+year+"-"+month+"-"+day+"T"+beginTime+":00-0"+offset+":00"+"&mode=fastest;car;traffic:enabled&start="+storeNumber[0]+";"+storeCoordinates2[storeNumber[0]]
      var cnt=0
      for (var i of coordinateComplete){
        cnt+=1
        if (timeWindows===true){
          var stop="&destination"+cnt+"="+i["orderNumber"]+";"+i["coordinates"]["lat"]+","+i["coordinates"]["lng"]+";acc:mo"+i["startTime24"]+":00-0"+offset+":00%7cmo"+i["endTime24"]+":00-0"+offset+":00;st:420" // The 420 is the amount of seconds between stops on average
        }
        else{
          var stop="&destination"+cnt+"="+i["orderNumber"]+";"+i["coordinates"]["lat"]+","+i["coordinates"]["lng"]+";st:300"
        }
        routerLink+=stop
      }
      if (quantity===true){
        console.log("Home store added")
        routerLink=routerLink+"&end="+11177777484+";"+storeCoordinates2[storeNumber[0]]
      }
      routerLink=routerLink+"&improveFor=TIME"+"&apikey=DqS4NCThFlPj61WbL-TLX-hqnzz28loSxsvmZ4TCdoc"
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
          setStatus({"m":"Success!", "color":"status-green", "display":true})
          setRoutedData(newRoute)
					setDisabled(false)
          routeTab()
        }
        else{setStatus({"m":"An Error occored: Try deselecting time windows", "color":"status-red"})}
      }

    }
  }

  const storeList=["1142 (Kirkland)", "1143 (North Seattle)", "1508 (South Seattle MFC)", "1624 (Issaquah)", "1680 (Silverdale)", "1798 (Puyallup)", "1803 (Lake Stevens)", "1966 (Kent)", "2645 (Everett)", "3545 (Milton)"]

  useEffect(() => {
    processData()
  }, [manifestBox]);


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
          <span className="text">Use the <a href="https://lens.google/">Google Lens</a> app to take a picture of your manifest. Make sure you copy ALL of the text and paste it into this text box. Remember to press Enter before adding another page. This data only exsits in your browser. If you refresh the browser, your progress will be lost.</span>
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
            Time Windows Included?{"  "}
            <label className="switch">
              <input type="checkbox"
                checked={timeWindows}
                onChange={handleTimeWindowsChange}
                disabled>
              </input>
              <span className="slider round"></span>
            </label>
          </label>
          <span>--</span>
					{disabled ? (
						<div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
					) : null}
					{!disabled ? (
						<button disabled={disabled} className="glass-green glass" onClick={Route}>ROUTE!</button>
					) : null}
          <div>
            <span className="text">Efficiency/Quantity{"  "}</span>
              <label className="switch text">
                <input type="checkbox"
                  checked={quantity}
                  onChange={handleQuantityChange}>
                </input>
                <span className="slider round"></span>
              </label>
            </div>
        </div>
        </div>
      ) : null}


      {!initButton ? (
      <div>
        <p className="text">Routing Tab</p>
        <Routed rtd={routedData} strnmb={storeNumber}/>
      </div>
      ) : null}
    </div>
  );
};

export default Driver2;
