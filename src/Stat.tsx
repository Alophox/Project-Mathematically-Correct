import { StatBuild } from "./builds/StatBuild";
import { StatIcon, TextIcon } from "./icons/TextIcon";

export enum Stat {
	Unknown,

	//advanced stats
	Burst,
	DamagePerSecond,
	PStat,
	QStat,
	WStat,
	EStat,
	RStat,
	Sustain,
	SustainGrievousWounds,
	Shield,
	EffectiveHealthPhysical,
	EffectiveHealthMagic,
	EffectiveHealth,
	DuelingScore,

	//item stats

	//item stat reset starts here, at Cost
	//all stats changed by items and champions should be between this and Cooldown(which is a useless stat, cause its not a stat at all)
	Cost,//gold

	AttackDamage,
	AbilityPower,

	AttackSpeed,
	CriticalStrikeChance,
	CriticalStrikeDamage,

	Lethality,

	ArmorPenetrationFlat, //unused in items, as Lethality replaces it
	ArmorPenetrationPercent,
	MagicPenetrationFlat,
	MagicPenetrationPercent,
	HealShieldPower,

	Health,
	Armor,
	MagicResist,
	/**Any resource type will use this when utilized in Champions*/
	Mana,
	AbilityHaste,
	BaseHealthRegenPercent,
	BaseManaRegenPercent,

	LifeSteal,
	Omnivamp,
	PhysicalVamp,
	SpellVamp,


	MoveSpeedFlat,
	MoveSpeedPercent,
	TenacityA,
	TenacityB,
	TenacityC,

	SummonerSpellHaste,
	SlowResist,
	//other stats, not found in items
	ItemHaste,
	HealthRegen, //per 5 seconds
	ManaRegen, //per 5 seconds
	AttackRange,

	//stat viewing
	/**
	 * Calculated view stat, don't use in items or champions
	 */
	ArmorPenetration,
	/**
	 * Calculated view stat, don't use in items or champions
	 */
	MagicPenetration,
	/**
	 * Calculated stat, don't use in items or champions for adding, but use for reading
	 */
	MoveSpeed,
	/**
	 * Calculated stat, don't use in items or champions for adding, but use for reading
	 */
	Tenacity,
	/**
	 * Calculated view stat, don't use in items or champions
	 */
	Vamp,



	//other stats
	//item stat reste ends here, at Cooldown
	Cooldown,

}

