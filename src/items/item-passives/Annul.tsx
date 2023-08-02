import { StatBuild } from "../../builds/StatBuild";
import { StatIcon } from "../../icons/TextIcon";
import { Passive, PassiveTrigger } from "../Passive";

export class Annul extends Passive {
	passiveName = "Annul";
	additionalTip = "Cooldown is restarted when damage is taken from Champions.";
	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Grants a Spell Shield that blocks the next enemy Ability.
			</span>
		)
	}
}