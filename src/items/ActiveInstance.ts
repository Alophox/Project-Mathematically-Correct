import { DamageInstance } from "../builds/DamageInstance";


export class ActiveInstance{
	public castTime: number;
	public castBuffer: Array<DamageInstance>;

	constructor(castTime:number, castBuffer: DamageInstance[]) {
		this.castBuffer = castBuffer;
		this.castTime = castTime;
	}
}