(function(window) {
  var client = new BinaryClient('ws://localhost:9001');
  client.on('open', function() {
    window.Stream = client.createStream();
    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio:true}, success, function(e) {
        alert('Error capturing audio.');
      });
    } else alert('getUserMedia not supported in this browser.');

    var recording = false;

    window.startRecording = function() {
      console.log("startRecording ");
      recording = true;
    }

    window.stopRecording = function() {
      console.log("stopRecording ");
      recording = false;
      window.Stream.end();
    }

    function success(e) {
      console.log(" success ");
      audioContext = window.AudioContext || window.webkitAudioContext;
      context = new audioContext({sampleRate : 16000});
      console.log(" context ",context);
      // the sample rate is in context.sampleRate
      audioInput = context.createMediaStreamSource(e);

      var bufferSize = 2048;
      recorder = context.createScriptProcessor(bufferSize, 1, 1);
      console.log(" recorder ",recorder);
      recorder.onaudioprocess = function(e){
        if(!recording) return;
        console.log ('recording');
        var left = e.inputBuffer.getChannelData(0);
        window.Stream.write(convertoFloat32ToInt16(left));
      }

      audioInput.connect(recorder)
      recorder.connect(context.destination); 
    }

    function convertoFloat32ToInt16(buffer) {
      var l = buffer.length;
      var buf = new Int16Array(l)
      while (l--) {
        buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
      }
      return buf.buffer
    }
  });
})(this);
