
// Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service_worker.js")
      .then(registration => {
        console.log("Service Worker registered: ", registration);
      })
      .catch(registrationError => {
        console.log("Service Worker registration failed: ", registrationError);
      });
  });
}

let isPermitted = false;

// Notification Permission Request
const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      isPermitted = true;
    } else {
      throw new Error('Permission not granted for Notifications');
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error.message);
  }
}

// WebSocket Message Handling
export const handleWebSocketMessage = async (message) => {
  if (!isPermitted) {
    await requestPermission();
  }
  if (Notification.permission === 'granted') {

    const title = message.title;
    const options = {
      body: message.message,
      icon: '../../assets/logo.png'
    }

    // Sending a message to the service worker to show a notification
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title: title,
        options: options
      });

      const audio = new Audio('../../assets/notification.mp3');
      audio.play();
    } else {
      console.error('Service worker controller not available');
    }
  }
}