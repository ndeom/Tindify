import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useLayoutEffect,
} from "react";
import { userContext } from "../../UserProvider";
import { cancelAudioContext } from "../../App";
import { animated } from "react-spring";
import { Keyframes } from "react-spring/renderprops";
import hexToRgba from "../../utils/hexToRgba";
import TimeBar from "./TimeBar/TimeBar";
import ButtonControls from "./ButtonControls/ButtonControls";
import "./Card.scss";

export default function Card({
  i,
  bind,
  styles,
  track,
  zIndex,
  gone,
  currentIndex,
  setNoPreviewWarning,
  setNoDeviceWarning,
  handleLikeOrDislike,
  previewAudio,
}) {
  const { userToken, userInfo, spotify } = useContext(userContext);
  const { cancelAudio, setCancelAudio, setActiveAudio } = useContext(
    cancelAudioContext
  );

  const [hasPremium] = useState(userInfo.product === "premium");

  const [artists] = useState(
    track.track.artists.map((artist) => artist.name).join(", ") || ""
  );
  const [song] = useState(track.track.name || "");
  const [trackLength] = useState(track.track.duration_ms);
  const [primaryColor] = useState(track.primary_color || "#282828");
  const [albumArtArray] = useState(track.track.album.images);
  const [album] = useState(track.track.album.name);
  const [uri] = useState(track.track.uri);

  const playbackState = useRef({
    elapsed: 0,
    remaining: hasPremium ? trackLength : 30000,
  });

  const [hasPreview] = useState(track.track.preview_url || null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songStarted, setSongStarted] = useState(false);
  const [songEnded, setSongEnded] = useState(false);

  //Cancels audio for both premium and regular users
  useEffect(() => {
    if (cancelAudio && !hasPremium) {
      previewAudio.pause();
      setActiveAudio(false);
    }

    if (cancelAudio && hasPremium) {
      spotify.pause({ uris: [uri] });
      setActiveAudio(false);
    }
  });

  //Handles event listeners for previewAudio
  useEffect(() => {
    const isCurrentIndex = currentIndex === i;
    if (!isCurrentIndex) return;

    console.log("Event listeners added to index", currentIndex);
    previewAudio.addEventListener("loadeddata", () => setPreviewLoading(false));
    previewAudio.addEventListener("ended", () => setSongEnded(true));

    return () => {
      console.log("Event listeners removed from index", currentIndex);
      previewAudio.removeEventListener("loadeddata", () =>
        setPreviewLoading(false)
      );
      previewAudio.removeEventListener("ended", () => setSongEnded(true));
    };
  }, [currentIndex, i, previewAudio]);

  //Handles playback for preview audio
  useEffect(() => {
    const isCurrentIndex = currentIndex === i;
    if (!isCurrentIndex) return;
    if (hasPremium) return;
    if (songStarted) return;

    const loadPreviewAudio = () => {
      previewAudio.src = hasPreview;
    };

    const startPreviewPlayback = () => {
      if (cancelAudio) {
        setCancelAudio(false);
      }
      setSongStarted(true);
      setIsPlaying(true);
      setActiveAudio(true);
      previewAudio.play();
    };

    if (hasPreview && previewLoading) {
      console.log("Loading preview audio, index:", currentIndex);
      loadPreviewAudio();
    }

    if (hasPreview && !previewLoading) {
      console.log("Starting preview playback, index: ", currentIndex);
      startPreviewPlayback();
    }

    if (!hasPreview) {
      console.log("There isn't a preview, index: ", currentIndex);
      setNoPreviewWarning(true);
    }
  }, [
    previewLoading,
    previewAudio,
    hasPreview,
    cancelAudio,
    setActiveAudio,
    setCancelAudio,
    currentIndex,
    i,
    hasPremium,
    setNoPreviewWarning,
    songStarted,
  ]);

  //Handles playback for premium users
  useEffect(() => {
    const isCurrentIndex = currentIndex === i;
    if (!isCurrentIndex) return;
    if (!hasPremium) return;
    if (songStarted) return;

    const checkForActiveDevices = async () => {
      console.log("Checking for active devices");
      spotify.setAccessToken(userToken);
      const devices = await spotify.getMyDevices();
      return devices;
    };

    const startPremiumPlayback = async () => {
      const { devices } = await checkForActiveDevices();

      console.log("Active devices: ", devices);
      console.log("cancelAudio: ", cancelAudio);
      console.log("isPlaying: ", isPlaying, "index: ", currentIndex);

      if (cancelAudio) {
        setCancelAudio(false);
      }

      if (!devices.length) {
        setNoDeviceWarning(true);
      } else {
        setIsPlaying(true);
        setActiveAudio(true);
        setSongStarted(true);
        spotify.play({ device_id: devices[0].id, uris: [uri], position_ms: 0 });
      }
    };

    startPremiumPlayback();
  }, [
    cancelAudio,
    currentIndex,
    hasPremium,
    i,
    isPlaying,
    setActiveAudio,
    setCancelAudio,
    setNoDeviceWarning,
    songStarted,
    spotify,
    uri,
    userToken,
  ]);

  return (
    <animated.div {...bind(i)} style={{ ...styles }} className="card">
      <div
        className="background-color"
        style={{ backgroundColor: primaryColor }}
      ></div>
      <FadedEdges
        containerClass={"album-title"}
        primaryColor={primaryColor}
        children={album}
        zIndex={zIndex}
      />
      <img className="album-art" alt="Album Art" src={albumArtArray[1].url} />
      <FadedEdges
        containerClass={"track"}
        primaryColor={primaryColor}
        children={song}
        zIndex={zIndex}
      />
      <FadedEdges
        containerClass={"artist"}
        primaryColor={primaryColor}
        children={artists}
        zIndex={zIndex}
      />
      <TimeBar
        trackLength={trackLength}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        playbackState={playbackState}
        i={i}
        currentIndex={currentIndex}
        hasPremium={hasPremium}
        previewAudio={previewAudio}
        songEnded={songEnded}
        setSongEnded={setSongEnded}
      />
      <ButtonControls
        primaryColor={primaryColor}
        uri={uri}
        previewAudio={previewAudio}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        playbackState={playbackState}
        gone={gone}
        i={i}
        handleLikeOrDislike={handleLikeOrDislike}
        currentIndex={currentIndex}
        hasPremium={hasPremium}
      />
    </animated.div>
  );
}

