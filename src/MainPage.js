import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Routed from "./Routed";

function MainPage() {

  const [main, setMain] = useState(true);
  const [routedData, setRoutedData] = useState([])


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
      if (encodedData!==null){
        setMain(false)
        try {
          // Parse the JSON string into a JavaScript object
          const dataArray = JSON.parse(encodedData); // Use 'encodedData' here
          console.log(dataArray)
          setRoutedData(dataArray[0])
          // Now dataArray is an array with its respective objects
          // You can work with it as needed
        } catch (error) {
          console.error('Error parsing JSON data:', error);
        }
        // var splittedData = decodedData.split("5z3")
        // var goodData=[]
        // for (var i of splittedData){
        //   var dashesRemoved=i.split("_")
        //   if (dashesRemoved.length>2){
        //     var singleRoute={}
        //     singleRoute["oldRoute"]=dashesRemoved[0]
        //     singleRoute["startTime"]=convertTimeBack(dashesRemoved[1])
        //     singleRoute["endTime"]=convertTimeBack(dashesRemoved[2])
        //     singleRoute["phoneNumber"]=dashesRemoved[3]
        //     singleRoute["orderNumber"]=dashesRemoved[4]
        //     var address=""
        //     var names=""
        //     var instruction=""
        //     var nameBool=true
        //     var addressBool=false
        //     var instructionBool=false
        //     for (let j = 5; j < dashesRemoved.length; j++) {
        //       if (dashesRemoved[j]==="5z1"){
        //         nameBool=false
        //       }
        //       if (dashesRemoved[j-1]==="5z1"){
        //         var addressBool=true
        //       }
        //       if (dashesRemoved[j]==="5z2"){
        //         addressBool=false
        //       }

        //       if (dashesRemoved[j-1]==="5z2"){
        //         var instructionBool=true
        //       }

        //       if (nameBool){
        //         names+=dashesRemoved[j]
        //         if (dashesRemoved[j]!=="5z1"){
        //             names+=" "
        //         }
        //       }

        //       if (addressBool){
        //         address+=dashesRemoved[j]
        //         address+=" "
        //       }

        //       if (instructionBool){
        //         instruction+=dashesRemoved[j]
        //         instruction+=" "
        //       }
        //     }
        //     singleRoute["name"]=names
        //     singleRoute["address"]=address
        //     singleRoute["instruction"]=instruction
        //     singleRoute["instructionBool"]=instructionBool
        //     goodData.push(singleRoute)
        //   }
        // }
        // console.log(goodData);
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
        <NavLink className="text" to="/newdotcom">
        <h2>DotCom</h2>
        </NavLink>
        <NavLink className="text" to="/driver2">
          <h2>Driver</h2>
        </NavLink>
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
      <Routed rtd={[routedData]}/>
    ) : null}
    </>
  );
};

export default MainPage;
