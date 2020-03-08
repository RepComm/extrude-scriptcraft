
//Imports
var ExtrudeData = require("./extrude.data.js");
var ExtrudeMode = require("./extrude.mode.js");
var Material = org.bukkit.Material;

//Aliases
var PlayerInteractEvent = org.bukkit.event.player.PlayerInteractEvent;
var PlayerMoveEvent = org.bukkit.event.player.PlayerMoveEvent;
var Action = org.bukkit.event.block.Action;

/** Compare one value against an array of values
 * @param {any} toCompare
 * @param {Array<any>} against 
 * @param {Boolean} abs test with absolute === instead of ==
 */
function isAnyOf(toCompare, against, abs) {
  for (var i = 0; i < against.length; i++) {
    if (abs) {
      if (toCompare === against[i]) {
        return true;
      }
    } else {
      if (toCompare == against[i]) {
        return true;
      }
    }
  }
  return false;
}

/**A map of player name to their extrude data
 * @type {Map<String, ExtrudeData}
 */
var playersExtrudeData = {};

/**Get or create extrude data for a player
 * @param {String} playerName
 * @returns {ExtrudeData}
 */
function playerGetOrCreateExtrudeData(playerName) {
  var result = playersExtrudeData[playerName];
  if (result) return result;

  result = new ExtrudeData();

  playersExtrudeData[playerName] = result;
  return result;
}

//Actions we care about when listening to player interactions
var toolSwitchActions = [Action.RIGHT_CLICK_AIR, Action.RIGHT_CLICK_BLOCK];
var toolModeUseActions = [Action.LEFT_CLICK_BLOCK, Action.LEFT_CLICK_AIR];

/**Handles every player interact w/ block event
 * @param {PlayerInteractEvent} evt 
 */
function playerInteractEventListener(evt) {
  //Get the player, and his extrude data
  var player = evt.getPlayer();
  var extrudeData = playerGetOrCreateExtrudeData(player.getName());

  var block = evt.getClickedBlock(); //CAN BE NULL

  var itemInHand = evt.getItem();

  //If no item in hand, return
  if (!itemInHand) return;
  var itemMaterial = itemInHand.getType();

  //If we're using the player's set tool, we can do extrude-y things!
  if (itemMaterial === extrudeData.toolMaterial) {
    //Cancel the interaction event so it doesn't break/replace block
    evt.setCancelled(true);

    var action = evt.getAction();

    if (isAnyOf(action, toolSwitchActions)) {
      //Switch mode of tool
      extrudeData.mode.next();

      //Tell the player about it
      player.sendMessage(
        "[Extrude] Mode is now " + extrudeData.mode.mode
      );
    } else if (isAnyOf(action, toolModeUseActions)) {
      switch (extrudeData.mode.mode) {
        case ExtrudeMode.ADDBLOCK:
          //If we're not dealing with a block, return
          if (!evt.hasBlock()) return;
          
          if (extrudeData.addBlock(
            block.getX(),
            block.getY(),
            block.getZ(),
            block.getType()
          )) {
            var bxo = block.getX() % 2;
            var byo = block.getY() % 2;
            var bzo = block.getZ() % 2;
            var doBlack = false;
            if (bxo !== 0) doBlack = !doBlack;
            if (byo !== 0) doBlack = !doBlack;
            if (bzo !== 0) doBlack = !doBlack;
  
            if (doBlack) { //X IS EVEN
              block.setType(Material.BLACK_WOOL);
            } else {
              block.setType(Material.YELLOW_WOOL);
            }
          } else {
            player.sendMessage(
              "[Extrude] Cannot add block twice"
            );
            return;
          }
          break;
        case ExtrudeMode.REMOVEBLOCK:
          //If we're not dealing with a block, return
          if (!evt.hasBlock()) return;
          if (!extrudeData.removeBlock(
            block.getX(),
            block.getY(),
            block.getZ(),
            player
          )) {
            player.sendMessage(
              "[Extrude] That block wasn't recorded, no need to remove"
            );
            return;
          }
          break;
        case ExtrudeMode.CLEAR:
          extrudeData.clearBlocks(player);
          break;
        case ExtrudeMode.AUTOCLEAR:
          extrudeData.autoClear = !extrudeData.autoClear;
          break;
        case ExtrudeMode.AXIS:
          extrudeData.nextAxis();
          break;
        case ExtrudeMode.EXTRUDE:
          if (extrudeData.isExtruding) {
            extrudeData.doExtrude(player);
            extrudeData.setExtruding(false);
          } else {
            extrudeData.setExtruding(true);
            var loc = player.getLocation();
            extrudeData.setOrigin(
              loc.getBlockX(),
              loc.getBlockY(),
              loc.getBlockZ()
            );
            player.sendMessage("[Extrude] Origin " + extrudeData.origin.X + ", " + extrudeData.origin.Y + ", " + extrudeData.origin.Z);
          }
          break;
      }
      player.sendMessage(
        extrudeData.createLastActionMessage()
      );
    }
  }
}
events.on(PlayerInteractEvent, playerInteractEventListener);

function playerMoveEventListener(evt) {
  var player = evt.getPlayer();
  var pname = player.getName();
  /**@type {ExtrudeData} */
  var extrudeData = playersExtrudeData[pname];

  if (extrudeData && extrudeData.isExtruding) {
    var oldSteps = extrudeData.axisSteps;
    var loc = player.getLocation();
    switch (extrudeData.axis) {
      case ExtrudeData.AXIS.X:
        extrudeData.axisSteps = loc.getBlockX() - extrudeData.origin.X;
        break;
      case ExtrudeData.AXIS.Y:
        extrudeData.axisSteps = loc.getBlockY() - extrudeData.origin.Y;
        break;
      case ExtrudeData.AXIS.Z:
        extrudeData.axisSteps = loc.getBlockZ() - extrudeData.origin.Z;
        break;
    }
    if (oldSteps !== extrudeData.axisSteps) {
      player.sendMessage(
        "[Extrude] Now " + extrudeData.axisSteps + " in " + extrudeData.axis
      );
    }
  }

}
events.on(PlayerMoveEvent, playerMoveEventListener);
