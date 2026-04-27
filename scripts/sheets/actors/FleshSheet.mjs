// @ts-nocheck

import { VermisActorSheet } from "../../Actor-Sheet.mjs";

export class FleshSheet extends VermisActorSheet {
  static DEFAULT_OPTIONS = {
    classes: ["flesh-sheet"]
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.resourceBars.xp = this._getResourceBar(this.actor.system.resources?.xp);

    return context;
  }
}
