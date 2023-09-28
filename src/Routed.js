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

function Routed(props){
	const [routedData, setRoutedData] = useState([[{name:"Wait for it...", address: "", startTime: "", endTime: "", startTime24:"08:00", endTime24: "09:00", oldRoute: "", orderNumber: "pending...", instruction: "", coordinates:{lat:47.652690, lng:-122.688230}}]])
  const [storeNumber, setStoreNumber] = useState(["1508", [47.5688609, -122.2879537]])
	const [newRouteLink, setNewRouteLink] = useState("http://localhost:4000/dotcom")
	const [fullLink, setFullLink] = useState("http://localhost:4000/dotcom")
  const [showQr, setShowQr] = useState(false)
  const [showMap, setShowMap] = useState(false)

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

	function makeFullLink(bigData){
		var newLink="https://jacobsz0.github.io/SafewayFront?data="+JSON.stringify(bigData)
		setFullLink(newLink)
	}

	function condenseLink(bigData){
		console.log(bigData[0])
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

	useEffect(() => {
		console.log(routedData)
    condenseLink(routedData)
		makeFullLink(routedData)
		setRoutedData(props.rtd)
		setStoreNumber(props.strnmb)
  }, [routedData]);

	return(
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
			<button className="tooltip-wrap glass-lblue" onClick={() => {navigator.clipboard.writeText(fullLink)}}>
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
										></Marker>
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
	)
} export default Routed
