// Safe stub that won't throw errors
try {
	class AudioWorkletProcessor {}
	if (typeof registerProcessor !== 'undefined') {
	  registerProcessor('audio-position', class extends AudioWorkletProcessor {
		process() { return true; }
	  });
	}
  } catch (e) {
	// Silently fail
  }