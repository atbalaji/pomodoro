const playBeep = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Set tone and volume
  oscillator.type = 'sine'; // Other types: 'square', 'triangle', 'sawtooth'
  oscillator.frequency.setValueAtTime(1000, ctx.currentTime); // Hz
  gainNode.gain.setValueAtTime(0.1, ctx.currentTime); // Volume

  // Start and stop sound
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.5); // Play for 0.5 seconds
};

export default playBeep;