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

  static async #onSetStat(event, target) {
    const stat = target.closest(".stat-bar")?.dataset.stat;
    const value = Number(target.dataset.value);

    if (!stat || !Number.isFinite(value)) return;

    await this.actor.update({
      [`system.stats.${stat}`]: value
    });
  }
}

export class FleshSheet extends VermisActorSheet {
  static DEFAULT_OPTIONS = {
    classes: ["flesh-sheet"]
  };
}
