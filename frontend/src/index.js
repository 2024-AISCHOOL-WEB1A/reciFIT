import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={<div></div>} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

// 캐쉬 삭제 포함 서비스 워커 등록 (아직 미적용)
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/service-worker.js').then((registration) => {
//     console.log('Service Worker registered with scope:', registration.scope);

//     registration.onupdatefound = () => {
//       const installingWorker = registration.installing;

//       if (installingWorker) {
//         installingWorker.onstatechange = () => {
//           if (installingWorker.state === 'installed') {
//             if (navigator.serviceWorker.controller) {
//               // 새로운 콘텐츠가 있을 때
//               console.log('New content is available; please refresh.');
//               window.location.reload(); // 자동 새로고침
//             }
//           }
//         };
//       }
//     };
//   });
// }