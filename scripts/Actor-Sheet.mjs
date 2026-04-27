// @ts-nocheck

const { ActorSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;

export class VermisActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["vermis", "actor-sheet"],
    position: {
      width: 720,
      height: 680
    },
    form: {
      submitOnChange: true,
      closeOnSubmit: false
    },
    actions: {
      setStat: VermisActorSheet.#onSetStat
    }
  };

  static PARTS = {
    form: {
      template: "systems/Vermis/templates/actors/flesh-sheet.hbs"
    }
  };

  static TABS = {
    primary: {
      initial: "main",
      tabs: [
        { id: "main", label: "Main" },
        { id: "biography", label: "Biography" }
      ]
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.actor = this.actor;
    context.system = this.actor.system;
    context.statRows = this.#getStatRows(this.actor.system.stats);
    context.resourceBars = {
      health: this._getResourceBar(this.actor.system.resources?.health)
    };

    return context;
  }

  #getStatRows(stats = {}) {
    return Object.entries(stats).map(([key, value]) => {
      const current = Number(value);

      return {
        key,
        label: key,
        value: current,
        max: 6,
        segments: Array.from({ length: 6 }, (_, index) => {
          const segmentValue = index + 1;

          return {
            value: segmentValue,
            filled: current >= segmentValue
          };
        })
      };
    });
  }

  _getResourceBar(resource = {}) {
    const value = Number(resource.value ?? 0);
    const max = Number(resource.max ?? 0);
    const percent = max > 0 ? Math.clamp((value / max) * 100, 0, 100) : 0;

    return {
      value,
      max,
      percent
    };
  }

  static async #onSetStat(event, target) {
    const stat = target.closest(".stat-bar")?.dataset.stat;
    const value = Number(target.dataset.value);

    if (!stat || !Number.isFinite(value)) return;

    await this.actor.update({
      [`system.stats.${stat}`]: value
    });
  }
}
