/**@constructor
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z 
 */
function BlockLocation(x, y, z, material) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  this.material = material;
}
/**@static Create a log message of a block location
 * @returns {String} "<x>, <y>, <z>"
 */
BlockLocation.createLogMessage = function (blockLocation) {
  if (blockLocation === undefined) return " <you shouldn't be seeing this..>";
  return blockLocation.x + ", " + blockLocation.y + ", " + blockLocation.z;
}
/**Set an axis by its name
 * @param {"X"|"Y"|"Z"} axis
 * @param {Number} val
 */
BlockLocation.prototype.setAxis = function (axis, val) {
  if (axis === "X") {
    this.x = val;
    return;
  } else if (axis === "Y") {
    this.y = val;
    return;
  } else if (axis === "Z") {
    this.z = val;
    return;
  }

}
/**Add to an axis by its name
 * @param {"X"|"Y"|"Z"} axis
 * @param {Number} val number to add to the axis
 */
BlockLocation.prototype.addAxis = function (axis, val) {
  if (axis === "X") {
    this.x += val;
    return;
  } else if (axis === "Y") {
    this.y += val;
    return;
  } else if (axis === "Z") {
    this.z += val;
    return;
  }

}
BlockLocation.prototype.set = function (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}
BlockLocation.prototype.copyFrom = function (otherLoc) {
  this.x = otherLoc.x;
  this.y = otherLoc.y;
  this.z = otherLoc.z;
  this.material = otherLoc.material;
}
module.exports = BlockLocation;