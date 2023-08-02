import { Champion } from './Champion';
import * as ChampionObjects from './champion-objects';

export abstract class ChampionList {
	static allChampions: Array<Champion> = (() => {
		let temp = new Array<Champion>;
		Object.values(ChampionObjects).forEach((key) => {
			temp.push(new key());
		});
		return temp;
	})();

	public static getFilteredChampions(searchTerm: string): Array<Champion> {
		let filteredChampions: Champion[] = [];
		let index = -1;
		Object.values(ChampionObjects).forEach((key) => {
			filteredChampions.push(new key());
			if (key == ChampionObjects.TargetDummy)
				index = filteredChampions.length - 1;
		});

		//move target dummy to front
		filteredChampions.unshift(filteredChampions.splice(index, 1)[0]);

		searchTerm = stringConvert(searchTerm);

		filteredChampions = filteredChampions.filter(champion => {
			if (searchTerm === '')
				return true;

			if (stringConvert((champion).championName).includes(searchTerm))
				return true;
			if (stringConvert((champion).epithet).includes(searchTerm))
				return true;
			return false;
		});
		return filteredChampions;
	}

}

function stringConvert(input: string): string {
	input = input.replace(/[\s,'-]/g, "").toLowerCase();;
	return input;
}