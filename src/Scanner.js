import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { Html5QrcodeScanner } from "html5-qrcode";

// const USETICKET_MUTATION = gql`
//   mutation useTicket($userId: String!, $fundId: String!) {
//     useTicket(userId: $userId, fundId: $fundId) {
//       ok
//       error
//     }
//   }
// `;

function Scanner() {
  const [scanResult, setScanResult] = useState(null);
  const [showScanSuccess, setShowScanSuccess] = useState(false);
  const [refresh, setRefresh] = useState(null);

  // const onCompleted = (data) => {};

  // const [useTicket, { loading }] = useMutation(USETICKET_MUTATION, {
  //   onCompleted,
  // });

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
      verbose: false,
    });
    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setScanResult(JSON.parse(result));
      console.log(result);
      setShowScanSuccess(true);

      setTimeout(() => {
        setShowScanSuccess(false);
        setRefresh((prev) => (prev == 1 ? 0 : 1));
      }, 2500);
    }

    function error(err) {
      console.warn(err);
    }
  }, [refresh]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>DBUS QR</h1>
      {showScanSuccess ? (
        <div
          style={{
            width: "500px",
            height: "500px",
            border: "solid",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <br />
          <a>{scanResult.fundId}번 버스</a>
          <br />
          <a>남은 티켓: {scanResult.left}</a>
        </div>
      ) : (
        <div id="reader" style={{ width: "500px", height: "500px" }} />
      )}
    </div>
  );
}

export default Scanner;
