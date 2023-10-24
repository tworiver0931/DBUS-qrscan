import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import beep from "./beep.mp3";

function Scanner() {
  const [scanResult, setScanResult] = useState(null);
  const [showScanSuccess, setShowScanSuccess] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
      verbose: false,
    });

    scannerRef.current = scanner;

    scanner.render(success, error);
    var audio = new Audio(beep);

    function success(result) {
      audio.play();
      // result: {fundId, left}
      setScanResult(JSON.parse(result));
      setShowScanSuccess(true);

      setTimeout(() => {
        setShowScanSuccess(false);
      }, 1500);
    }

    function error(err) {
      console.warn(err);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

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
      <div
        id="reader"
        style={{
          width: "500px",
          height: "500px",
          overflow: "hidden",
          borderRadius: "15px",
        }}
      />
      {showScanSuccess && (
        <div
          style={{
            width: "500px",
            height: "500px",
            border: "medium solid lime",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <a style={{ fontWeight: "bold", fontSize: "16px" }}>
            {scanResult.fundId}번 버스
          </a>
          <br />
          <a style={{ fontWeight: "bold", fontSize: "16px" }}>
            남은 티켓: {scanResult.left}
          </a>
        </div>
      )}
    </div>
  );
}

export default Scanner;
