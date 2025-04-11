import { useEffect } from "react";
import downsizeCanvasData from "./downsizeCanvasData";
import processImageData from "./processImageData";

// The core features that should stay the same as this:

// start user webcam
// display it in a video modal over the brain visualizer (can make hidden from view for now if hard)
// draw canvas onto video and make it within FEAGI dimension constraints
// downsize and process using the above 2 helper functions
// convert to uint8array and compress
// send via websocket

const ExampleWebcamProcessing = ({
  webcamOpen,
  setWebcamOpen,
  websocketOpen,
  websocket,
}) => {
  const streamRef = useRef(null);

  useEffect(() => {
    if (!webcamOpen || !websocketOpen || !videoRef.current) {
      console.log(
        `Conditions not met for webcam processing. webcamOpen: ${webcamOpen}. websocketOpen: ${websocketOpen}. videoRef.current: ${videoRef.current}`
      );
      return;
    }

    let stream = null;
    const mediaDevices = navigator.mediaDevices;

    mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((mediaStream) => {
        stream = mediaStream;
        streamRef.current = mediaStream;
        videoRef.current.srcObject = stream;

        videoRef.current.addEventListener("loadedmetadata", () => {
          videoRef.current.play();

          // Set up interval to continually process & send video as canvas data
          intervalIdRef.current = setInterval(() => {
            if (videoRef.current) {
              const canvas = document.createElement("canvas");

              function processFrame() {
                // Set canvas size to container dimensions
                const containerRect =
                  videoContainerRef.current?.getBoundingClientRect();
                canvas.width = containerRect?.width;
                canvas.height = containerRect?.height;
                const ctx = canvas.getContext("2d");

                // Draw video onto canvas matching object-fit cover
                const videoAspect =
                  videoRef.current.videoWidth / videoRef.current.videoHeight;
                const containerAspect =
                  containerRect.width / containerRect.height;

                let sourceWidth = videoRef.current.videoWidth;
                let sourceHeight = videoRef.current.videoHeight;

                // If container is wider than video (after maintaining aspect)
                if (containerAspect > videoAspect) {
                  sourceHeight = videoRef.current.videoWidth / containerAspect;
                } else {
                  // If container is taller than video (after maintaining aspect)
                  sourceWidth = videoRef.current.videoHeight * containerAspect;
                }

                ctx.drawImage(
                  videoRef.current,
                  0, // Start from top left
                  0,
                  sourceWidth, // How much of video to include
                  sourceHeight,
                  0, // Where to place in canvas
                  0,
                  containerRect.width, // Canvas dimensions
                  containerRect.height
                );

                if (websocket.current && sessionId && clusterId) {
                  const { downsizedData, newWidth, newHeight } =
                    downsizeCanvasData(
                      canvas,
                      feagiWidthRef.current,
                      feagiHeightRef.current
                    );

                  // Remove alpha values, add width & height
                  const processedData = processImageData(
                    downsizedData,
                    height,
                    width
                  ); // controller must have height, width -- this order!

                  // confirm right length for FEAGI (should be true)
                  // console.log(processedData.length === width * height * 3 + 2);

                  // Convert to JSON & UInt8Array & compress (lz4 requires uint8array)
                  const uInt8Array = new Uint8ClampedArray(processedData);
                  const compressed = lz4.compress(uInt8Array); // if can't use lz4 in React Native, need a library that produces same result

                  // Send via ws
                  if (websocketOpen && websocket.current) {
                    websocket.current.send(compressed); // or whatever method the websocket class uses
                  } else {
                    console.error(
                      "Websocket not open. Cannot send data. websocketOpen:",
                      websocketOpen,
                      "websocket.current:",
                      websocket.current
                    );
                  }
                }

                // Schedule next frame
                intervalIdRef.current = requestAnimationFrame(processFrame);
              }

              // Start the frame processing
              intervalIdRef.current = requestAnimationFrame(processFrame);
            }
          }, refreshRate);
        });
      })
      .catch((error) => {
        alert(error);
        handleClose();
      });

    // When the `webcamOpen` prop changes to false, stop the media stream and clear the interval
    return () => {
      // Clear video & stream tracks
      const tracks = [
        ...(streamRef.current?.getTracks() || []),
        ...(videoRef.current?.srcObject?.getTracks() || []),
      ];

      tracks.forEach((track) => {
        try {
          track.stop();
        } catch (err) {
          console.error("Error stopping track:", err);
        }
      });

      // Stop and clear the video stream
      if (videoRef.current) {
        console.log("Stopping video stream");
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        videoRef.current = null;
      }

      // Clear interval
      if (intervalIdRef.current) {
        console.log("Clearing sending interval");
        clearInterval(intervalIdRef.current);
      }

      // Setting webcamOpen to false
      console.log("Setting webcamOpen to false");
      setWebcamOpen(false);
    };
  }, [webcamOpen, websocketOpen, refreshRate]);

  return (
    <div
      ref={videoContainerRef}
      style={{
        marginTop: 1,
        aspectRatio: 1,
      }}
    >
      <video
        muted
        playsInline
        ref={videoRef}
        style={{
          height: "100%",
          width: "100%",
          aspectRatio: { ideal: 1 }, // make square if user camera has that option
          objectFit: "cover",
          objectPosition: "left top",
          transform: "scaleX(-1)", // horizontal flip 🐟💦
        }}
      >
        Webcam display pending or failed.
      </video>
    </div>
  );
};
