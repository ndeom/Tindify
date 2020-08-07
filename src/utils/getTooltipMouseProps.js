export default function getTooltipMouseProps({
  getXAndY,
  hovering,
  tooltipBody,
  revealTooltip,
  displayedText,
  setShowTooltip,
}) {
  return {
    onMouseOver: (e) => {
      getXAndY(e);
      hovering.current = true;
      tooltipBody.current = displayedText;
      revealTooltip(e);
    },
    onMouseOut: () => {
      hovering.current = false;
      setShowTooltip(false);
    },
  };
}
