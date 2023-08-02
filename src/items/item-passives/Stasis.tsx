import { CDRType, StatBuild } from "../../builds/StatBuild";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Passive, PassiveTrigger } from "../Passive";

export class Stasis extends Passive {
	passiveName = "Stasis";
	additionalTip = "Stasis currently has no impact on any calculations.";
	DURATION = 2.5;
	COOLDOWN = 120;
	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				[Active] Apply Stasis on yourself for {this.DURATION} seconds
				{(this.primarySource === "Stopwatch") && (
					". Stopwatch transforms into Broken Stopwatch once activated once, and all future aquisitions of Stopwatch are instead Broken Stopwatches."
				)}
				{(this.primarySource === "Zhonya's Hourglass") && (<span>({this.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <TextIcon iconName="Cooldown"/> cooldown).</span>)}
			</span>
		)
	}
}