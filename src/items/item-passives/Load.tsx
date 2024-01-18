import { CC } from "../../builds/CrowdControl";
import { DamageInstance, DamageTag, DamageType, Targeting } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion, ResourceType } from "../../champions/Champion";
import { Stat } from "../../Stat";
import { DarkSeal } from "../item-objects/DarkSeal";
import { Passive, PassiveTrigger } from "../Passive";

export class Load extends Passive {
	passiveName = "Load";
	public static image = "Luden's_Companion_item_HD.webp";

	public static MAXSTACKS = 6;
	public static INITIALSTACKS = 6;

	private STACKDURATION:number = 3;
	private startTime: number = -1;
	public trigger(trigger: PassiveTrigger, sourceChamp: Champion, time?: number, damageInst?: DamageInstance): void {
		switch (trigger) {
			case PassiveTrigger.OnTick:
				//passive tick stuff
				if (this.startTime == -1) {
					if (this.currentStacks < Load.MAXSTACKS) {
						this.startTime = time!;
					}
				}

				if (this.startTime != -1) {
					if (((time! - this.startTime) % this.STACKDURATION) < TICKTIME) {
						if (this.currentStacks < Load.MAXSTACKS) {
							this.currentStacks++;
							if (this.currentStacks == Load.MAXSTACKS) {
								this.startTime = -1;
							}
						}
					}
				}
				
				break;
			case PassiveTrigger.Reset:
				this.currentStacks = Math.min(Load.INITIALSTACKS, Load.MAXSTACKS);
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Gain a Shot Charge every {this.STACKDURATION} seconds, up to a maximum of {Load.MAXSTACKS}.
			</span>
		);
	}
}