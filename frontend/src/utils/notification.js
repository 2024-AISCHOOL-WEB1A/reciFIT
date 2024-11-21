import { apiAxios } from "./axiosUtils";

const PUBLIC_VAPID_KEY =
  "BFHz6c_yQi02hOxWeBgQQMuthqwH-ulYbiTuA87DNkunUA3OGAYqYit0nnetW4H9ibo6dOPhoOJOmOqLDcaTtX4";

// 알림 권한 요청
export const requestNotificationPermission = async () => {
  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else {
      console.error("Notification permission denied.");
    }
  }
};

// 푸시 구독 생성
export const subscribeToPush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: PUBLIC_VAPID_KEY,
    });

    console.log("Push subscription created:", subscription);

    // 서버에 구독 정보 저장
    await apiAxios.post(
      "/subscription", // 서버의 푸시 구독 저장 라우트
      subscription
    );

    // alert("푸시 알림 구독이 활성화되었습니다.");
  } catch (err) {
    console.error("Failed to subscribe to push notifications:", err);
    // alert("푸시 알림 구독 중 오류가 발생했습니다.");
  }
};
