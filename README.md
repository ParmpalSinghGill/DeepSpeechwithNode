It streams pcm chunks from the browser's mic into a node server through websockets. Those chunks are piped into node-wav FileWriter.

To start run:

    node app.js

Then go to `http://localhost:3700` and make a recording. It should create a wav file in your project's folder.


To start the ASR with Node on terminal run:
    node NodjsAudioStreaming.js
    
To start the Nodejs from streaming from browser run:
    node appDeepSpeech.js
