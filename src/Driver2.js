import React, { useState } from "react";

function Driver2() {
  const [typingData, setTypingData] = useState([{ oldRoute: "" }]);

  const handleDataChange = (index, event) => {
    const { name, value } = event.target;
    const updatedData = [...typingData];
    updatedData[index][name] = value;
    setTypingData(updatedData);
  };

  const handleAddEntry = () => {
    setTypingData([...typingData, {}]);
  };

  return (
    <>
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
                <td className="text">
                  <input name="oldRoute" value={data.oldRoute || ""} onChange={(e) => handleDataChange(index, e)} />
                </td>
                <td className="text">
                  <input name="name" value={data.name || ""} onChange={(e) => handleDataChange(index, e)} />
                </td>
                <td className="text">
                  <input name="address" value={data.address || ""} onChange={(e) => handleDataChange(index, e)} />
                </td>
                <td className="text">
                  <input name="timeWindowStart" value={data.timeWindowStart || ""} onChange={(e) => handleDataChange(index, e)} /> -{" "}
                  <input name="timeWindowEnd" value={data.timeWindowEnd || ""} onChange={(e) => handleDataChange(index, e)} />
                </td>
                <td className="text">
                  <input name="phoneNumber" value={data.phoneNumber || ""} onChange={(e) => handleDataChange(index, e)} />
                </td>
                <td className="text">
                  <input name="orderNumber" value={data.orderNumber || ""} onChange={(e) => handleDataChange(index, e)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAddEntry}>Manually Add Stop</button>
      </div>
    </>
  );
}

export default Driver2;