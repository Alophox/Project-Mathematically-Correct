import { Stat } from "../Stat";

export class Share {

	public primarySource: string; //item
	public secondarySource: string; //passive or Stat if applicable
	public amount: number;
	/**
	 * 
	 * @param primarySource: the item or champion
	 * @param secondarySource: the passive, if applicable
	 * @param amount: how much of the stat is given
	 */
	constructor(amount:number, primarySource:string, secondarySource:string) {
		this.primarySource = primarySource;
		this.secondarySource = secondarySource;
		this.amount = amount;
	}
}