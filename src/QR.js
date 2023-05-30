import React, { useState } from "react";
import QRCode from "qrcode.react";

function QR() {
	const [newRouteLink, setNewRouteLink] = useState("")

	const handleManifestChange = (event) => {
    const value = event.target.value;
		setNewRouteLink(value)
	}

	function handleClear() {
		setNewRouteLink("")
	}

  return (
		<>
			<div className="textarea">
				<p className="text">Please paste the text of one manifest at a time. If you get an error, just reload the page and do only half the manifest.</p>
				<textarea rows={5}
					cols={50}
					onChange={handleManifestChange}
					value={newRouteLink}>
				</textarea>
				<button onClick={handleClear}>CLEAR</button>
			</div>
			<div className="qr">
				<QRCode value={newRouteLink} size={512} />
			</div>
		</>
  )
}

export default QR;