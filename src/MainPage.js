import React, { useState, useEffect } from "react";
import JSpdf from "jspdf";
import QRCode from "qrcode.react";
import h2c from "html2canvas";
import Tooltip from "react-tooltip";
import info from "./img/info.png"

function MainPage() {

  const [main, setMain] = useState(true);
  const [routedData, setRoutedData] = useState([])
  const [showQr, setShowQr] = useState(false)


  function qrToggle(){
    if (showQr===false){setShowQr(true)}
    else if (showQr===true){setShowQr(false)}
  }

  function exportToPdf() {
    let elem = document.getElementById("toRender");
    elem.scrollIntoView();
    h2c(elem).then(canvas => {
      //document.body.appendChild(canvas)
      const img = canvas.toDataURL("image/png", 1);

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
  function convertTimeBack(t){
    var time=parseInt(t)
    if (time>12){
      var sttime=JSON.stringify(time-12)
      var time12=sttime+":00 PM"
    }
    else{
      var time12=t+":00 PM"
    }
    return time12
  }

  function doList(){
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const encodedData = urlParams.get('data');
      if (encodedData!==[]){
        setMain(false)
        const decodedData = decodeURIComponent(encodedData);
        var splittedData = decodedData.split("5z3")
        var goodData=[]
        for (var i of splittedData){
          var dashesRemoved=i.split("_")
          if (dashesRemoved.length>2){
            var singleRoute={}
            singleRoute["oldRoute"]=dashesRemoved[0]
            singleRoute["startTime"]=convertTimeBack(dashesRemoved[1])
            singleRoute["endTime"]=convertTimeBack(dashesRemoved[2])
            singleRoute["phoneNumber"]=dashesRemoved[3]
            singleRoute["orderNumber"]=dashesRemoved[4]
            var address=""
            var names=""
            var instruction=""
            var nameBool=true
            var addressBool=false
            var instructionBool=false
            for (let j = 5; j < dashesRemoved.length; j++) {
              if (dashesRemoved[j]==="5z1"){
                nameBool=false
              }
              if (dashesRemoved[j-1]==="5z1"){
                var addressBool=true
              }
              if (dashesRemoved[j]==="5z2"){
                addressBool=false
              }

              if (dashesRemoved[j-1]==="5z2"){
                var instructionBool=true
              }

              if (nameBool){
                names+=dashesRemoved[j]
                if (dashesRemoved[j]!=="5z1"){
                    names+=" "
                }
              }

              if (addressBool){
                address+=dashesRemoved[j]
                address+=" "
              }

              if (instructionBool){
                instruction+=dashesRemoved[j]
                instruction+=" "
              }
            }
            singleRoute["name"]=names
            singleRoute["address"]=address
            singleRoute["instruction"]=instruction
            singleRoute["instructionBool"]=instructionBool
            goodData.push(singleRoute)
          }
        }
        console.log(goodData);
        setRoutedData(goodData)
      }
  }
  useEffect(() => {doList()}, [])

  return (
    <>
    {main ? (
      <div>
        <br></br>
        <br></br>
        <h1 className="text">Routing App for DotCom</h1>
        <br></br>
        <br></br>
        <br></br>
        <h4 className="text">Select user</h4>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    ) : null}
    {!main ? (
      <div>
        <button onClick={exportToPdf}>Download PDF</button>
          <button onClick={qrToggle}>Show Giant QR Code</button>
          {showQr ? (
          <div className="qr">
            <QRCode value={window.location.href} size={512} />
          </div>
          ) : null}
      <table className="table bg-lite" id="toRender">
        <thead className="blue-background">
          <tr>
          <td className="text">Route ID</td>
            <td className="text">Name</td>
            <td className="text">Address</td>
            <td className="text">Inst</td>
            <td className="text">Time Window</td>
            <td className="text">Phone #</td>
            <td className="text">Order #</td>
          </tr>
        </thead>
        <tbody>
        {routedData.map((i) => {
          return(
            <tr key={i.orderNumber}>
              <td className="text-center">{i.oldRoute}</td>
              <td className="text-center">{i.name}</td>
              <td><a className="text-center" href={"https://maps.google.com/?q=" + i.address}>{i.address}</a></td>
              <td className="text-center">
                {i.instructionBool ? (
                    <div className="tooltip-wrap">
                        <img className="information-image"src={info} alt="" />
                        <div className="tooltip-content">
                            {i.instruction}
                        </div>
                    </div>
                ) : null}
              </td>
              <td className="text-center">{i.startTime} - {i.endTime}</td>
              <td className="text-center"><a href={`tel:${i.phoneNumber}`}>{i.phoneNumber}</a></td>
              <td className="text-center">{i.orderNumber}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
    ) : null}
    </>
  );
};

export default MainPage;
