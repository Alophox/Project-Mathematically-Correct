import { CDRType, StatBuild } from "../../builds/StatBuild";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Passive, PassiveTrigger } from "../Passive";

export class TimeStop extends Passive {
	passiveName = "Time Stop";
	additionalTip = "Time Stop currently has no impact on any calculations.";
	DURATION = 2.5;
	COOLDOWN = 120;
	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				[Active] Apply Stasis on yourself for {this.DURATION} seconds
				{(this.primarySource === "SeekersArmguard") && (
					". Seeker's Armguard transforms into Shattered Armguard once activated, and all future aquisitions of Seeker's Armguard are instead Shattered Armguards."
				)}
				{(this.primarySource === "Zhonya's Hourglass") && (<span>({this.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <TextIcon iconName="Cooldown"/> cooldown).</span>)}
			</span>
		)
	}
}