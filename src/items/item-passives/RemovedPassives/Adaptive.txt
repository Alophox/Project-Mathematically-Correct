import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Adaptive extends Passive {
	passiveName = "Adaptive";
	public static image = "Verdant_Barrier_item_HD.webp"
	public static MAXSTACKS = 30;
	public static INITIALSTACKS = 30;
	currentStacks = Adaptive.INITIALSTACKS;
	private MRRATIO: number = .3;
	private bonusMR: number = 0;

	public trigger(trigger: PassiveTrigger, sourceChamp?: Champion): void {
		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				this.bonusMR = this.currentStacks * this.MRRATIO;
				sourceChamp!.statBuild?.addStatShare(Stat.MagicResist, this.bonusMR, false, StatMathType.Flat, this.primarySource, this.passiveName);
				break;
			case PassiveTrigger.Reset:
				this.currentStacks = Adaptive.INITIALSTACKS;
		}
		
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Killing a unit grants{" "}
				<span className="MagicResist">
					{this.FloatPrecision(this.MRRATIO, 1)} <StatIcon stat={Stat.MagicResist} /> Magic Resist, max {Adaptive.MAXSTACKS * this.MRRATIO}{this.EnhancedText("(" + (this.currentStacks * this.MRRATIO) + ")",statBuild)}
				</span>.
			</span>
		)
	}
}