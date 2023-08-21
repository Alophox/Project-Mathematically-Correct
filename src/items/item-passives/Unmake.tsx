import { CDRType, StatBuild } from "../../builds/StatBuild";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Passive, PassiveTrigger } from "../Passive";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";

export class Unmake extends Passive {
	passiveName = "Unmake";
	additionalTip = "Unmake currently not implemented";
	private BASEREDUCTION = 5;
	private BONUSHEALTHRATIO = .012;
	private REDUCTIONCAP = 25;
	private BONUSMRPERCURSE = 9;
	private RANGE = 550;
	DescriptionElement = (statBuild?: StatBuild) => {
		bonusShred = this.BASEREDUCTION + (statBuild.getBonusStat(Stat.Health) ?? 0) * this.BONUSHEALTHRATIO;
		/**@todo:implement cap*/
		return (
			<span>
				Enemy Champions within {this.RANGE} units are cursed, reducing their{" "}
				<span className={Stat[Stat.MagicResist]}>
      				<StatIcon stat={Stat.MagicResist}/> Magic Resist by {this.EnhancedText("" + (this.BASEREDUCRION + this.bonusShred) + " = ", statBuild)}({this.BASEREDUCTION} +{" "}
					<span className={Stat[Stat.Health]}>
						({this.BONUSHEALTHRATIO * 100}% <StatIcon stat={Stat[Stat.Health]}/> Bonus Health{this.EnhancedText("(" + this.bonusShred + ")", statBuild)})
					</span>
					)
				</span>
				, capped at a max of <span className={Stat[Stat.MagicResist]}>{this.REDUCTIONCAP}</span>. Gain{" "}
				<span className={Stat[Stat.MagicResist]}>
					{this.BONUSMRPERCURSE} <StatIcon stat={Stat.MagicResist}/> Bonus Magic Resist{" "}
				</span>
				per cursed enemy.
			</span>
		)
	}
}
