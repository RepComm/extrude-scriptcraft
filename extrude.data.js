
var ExtrudeMode = require("./extrude.mode.js");
var BlockLocation = require("./extrude.block.location.js");

var Material = org.bukkit.Material;

function ExtrudeData() {
  this.mode = new ExtrudeMode();
  this.axis = ExtrudeData.AXIS.X;
  this.toolMaterial = Material.ALLIUM;
  /**@type {Array<BlockLocation} */
  this.blocks = new Array();
  /**@type {BlockLocation} */
  this.lastBlockInteract;
  this.isExtruding = false;
  this.axisSteps = 0;
  this.origin = {X:0, Y:0, Z:0};
  this.autoClear = true; //Auto-clear selection after extruding
}
ExtrudeData.prototype.setExtruding = function (val) {
  this.isExtruding = val;
  this.axisSteps = 0;
}
ExtrudeData.prototype.setOrigin = function (x, y, z) {
  this.origin.X = x;
  this.origin.Y = y;
  this.origin.Z = z;
}
ExtrudeData.prototype.createLogMessage = function () {
  return "[Extrude] " + this.mode.mode;
}
ExtrudeData.prototype.createLastActionMessage = function () {
  var msg = "[Extrude]";
  switch (this.mode.mode) {
    case ExtrudeMode.ADDBLOCK:
      msg += " Added " + BlockLocation.createLogMessage(this.lastBlockInteract);
      break;
    case ExtrudeMode.REMOVEBLOCK:
      msg += " Removed " + BlockLocation.createLogMessage(this.lastBlockInteract);
      break;
    case ExtrudeMode.AXIS:
      msg += " Axis > " + this.axis;
      break;
    case ExtrudeMode.CLEAR:
      msg += " Cleared Selection";
      break;
      case ExtrudeMode.AUTOCLEAR:
        if (this.autoClear) {
        msg += " Auto Clear ON";
        } else {
          msg += " Auto Clear OFF";
        }
        break;
    case ExtrudeMode.EXTRUDE:
      if (this.isExtruding) {
        msg += " Extrude ON";
      } else {
        msg += " Extrude OFF/FINISH";
      }
      break;
  }
  return msg;
}
ExtrudeData.prototype.addBlock = function (x, y, z, material) {
  var result;
  for (var i=0; i<this.blocks.length; i++) {
    result = this.blocks[i];
    if (result.x === x && result.y === y && result.z === z) return false;
  }
  var result = new BlockLocation(x, y, z, material);
  this.blocks.push(result);
  this.lastBlockInteract = result;
  return true;
}
ExtrudeData.prototype.removeBlock = function (x, y, z, player) {
  var bl, b, world = player.getWorld();
  for (var i = 0; i < this.blocks.length; i++) {
    bl = this.blocks[i];
    if (bl.x == x && bl.y == y && bl.z == z) {
      this.lastBlockInteract = bl;
      this.blocks.splice(i, 1);
      b = world.getBlockAt(x, y, z);
      b.setType(bl.material);
      return true;
    }
  }
  return false;
}
ExtrudeData.prototype.clearBlocks = function (player) {
  var world = player.getWorld();
  var len = this.blocks.length;
  var bl;
  var b;
  for (var i=0; i<len; i++) {
    bl = this.blocks[i];
    b = world.getBlockAt(bl.x, bl.y, bl.z);
    b.setType(bl.material);
  }
  this.blocks.length = 0;
  this.lastBlockInteract = undefined;
  return len;
}
ExtrudeData.prototype.nextAxis = function () {
  switch (this.axis) {
    case ExtrudeData.AXIS.X:
      this.axis = ExtrudeData.AXIS.Y;
      break;
    case ExtrudeData.AXIS.Y:
      this.axis = ExtrudeData.AXIS.Z;
      break;
    case ExtrudeData.AXIS.Z:
      this.axis = ExtrudeData.AXIS.X;
      break;
  }
}
ExtrudeData.prototype.doExtrude = function (player) {
  if (this.axisSteps === 0) return;
  
  var world = player.getWorld();
  var originalBlockLoc;
  var originalBlock;

  var newBlockLoc = new BlockLocation(0, 0, 0);
  var newBlock;

  for (var bi=0; bi<this.blocks.length; bi++) {
    originalBlockLoc = this.blocks[bi];
    originalBlock = world.getBlockAt(originalBlockLoc.x, originalBlockLoc.y, originalBlockLoc.z);

    if (this.axisSteps > 0) {
      //Positive direction
      
      //Step through axis
      for (var i=0; i<this.axisSteps; i++) {
        //Copy from original block location
        newBlockLoc.copyFrom(originalBlockLoc);

        //Modify the axis we're extruding in by adding current step
        newBlockLoc.addAxis(this.axis, i);

        //Get the block in the world at the new point
        newBlock = world.getBlockAt(newBlockLoc.x, newBlockLoc.y, newBlockLoc.z);

        //Copy the original block material to the new block
        //newBlock.setType(originalBlock.getType());
        newBlock.setType(originalBlockLoc.material);
      }
    } else if (this.axisSteps < 0) {
      //Negative direction
      
      //Step through axis
      for (var i=this.axisSteps; i<0; i++) {
        //Copy from original block location
        newBlockLoc.copyFrom(originalBlockLoc);

        //Modify the axis we're extruding in by adding current step
        newBlockLoc.addAxis(this.axis, i);

        //Get the block in the world at the new point
        newBlock = world.getBlockAt(newBlockLoc.x, newBlockLoc.y, newBlockLoc.z);

        //Copy the original block material to the new block
        //newBlock.setType(originalBlock.getType());
        newBlock.setType(originalBlockLoc.material);
      }
    }
  }
  if (this.autoClear) {
    player.sendMessage("[Extrude] AutoClear: Cleared selected blocks");
    this.clearBlocks(player);
  }
}
ExtrudeData.AXIS = { X: "X", Y: "Y", Z: "Z" };

module.exports = ExtrudeData;