function FadedEdges({ containerClass, children, primaryColor }) {
  const [scrollable, setScrollable] = useState(false);
  const [elementWidth, setElementWidth] = useState(0);

  const randomId = Math.floor(Math.random() * 1000);

  const ToAndFrom = Keyframes.Spring(async (next) => {
    while (true) {
      await next({
        delay: 3000,
        transform: `translateX(-${elementWidth - 250}px)`,
        from: { transform: `translateX(0px)` },
        config: {
          duration: ((elementWidth - 250) / 6) * 1000,
        },
      });
      await next({
        delay: 3000,
        transform: `translateX(0px)`,
        from: {
          transform: `translateX(-${elementWidth - 250}px)`,
        },
        config: {
          duration: ((elementWidth - 250) / 6) * 1000,
        },
      });
    }
  });

  useLayoutEffect(() => {
    const element = document
      .getElementById(`span-${randomId}`)
      .getBoundingClientRect();

    if (element.width > 250) {
      //console.log("width: ", element.width);
      setElementWidth(element.width);
      setScrollable(true);
    }
  }, []);

  return (
    <div className={containerClass}>
      <span
        className="left-gradient"
        style={{
          background: `linear-gradient(90deg, 
    ${hexToRgba(primaryColor, 1)} 50%, ${hexToRgba(primaryColor, 0)})`,
        }}
      ></span>
      {scrollable ? (
        <ToAndFrom>
          {(styles) => (
            <span
              style={styles}
              id={`span-${randomId}`}
              className={`${containerClass}-span ${
                scrollable ? "scrollable" : ""
              }`}
            >
              {children}
            </span>
          )}
        </ToAndFrom>
      ) : (
        <span
          id={`span-${randomId}`}
          className={`${containerClass}-span ${scrollable ? "scrollable" : ""}`}
        >
          {children}
        </span>
      )}
      <span
        className="right-gradient"
        style={{
          background: `linear-gradient(-90deg, 
    ${hexToRgba(primaryColor, 1)} 50%, ${hexToRgba(primaryColor, 0)})`,
        }}
      ></span>
    </div>
  );
}
