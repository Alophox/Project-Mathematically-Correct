import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { SeekersArmguard } from "../item-objects";
import { Passive, PassiveTrigger } from "../Passive";

export class WitchsPath extends Passive {
	passiveName = "Witch's Path";
	public static image = "Seeker's_Armguard_item_HD.webp";
	public static MAXSTACKS = 30;
	public static INITIALSTACKS = 30;

	private ARMORRATIO: number = .5;
	private bonusArmor: number = 0;

	public trigger(trigger: PassiveTrigger, sourceChamp?: Champion): void {
		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				this.bonusArmor = this.currentStacks * this.ARMORRATIO;
				sourceChamp!.statBuild?.addStatShare(Stat.Armor, this.bonusArmor, false, StatMathType.Flat, this.primarySource, this.passiveName);
				break;
			case PassiveTrigger.Reset:
				this.currentStacks = WitchsPath.INITIALSTACKS;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Killing a unit grants{" "}
				<span className="Armor">
					{this.FloatPrecision(this.ARMORRATIO, 1)} <StatIcon stat={Stat.Armor} /> Armor, max {WitchsPath.MAXSTACKS * this.ARMORRATIO}{this.EnhancedText("(" + (this.currentStacks * this.ARMORRATIO) + ")", statBuild) }
				</span>.
			</span>
		)
	}
}