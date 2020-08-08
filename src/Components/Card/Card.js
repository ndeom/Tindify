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
import SpotifyWebApi from "spotify-web-api-js";

export default function Card({
  i,
  bind,
  styles,
  track,
  zIndex,
  gone,
  currentIndex,
  noPreviewWarning,
  setNoPreviewWarning,
  noDeviceWarning,
  setNoDeviceWarning,
  handleLikeOrDislike,
}) {
  const { userToken, userInfo, previewAudio } = useContext(userContext);
  const { cancelAudio, setCancelAudio, setActiveAudio } = useContext(
    cancelAudioContext
  );

  const [hasPremium] = useState(userInfo.product === "premium");

  //Check added due to some tracks missing "artist" field
  const [artists] = useState(
    track.track.artists
      ? track.track.artists.map((artist) => artist.name).join(", ")
      : ""
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

  //Handles event listeners for previewAudio
  useEffect(() => {
    const isCurrentIndex = currentIndex === i;
    if (!isCurrentIndex) return;

    previewAudio.addEventListener("loadeddata", () => setPreviewLoading(false));
    previewAudio.addEventListener("ended", () => setSongEnded(true));

    return () => {
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
      //console.log("Loading preview audio, index:", currentIndex);
      loadPreviewAudio();
    }

    if (hasPreview && !previewLoading) {
      //console.log("Starting preview playback, index: ", currentIndex);
      startPreviewPlayback();
    }

    if (!hasPreview) {
      //console.log("There isn't a preview, index: ", currentIndex);
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
      try {
        const spotify = new SpotifyWebApi();
        spotify.setAccessToken(userToken);
        //console.log("Checking for active devices");

        const devices = await spotify.getMyDevices();
        return devices;
      } catch (error) {
        console.error("Error getting user devices!", error);
      }
    };

    const startPremiumPlayback = async () => {
      try {
        const { devices } = await checkForActiveDevices();

        if (cancelAudio) {
          setCancelAudio(false);
        }

        if (!devices.length) {
          setNoDeviceWarning(true);
        } else {
          const spotify = new SpotifyWebApi();
          spotify.setAccessToken(userToken);
          setIsPlaying(true);
          setActiveAudio(true);
          setSongStarted(true);
          spotify.play({
            device_id: devices[0].id,
            uris: [uri],
            position_ms: 0,
          });
        }
      } catch (error) {
        console.error("Error starting premium playback!", error);
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
        playbackState={playbackState}
        currentIndex={currentIndex}
        hasPremium={hasPremium}
        songEnded={songEnded}
        setSongEnded={setSongEnded}
      />
      <ButtonControls
        primaryColor={primaryColor}
        uri={uri}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        playbackState={playbackState}
        gone={gone}
        i={i}
        handleLikeOrDislike={handleLikeOrDislike}
        hasPremium={hasPremium}
        noPreviewWarning={noPreviewWarning}
        noDeviceWarning={noDeviceWarning}
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
      setElementWidth(element.width);
      setScrollable(true);
    }
  }, []);

  return (
    <div className={`${containerClass} ${scrollable ? "scrollable" : ""}`}>
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
