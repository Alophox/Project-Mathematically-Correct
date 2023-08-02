import { StatBuild } from "../../builds/StatBuild";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Passive, PassiveTrigger } from "../Passive";

export class Focus extends Passive {
	passiveName = "Focus";
	additionalTip = "No minions implemented, so this isn't implemented either"
	private BONUSDAMAGE = 5;

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Attacks against Minions deal an additional{" "}
				<span className="TextPhysical">
					{this.BONUSDAMAGE} physical damage{" "}
				</span>
				<span className="OnHit">
					<TextIcon iconName={"OnHit"} /> On-Hit
				</span>.
			</span>
		)
	}
}