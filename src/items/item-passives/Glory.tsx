import { CC } from "../../builds/CrowdControl";
import { DamageInstance, DamageTag, DamageType, Targeting } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion, ResourceType } from "../../champions/Champion";
import { Stat } from "../../Stat";
import { DarkSeal } from "../item-objects/DarkSeal";
import { Passive, PassiveTrigger } from "../Passive";

export class Glory extends Passive {
	passiveName = "Glory";
	public static image = "Dark_Seal_item_HD.webp";

	private props = {
		darkSeal: {
			maxStacks: 10,
			killStacks: 2,
			assistStacks: 1,
			deathStacks: 5,
		},
		mejais: {
			maxStacks: 25,
			killStacks: 4,
			assistStacks: 2,
			deathStacks: 10,
			bonusMSReq: 10,
			bonusMS: .1,
		}
	}


	public static MAXSTACKS = 25;
	public static INITIALSTACKS = 25;

	private prop;
	constructor(primarySource: string) {
		super(primarySource);
		this.prop = this.primarySource === DarkSeal.itemName ? this.props.darkSeal : this.props.mejais;
	}
	
	public trigger(trigger: PassiveTrigger, sourceChamp: Champion, time?: number, damageInst?: DamageInstance): void {
		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				if (this.primarySource === "Mejai's Soulstealer" && this.currentStacks >= this.props.mejais.bonusMSReq) {
					sourceChamp.statBuild!.addStatShare(Stat.MoveSpeedPercent, this.props.mejais.bonusMS, false, StatMathType.Flat, this.primarySource, this.passiveName);
				}
				break;
			case PassiveTrigger.Reset:
				this.currentStacks = Math.min(Glory.INITIALSTACKS, this.prop.maxStacks);
				break;
		}
	}

	public reconcile(otherPassive: this):boolean {
		if (otherPassive.primarySource === "Mejai's Soulstealer") {
			this.setToZero();
			return true;
		} else {
			otherPassive.setToZero();
			return false
		}
		
	}

	public setToZero() {
		this.currentStacks = 0;
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Gain {this.prop.killStacks} stacks for each Champion Kill and {this.prop.assistStacks} stack for each assist, up to a maximum of {this.prop.maxStacks}. Lose {this.prop.deathStacks} stacks on death.
			</span>
		);
	}
}