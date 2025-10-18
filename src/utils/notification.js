
const showNotification = () => {
  if(Notification.permission === 'granted') {
    new Notification("Pomodoro complete!", {
      body: "Take a short break."
    });
  }
};

export default showNotification;