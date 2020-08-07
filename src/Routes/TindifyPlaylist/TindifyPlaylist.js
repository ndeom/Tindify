import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { userContext } from "../../UserProvider";
import getTooltipMouseProps from "../../utils/getTooltipMouseProps";
import Loading from "../../Components/Loading/Loading";
import { ReactComponent as More } from "../../Components/Images/more.svg";
import { ReactComponent as Clock } from "../../Components/Images/clock.svg";
import { ReactComponent as BeamNote } from "../../Components/Images/beamnote.svg";
import SpotifyWebApi from "spotify-web-api-js";
import "./TindifyPlaylist.scss";

export default function TindifyPlaylist() {
  const { spotify, userInfo, userToken } = useContext(userContext);
  const [playlist, setPlaylist] = useState([]);
  const [playlistId, setPlaylistId] = useState("");
  const [playlistSnapshot, setPlaylistSnapshot] = useState("");
  const [playlistCover, setPlaylistCover] = useState("");
  const [noPlaylist, setNoPlaylist] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);
  const hovering = useRef(false);
  const tooltipPosition = useRef({ x: 0, y: 0 });
  const tooltipBody = useRef("");

  const [showMenu, setShowMenu] = useState(false);
  const clickRef = useRef(null);
  const [moreIndex, setMoreIndex] = useState(null);
  const morePosition = useRef({ x: 0, y: 0 });

  const revealTooltip = (e) => {
    setTimeout(() => {
      if (hovering.current) {
        setShowTooltip(true);
      }
    }, 1000);
  };

  const getXAndY = (e) => {
    tooltipPosition.current = { x: e.pageX, y: e.pageY };
  };

  const handleClick = (e) => {
    if (e.target.className === "more-menu-li") return;
    setShowMenu(false);
  };

  const handleShowMenu = (e, i) => {
    setMoreIndex(i);
    morePosition.current = { x: e.pageX, y: e.pageY };
    if (!showMenu) setShowMenu(true);
  };

  const handleRemoveIndex = useCallback(async () => {
    //Remove index
    setPlaylist([
      ...playlist.slice(0, moreIndex),
      ...playlist.slice(moreIndex + 1),
    ]);
    //Make request to remove from spotify playlist
    const spotify = new SpotifyWebApi();
    spotify.setAccessToken(userToken);

    try {
      const newSnapshot = await spotify.removeTracksFromPlaylistInPositions(
        playlistId,
        [moreIndex],
        playlistSnapshot
      );
      setPlaylistSnapshot(newSnapshot.snapshot_id);
    } catch (error) {
      console.error("Error removing track from Tindify playlist!", error);
    }
  }, [moreIndex, playlist, playlistId, playlistSnapshot, userToken]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  });

  useEffect(() => {
    if (!playlist.length && !noPlaylist) {
      setLoading(true);
      spotify.setAccessToken(userToken);
      spotify
        .getUserPlaylists(userInfo.id)
        .then(({ items: userPlaylists }) => {
          const tindify = userPlaylists.filter(
            (playlist) => playlist.name === "Tindify"
          )[0];

          console.log("tindify: ", tindify);

          if (tindify.images.length) {
            setPlaylistCover(tindify.images[0].url);
          }

          if (!playlistId) {
            setPlaylistId(tindify.id);
          }

          if (!playlistSnapshot) {
            setPlaylistSnapshot(tindify.snapshot_id);
          }

          spotify.getPlaylistTracks(tindify.id).then((tracks) => {
            if (!tracks.items.length) {
              setNoPlaylist(true);
            } else {
              setPlaylist(tracks.items);
            }

            setLoading(false);

            console.log("tracks from playlist: ", tracks);
          });
        })
        .catch((err) => {
          console.error("Error getting user's Tindify playlist!", err);
        });
    }
  }, [
    noPlaylist,
    playlist,
    playlistId,
    playlistSnapshot,
    spotify,
    userInfo.id,
    userToken,
  ]);

  return (
    <div id="tindify-playlist-container" ref={clickRef}>
      <div id="tindify-header">
        <div id="playlist-cover">
          {playlistCover ? (
            <img
              id="playlist-cover-image"
              alt="Tindify Playlist Cover"
              src={playlistCover}
            ></img>
          ) : (
            <BeamNote id="beam-note" />
          )}
        </div>
        <h1>My Tindify</h1>
      </div>
      <div id="tindify-playlist">
        <ul>
          <li id="title-row" className="playlist-row">
            <span>TITLE</span>
            <span>ARTIST</span>
            <span>ALBUM</span>
            <span id="clock">
              <Clock id="clock-svg" />
            </span>
          </li>
          {!!playlist.length &&
            playlist.map((song, i) => (
              <PlaylistRow
                key={`playlist-row-${i}`}
                song={song}
                hovering={hovering}
                getXAndY={getXAndY}
                tooltipBody={tooltipBody}
                revealTooltip={revealTooltip}
                setShowTooltip={setShowTooltip}
                showMenu={showMenu}
                //setShowMenu={setShowMenu}
                moreIndex={moreIndex}
                i={i}
                //morePosition={morePosition}
                //handleClick={handleClick}
                handleShowMenu={handleShowMenu}
              />
            ))}
        </ul>
        {!!loading && <Loading />}
        {!!noPlaylist && (
          <div id="no-playlist-warning">
            <div id="line-1">This playlist is currently empty</div>
            <div id="line-2">Find more music by heading to Browse.</div>
            <Link
              to={{ pathname: "/browse" }}
              id="no-playlist-button-container"
            >
              <button id="no-playlist-button">Browse</button>
            </Link>
          </div>
        )}
      </div>
      <Tooltip
        position={tooltipPosition.current}
        visible={showTooltip}
        body={tooltipBody.current}
      />
      {!!showMenu && (
        <MoreMenu
          handleRemoveIndex={handleRemoveIndex}
          morePosition={morePosition.current}
          setShowMenu={setShowMenu}
        />
      )}
    </div>
  );
}

