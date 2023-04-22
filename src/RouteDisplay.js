import Tooltip from "react-tooltip";
import file from "./file.png"

const RouteDisplay = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedData = urlParams.get('data');
    const decodedData = decodeURIComponent(encodedData);
    var splittedData = decodedData.split("5z3")

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

    var routedData=[]
    for (var i of splittedData){
      var dashesRemoved=i.split("-")
      if (dashesRemoved.length>2){
        var singleRoute={}
        console.log(dashesRemoved[0])
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
        routedData.push(singleRoute)
      }
    }
    console.log(routedData);
    return(
        <div>
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
                            <img className="information-image"src={file} alt="" />
                            <div className="tooltip-content">
                                {i.instruction}
                            </div>
                        </div>
                    ) : null}
                  </td>
                  <td className="text-center">{i.startTime} - {i.endTime}</td>
                  <td className="text-center">{i.phoneNumber}</td>
                  <td className="text-center">{i.orderNumber}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
    )
}
export default RouteDisplay;
