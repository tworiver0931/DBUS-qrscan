import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import beepSound from "./beep.mp3";
import emptySound from "./empty.mp3";
import invalidSound from "./invalid.mp3";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";

const USETICKET_MUTATION = gql`
  mutation useTicket($userId: Int!, $fundId: Int!) {
    useTicket(userId: $userId, fundId: $fundId) {
      ok
      error
    }
  }
`;

function Scanner() {
  const [UseTicketMutation, { data }] = useMutation(USETICKET_MUTATION);

  const [scanResult, setScanResult] = useState(null);
  const [showScanSuccess, setShowScanSuccess] = useState(null);
  const scannerRef = useRef(null);

  const fundId = 2;

  useEffect(() => {
    var beepAudio = new Audio(beepSound);
    var invalidAudio = new Audio(invalidSound);
    var emptyAudio = new Audio(emptySound);

    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 220,
        height: 220,
      },
      fps: 5,
      verbose: false,
    });

    scannerRef.current = scanner;

    scanner.render(success, error);

    // 5초 뒤 초기화
    setTimeout(() => {
      const stopCameraButton = document.getElementById(
        "html5-qrcode-button-camera-stop"
      );
      console.log(stopCameraButton);
      if (stopCameraButton) {
        stopCameraButton.remove();
      }

      const readerDashboard = document.getElementById("reader__dashboard");
      console.log(readerDashboard);
      if (readerDashboard) {
        readerDashboard.remove();
      }

      const reader = document.getElementById("reader");
      console.log(reader);
      if (reader) {
        reader.style.border = "none";
        reader.style.borderRadius = "12px";
      }
    }, 5000);

    function success(result) {
      scanner.pause();
      result = JSON.parse(result);

      console.log(result);

      if (result.fundId !== fundId) {
        invalidAudio.play();
        setShowScanSuccess("invalid");
        setScanResult("올바른 큐알코드를 대주세요");
      } else if (result.left <= 0) {
        emptyAudio.play();
        setShowScanSuccess("empty");
        setScanResult("티켓이 부족합니다");
      } else {
        beepAudio.play();
        setScanResult(result);
        setShowScanSuccess("accept");

        UseTicketMutation({
          variables: { userId: result.userId, fundId: result.fundId },
        });
      }

      setTimeout(() => {
        scanner.resume();
        setShowScanSuccess(null);
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
        width: "500px",
        height: "450px",
        borderRadius: 15,
        border: `${
          showScanSuccess == "accept"
            ? "thick solid lime"
            : showScanSuccess === "empty" || showScanSuccess === "invalid"
            ? "thick solid red"
            : "medium solid navy"
        }`,
        backgroundColor: `${
          showScanSuccess == "accept"
            ? "rgba(0,255,0,0.5)"
            : showScanSuccess === "empty" || showScanSuccess === "invalid"
            ? "rgba(255,0,0,0.5)"
            : "rgba(0,0,0,0.01)"
        }`,
      }}
    >
      <div
        id="reader"
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {showScanSuccess == "accept" ? (
          <h3>{scanResult.left}</h3>
        ) : showScanSuccess === "empty" || showScanSuccess === "invalid" ? (
          <h4 style={{ color: "navy" }}>DBUS</h4>
        ) : (
          <h4 style={{ color: "navy" }}>DBUS</h4>
        )}
      </div>
    </div>
  );
}

export default Scanner;