export function StatDescription (input: Stat):JSX.Element | string{
	switch (input) {
		case Stat.Cost: return "How much the build or item costs";

		case Stat.AttackDamage: return "Attack Damage (AD) increases the damage of most Attacks and some Abilities.";
		case Stat.AbilityPower: return "Ability Power (AP) most commonly increases the output of Abilities.";

		case Stat.AttackSpeed: return "Attack Speed (AS) increases the rate at which a Champion can Attack.";
		case Stat.CriticalStrikeChance: return "Critical Strike Chance is the chance at which an Attack can Critically Strike, dealing increased damage";
		case Stat.CriticalStrikeDamage: return "Critical Strike Damage is the damage multiplier of an Attack that Critically Strikes";

		case Stat.Lethality: return (<div> Lethality is converted into flat Armor Penetration based on <TextIcon iconName="Level" /> Champion Level</div>);

		case Stat.ArmorPenetrationFlat: return (<div> Flat Armor Penetration ignores a flat amount of the target's <StatIcon stat={Stat.Armor}/> Armor when applying physical damage. </div>); //unused in items; as Lethality replaces it
		case Stat.ArmorPenetrationPercent: return (<div>Percent Armor Penetration ignores a percent amount of the target's <StatIcon stat={Stat.Armor} /> Armor when applying <span className="TextPhysical">physical damage</span>. </div>);
		case Stat.MagicPenetrationFlat: return (<div>Flat Magic Penetration ignores a flat amount of the target's <StatIcon stat={Stat.MagicResist} /> Magic Resist when applying <span className="TextMagic">magic damage</span>. </div>);
		case Stat.MagicPenetrationPercent: return (<div>Percent Magic Penetration ignores a percent amount of the target's <StatIcon stat={Stat.MagicResist} /> Magic Resist when applying <span className="TextMagic">magic damage</span>. </div>);
		case Stat.HealShieldPower: return (<div>Heal Shield Power increases heals and shields by this percent. Heal Shield Power does not increase healing from sources of <StatIcon stat={Stat.LifeSteal} /> Lifesteal and <StatIcon stat={Stat.Vamp} /> Vamp.</div>);

		case Stat.Health: return "Health (HP) is how much Health the champion has";
		case Stat.Armor: return (<div>Armor reduces the damage taken from <span className="TextPhysical">physical damage</span>.</div>);
		case Stat.MagicResist: return (<div>Magic Resist (MR) reduces the damage taken from <span className="TextMagic">magic damage</span>.</div>);
		case Stat.Mana: return "Mana (MP) on Mana Champions, determines the max Resource the Champion has to cast Abilities. Manaless champions may use other resources, such as Energy or Rage.";
		case Stat.AbilityHaste: return "Ability Haste (AH) increases the amount of casts of Abilities in a given time frame; 50 AH means roughly 50% more casts, or 33% Cooldown Reduction (CDR). Total AH will be displayed in the format: AH | CDR.";
		case Stat.BaseHealthRegenPercent: return "Increases the Health Regeneration of a Champion by this percent.";
		case Stat.BaseManaRegenPercent: return "Increases the Mana Regeneration of a Mana Champion by this percent.";

		case Stat.LifeSteal: return "Grants healing equal to the percent of damage dealt from Attacks.";
		case Stat.Omnivamp: return "Grants healing equal to the percent of all damage dealt. Healing from AOE Abilities or pets is applied at 1/3 efficiency.";
		case Stat.PhysicalVamp: return "Grants healing equal to the percent of physical damage dealt. Healing from AOE abilities or pets is applied at 1/3 efficiency.";
		case Stat.SpellVamp: return "Grants healing equal to the percent of Ability damage dealt. Healing from AOE abilities or pets is applied at 1/3 efficiency.";


		case Stat.MoveSpeedFlat: return "Increases the rate at which a Champion can move per second. There is a soft cap where excess Move Speed is reduced in effectiveness.";
		case Stat.MoveSpeedPercent: return "Increases the rate at which a Champion can move per second by percent of base + flat. There is a soft cap where excess Move Speed is reduced in effectiveness.";
		case Stat.TenacityA:
		case Stat.TenacityB:
		case Stat.TenacityC:
		case Stat.Tenacity: return "Reduces the duration of most forms of Crowd Control (CC); excluding airborne, drowsy, nearsight, stasis, and suppression. Cannot reduce CC duration to below 0.3 seconds.";

		case Stat.SummonerSpellHaste: return "Increases the amount of uses of summoner spells in the same way Ability Haste does."
		case Stat.SlowResist: return "Slow Resist reduces the strength of slows."

		//other stats; not found in items
		case Stat.ItemHaste: return "Increases the amount of uses of item and trinket passives and actives the same way Ability Haste does.";
		case Stat.HealthRegen: return (<div>Health Regen (HP5) is the amount of <StatIcon stat={Stat.Health}/> Health naturally regenerated over 5 seconds.</div>);
		case Stat.ManaRegen: return (<div>Mana Regen (MP5) is the amount of <StatIcon stat={Stat.Mana} /> Resource naturally regenerated over 5 seconds.</div>);
		case Stat.AttackRange: return "The range in units at which an Attack may be made.";

		//stat viewing
		case Stat.ArmorPenetration: return (<div>Armor Penetration ignores an amount of the target's <StatIcon stat={Stat.Armor} /> Armor when applying <span className="TextPhysical">physical damage</span>.</div>);
		case Stat.MagicPenetration: return (<div>Magic Penetration ignores an amount of the target's <StatIcon stat={Stat.MagicResist} /> Magic Resist when applying <span className="TextMagic">magic damage</span>.</div>);
		case Stat.MoveSpeed: return "Move Speed (MS) increases the rate at which a Champion can move per second. There is a soft cap where excess MS is reduced in effectiveness.";
		case Stat.Vamp: return (<div>Omnivamp grants healing equal to the percent of all damage dealt, while Physical Vamp only heals on <span className="TextPhysical">physical damage</span> dealt. Healing from AOE Abilities or Pets is applied at 1/3 efficiency. Displayed in the following format: Omnivamp | Physical Vamp</div>);

		//advanced stats
		case Stat.Burst: return "Burst or Alpha Damage is an estimate of how much damage is dealt to the Enemy Champion with the given Ability sequence.";
		case Stat.DamagePerSecond: return "Damage Per Second(DPS) is an estimate of how much damage is dealt to the Enemy Champion per second with the given Ability priorities.";
		case Stat.Sustain: return (<div>Sustain is an estimate of how much healing per second is caused by <StatIcon stat={Stat.LifeSteal} /> Life Steal, <StatIcon stat={Stat.Vamp} /> Vamp,  <StatIcon stat={Stat.HealthRegen} /> Health Regen, and other sources based off of the DPS sequence.</div>);
		case Stat.SustainGrievousWounds: return "Sustain but with grievous wounds applied.";
		case Stat.EffectiveHealthPhysical: return (<div>How much <StatIcon stat={Stat.Health} /> Health the Champion effectively has against pre-mitigation <span className="TextPhysical">physical damage</span> without penetration. Equal to (<StatIcon stat={Stat.Health} /> Health + Shield) * (1 + (<StatIcon stat={Stat.Armor} /> Armor / 100))</div>);
		case Stat.EffectiveHealthMagic: return (<div>How much <StatIcon stat={Stat.Health} /> Health the Champion effectively has against pre-mitigation <span className="TextMagic">magic damage</span> without penetration. Equal to (<StatIcon stat={Stat.Health} /> Health + Shield) * (1 + (<StatIcon stat={Stat.MagicResist} /> Magic Resist / 100))</div>);
		case Stat.EffectiveHealth: return (<div>How much <StatIcon stat={Stat.Health} /> Health the Champion effectively has against equal amounts of pre-mitigation <span className="TextMagic">magic</span> and <span className="TextPhysical">physical damage</span> without penetration. Equal to average of <StatIcon stat={Stat.EffectiveHealthPhysical} /> Effective Physical and <StatIcon stat={Stat.EffectiveHealthMagic} /> Magic Health.</div>);
		case Stat.DuelingScore: return (<div>An arbitrary score calculated with <StatIcon stat={Stat.EffectiveHealth}/> Effective Health, <StatIcon stat={Stat.DamagePerSecond} /> DPS, and <StatIcon stat={Stat.Sustain}/> Sustain, meant to give a rough idea of dueling potential.</div>);
		default:
			return "No description created.";
	}
}

export function StatNameReplace(input: string): string {

	input = input.replace(/(Flat)|(Percent)/, '');
	input = input.replace(/([A-Z])/g, " $1");
	return input;
}

export function StatNameIconReplace(input: string): string {
	switch (input) {
		case Stat[Stat.Lethality]:
			input = Stat[Stat.ArmorPenetrationFlat];
			break;
		case Stat[Stat.ItemHaste]:
		case Stat[Stat.SummonerSpellHaste]:
			input = Stat[Stat.AbilityHaste];
			break;
		case Stat[Stat.DuelingScore]:
			input = "Melee";
			break;
		//stats without icons
		case Stat[Stat.SlowResist]:
			input = ""
			break;
	}
		
	
	input = input.replace(/(Flat)|(Percent)|(GrievousWounds)|(A)$|(B)$|(C)$/, '');
	input = input.replace(/Penetration/, 'Pen');
	if (input.toLowerCase().includes("vamp")) {
		input = "Vamp";
	}
	
	return input;

}

/**
 * given a stat, will parse value and get more. statBuild MUST be provided for calculated values, ie MPen as it does both flat and percent, or total AH to get CDR.
 * if statBuild is provided, value does not need to be, but at least one or the other must be
 * @param stat: stat to get value of
 * @param statBuild: if a statbuild is provided, total is given instead of part. some stats display a calculated value as well(AH displaying CDR)
 * @param value: vakue to convert
 * @returns a string with converted value(s)
 */
export function StatValueConversion(stat: Stat, statBuild?: StatBuild, value?:number): string {
	let text: string;
	let statVal = statBuild?.getTotalStat(stat) ?? value ?? 0;

	//base calculated values are found in statBuild
	switch (stat) {
		//% cases
		case Stat.ArmorPenetrationPercent:
		case Stat.MagicPenetrationPercent:
		case Stat.CriticalStrikeChance:
		case Stat.CriticalStrikeDamage:
		case Stat.MoveSpeedPercent:
		case Stat.HealShieldPower:
		case Stat.TenacityA:
		case Stat.TenacityB:
		case Stat.TenacityC:
		case Stat.Tenacity:
		case Stat.LifeSteal:
		case Stat.Omnivamp:
			text = parseFloat((statVal * 100).toFixed(1)) + "%";
			break;
		//multi-output cases
		case Stat.ArmorPenetration:
			text = parseFloat((statBuild!.getTotalStat(Stat.ArmorPenetrationFlat) ?? 0).toFixed(3)) + " | " + ((statBuild!.getTotalStat(Stat.ArmorPenetrationPercent) ?? 0) * 100) + "%";
			break;
		case Stat.MagicPenetration:
			text = parseFloat((statBuild!.getTotalStat(Stat.MagicPenetrationFlat) ?? 0).toFixed(3)) + " | " + ((statBuild!.getTotalStat(Stat.MagicPenetrationPercent) ?? 0) * 100) + "%";
			break;
		case Stat.SummonerSpellHaste:
		case Stat.ItemHaste:
		case Stat.AbilityHaste:
			text = parseFloat(statVal.toFixed(3)) + ((statBuild !== undefined) ? (" | " + parseFloat((statVal / (statVal + 100) * 100).toFixed(2)) + "%") : "");
			break;
		case Stat.Vamp:
			text = parseFloat(((statBuild!.getTotalStat(Stat.Omnivamp) ?? 0) * 100).toFixed(1)) + "%" + " | " + ((statBuild!.getTotalStat(Stat.PhysicalVamp) ?? 0) * 100) + "%";
			break;
		case Stat.SustainGrievousWounds:
			text = "" + parseFloat(((statBuild?.getTotalStat(Stat.Sustain) ?? 0)*.6).toFixed(3))
			break;

		//weird cases
		case Stat.AttackSpeed: //percent when not total
			text = ((statBuild === undefined) ? (parseFloat((statVal * 100).toFixed(0)) + "%") : ("" + parseFloat(statVal.toFixed(3))));
			break;
		//default, just the number
		default:
			text = "" + parseFloat(statVal.toFixed(3));
			break;
	}
	return text;
}

export function getSortStats(isBuildStat: boolean) {
	return Object.entries(Stat).filter(([statName, stat]) => {
		if (isNaN(Number(stat))) return false;
		//stats without icons or stats without easy number to compare
		//default new stats are not included
		switch (stat) {
			//always sortable
			case Stat.Cost:
			case Stat.AttackDamage:
			case Stat.AbilityPower:
			case Stat.AttackSpeed:
			case Stat.Lethality:
			case Stat.ArmorPenetrationPercent:
			case Stat.MagicPenetrationFlat:
			case Stat.MagicPenetrationPercent:
			case Stat.HealShieldPower:
			case Stat.Health:
			case Stat.Armor:
			case Stat.MagicResist:
			case Stat.Mana:
			case Stat.AbilityHaste:
			case Stat.LifeSteal:
				return true;
			//only in items...if a sorter is placed there, at some point
			case Stat.CriticalStrikeChance:
			case Stat.Omnivamp:
			case Stat.PhysicalVamp:
			case Stat.MoveSpeedFlat:
			case Stat.MoveSpeedPercent:
				return !isBuildStat;
			//only in builds
			case Stat.Burst:
			case Stat.DamagePerSecond:
			case Stat.Sustain:
			case Stat.EffectiveHealthPhysical:
			case Stat.EffectiveHealthMagic:
			case Stat.EffectiveHealth:
			case Stat.DuelingScore:
			case Stat.MoveSpeed:
			case Stat.Tenacity:
				return isBuildStat;
			//never
			default:
				return false;
		}
	})
}