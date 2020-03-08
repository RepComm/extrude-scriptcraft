/**Represents an extrude mode
 */
function ExtrudeMode() {
  this.mode = ExtrudeMode.ADDBLOCK;
}
ExtrudeMode.prototype.next = function () {
  switch (this.mode) {
    case ExtrudeMode.ADDBLOCK:
      this.mode = ExtrudeMode.REMOVEBLOCK;
      break;
    case ExtrudeMode.REMOVEBLOCK:
      this.mode = ExtrudeMode.AXIS;
      break;
      case ExtrudeMode.AXIS:
      this.mode = ExtrudeMode.EXTRUDE;
      break;
    case ExtrudeMode.EXTRUDE:
      this.mode = ExtrudeMode.AUTOCLEAR;
      break;
    case ExtrudeMode.AUTOCLEAR:
      this.mode = ExtrudeMode.CLEAR;
      break;
    //Add more modes here
    default:
      this.mode = ExtrudeMode.ADDBLOCK;
      break;
  }
}
ExtrudeMode.ADDBLOCK = "Add Block";
ExtrudeMode.REMOVEBLOCK = "Remove Block";
ExtrudeMode.EXTRUDE = "Extrude";
ExtrudeMode.AXIS = "Set Axis";
ExtrudeMode.CLEAR = "Clear Selection";
ExtrudeMode.AUTOCLEAR = "Change Auto-Clear Mode";

module.exports = ExtrudeMode;