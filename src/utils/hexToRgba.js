export default function hexToRgbA(hex, alpha, brightness) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    //console.log("c is = ", c);

    let rgb = [(c >> 16) & 255, (c >> 8) & 255, c & 255];

    if (brightness) {
      rgb = rgb.map((color) => {
        return color * brightness <= 255 ? color * brightness : 255;
      });
    }

    return "rgba(" + rgb + "," + alpha + ")";
  }
  throw new Error("Bad Hex");
}
