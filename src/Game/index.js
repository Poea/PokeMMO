import {
  EDIT_MODE,
  MIN_SCALE,
  LEFT, RIGHT, UP, DOWN,
  CONNECTION_URL, CONNECTION_PORT
} from "../cfg";

import Engine from "../Engine";
import Input  from "../Engine/Input";
import Editor from "../Engine/Editor";
import Connection from "../Engine/Connection";

import * as Events from "./input.js";
import * as entities from "./entities";
import * as scenes from "./scenes";

/**
 * Game
 * @class Game
 * @export
 */
export default class Game {

  /**
   * @constructor
   */
  constructor() {

    this.canvasNode = document.querySelector("#canvas");
    this.glNode = document.querySelector("#webgl");
    this.uiNode = document.querySelector("#ui");

    this.entities = entities;

    this.scenes = scenes;

    this.engine = new Engine(this);

    this.engine.camera.scale = MIN_SCALE;

    this.setup();

  }

  /**
   * Setup
   * @param {Number} stage
   */
  setup(stage = stage === void 0 ? 0 : stage) {

    switch (++stage) {
      case 1:
        this.addWorld(() => this.setup(stage));
      return void 0;
      case 2:
        this.addMap(() => this.setup(stage));
      return void 0;
      case 3:
        this.addEntities(() => this.setup(stage));
      return void 0;
      case 4:
        //this.animateNPC();
        this.setup(stage);
      return void 0;
      case 5:
        /** Instant focus local player */
        this.engine.camera.focus(this.engine.getEntityByProperty("Felix", "name"), true);
        this.setup(stage);
      return void 0;
      case 6:
        if (EDIT_MODE) {
          this.engine.editor = new Editor(this.engine);
        }
        this.setup(stage);
      return void 0;
      case 7:
        window.rAF(() => this.engine.renderer.render());
        this.setup(stage);
      return void 0;
      case 8:
        this.input = new Input(Events, this);
        this.setup(stage);
      return void 0;
      case 9:
        this.engine.renderer.glRenderer.init();
        this.setup(stage);
      return void 0;
      case 10:
        this.engine.connection = new Connection(
          this,
          `${CONNECTION_URL}:${CONNECTION_PORT}`,
          null
        );
      return void 0;
    };

    return void 0;

  }

  animateNPC() {
    setTimeout(this::function() {
      let entity = this.engine.getEntityByProperty("Joy", "name");
      let move = [LEFT, RIGHT, UP, DOWN][(Math.random() * 3) << 0];
      entity.move(move);
      this.animateNPC();
    }, 2e3);
  }

  /**
   * Add world
   * @param {Function} resolve
   */
  addWorld(resolve) {
    this.engine.addWorld("worlds/kanto/index.js", resolve);
  }

  /**
   * Add map
   * @param {Function} resolve
   */
  addMap(resolve) {
    this.engine.addMap("worlds/kanto/town/town.json", resolve);
  }

  /**
   * Add entities
   * @param {Function} resolve
   */
  addEntities(resolve) {

    let player = this.entities.Player;

    this.engine.addEntity(new player({ name: "Joy", map: "Town", x: 120, y: 120, sprite: "assets/img/200.png", width: 16, height: 16, collidable: true,
      onCollide: {
        JavaScript: function(entity) {
          this.facing = this.oppositFacing(entity.facing);
        }
      }
    }));

    return (resolve());

  }

}

window.game = new Game();