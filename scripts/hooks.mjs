// @ts-nocheck

import { SystemActor } from "./actors.mjs";
import { SystemItem } from "./items.mjs";
import { FleshSheet } from "./Actor-Sheet.mjs";
import { HeroDataModel, PawnDataModel, VillainDataModel, WeaponDataModel } from "./MySystem.mjs";

Hooks.once("init", async () => {
  await loadTemplates([
    "systems/Vermis/templates/partials/character-stats-bars.hbs"
  ]);

  CONFIG.Actor.documentClass = SystemActor;
  CONFIG.Actor.dataModels = {
    flesh: HeroDataModel,
    villain: VillainDataModel,
    pawn: PawnDataModel
  };
  CONFIG.Actor.typeLabels = {
    flesh: "flesh",
    villain: "villain",
    pawn: "pawn"
  };
  CONFIG.Actor.trackableAttributes = {
    flesh: {
      bar: ["resources.health", "resources.xp"],
      value: ["level", "stats.mind", "stats.will", "stats.faith", "stats.strength"]
    },
    pawn: {
      bar: ["resources.health"],
      value: []
    }
  };

  const { DocumentSheetConfig } = foundry.applications.apps;

  DocumentSheetConfig.unregisterSheet(Actor, "core", ActorSheet);
  DocumentSheetConfig.registerSheet(Actor, "Vermis", FleshSheet, {
    types: ["flesh"],
    makeDefault: true
  });

  CONFIG.Item.documentClass = SystemItem;
  CONFIG.Item.dataModels = {
    weapon: WeaponDataModel
  };
});
