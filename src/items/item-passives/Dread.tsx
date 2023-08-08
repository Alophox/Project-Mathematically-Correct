import { CC } from "../../builds/CrowdControl";
import { DamageInstance, DamageTag, DamageType, Targeting } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion, ResourceType } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { DarkSeal } from "../item-objects/DarkSeal";
import { Passive, PassiveTrigger } from "../Passive";
import { Glory } from "./Glory";

export class Dread extends Passive {
	passiveName = "Dread";

	private props = {
		darkSeal: {
			apPerStack: 4,
		},
		mejais: {
			apPerStack: 5,
		}
	}
	private glory: Glory;

	private prop;

	constructor(primarySource: string, glory: Glory) {
		super(primarySource);
		this.glory = glory;
		this.prop = this.primarySource === DarkSeal.itemName ? this.props.darkSeal : this.props.mejais;
	}

	public trigger(trigger: PassiveTrigger, sourceChamp: Champion, time?: number, damageInst?: DamageInstance): void {
		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				//console.log(this.glory.currentStacks + " * " + this.prop.apPerStack);
				sourceChamp.statBuild!.addStatShare(Stat.AbilityPower, this.glory.currentStacks * this.prop.apPerStack, false, StatMathType.Flat, this.primarySource, this.passiveName);
				break;
		}
	}

	public reconcile(otherPassive: this): boolean {
		if (otherPassive.primarySource === "Mejai's Soulstealer") {
			return true;
		} else {
			return false;
		}

	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Gain{" "}
				<span className={Stat[Stat.AbilityPower] }>
					{this.prop.apPerStack} <StatIcon stat={Stat.AbilityPower} /> Ability Power{this.EnhancedText("(" + this.glory.currentStacks * this.prop.apPerStack +")", statBuild)}{" "}
				</span>
				for each stack of Glory.
			</span>
		);
	}
}