import { useState, useMemo } from "react";

// ── HEADLINE DATA ──────────────────────────────────────────────────────────────
const PAIRS = [
  {
    id: "17|18",
    label: "Ch.17 ↔ Ch.18",
    titles: "Boundary Shift Equation / Broken Wing",
    overlap: 90,
    redundantWords: 4729,
    adjacent: true,
    severity: "CRITICAL",
    read: "Near-total clone. One is a forked draft of the other. Ch.18 likely a renamed copy of Ch.17 — pick one, delete duplicated body from the other.",
    color: "red",
  },
  {
    id: "14|22",
    label: "Ch.14 ↔ Ch.22",
    titles: "Package Sacrament / Don't Fuck with Familia",
    overlap: 86,
    redundantWords: 3040,
    adjacent: false,
    severity: "HIGH",
    read: "High overlap across distant chapters (8 apart). Either a deliberate reprise or pasted residue. The authorial call: callback (keep/compress) vs revision paste (remove)?",
    color: "gold",
  },
  {
    id: "26|27",
    label: "Ch.26 ↔ Ch.27",
    titles: "Echoes of an Empire / Hunter's Geometry",
    overlap: 67,
    redundantWords: 2375,
    adjacent: true,
    severity: "HIGH",
    read: "Substantial shared spine — ~1/3 of the smaller chapter is unique. Possibly a split that wasn't finished. Unique material from both sides should be merged into one coherent chapter.",
    color: "orange",
  },
];

