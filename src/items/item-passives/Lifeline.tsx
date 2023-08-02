import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { CDRType, StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { ArchangelsStaff } from "../item-objects";
import { Passive, PassiveTrigger } from "../Passive";

export class Lifeline extends Passive {
	passiveName = "Lifeline";

	private props = {
		seraphs: {
			FLATSHIELD: 250,
			CURRENTMANARATIO: .2,
			COOLDOWN: 90,
			DURATION: 3,
		}

	}

	private get healthThreshold():number {
		return .3;
	}


	private shieldAmount(sourceChamp: Champion): number {
		switch (this.primarySource) {
			case ArchangelsStaff.upgradeName:
				return this.props.seraphs.FLATSHIELD + sourceChamp.currentResource * this.props.seraphs.CURRENTMANARATIO;
			default:
				return 0;
		}
	}

	public trigger(trigger: PassiveTrigger, sourceChamp?: Champion, time?: number, damageInst?: DamageInstance): void {
		switch (trigger) {
			case PassiveTrigger.OnDamageTaken:
			case PassiveTrigger.OnUse:
				if (trigger === PassiveTrigger.OnUse || (sourceChamp!.currentHealth - damageInst!.postMitigation < this.healthThreshold * sourceChamp!.statBuild!.getTotalStat(Stat.Health))) {
					let shield: number = this.shieldAmount(sourceChamp!);
					let shieldInst1 = new DamageInstance(sourceChamp!, sourceChamp!, this.passiveName, DamageType.Shield, shield, time!, -1, DamageTag.None);
					shieldInst1.addTotalShare(shield, this.primarySource, this.passiveName);
					sourceChamp!.handleHealShieldDI(shieldInst1, time!);
				}
				break;
		}
	}

	private descriptionShield(statBuild?: StatBuild): JSX.Element {
		switch (this.primarySource) {
			case ArchangelsStaff.upgradeName:
				let bonusShield = (statBuild?.getTotalStat(Stat.Mana) ?? 0) * this.props.seraphs.CURRENTMANARATIO;
				return (
					<span>
						<span className="TextShield">
							{this.EnhancedText(this.props.seraphs.FLATSHIELD + " to " + (bonusShield + this.props.seraphs.FLATSHIELD) + " = ", statBuild)}(
							<span className="Base">
								{this.props.seraphs.FLATSHIELD}{" "}
							</span>
							<span className={Stat[Stat.Mana]}>
								+ {this.props.seraphs.CURRENTMANARATIO * 100}% <StatIcon stat={Stat.Mana} /> Current Mana{this.EnhancedText(" (0 to " + bonusShield + ")", statBuild)}
							</span>
							) Shield{" "}
						</span>
						that lasts for {this.props.seraphs.DURATION} seconds({this.props.seraphs.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <StatIcon stat={Stat.Cooldown} /> cooldown).
					</span>
				);
			default:
				return <span>Shield not implemented</span>;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				If you would take damage that would reduce you below{" "}
				<span className={Stat[Stat.Health]}>
					{this.healthThreshold * 100}% of your Max Health
				</span>
				, you first gain a{" "}
				{this.descriptionShield(statBuild)}
			</span>
		);
	}
}