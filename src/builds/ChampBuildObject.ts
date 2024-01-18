import { Ability, Champion } from "../champions/Champion";
import { TargetDummy } from "../champions/champion-objects";
import { Item } from "../items/Item";
import { PassiveTrigger } from "../items/Passive";
import { TICKTIME } from "./ServerConstants";
import { StatBuild } from "./StatBuild";
import * as ChampionObjects from '../champions/champion-objects';




export class ChampBuildObject {
	public statBuild: StatBuild = new StatBuild(new TargetDummy(), []);

	public items: Array<{ item: Item | undefined }> = new Array<{ item: Item | undefined }>();
;
	public key: number;
	private isEnemy: boolean;
	constructor(key: number, allyChamp: Champion, targetChamp: Champion, itemObjArr: {item:Item|undefined}[],  isEnemy:boolean) {
		this.key = key;
		this.isEnemy = isEnemy;
		//this.items = itemObjArr;
		this.update(allyChamp, targetChamp, itemObjArr);
	}

	public update(allyChamp: Champion, target: Champion, newItems?: Array<{ item: Item | undefined }>) {
		//console.log(allyChamp.constructor.name as keyof typeof ChampionObjects + " | " + (ChampionObjects) + " | " + (ChampionObjects[allyChamp.constructor.name as keyof typeof ChampionObjects]) + " | " + allyChamp);
		/**
		 * while this works in development, due to the building process(see minifying) .constructor.name will no longer be the class name, and thus I cannot use it to index ChampionObjects to get the related constructor
		 */
		//let champObj: Champion = this.isEnemy ? allyChamp : new ((ChampionObjects[allyChamp.constructor.name as keyof typeof ChampionObjects]))();
		/**
		 * so... solution: have classname be a property
		 */
		let champObj: Champion = this.isEnemy ? allyChamp : new ((ChampionObjects[allyChamp.getClassName as keyof typeof ChampionObjects]))();
		champObj.level = allyChamp.level;

		if(newItems !== undefined)
			this.items = newItems;

		this.statBuild = new StatBuild(champObj, this.items);

		//console.log(allyChamp.constructor.name + " " + allyChamp.level);

		/**@todo:add distance editor, or automatically use shortest range for a champion*/
		let distance: number = 500;

		/**@todo: add burst and dps ability prio editors*/
		let allyBurstSequence: string = allyChamp.burstSequence;//"eqwarrr"";
		let allyDPSPriority: string = allyChamp.dpsPriority;// "eqwra";

		allyBurstSequence = allyBurstSequence.toUpperCase();
		allyDPSPriority = allyDPSPriority.toUpperCase();
		let enemyBurstSequence: string = allyBurstSequence;
		let enemyDPSPriority: string = allyDPSPriority;
		enemyBurstSequence = enemyBurstSequence.toUpperCase();
		enemyDPSPriority = enemyDPSPriority.toUpperCase();
		let dpsTime: number = 30;

		let allyIndex: number = 0;
		let enemyIndex: number = 0;
		//ticktime is .033, so tick rate is a little bit larger than 30

		let ability: string;


		if (this.isEnemy) {
			target.statBuild = new StatBuild(target, [{ item: undefined }]);
		}
		//else {
			//console.log((target.statBuild?.items[0].item as typeof Item)?.itemName)
		//}
		champObj.reset();
		target.reset();

		champObj.champPos = -distance;
		target.champPos = 0;

		champObj.direction = 1;
		target.direction = -1;

		//BURST
	//	console.log("BURST");
		champObj.init();
		target.init();
		let time;
		/**
		* ticks go up, limit DPS time
		* burstIndex goes up on successful cast
		*/
		for (time = 0; (allyIndex < allyBurstSequence.length) && (time < dpsTime); time += TICKTIME) {
			ability = allyBurstSequence.charAt(allyIndex);
			//console.log(ability + " -> " + Ability[ability as keyof typeof Ability]);

			console.log("Tick: " + (time / TICKTIME).toFixed(0));

			//if ability casts or is not an ability, returns true.
			//non ability inputs consume a tick of time, however
			if (!(champObj instanceof TargetDummy)) {
				if (champObj.combatTick(Ability[ability as keyof typeof Ability], time, target)) {
					allyIndex++;
				}
			}

			if (!(target instanceof TargetDummy))
				target.combatTick(Ability.A, time, champObj);

			champObj.handleDamageTick(time);
			target.handleDamageTick(time);
		}

		champObj.triggerPassives(PassiveTrigger.OnUse, time, undefined, target);

		remainingDamageTicks(time);

	//	console.log("calcBurst");
		this.statBuild.calcBurst(champObj.postCalcDamageInstances);

		champObj.reset();
		target.reset();

		//DPS
	//	console.log("DPS");
		champObj.init();
		target.init();
		for (time = 0; time < dpsTime; time += TICKTIME) {

			//console.log("Tick: " + (time / TICKTIME).toFixed(0));

			if (!(champObj instanceof TargetDummy)) {
				for (allyIndex = 0; allyIndex < allyDPSPriority.length; allyIndex++) {
					ability = allyDPSPriority.charAt(allyIndex);
					//if ability casts or is not an ability, returns true.
					//non ability inputs consume a tick of time, however
					if (champObj.combatTick(Ability[ability as keyof typeof Ability], time, target)) {
						break;
					}

				}
				//console.log(allyDPSPriority.length);
				//if (!(allyDPSPriority.length > 0)) {
				//	champObj.combatTick(Ability.None, time, target);
				//}
			}

			if (!(target instanceof TargetDummy)) {
				for (enemyIndex = 0; enemyIndex < enemyDPSPriority.length; enemyIndex++) {
					ability = enemyDPSPriority.charAt(enemyIndex);

					//if ability casts or is not an ability, returns true.
					//non ability inputs consume a tick of time, however
					if (target.combatTick(Ability[ability as keyof typeof Ability], time, champObj)) {
						//console.log("enemy ability tick " + Ability[ability as keyof typeof Ability]);
						break;
					}
				}
				//if (!(allyDPSPriority.length > 0)) {
				//	champObj.combatTick(Ability.None, time, target);
				//}
			}	
				

			champObj.handleDamageTick(time);
			target.handleDamageTick(time);
		}


		remainingDamageTicks(time);

		this.statBuild.calcDPS(champObj.postCalcDamageInstances, dpsTime);
		//target.statBuild()!.calcDPS(target.postCalcDamageInstances, dpsTime);
		champObj.reset();
		target.reset();
		if (!(champObj instanceof TargetDummy)) {
			//Start Individual Abilities
			time = 0;

		//	console.log("Start Individual Abilities");

			//Q
			//console.log("Q");
			champObj.init();
			target.init();
			champObj.combatTick(Ability.Q, time, target);
			champObj.handleDamageTick(time);
			target.handleDamageTick(time);
			remainingDamageTicks(time);
			//console.log("calcAbility");
			this.statBuild.calcAbility(champObj.postCalcDamageInstances, Ability.Q);

			champObj.reset();
			target.reset();

			//W
			//console.log("W");
			champObj.init();
			target.init();
			champObj.combatTick(Ability.W, time, target);
			champObj.handleDamageTick(time);
			target.handleDamageTick(time);
			remainingDamageTicks(time);
			//console.log("calcAbility");
			this.statBuild.calcAbility(champObj.postCalcDamageInstances, Ability.W);

			champObj.reset();
			target.reset();

			//E
			//console.log("E");
			champObj.init();
			target.init();
			champObj.combatTick(Ability.E, time, target);
			champObj.handleDamageTick(time);
			target.handleDamageTick(time);
			remainingDamageTicks(time);
			//console.log("calcAbility");
			this.statBuild.calcAbility(champObj.postCalcDamageInstances, Ability.E);

			champObj.reset();
			target.reset();

			//R
			//console.log("R");
			champObj.init();
			target.init();
			champObj.combatTick(Ability.R, time, target);
			champObj.handleDamageTick(time);
			target.handleDamageTick(time);
			remainingDamageTicks(time);
			//console.log("calcAbility");
			this.statBuild.calcAbility(champObj.postCalcDamageInstances, Ability.R);

			champObj.reset();
			target.reset();

		}

		/**
		* stop attacking, but handle remaining damage
		*/
		function remainingDamageTicks(startTime: number) {
			let timeTarget = startTime + 5;
			//console.log("Overtime");
			for (let t = startTime; t < timeTarget; t += TICKTIME) {

				//console.log("Tick: " + (t / TICKTIME).toFixed(0));

				champObj.combatTick(Ability.None, t, target);
				target.combatTick(Ability.None, t, target);

				champObj.handleDamageTick(t, true);
				target.handleDamageTick(t, true);
			}
		}
	}

}