// ── RAW CSV DATA (236 clusters) ────────────────────────────────────────────────
const RAW = [
  ["DUP-001","17|18",88,88,"\"My father worked twenty years in fields that belonged to other men.\" His voice came out f"],
  ["DUP-002","17|18",87,87,"The years ahead of him stretched beyond counting — he would measure them one day at a time"],
  ["DUP-003","17|18",85,85,"\"Black soldiers. Eleven percent of your forces. Twenty percent of combat deaths in the ear"],
  ["DUP-004","17|18",84,84,"Each heartbeat came with a face. Young. Brown. Uniformed in the way of expendable bodies."],
  ["DUP-005","17|18",80,80,"Alvarez reached forward. He picked up the rosary from the desk. He held it a moment — feel"],
  ["DUP-006","17|18",78,78,"\"Psychology. Strategy.\" Duc leaned forward. The chair groaned. His fingertips pressed the"],
  ["DUP-007","17|18",78,78,"A young man's face, brown, uniformed in Army olive, holding a photograph of a woman and tw"],
  ["DUP-008","17|18",75,75,"He stood. He carried the rosary to the desk in the interrogation chamber and set it in the"],
  ["DUP-009","17|18",74,74,"He pulled the rosary from his jacket. Beads held warmth — years of body heat absorbed into"],
  ["DUP-010","17|18",73,73,"The radio call lived in his chest — his voice, level, transmitting coordinates. Someone ha"],
  ["DUP-011","26|27",70,70,"He could taste the border—Sonoran dust, blood spilled at La Frontera, wells gone alkaline-"],
  ["DUP-012","17|18",69,69,"They processed him in the morning. A clerk behind a folding table filled in fields in a la"],
  ["DUP-013","17|18",69,69,"\"Jesus.\" He did not know where the names came from. They arrived the way his grandmother's"],
  ["DUP-014","17|18",68,68,"\"Because I need to understand how a man carries a fracture for this long without it closin"],
  ["DUP-015","17|18",68,68,"Hands roughened by fields not his own. Eyes steady from a lifetime of dignity purchased th"],
  ["DUP-016","17|18",67,67,"Abuela's voice vibrated through the seat — bass frequency, a register that traveled throug"],
  ["DUP-017","17|18",66,66,"Below: red earth. Jungle. Figures gathering, pointing, running. Humidity pressed against s"],
  ["DUP-018","17|18",63,63,"WHUMPH. Impact. Body registered the shock traveling from feet through ankles, calves, expl"],
  ["DUP-019","26|27",63,63,"A half-laugh escaped Miguel's throat—warning more than humor, the sound predators made cat"],
  ["DUP-020","17|18",62,62,"Metallic grinding at a frequency that set teeth vibrating. Not a vehicle. The system itsel"],
  ["DUP-021","17|18",61,61,"He ran his hands across the mat. Rough fabric. Weave registered under his fingers like a c"],
  ["DUP-022","26|27",60,60,"Miguel missed the English but understood the grin, caught amazement and apprehension flick"],
  ["DUP-023","17|18",59,59,"He held the transmit key three seconds past requirement. His father had told him: the reco"],
  ["DUP-024","17|18",59,59,"Air hung thick. Each inhalation brought particles of earth, fragments of time, the accumul"],
  ["DUP-025","17|18",59,59,"\"Americans have a weakness.\" Duc kept his voice measured. His fingers pressed the table ed"],
  ["DUP-026","17|18",56,56,"Duc did not write this down. Some things the journal did not need to hold. Some things tra"],
  ["DUP-027","17|18",55,55,"Command pushed through: \"Say again. Say your position!\" His father's voice layered underne"],
  ["DUP-028","17|18",55,55,"He closed his eyes. Waited for dawn that would not come. He thought of the record that som"],
  ["DUP-029","17|18",55,55,"Lieutenant Everett Alvarez Jr. First captured American pilot. August 1964. Mexican-America"],
  ["DUP-030","17|18",53,53,"He catalogued these things because the system relied on the prisoner losing his precision"],
  ["DUP-031","14|22",52,52,"He pulled out two manila folders. \"You're getting NJP. Office Hours. Forfeiture of pay, re"],
  ["DUP-032","26|27",52,52,"Cigarette ash braided incense dust at Sacred Heart—sacred and profane sharing air where su"],
  ["DUP-033","17|18",51,51,"Alvarez stared at the numbers. His jaw worked once. His right thumb ground against his ind"],
  ["DUP-034","26|27",51,51,"The plan emerged like a developing photograph: strip away everything marking them as Ameri"],
  ["DUP-035","14|22",50,50,"Everyone turned. Johnson's care package — what remained — lay dumped beside O'Neil's bed."],
  ["DUP-036","17|18",50,50,"Water pit-pit-pit through cracks overhead, pooling in the corner, throwing shadows from th"],
  ["DUP-037","26|27",50,50,"\"Fuera uniformes. Pantalones oscuros. Descalzos. Una radio. Silencio absoluto. Y esto—\" he"],
  ["DUP-038","17|18",49,49,"He had read Alvarez's file four times. He opened it a fifth. The folder radiated the warmt"],
  ["DUP-039","14|22",48,48,"Eight men packed the hooch. The sensor hit first: torn cardboard, displaced personal effec"],
  ["DUP-040","17|18",48,48,"The airframe bucked. Sky and jungle traded places. The jet screamed — frequency exceeding"],
  ["DUP-041","26|27",48,48,"Jorge tilted his head, the compass swinging like a metronome set to the old rhythm of disp"],
  ["DUP-042","26|27",48,48,"\"Cambiamos la piel. Fuera el uniforme que nos prestaron. Fuera las botas. Sacamos pantalon"],
  ["DUP-043","14|22",47,47,"Doc Watkins stepped forward, medical bag slung. Alabama accent carrying the weight of a ma"],
  ["DUP-044","14|22",47,47,"Williams found his voice at the memorial formation: \"Vengeance belongeth to the Lord, and"],
  ["DUP-045","17|18",47,47,"Now — fifteen revolutionary years carved into his temples, hands bearing scars from pen an"],
  ["DUP-046","26|27",47,47,"Behind them, candlelight flickered through stained-glass windows, like prayers made visibl"],
  ["DUP-047","17|18",46,46,"The O of LIVES stretched, became tunnel mouth. A throat. An invitation. The smell of spray"],
  ["DUP-048","14|22",45,45,"First Squad limped back to their hooch. George led with his eye swelling shut. Behind him,"],
  ["DUP-049","14|22",45,45,"\"I don't want to hear it, Ramos. I've got statements from witnesses, a firebase that smell"],
  ["DUP-050","17|18",45,45,"Darkness complete. Stone darkness, earth darkness, depth measured in meters. It pressed. I"],
  ["DUP-051","26|27",45,45,"Ramos and O'Neil stepped into moon and radio glow—four silhouettes reading the same map in"],
  ["DUP-052","26|27",45,45,"Jorge gave a slight nod, understanding the unspoken truth between them: if they never saw"],
  ["DUP-053","14|22",44,44,"Three weeks later, when Third Squad took casualties on patrol, George's ten-man squad resp"],
  ["DUP-054","17|18",44,44,"Alvarez lurched upright on the mat, muscles still falling through air. His hands seized th"],
  ["DUP-055","17|18",44,44,"His father had done that. The knowing arrived through his hands — muscle carrying memory t"],
  ["DUP-056","17|18",44,44,"Then: abuela. Scent — albahaca mixing with tunnel dust, intensifying, becoming real. Her c"],
  ["DUP-057","26|27",44,44,"Jorge drifted closer, his compass ticking sacred time like rosary beads sliding through fi"],
  ["DUP-058","17|18",43,43,"His hands seized the stick anyway. Tendons locked. Fingers whitened inside gloves. Cordite"],
  ["DUP-059","17|18",43,43,"He drank the cold tea. Bitterness coated his tongue — refusal-taste, copper and jasmine fu"],
  ["DUP-060","26|27",43,43,"\"Promíteme algo.\" Jorge's voice cut through ritual preparation. \"Promíteme que si the hunt"],
  ["DUP-061","14|22",42,42,"O'Neil's head snapped up. Face shifted from hurt to fury. \"I hope they ate the wrong ones"],
  ["DUP-062","17|18",42,42,"His hands shook. Recognition, not weakness. The tremor that runs through bodies when they"],
  ["DUP-063","17|18",41,41,"Duc considered the question with the full weight it deserved. His thumb traced a groove in"],
  ["DUP-064","17|18",41,41,"Then: grandfather. Shadow of him — man he had never met, dead before Alvarez arrived, whos"],
  ["DUP-065","26|27",41,41,"The earth kept records. Miguel's people read them since Tenochtitlan fell—brown warriors p"],
  ["DUP-066","14|22",40,40,"O'Neil and Jorge positioned as lookouts. They watched Martinez, fascination mixing with so"],
  ["DUP-067","14|22",40,40,"Doc Watkins treated all ten men. Williams brought water. Reynolds offered quiet presence,"],
  ["DUP-068","17|18",40,40,"Duc studied the photograph. Brown skin. Brown hands. The same brown as the farmers he had"],
  ["DUP-069","26|27",40,40,"\"Nel, hermano. Esto está loco. Está muy mal, carnal. Pero mira—los niños duermen abajo. Es"],
  ["DUP-070","26|27",40,40,"Kowalski spat tobacco juice into darkness. \"Quiet's worse than noise. Noise you can count."],
  ["DUP-071","17|18",39,39,"He tried to stand. Ankle held one step. Then the rifle butt found his kidney and he drove"],
  ["DUP-072","17|18",39,39,"The chamber: cave carved into living earth, clay walls pressing inward, bamboo ribs strain"],
  ["DUP-073","14|22",38,38,"George's jaw tightened. He surveyed the wreckage. Someone had rifled their effects like en"],
  ["DUP-074","14|22",38,38,"He paused, studying George's face. \"But here's the thing, Sergeant Ramos. Ten men who'll d"],
  ["DUP-075","17|18",37,37,"Desk: concrete. Cold leeched through his palms and forearms, drawing heat from his body as"],
  ["DUP-076","26|27",37,37,"Jorge rolled onto his arches, testing balance like a dancer preparing for performance judg"],
  ["DUP-077","14|22",36,36,"\"You know what gets me?\" Kowalski's voice dropped. \"Linda skipped desserts two months to m"],
  ["DUP-078","14|22",36,36,"Johnson and Martinez moved through Third Squad's quarters. Williams's refusal showed in th"],
  ["DUP-079","14|22",36,36,"O'NEIL fought with Kentucky mountain fury, each punch carrying generations of feuding bloo"],
  ["DUP-080","14|22",36,36,"\"Murphy, get your boys to sick bay. Some of them need medical attention. And Ramos — next"],
  ["DUP-081","17|18",36,36,"Ancestors poured in. Vietnamese. Mexican. Brown faces from every war, every battlefield wh"],
  ["DUP-082","17|18",36,36,"He opened his hands in the dark. He flexed each finger — counting them, confirming them, t"],
  ["DUP-083","14|22",35,35,"\"Forgive?\" Johnson's voice cracked. \"Williams, they disrespected my mama's love. Took some"],
  ["DUP-084","14|22",35,35,"Doc Watkins stepped in, voice measured. \"What he means is retaliation escalates. Third Squ"],
  ["DUP-085","14|22",35,35,"Doc Watkins laid out bandages and antiseptic. \"That's the hardest position to hold. Everyo"],
  ["DUP-086","17|18",35,35,"Two objects on a concrete desk. No explanation attached. The arrangement itself the argume"],
  ["DUP-087","14|22",34,34,"\"It means not everyone thinks violence solves everything.\" Williams's voice wavered. \"Mama"],
  ["DUP-088","17|18",34,34,"A white streak from the jungle — missile climbing bright smoke, drawing a line from ground"],
  ["DUP-089","17|18",34,34,"Water pit-pit-pit through cracks overhead. Sound arrived tactile — each droplet a finger p"],
  ["DUP-090","17|18",34,34,"Cigarette smoke curled through the room. Binh spread intelligence reports across the desk,"],
  ["DUP-091","17|18",34,34,"He had transmitted his position before the missile hit. He had spoken first in the interro"],
  ["DUP-092","14|22",33,33,"Williams stepped forward, hands raised. \"Mama said when men act without thinking, regret f"],
  ["DUP-093","17|18",33,33,"The warhead flashed. KRAK-WHUMP. Pressure wave struck his chest from inside out. Ribs comp"],
  ["DUP-094","17|18",33,33,"His hands pressed tunnel walls. Clay slick with sweat. The walls breathed — warm breath of"],
  ["DUP-095","14|22",32,32,"PFC Kowalski gripped the torn envelope, hands shaking. Linda's care package — cookies, swe"],
  ["DUP-096","14|22",32,32,"\"They opened Linda's package.\" Each word a blade. \"They read what was ours. I was supposed"],
  ["DUP-097","14|22",32,32,"\"They ate my mama's pound cake.\" Philadelphia street cool evaporated. \"My mama worked doub"],
  ["DUP-098","14|22",32,32,"Juan burst through the entrance like a street fighter hunting trouble. \"¿Qué pasa, hermano"],
  ["DUP-099","26|27",32,32,"The frequency pulsed like a second heartbeat—mechanical rhythm replacing organic blood and"],
  ["DUP-100","26|27",32,32,"\"Four months ago, you told me I was a tracker. A reader of signs. A man understanding eart"],
  ["DUP-101","26|27",32,32,"For the first time in months, Miguel felt lighter without American uniform's weight—a pred"],
  ["DUP-102","14|22",31,31,"Williams tried again. \"Mama believed forgiveness isn't weakness — it's strength. Brothers,"],
  ["DUP-103","14|22",31,31,"\"They got my Mexican candy.\" His voice made wise men sit down. \"Abuela's chamoy and tamari"],
  ["DUP-104","14|22",31,31,"The incident became company legend — not for the fight, but for what it revealed about res"],
  ["DUP-105","17|18",31,31,"Wind. Ragged breathing mixing with the whistle of air through parachute vents. Radio crack"],
  ["DUP-106","17|18",31,31,"Outside, a guard shifted. Chair scraped concrete — scrape-scrape — surveillance vibrating"],
  ["DUP-107","17|18",31,31,"Alvarez's jaw tightened. The muscle near his ear jumped. Tendons in his neck corded. His f"],
  ["DUP-108","17|18",31,31,"Not memory. Its echo — metal grown teeth, crawled inside his nervous system, installed its"],
  ["DUP-109","17|18",31,31,"The cockpit held absolute stillness, and in that stillness his hands stopped shaking, and"],
  ["DUP-110","17|18",31,31,"Wind roared — but underneath the roar lived sounds older than sound. The acoustic signatur"],
  ["DUP-111","26|27",31,31,"Miguel's hand found the compass at Jorge's throat, pressed brass warm from body heat. \"Vám"],
  ["DUP-112","14|22",30,30,"\"What? More than two words?\" Kowalski wheeled on him, stutter gone, Detroit-hard consonant"],
  ["DUP-113","14|22",30,30,"\"I understand you're hurting,\" Williams said. \"But Mama said revenge is drinking poison an"],
  ["DUP-114","14|22",30,30,"Williams looked up, farm boy face reddening. \"Mama said just because the world acts withou"],
  ["DUP-115","14|22",30,30,"Reynolds set down his wooden cross. \"That's my position. Williams is right about one thing"],
  ["DUP-116","14|22",30,30,"The real message came when Martinez looked at Jenkins's rack and let his gap-toothed grin"],
  ["DUP-117","14|22",30,30,"Henderson straightened his glasses. Iowa farm boy fury, unleashed. \"This is for being an a"],
  ["DUP-118","17|18",30,30,"Massive. Barrio colors — deep greens and gold, blood reds, electric blue of azulejo tile,"],
  ["DUP-119","14|22",29,29,"\"American soldiers.\" O'Neil's voice cut across the LZ, Kentucky pride burning clean. \"Comi"],
  ["DUP-120","14|22",29,29,"Doc Watkins waited in the separate hooch with his aid bag open. Williams sat beside Reynol"],
  ["DUP-121","14|22",29,29,"\"Gentlemen.\" Thompson's voice carried twenty years of the Corps. \"Yesterday's boxing exhib"],
  ["DUP-122","17|18",29,29,"Warning tone: WEE-OOO, WEE-OOO. Frequency thrummed through his sternum, vibrated his molar"],
  ["DUP-123","17|18",29,29,"\"I want to hear it from them. If we understand why the fracture holds even against their o"],
  ["DUP-124","17|18",29,29,"\"Mine also.\" Duc's hands moved to the journal without opening it. \"Not fields. Not someone"],
  ["DUP-125","17|18",29,29,"His body continued its false descent — vestibular system still reporting the tunnel, still"],
  ["DUP-126","14|22",28,28,"Miguel knelt beside his violated footlocker, holding torn letters from Michoacán. \"Se comi"],
  ["DUP-127","17|18",28,28,"\"They asked about aviation technology.\" Duc's hand moved across the file, fingertips traci"],
  ["DUP-128","17|18",28,28,"Alvarez stared at the rosary on the desk. His right hand twitched — the fingers curling, u"],
  ["DUP-129","26|27",28,28,"And in that beginning, two men speaking only Spanish, belonging to no empire, carrying gen"],
  ["DUP-130","17|18",27,27,"Engine seized. SHRIEK-WHINE-DEAD. A dying animal's cry compressed into machinery. Hydrauli"],
  ["DUP-131","17|18",27,27,"Left ankle twisted. Pain detonated — not gradual but immediate, ligaments tearing, the sen"],
  ["DUP-132","17|18",27,27,"Duc reached for the journal and turned it toward himself. He wrote one line: *The fracture"],
  ["DUP-133","17|18",27,27,"\"Your father,\" Duc said. His voice changed registers — lower, the interrogation frequency"],
  ["DUP-134","14|22",26,26,"\"Maybe I do.\" Williams's composure cracked. \"Maybe I think some of y'all act more like the"],
  ["DUP-135","14|22",26,26,"Miguel struggled with tape around his ribs, gap-toothed grin matching Martinez's. \"Esos ca"],
  ["DUP-136","17|18",26,26,"Binh lit another cigarette and offered one. Duc declined. Binh held the match a moment lon"],
  ["DUP-137","17|18",26,26,"\"Alvarez. Navy pilot. First captured, August 1964. Mexican-American. His people die at hig"],
  ["DUP-138","17|18",26,26,"Binh looked at the file. He looked at it a full five seconds — long enough that both men u"],
  ["DUP-139","26|27",26,26,"Mitchell's jaw worked like chewing glass. Numbers didn't add up—too many vectors, too much"],
  ["DUP-140","26|27",26,26,"The moon hung heavy and full, so bright his pupils shrank, so bright he could see shadow-t"],
  ["DUP-141","14|22",25,25,"Doc Watkins raised his hands. \"Williams, Reynolds, and I won't participate. That's our cho"],
  ["DUP-142","14|22",25,25,"Williams looked between them — Reynolds with his wooden cross, Doc Watkins with his aid ba"],
  ["DUP-143","14|22",25,25,"The squad split. Reynolds, Doc Watkins, and Williams moved to the far hooch. O'Neil, Jorge"],
  ["DUP-144","14|22",25,25,"George led his ten warriors across red dust — his original eight plus Jorge and Miguel, wh"],
  ["DUP-145","14|22",25,25,"Johnson found Henderson's glasses in red dirt, bent but intact, placed them back on Hender"],
  ["DUP-146","14|22",25,25,"\"And tell her Juan and Miguel fought like true hermanos,\" O'Neil added — the acceptance in"],
  ["DUP-147","14|22",25,25,"Williams nodded. \"Mama said refusing to participate doesn't mean refusing to serve. We did"],
  ["DUP-148","17|18",25,25,"The silence that followed held a different quality — weight without threat, a load shared"],
  ["DUP-149","17|18",25,25,"Father's voice came not as words but as resonance in Alvarez's chest: *Mijo, no te rindas."],
  ["DUP-150","26|27",25,25,"\"The children are why we're here. All of this—the plan, the infiltration, the barefoot wal"],
  ["DUP-151","14|22",24,24,"\"Esos hijos de puta.\" Jorge snarled. \"Nadie toca los regalos de Abuela. En Zona Norte, les"],
  ["DUP-152","14|22",24,24,"\"Would you shut up about your Sunday school bullshit?\" Kowalski snapped. \"We're trying to"],
  ["DUP-153","14|22",24,24,"\"You didn't have to,\" Reynolds cut in, still whittling. \"I understand the anger. I won't t"],
  ["DUP-154","14|22",24,24,"\"Mark our territory and leave them a calling card.\" Martinez's gap-toothed grin formed slo"],
  ["DUP-155","14|22",24,24,"\"Sending a message.\" Martinez unzipped his fly. \"In the barrio, when someone steals from y"],
  ["DUP-156","14|22",24,24,"The rant died. Half the firebase had heard him. The crowd that gathered shifted, understan"],
  ["DUP-157","14|22",24,24,"Thompson leaned forward. \"Jenkins owes a public apology at formation for that mouth of his"],
  ["DUP-158","14|22",24,24,"Doc Watkins treated the wounded from both squads. Williams and Reynolds stood with George'"],
  ["DUP-159","17|18",24,24,"Duc stood. His chair scraped concrete — a sound the walls would file with every other scra"],
  ["DUP-160","26|27",24,24,"\"I was checking the northern perimeter. The one where you said scouts moved. I wanted to r"],
  ["DUP-161","26|27",24,24,"Every time the frogs fell silent, his ears twitched with attention bordering on prayer. A"],
  ["DUP-162","26|27",24,24,"\"Nos vamos por atrás y les caemos por el otro lado. Los niños primero. Siempre. Eso es la"],
  ["DUP-163","14|22",23,23,"Henderson jumped in. \"Oh, that's rich. Mister 'I never done nothing wrong' looking down on"],
  ["DUP-164","14|22",23,23,"Martinez lunged. Henderson stepped between them. \"You calling us thugs, Williams? Think be"],
  ["DUP-165","14|22",23,23,"Johnson followed. \"This is how we do it in Philly when someone thinks they can punk your f"],
  ["DUP-166","14|22",23,23,"\"CONTACT LEFT!\" George's voice boomed across the LZ with command authority that cut throug"],
  ["DUP-167","17|18",23,23,"CRACK-SNAP-THUMP. Chute deployed. Shoulders wrenched, joint sockets grinding. The world st"],
  ["DUP-168","17|18",23,23,"He keyed the radio a final time. Coordinates. Level voice. An act of record-keeping in the"],
  ["DUP-169","17|18",23,23,"Tunnel walls pulsed synchronized to his lungs. Warm on inhale — life-temperature. Cool on"],
  ["DUP-170","17|18",23,23,"Alvarez lurched upright on the mat. Hands seized air. The cell stayed dark. Lungs burned."],
  ["DUP-171","17|18",23,23,"Three active choices across three years, seven months of captivity. Against a system with"],
  ["DUP-172","26|27",23,23,"But the lie rose in his throat like bile. Where had he been? The Demilitarized Zone beyond"],
  ["DUP-173","14|22",22,22,"\"I don't understand, Sarge.\" Kentucky drawl thick as grief. \"Mama sent cornbread. Three we"],
  ["DUP-174","14|22",22,22,"\"I won't participate in revenge.\" North Carolina accent steady. \"I won't steal and I won't"],
  ["DUP-175","14|22",22,22,"O'Neil's cornbread tin. Kowalski's father's watch. George's candy wrappers. Plus compensat"],
  ["DUP-176","14|22",22,22,"Morrison collapsed onto his bunk face-first. His body knew before his brain caught up. The"],
  ["DUP-177","14|22",22,22,"George touched his rosary beads with swollen fingers. \"We're more than alright, hermanos."],
  ["DUP-178","14|22",22,22,"Reynolds finished a line on his cross. \"I won't apologize for my refusal. But I won't aban"],
  ["DUP-179","17|18",22,22,"Twenty years ago, French Indochina. He had believed mathematics could explain history, emp"],
  ["DUP-180","17|18",22,22,"Not flashing. Dripping — thick, viscous, carrying the bodies they represented, pooling in"],
  ["DUP-181","14|22",21,21,"\"Those sons of bitches.\" O'Neil stood, tall frame unfolding. \"Nobody touches Abuela's gift"],
  ["DUP-182","14|22",21,21,"Miguel stood. \"Sarge, nomás di la palabra. Juan y yo sabemos cómo manejar a estos cabrones"],
  ["DUP-183","17|18",21,21,"Vietnamese voices. Running feet — pad-pad-pad-pad through earth that carried sound into bo"],
  ["DUP-184","17|18",21,21,"That choice lived in muscle before it lived in memory. He would not recognize it as a choi"],
  ["DUP-185","17|18",21,21,"He lay back. Above him: 123 meters of Vietnamese soil. Around him: walls that had heard ev"],
  ["DUP-186","17|18",21,21,"Duc sipped tea. The taste — bitter, past warmth, at the temperature of held breath — told"],
  ["DUP-187","17|18",21,21,"Duc set down his tea. The cup clicked against concrete — a small percussion that both men"],
  ["DUP-188","17|18",21,21,"He reached for the rosary on the desk — then stopped. Left it where it lay. Left it in the"],
  ["DUP-189","17|18",21,21,"Alvarez looked up. Something moved in his face — surprise, then caution, then something un"],
  ["DUP-190","17|18",21,21,"Father stepped forward. Rosary beads warm in his hands. *Hijo, no te rindas. Mis alas esta"],
  ["DUP-191","17|18",21,21,"His breath. His voice. His body, which the system had taken enormous trouble to destroy an"],
  ["DUP-192","26|27",21,21,"\"Con esto, sí se pone fea. Pero no venimos a pelear; venimos a cazar. Venimos a proteger l"],
  ["DUP-193","14|22",20,20,"Miguel rose from his violated possessions, compact frame coiled spring-tight. \"Hijo de la"],
  ["DUP-194","14|22",20,20,"\"And does that process entail — is it within regulations?\" Williams called from across the"],
  ["DUP-195","14|22",20,20,"George's voice cut across the compound from outside — ice and command authority both. \"Wat"],
  ["DUP-196","14|22",20,20,"\"This is what happens when you steal from familia.\" Martinez's voice, from the shadows. Ga"],
  ["DUP-197","17|18",20,20,"Flak hit — sickening lurch before sound. CRACK-CRACK-CRACK through airframe and spine. Dea"],
  ["DUP-198","17|18",20,20,"Three years, seven months of captivity had taught Alvarez this: what the system cannot cou"],
  ["DUP-199","26|27",20,20,"\"You're lying. Your hands smell like something besides gun oil. And you're moving like you"],
  ["DUP-200","14|22",19,19,"\"Justice?\" Kowalski wheeled on Williams. \"They stole from my girlfriend, Williams. Violate"],
  ["DUP-201","14|22",19,19,"Staff Sergeant Murphy, too tired to process anything: \"Just get your gear squared away. We"],
  ["DUP-202","17|18",19,19,"The A-4 Skyhawk convulsed. Aluminum screamed its death note against calloused hands that h"],
  ["DUP-203","17|18",19,19,"\"Command, Boxer 201. SAM inbound, ten o'clock low. I am at grid 21-Niner-Alpha. Mark my po"],
  ["DUP-204","17|18",19,19,"Duc pulled out the journal. He turned pages so Alvarez could see — Vietnamese script, but"],
  ["DUP-205","17|18",19,19,"A deliberate restoration. A statement requiring no translation: *I see what you placed her"],
  ["DUP-206","14|22",18,18,"O'Neil's body hunched over his cot, shoulders caved where his care package belonged. Famil"],
  ["DUP-207","14|22",18,18,"Miguel moved, Michoacán temper flaring. \"¿Qué estás diciendo de nosotros, Williams? ¿Que n"],
  ["DUP-208","14|22",18,18,"Juan's eyes flashed. \"¿Thug, pendejo? Cuidado, güero. Esas son palabras de pelea donde ven"],
  ["DUP-209","14|22",18,18,"Doc Watkins nodded. \"I'll be here when you come back. To patch you up or listen, either wa"],
  ["DUP-210","14|22",18,18,"They left the ace of spades on the one dry spot of Jenkins's bunk: *Don't fuck with famil"],
  ["DUP-211","17|18",18,18,"Long silence. The sixty-cycle hum from the corridor fluorescent threaded through the pause"],
  ["DUP-212","17|18",18,18,"Warning lights strobed: red-red-red. Color vibrated at a frequency that made vision pulse."],
  ["DUP-213","17|18",18,18,"Hydraulic scream returned. SHRIEK-WHINE-DEAD. Not metal. Voices. A thousand voices screami"],
  ["DUP-214","17|18",18,18,"He pressed his palm flat against the cracking stone and held it there until the stone held"],
  ["DUP-215","26|27",18,18,"\"Alpha Base, this is Charlie Six. Movement on the ridgeline, estimate company strength, mo"],
  ["DUP-216","26|27",18,18,"Within seconds, the two men vanished into mist and foliage beyond the gate, indistinguisha"],
  ["DUP-217","14|22",17,17,"\"With all respect, Doc,\" Johnson said, \"they stole from our families. This ain't academic."],
  ["DUP-218","14|22",17,17,"\"Sarge, wasn't Abuelita sending some chamoy for me too?\" O'Neil asked, hope bleeding from"],
  ["DUP-219","14|22",17,17,"Miguel pulled out his Bowie knife. \"Ahorita se los voy a sacar por el trasero. Vatos estúp"],
  ["DUP-220","14|22",17,17,"Jenkins stepped forward, holding the ace of spades. \"You think you're real fucking funny,"],
  ["DUP-221","14|22",17,17,"The next morning, First Sergeant Thompson's voice boomed across the company area. \"SQUAD L"],
  ["DUP-222","17|18",17,17,"He closed the journal. His pen clicked against the spine — a sound like a bone setting."],
  ["DUP-223","26|27",17,17,"\"Descalzos. Sientes el suelo. Escuchas con los pies. No haces ruido. El silencio es tu arm"],
  ["DUP-224","14|22",16,16,"\"We're not in Mayberry where the hillbilly sheriff saves the day,\" Johnson snapped, Philad"],
  ["DUP-225","14|22",16,16,"Doc Watkins crossed his arms. \"Brothers, you get your revenge, might as well dig two grave"],
  ["DUP-226","14|22",16,16,"\"At least I don't curse every other word and act like some street thug,\" Williams said."],
  ["DUP-227","14|22",16,16,"Martinez moved through Third Squad's sleeping area with grim precision. Three beds. Pillow"],
  ["DUP-228","14|22",16,16,"An hour later, Third Squad trudged back from night patrol, boots heavy with mud and exhaus"],
  ["DUP-229","14|22",16,16,"The two squad leaders met at the midpoint. Twenty feet of dangerous ground between their m"],
  ["DUP-230","17|18",16,16,"Hundreds. Thousands. All out of sync, all pounding in blood-ratio mathematics: 11% — 20% —"],
  ["DUP-231","14|22",15,15,"Henderson's glasses fogged. \"Gosh darn it all, Kowalski, I didn't think you could string t"],
  ["DUP-232","14|22",15,15,"O'Neil's head turned toward Johnson. Kentucky mountain pride flared. \"What's that supposed"],
  ["DUP-233","14|22",15,15,"\"Values?\" Kowalski stood, hands clenched. \"What's that supposed to mean? That my values ai"],
  ["DUP-234","14|22",15,15,"Herrera stopped cleaning his weapon. \"I'm out. Williams, you should walk away from this. N"],
  ["DUP-235","14|22",15,15,"\"Jesus Christ, Sarge.\" Martinez wheezed. \"My abuela's gonna beat me with her chancla for f"],
  ["DUP-236","17|18",15,15,"*Los campos no eran nuestros. Pero nuestras manos eran nuestras. Y nuestro corazon era nue"],
];

