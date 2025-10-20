
const showNotification = (msg) => {
  if(Notification.permission === 'granted') {
    new Notification("Pomodoro complete!", {
      body: msg
    });
  }
};

export default showNotification;