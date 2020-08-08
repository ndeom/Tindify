import { useState, useEffect, useRef } from "react";

export default function useTooltip() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hovering, setHovering] = useState(false);
  const tooltipPosition = useRef({ x: 0, y: 0 });
  const tooltipBody = useRef("");

  const getXAndY = (e) => {
    tooltipPosition.current = { x: e.pageX, y: e.pageY };
    //console.log(tooltipPosition);
  };

  const getTooltipMouseProps = ({ displayedText }) => {
    return {
      onMouseOver: (e) => {
        getXAndY(e);
        setHovering(true);
        tooltipBody.current = displayedText;
      },
      onMouseOut: () => {
        setHovering(false);
      },
    };
  };

  useEffect(() => {
    let timeout;
    if (hovering) {
      timeout = setTimeout(() => {
        setShowTooltip(true);
      }, 800);
    }

    return () => {
      clearTimeout(timeout);
      setShowTooltip(false);
    };
  }, [hovering]);

  return {
    getXAndY,
    hovering,
    tooltipPosition,
    tooltipBody,
    getTooltipMouseProps,
    showTooltip,
    setShowTooltip,
  };
}