const DUPLICATION_DATA = RAW.map(([id, chapters, words_each, redundant_words, snippet]) => ({
  id, chapters, words_each, redundant_words, snippet,
}));

const PAIR_COLOR = {
  "17|18": { text: "text-red",    bar: "bg-red",    border: "border-red/40",    bg: "bg-red/5"    },
  "14|22": { text: "text-gold",   bar: "bg-gold",   border: "border-gold/40",   bg: "bg-gold/5"   },
  "26|27": { text: "text-orange", bar: "bg-orange", border: "border-orange/40", bg: "bg-orange/5" },
};

const TOTAL_REDUNDANT = DUPLICATION_DATA.reduce((s, d) => s + d.redundant_words, 0);

export default function DuplicationMapTab() {
  const [activePair, setActivePair] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() =>
    activePair
      ? DUPLICATION_DATA.filter(d => d.chapters === activePair)
      : DUPLICATION_DATA,
  [activePair]);

  const displayData = showAll ? filtered : filtered.slice(0, 30);

  const pairCounts = useMemo(() => {
    const counts = {};
    DUPLICATION_DATA.forEach(d => {
      counts[d.chapters] = (counts[d.chapters] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-4 animate-slide-up">

      {/* Header */}
      <div className="bg-red/5 border border-red/30 rounded-lg p-3">
        <div className="text-sm font-black font-mono text-red">DUPLICATION MAP — v6 MANUSCRIPT</div>
        <div className="text-[10px] text-muted-foreground font-sans mt-0.5">
          Method: exact-normalized paragraph matching (≥15 words) · 236 clusters confirmed · Zero scattered duplicates outside these three pairs
        </div>
      </div>

      {/* Headline stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "DUPLICATE CLUSTERS", value: "236", sub: "total confirmed", color: "text-red" },
          { label: "REDUNDANT WORDS", value: TOTAL_REDUNDANT.toLocaleString(), sub: "exact matches only", color: "text-gold" },
          { label: "W/ NEAR-MATCHES", value: "~10,000", sub: "≥0.82 similarity", color: "text-orange" },
          { label: "PAIRS AFFECTED", value: "3", sub: "all isolated, no scatter", color: "text-teal" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className={`text-2xl font-black font-mono ${s.color}`}>{s.value}</div>
            <div className="text-[9px] font-bold font-mono text-muted-foreground">{s.label}</div>
            <div className="text-[8px] font-mono text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Pair cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PAIRS.map(p => {
          const c = PAIR_COLOR[p.id];
          const isActive = activePair === p.id;
          const clusterCount = pairCounts[p.id] || 0;
          return (
            <button
              key={p.id}
              onClick={() => setActivePair(isActive ? null : p.id)}
              className={`rounded-lg border p-4 text-left transition-all ${isActive ? `${c.border} ${c.bg}` : "border-border bg-card hover:bg-secondary/30"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`text-xs font-black font-mono ${c.text}`}>{p.label}</div>
                <div className={`text-[8px] font-bold font-mono px-2 py-0.5 rounded border ${p.severity === "CRITICAL" ? "text-red border-red/30 bg-red/10" : "text-gold border-gold/30 bg-gold/10"}`}>
                  {p.severity}
                </div>
              </div>
              <div className="text-[10px] font-sans text-muted-foreground italic mb-3">{p.titles}</div>

              {/* Overlap bar */}
              <div className="mb-1">
                <div className="flex justify-between text-[8px] font-mono text-muted-foreground mb-0.5">
                  <span>OVERLAP</span>
                  <span className={c.text}>{p.overlap}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${p.overlap}%` }} />
                </div>
              </div>

              <div className="flex justify-between text-[9px] font-mono mt-2">
                <span className="text-muted-foreground">{p.redundantWords.toLocaleString()} words</span>
                <span className="text-muted-foreground">{clusterCount} clusters</span>
              </div>
              <div className={`text-[8px] font-sans mt-2 leading-snug ${c.text}`}>{p.adjacent ? "Adjacent chapters" : "8 chapters apart"}</div>
              <div className="text-[9px] font-sans text-muted-foreground leading-snug mt-1">{p.read}</div>

              <div className={`text-[8px] font-bold font-mono mt-2 ${isActive ? c.text : "text-muted-foreground"}`}>
                {isActive ? "▼ showing clusters" : "▶ view clusters"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Word count impact */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-[10px] font-bold font-mono text-muted-foreground mb-3">WORD COUNT RECOVERY — DEDUP IMPACT</div>
        <div className="space-y-2">
          {PAIRS.map(p => {
            const c = PAIR_COLOR[p.id];
            const pct = (p.redundantWords / 248381) * 100;
            return (
              <div key={p.id} className="flex items-center gap-3">
                <div className={`text-[9px] font-bold font-mono ${c.text} w-20 flex-shrink-0`}>{p.label}</div>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${(p.redundantWords / 5000) * 100}%` }} />
                </div>
                <div className="text-[9px] font-mono text-foreground w-16 text-right flex-shrink-0">~{p.redundantWords.toLocaleString()} wds</div>
                <div className="text-[8px] font-mono text-muted-foreground w-10 text-right">{pct.toFixed(1)}%</div>
              </div>
            );
          })}
          <div className="border-t border-border pt-2 mt-2 flex items-center gap-3">
            <div className="text-[9px] font-bold font-mono text-teal w-20 flex-shrink-0">TOTAL</div>
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-teal rounded-full" style={{ width: `${(TOTAL_REDUNDANT / 5000) * 100}%` }} />
            </div>
            <div className="text-[9px] font-mono text-teal w-16 text-right flex-shrink-0">~{TOTAL_REDUNDANT.toLocaleString()} wds</div>
            <div className="text-[8px] font-mono text-teal w-10 text-right">{((TOTAL_REDUNDANT / 248381) * 100).toFixed(1)}%</div>
          </div>
        </div>
        <div className="mt-3 text-[9px] font-sans text-muted-foreground bg-teal/5 border border-teal/20 rounded p-2">
          ✓ Resolving these three pairs recovers <span className="text-teal font-bold">~8–10k words</span> as pure error correction — ≈25% of the roadmap's 40k-word target reached without sacrificing one intentional sentence.
        </div>
      </div>

      {/* Cluster table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="text-[10px] font-bold font-mono text-muted-foreground">
            {activePair ? `PAIR ${activePair} — ` : "ALL PAIRS — "}{filtered.length} CLUSTERS
            {activePair && <button onClick={() => setActivePair(null)} className="ml-2 text-accent hover:text-foreground">✕ clear filter</button>}
          </div>
          <div className="flex items-center gap-2">
            {PAIRS.map(p => (
              <button key={p.id} onClick={() => setActivePair(activePair === p.id ? null : p.id)}
                className={`text-[8px] font-bold font-mono px-2 py-1 rounded border transition-all ${activePair === p.id ? `${PAIR_COLOR[p.id].text} ${PAIR_COLOR[p.id].border} ${PAIR_COLOR[p.id].bg}` : "border-border text-muted-foreground hover:text-foreground"}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted-foreground font-bold w-24">ID</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-bold w-20">PAIR</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-bold w-20">WORDS</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-bold">SNIPPET</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((d, i) => {
                const c = PAIR_COLOR[d.chapters] || {};
                return (
                  <tr key={d.id} className={`border-b border-border/40 ${i % 2 === 0 ? "" : "bg-secondary/10"} hover:bg-secondary/20`}>
                    <td className={`px-3 py-2 font-bold ${c.text}`}>{d.id}</td>
                    <td className={`px-3 py-2 ${c.text}`}>{d.chapters}</td>
                    <td className="px-3 py-2 text-right text-foreground">{d.words_each}</td>
                    <td className="px-3 py-2 text-muted-foreground max-w-lg truncate" title={d.snippet}>{d.snippet}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length > 30 && (
          <div className="px-4 py-3 border-t border-border text-center">
            <button onClick={() => setShowAll(!showAll)}
              className="text-[9px] font-bold font-mono text-accent hover:text-foreground transition-colors">
              {showAll ? `▲ SHOW LESS` : `▼ SHOW ALL ${filtered.length} CLUSTERS`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}