function Tooltip({ position, visible, body }) {
  return (
    <div
      className={`tooltip ${visible ? "visible" : ""}`}
      style={{
        left: position.x + "px",
        top: position.y + 16 + "px",
      }}
    >
      <div className="tooltip-arrow"></div>
      <div className="tooltip-body">{`${body}`}</div>
    </div>
  );
}

function PlaylistRow({
  song,
  hovering,
  getXAndY,
  tooltipBody,
  revealTooltip,
  setShowTooltip,
  showMenu,
  moreIndex,
  i,
  handleShowMenu,
}) {
  const artists = song.track.artists.map((artist) => artist.name).join(", ");
  //const [showMenu, setShowMenu] = useState(false);

  return (
    <li className="playlist-row">
      <span
        className="playlist-song-title"
        {...getTooltipMouseProps({
          getXAndY,
          hovering,
          tooltipBody,
          revealTooltip,
          displayedText: song.track.name,
          setShowTooltip,
        })}
      >
        {stringShortener(song.track.name)}
      </span>
      <span
        className="playlist-artist"
        {...getTooltipMouseProps({
          getXAndY,
          hovering,
          tooltipBody,
          revealTooltip,
          displayedText: artists,
          setShowTooltip,
        })}
      >
        {stringShortener(artists)}
      </span>
      <span
        className="playlist-album"
        {...getTooltipMouseProps({
          getXAndY,
          hovering,
          tooltipBody,
          revealTooltip,
          displayedText: song.track.album.name,
          setShowTooltip,
        })}
      >
        {stringShortener(song.track.album.name)}
      </span>
      <span
        className={`more ${showMenu && moreIndex === i ? "active" : ""}`}
        onClick={(e) => {
          handleShowMenu(e, i);
        }}
        {...getTooltipMouseProps({
          getXAndY,
          hovering,
          tooltipBody,
          revealTooltip,
          displayedText: "More",
          setShowTooltip,
        })}
      >
        <More className="more-svg" />
        {/* {!!showMenu && <MoreMenu />} */}
      </span>
      {/* {!!showMenu && <MoreMenu morePosition={morePosition.current} />} */}
      <span className="playlist-date-added">{formatTime(song.added_at)}</span>
    </li>
  );
}

function MoreMenu({ morePosition, handleRemoveIndex, setShowMenu }) {
  console.log("moreMenu position: ", morePosition);
  return (
    <ul
      className="more-menu"
      style={{
        left: morePosition.x - 164 + "px",
        top: morePosition.y + 10 + "px",
      }}
    >
      <li
        className="more-menu-li"
        onClick={() => {
          handleRemoveIndex();
          setShowMenu(false);
        }}
      >
        Remove from Playlist
      </li>
    </ul>
  );
}

function formatTime(time) {
  const date = new Date(time);
  const timeSinceSongAdded = Date.now() - date;
  const minutes = timeSinceSongAdded / 1000 / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const months = days / 30;
  const years = months / 365;

  if (minutes < 60) {
    return `${Math.round(minutes)} minutes ago`;
  }

  if (hours < 24) {
    return `${Math.round(hours)} hours ago`;
  }

  if (days < 30) {
    return `${Math.round(days)} days ago`;
  }

  if (months < 12) {
    return `${Math.round(months)} months ago`;
  }

  return `${Math.round(years)} years ago`;
}

function stringShortener(string) {
  return string.length > 20 ? `${string.slice(0, 20)}...` : string;
}
