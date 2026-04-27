
// @ts-nocheck
const {
    HTMLField, SchemaField, NumberField, StringField, FilePathField, ArrayField, BooleanField
} = foundry.data.fields;

class CharacterData extends foundry.abstract.TypeDataModel
{
    static defineSchema()
    {
return{
    biography: new HTMLField(),
    resources: new SchemaField({
    health: new SchemaField(
   {
    value: new NumberField({required: true,integer:true, min: 0, initial: 10}), 
    min: new NumberField({required: true,integer:true, min: 0, initial: 0}),
    max: new NumberField({required: true,integer:true, min: 0, initial: 10}),
   })
}),
   proficiencies: new SchemaField(
   {
    weapons: new ArrayField(new StringField()),
    skills: new ArrayField(new StringField())
    }),
    

  crest: new FilePathField({required:false, categories:["IMAGE"] }),
  stats: new SchemaField({
    mind: new NumberField({required:true,integer:true,min:1,max:6,initial:1}),
    will: new NumberField({required:true,integer:true,min:1,max:6,initial:1}),
    faith: new NumberField({required:true,integer:true,min:1,max:6,initial:1}),
    strength: new NumberField({required:true,integer:true,min:1,max:6,initial:1})
})}
 }

 
 static migrateData(source)
        {
         const proficiencies = source.proficiencies ?? {};   
         if ("weapons" in proficiencies)
         {
            proficiencies.weapons = proficiencies.weapons.map(weapon => {return weapon === "bmr" ? "boomerang" : weapon;})
         }
        
                return super.migrateData(source);
            }

  get dead()
    { 
        const invulnerable = CONFIG.specialStatusEffects.INVULNERABLE
        if(this.parent.statuses.has(invulnerable)) return false;
        return this.resources.health.value <= this.resources.health.min;
        


    }
}

export class HeroDataModel extends CharacterData
{
static defineSchema()
{
    const CharacterSchema = super.defineSchema();
    CharacterSchema.resources = new SchemaField({
        health: new SchemaField({
            value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
            min: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
            max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
        }),
        xp: new SchemaField({
            value: new NumberField({ required: true, integer: true, min: 0, initial: 33 }),
            max: new NumberField({ required: true, integer: true, min: 0, initial: 100 })
        })
    });
    return {
        ...CharacterSchema,
        level: new NumberField({ required: true, integer: true, min: 0, initial: 1 })
    };
}
 prepareDerivedData()
 {
    super.prepareDerivedData();
    this.level = Math.floor(this.resources.xp.value / 5);    
 }
}

export class VillainDataModel extends CharacterData
{

    static defineSchema(){
        return{
    ...super.defineSchema(),
    layer_action : new BooleanField()
        }
}
}
 
export class PawnDataModel extends CharacterData{}

//items
class ItemDataModel extends foundry.abstract.TypeDataModel
{
static defineSchema()
{ return{
    description: new HTMLField(),
    rarity: new StringField({
        required: true,
        blank: false,
        options: ["common","uncommon","rare","legendary"],
        initial: "common"
    }),
    price: new NumberField({required: true, integer: true, min: 0, initial:0})
    }
}

}

export class WeaponDataModel extends ItemDataModel 
{
    static defineSchema()
    {
        return{
            ...super.defineSchema(),
            damage: new NumberField({required: true, integer:true, min: 0, initial:1})
        }
    }
}

