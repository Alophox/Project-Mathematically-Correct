import { useState } from 'react';
import './App.css';
import './UIPanel.css';
import { TargetDummy } from './champions/champion-objects';
import { Champion } from './champions/Champion';
import { AdvancedPanel } from './PanelAdvanced/AdvancedPanel';

import { ToolTip } from './ToolTip';
import { useAppSelector } from './store/hooks';
import { BuildPanel } from './PanelBuild/BuildPanel';
import { SelectorPanel } from './PanelSelector/SelectorPanel';



function App() {
	const [allyChamp, setAllyChamp] = useState<Champion | undefined>();
	const [enemyChamp, setEnemyChamp] = useState<Champion|undefined>();
	const [defaultChamp, setDefaultChamp] = useState<Champion>(new TargetDummy());

	const calculatorAttributes = useAppSelector((state) => state.calculatorAttributes)


//	console.log("app rerender");
	return (
		<div className="App">
			<div className="UIPanel">
				Up to date as of patch 14.2b. Disclaimer: Calculator strives for but will not be 100% correct, and some items could be bugged.
			</div>
			<div className="AppContainer">
				<SelectorPanel
					allyChamp={allyChamp}
					setAllyChamp={setAllyChamp}
					enemyChamp={enemyChamp}
					setEnemyChamp={setEnemyChamp}
					defaultChamp={defaultChamp}
					setDefaultChamp={setDefaultChamp}
				/>
	
				<BuildPanel
					allyChamp={allyChamp}
					enemyChamp={enemyChamp}
					defaultChamp={defaultChamp}
					allyLevel={calculatorAttributes.allyLevel}
					burstSequence={calculatorAttributes.burstSequence}
					dpsPriority={calculatorAttributes.dpsPriority}
					enemyLevel={calculatorAttributes.enemyLevel}
				/>
				<AdvancedPanel />
			</div>
			<ToolTip />



			{/* This is for legal purposes and all that, I just want to make sure everything is all right... see Sources for where stuff was gotten(most is from the fandom wiki, which either got them straight from Riot or from decompiling LoL, either way it's from Riot */ }
			{/* No idea if this is necessary... */ }
			{/* https://www.riotgames.com/en/legal */ }
			{/* See point 6 */ }
			{/* [The title of your Project] was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games.  Riot Games does not endorse or sponsor this project. */ }
			<div className={"LegalJibberJabber"}>
				Project Mathematically Correct was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games.  Riot Games does not endorse or sponsor this project.
			</div>

		</div>



	);
}






export default App;