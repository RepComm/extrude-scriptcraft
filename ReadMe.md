# Extrude - A minecraft/spigot/scriptcraft mod
Adds a tool for extruding along axis to minecraft

## Getting it running:

- You'll need Spigot (tested in 1.15.2)
  https://www.spigotmc.org/


- You'll need ScriptCraft
  https://github.com/walterhiggins/ScriptCraft

- Git clone or download/extract the zip

  Put `extrude` folder (containing `extrude.js`) <br/>
  in `scriptcraft/plugins` in Spigot directory

## Using:
1. Hold `minecraft:allium` in hand
2. **Right** click changes `mode`
3. **Left** click `operates` current mode

Modes:
- Add block (adds a block to selection)
- Remove block (removes from selection)
- Axis (sets X, Y, or Z to extrude in)
- Extrude (toggle start/finish)
- Auto Clear (toggle auto clear mode)
- Clear (manually clear selection)

Example Steps:
1. Switch mode to `Add Block`
  Click some blocks
3. Switch mode to `Axis`
  Set axis (Y is up)
4. Switch mode to `Extrude`
  Click to toggle `ON`<br>
  Walk in direction of Axis how many blocks<br>
  you want to extrude in<br>
  Click to `FINISH`
5. Profit