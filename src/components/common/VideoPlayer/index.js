// taken from https://github.com/videojs/video.js/blob/master/docs/guides/react.md
import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import { useOutsideClick } from "shared/hooks";
import "video.js/dist/video-js.css";

const VideoPlayer = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  useOutsideClick(videoRef, () => playerRef.current.pause());

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      playerRef.current = videojs(videoElement, props, () => {
        console.log("player is ready");
      });
    }
  }, [videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-fluid vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;
