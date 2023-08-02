export enum CC {
	None = 0,
	Airborne = 1 << 0,
	Blind = 1 << 1,
	Cripple = 1 << 2,
	Disarm = 1 << 3,
	Disrupt = 1 << 4,
	Drowsy = 1 << 5,
	Sleep = 1 << 6,

	Berserk = 1 << 7,
	Charm = 1 << 8,
	Flee = 1 << 9,
	Taunt = 1 << 10,

	ForcedAction = Berserk | Charm | Flee | Taunt,

	Ground = 1 << 11,
	Kinematics = 1 << 12, //rell ult
	Knockdown = 1 << 13,
	Nearsight = 1 << 14,
	Root = 1 << 15,
	Silence = 1 << 16,
	Polymorph = 1 << 17,
	Slow = 1 << 18,
	Stasis = 1 << 19,
	Stun = 1 << 20,
	Suspension = 1 << 21,
	Suppression = 1 << 21,

	//hard  cc
	TotalCC = Airborne | ForcedAction | Sleep | Stasis | Stun | Suppression | Suspension,
	//soft cc
	PartialCC = ~TotalCC,


	//anything that cancels channels
	Disrupts = Disrupt | Airborne | ForcedAction | Polymorph | Silence | Sleep | Stasis | Stun | Suppression | Suspension,

	//no movement commands
	Immobilizing = Airborne | ForcedAction | Root | Sleep | Stasis | Stun | Suppression | Suspension,

	//disables attacks
	Disarming = Disarm | Airborne | Charm | Flee | Sleep | Stasis | Stun | Suppression | Suspension,


}

export class CrowdControl {
	public cc: CC;
	public duration: number;
	public mod: number = 0;
	constructor(cc:CC, duration: number, mod?:number) {
		this.cc = cc;
		this.duration = duration;
		this.mod = mod ?? this.mod;
	}
}

export class NetCrowdControl {
	netCC: Array<CrowdControl> = new Array<CrowdControl>();
	startTime:number = 0;
	constructor(netCC?: Array<CrowdControl>) {
		this.netCC = netCC ?? this.netCC;
	}

	public includes(cc: CC): boolean {
		let yes:boolean = false
		//console.log(cc);
		this.netCC.forEach((value) => {
			//console.log("against: " + value.cc);
			if (value.cc & cc) {

				yes = true;
			}
		});
		return yes;
	}
}