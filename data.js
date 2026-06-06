/* GRE Sprint — data.js */
'use strict';


// ---------- STORAGE FALLBACK (so it works as a downloaded file / plain browser too) ----------
(function(){
  const hasStore = (typeof window!=="undefined") && window.storage && typeof window.storage.get==="function";
  if(!hasStore){
    const mem = {};
    window.storage = {
      get: async(k)=>{ try{ const v=localStorage.getItem(k); return v!=null?{value:v}:null; }catch(e){ return mem[k]!=null?{value:mem[k]}:null; } },
      set: async(k,v)=>{ try{ localStorage.setItem(k,v); }catch(e){ mem[k]=v; } },
      delete: async(k)=>{ try{ localStorage.removeItem(k); }catch(e){ delete mem[k]; } }
    };
  }
})();
// GRE content banks — vocab (250+) and quiz (80+)
const DECKS = {
  "1 · Core": [
["Aberration","noun","A departure from what is normal or expected.","The warm December day was an aberration in an otherwise brutal winter.","anomaly · deviation · irregularity"],
["Abscond","verb","To leave hurriedly and secretly, often to avoid capture.","The treasurer absconded with the company funds overnight.","flee · escape · bolt"],
["Abstain","verb","To restrain oneself from doing something.","She abstained from dessert despite the temptation.","refrain · forbear · withhold"],
["Acumen","noun","Keen insight and good judgment.","Her business acumen turned a small shop into a chain.","insight · shrewdness · sharpness"],
["Admonish","verb","To warn or reprimand firmly but gently.","The coach admonished the players for arriving late.","reprimand · caution · rebuke"],
["Aesthetic","adj","Concerned with beauty or the appreciation of beauty.","The building's aesthetic appeal drew tourists daily.","artistic · tasteful · stylistic"],
["Affable","adj","Friendly, good-natured, easy to talk to.","The affable host made every guest feel welcome.","amiable · genial · cordial"],
["Aggrandize","verb","To increase power, status, or wealth; to exaggerate.","He used the position only to aggrandize himself.","exalt · magnify · enlarge"],
["Alacrity","noun","Brisk and cheerful readiness.","She accepted the challenge with surprising alacrity.","eagerness · willingness · readiness"],
["Ambiguous","adj","Open to more than one interpretation; unclear.","His ambiguous answer left everyone guessing.","vague · equivocal · unclear"],
["Ameliorate","verb","To make a bad situation better.","New policies helped ameliorate the housing crisis.","improve · alleviate · ease"],
["Anachronism","noun","Something out of its proper time.","A smartphone in a medieval film is an anachronism.","misplacement · incongruity"],
["Antithesis","noun","The direct opposite.","Her calm was the antithesis of his constant panic.","opposite · contrast · reverse"],
["Apathy","noun","Lack of interest, enthusiasm, or concern.","Voter apathy led to a record-low turnout.","indifference · unconcern · lethargy"],
["Arduous","adj","Difficult and requiring much effort.","The arduous climb took eight hours.","strenuous · grueling · taxing"]
  ],
  "2 · Tricky": [
["Belie","verb","To give a false impression of; to contradict.","Her smile belied the grief she felt inside.","misrepresent · contradict · disguise"],
["Bolster","verb","To support or strengthen.","New evidence bolstered the prosecution's case.","reinforce · buttress · strengthen"],
["Cacophony","noun","A harsh, discordant mixture of sounds.","The cacophony of car horns filled the street.","din · racket · discord"],
["Cajole","verb","To persuade by flattery or coaxing.","He cajoled his sister into lending the car.","coax · wheedle · sweet-talk"],
["Castigate","verb","To reprimand severely.","The columnist castigated the council for waste.","censure · chastise · upbraid"],
["Circumspect","adj","Cautious; considering all circumstances.","She was circumspect about sharing private details.","wary · prudent · guarded"],
["Clandestine","adj","Kept secret, especially because illicit.","They held clandestine meetings after dark.","secret · covert · furtive"],
["Coalesce","verb","To come together to form one whole.","The protest groups coalesced into a movement.","merge · unite · fuse"],
["Confound","verb","To confuse; to mix up.","The results confounded the researchers.","baffle · perplex · bewilder"],
["Conundrum","noun","A confusing and difficult problem.","Balancing growth with sustainability is a conundrum.","puzzle · dilemma · riddle"],
["Corroborate","verb","To confirm or support with evidence.","A second witness corroborated her account.","confirm · verify · substantiate"],
["Craven","adj","Contemptibly lacking courage.","His craven retreat embarrassed the unit.","cowardly · timid · pusillanimous"],
["Cryptic","adj","Mysterious or obscure in meaning.","She left a cryptic note no one could decode.","enigmatic · obscure · arcane"],
["Deference","noun","Respectful submission to another's judgment.","Out of deference to elders, he stayed quiet.","respect · regard · courtesy"],
["Deleterious","adj","Causing harm or damage.","Smoking has deleterious effects on the lungs.","harmful · damaging · injurious"]
  ],
  "3 · High-freq": [
["Demagogue","noun","A leader who exploits popular prejudices.","The demagogue stirred crowds with empty promises.","agitator · rabble-rouser"],
["Denigrate","verb","To criticize unfairly; to disparage.","He denigrated rivals instead of stating his ideas.","belittle · disparage · malign"],
["Deride","verb","To express contempt; to ridicule.","Critics derided the film as shallow.","mock · ridicule · scorn"],
["Desultory","adj","Lacking a plan; random.","He made a few desultory attempts before quitting.","aimless · haphazard · unfocused"],
["Diatribe","noun","A bitter, abusive verbal attack.","Her speech turned into a diatribe against the press.","tirade · rant · harangue"],
["Diffident","adj","Modest or shy from lack of confidence.","The diffident intern rarely spoke in meetings.","timid · bashful · reserved"],
["Dilatory","adj","Slow to act; intended to cause delay.","Their dilatory tactics stalled the vote.","tardy · sluggish · stalling"],
["Disabuse","verb","To free someone from a misconception.","Let me disabuse you of that false idea.","correct · undeceive · enlighten"],
["Discordant","adj","Disagreeing; harsh-sounding.","Discordant opinions split the committee.","clashing · jarring · conflicting"],
["Disparage","verb","To regard or speak of as unimportant.","He disparaged the work without reading it.","belittle · denigrate · demean"],
["Dissemble","verb","To conceal one's true motives or feelings.","She dissembled her disappointment with a grin.","disguise · feign · mask"],
["Dogmatic","adj","Asserting opinions as if they were facts.","His dogmatic tone shut down all debate.","opinionated · rigid · assertive"],
["Ebullient","adj","Cheerful and full of energy.","The ebullient crowd cheered every play.","exuberant · buoyant · elated"],
["Eclectic","adj","Drawing from a broad range of sources.","Her eclectic taste mixed jazz with techno.","varied · diverse · wide-ranging"],
["Efficacy","noun","The ability to produce a desired result.","Trials confirmed the drug's efficacy.","effectiveness · potency · power"]
  ],
  "4 · Advanced": [
["Enervate","verb","To weaken or drain of energy.","The relentless heat enervated the hikers.","weaken · exhaust · sap"],
["Ephemeral","adj","Lasting a very short time.","Fame can be ephemeral, gone within a season.","fleeting · transient · momentary"],
["Equanimity","noun","Calmness under stress.","She faced the crisis with remarkable equanimity.","composure · poise · serenity"],
["Erudite","adj","Showing great learning.","The erudite professor cited texts from memory.","scholarly · learned · cultured"],
["Esoteric","adj","Understood by only a small group.","The lecture was too esoteric for beginners.","obscure · arcane · recondite"],
["Eulogy","noun","A speech of high praise, often for the dead.","His eulogy moved the whole congregation.","tribute · panegyric · homage"],
["Exacerbate","verb","To make worse.","Ignoring the leak only exacerbated the damage.","aggravate · worsen · intensify"],
["Exculpate","verb","To clear from blame.","New DNA evidence exculpated the prisoner.","exonerate · absolve · acquit"],
["Extol","verb","To praise enthusiastically.","Reviewers extolled the novel's daring structure.","laud · acclaim · glorify"],
["Fallacious","adj","Based on mistaken belief; misleading.","His argument rested on fallacious reasoning.","erroneous · false · spurious"],
["Fervor","noun","Intense and passionate feeling.","She spoke with the fervor of a true believer.","passion · zeal · ardor"],
["Flout","verb","To openly disregard a rule.","Drivers routinely flout the speed limit here.","defy · disobey · scorn"],
["Garrulous","adj","Excessively talkative.","The garrulous neighbor told her whole life story.","talkative · loquacious · voluble"],
["Germane","adj","Relevant to a subject.","Keep your points germane to the topic.","relevant · pertinent · applicable"],
["Grandiloquent","adj","Pompous or extravagant in language.","His grandiloquent speech impressed no one.","bombastic · pompous · overblown"]
  ],
  "5 · Verbal MVPs": [
["Harangue","noun","A lengthy, aggressive speech.","The manager's harangue lasted twenty minutes.","tirade · diatribe · rant"],
["Iconoclast","noun","One who attacks cherished beliefs.","The scientist was an iconoclast in her field.","rebel · dissenter · maverick"],
["Impecunious","adj","Having little or no money.","The impecunious artist lived on bread and hope.","poor · penniless · destitute"],
["Inchoate","adj","Just begun; not fully formed.","The plan was still inchoate, more hope than detail.","rudimentary · nascent · embryonic"],
["Indolent","adj","Wanting to avoid activity; lazy.","The indolent cat slept through the afternoon.","lazy · idle · slothful"],
["Ineffable","adj","Too great to be expressed in words.","The view from the summit was ineffable.","indescribable · inexpressible"],
["Insipid","adj","Lacking flavor or interest.","The soup was insipid and the talk worse.","bland · dull · vapid"],
["Intransigent","adj","Refusing to change one's views.","Both sides remained intransigent for weeks.","stubborn · unyielding · obstinate"],
["Inveterate","adj","Long-established and unlikely to change.","He was an inveterate gambler.","habitual · chronic · ingrained"],
["Laconic","adj","Using very few words.","Her laconic 'No.' ended the discussion.","terse · curt · succinct"],
["Languid","adj","Slow, relaxed, lacking energy.","They spent a languid afternoon by the river.","listless · sluggish · leisurely"],
["Largess","noun","Generosity in giving.","The foundation's largess funded ten schools.","generosity · munificence · bounty"],
["Lethargic","adj","Sluggish and apathetic.","The heat left everyone lethargic.","sluggish · torpid · drowsy"],
["Loquacious","adj","Very talkative.","The loquacious guide never paused for breath.","talkative · garrulous · voluble"],
["Lucid","adj","Clear and easy to understand.","Her lucid summary clarified the whole report.","clear · coherent · limpid"]
  ],
  "6 · Verbal MVPs II": [
["Magnanimous","adj","Generous, especially toward a rival.","Magnanimous in victory, she praised her opponent.","generous · noble · gracious"],
["Maudlin","adj","Self-pityingly or tearfully sentimental.","The maudlin film tried too hard to make us cry.","mawkish · sentimental · weepy"],
["Mendacious","adj","Not telling the truth; lying.","The mendacious witness was caught in lies.","dishonest · deceitful · untruthful"],
["Mercurial","adj","Subject to sudden mood changes.","His mercurial temper made him hard to work for.","volatile · capricious · fickle"],
["Mitigate","verb","To make less severe.","Sandbags helped mitigate the flooding.","alleviate · lessen · reduce"],
["Mollify","verb","To soothe or appease.","An apology mollified the angry customer.","appease · placate · pacify"],
["Munificent","adj","Very generous.","A munificent gift endowed the new library.","generous · lavish · bountiful"],
["Nascent","adj","Just coming into existence.","The nascent startup had only three employees.","emerging · budding · developing"],
["Nefarious","adj","Wicked or criminal.","Police uncovered a nefarious smuggling ring.","villainous · sinister · heinous"],
["Obdurate","adj","Stubbornly refusing to change.","The obdurate landlord refused every request.","stubborn · inflexible · unrelenting"],
["Obfuscate","verb","To make unclear or confusing.","The jargon only obfuscated the simple point.","obscure · muddle · confuse"],
["Obsequious","adj","Excessively eager to please.","The obsequious clerk agreed with everything.","servile · fawning · sycophantic"],
["Onerous","adj","Involving heavy effort or duty.","The contract imposed onerous conditions.","burdensome · arduous · taxing"],
["Opaque","adj","Hard to understand; not transparent.","The instructions were frustratingly opaque.","unclear · obscure · cryptic"],
["Ostentatious","adj","Showy, meant to impress.","The ostentatious decor felt like a showroom.","showy · flashy · pretentious"]
  ],
  "7 · Verbal MVPs III": [
["Paragon","noun","A model of excellence.","She was a paragon of patience with students.","model · exemplar · epitome"],
["Pariah","noun","An outcast.","After the scandal he became a social pariah.","outcast · untouchable · reject"],
["Paucity","noun","Scarcity; smallness of amount.","A paucity of data weakened the study.","scarcity · dearth · shortage"],
["Pellucid","adj","Transparently clear in style or meaning.","Her pellucid prose required no rereading.","clear · lucid · limpid"],
["Penury","noun","Extreme poverty.","Illness drove the family into penury.","poverty · destitution · want"],
["Perfidious","adj","Deceitful and untrustworthy.","His perfidious betrayal stunned his allies.","treacherous · disloyal · faithless"],
["Pernicious","adj","Harmful, often in a gradual way.","Misinformation has a pernicious influence.","harmful · insidious · destructive"],
["Perspicacious","adj","Having keen insight.","A perspicacious editor spotted the flaw at once.","perceptive · shrewd · astute"],
["Phlegmatic","adj","Calm and unemotional.","His phlegmatic manner steadied the team.","stolid · unflappable · composed"],
["Placate","verb","To calm or appease.","They placated the crowd with free tickets.","appease · pacify · mollify"],
["Plethora","noun","An excess; a large amount.","A plethora of options overwhelmed buyers.","excess · abundance · surplus"],
["Pragmatic","adj","Practical rather than idealistic.","A pragmatic leader, she focused on results.","practical · realistic · sensible"],
["Precarious","adj","Dangerously uncertain.","The ladder rested in a precarious position.","unstable · perilous · shaky"],
["Prevaricate","verb","To avoid the truth; to be evasive.","He prevaricated rather than admit the error.","equivocate · hedge · dodge"],
["Profligate","adj","Recklessly wasteful.","Profligate spending drained the budget.","wasteful · extravagant · prodigal"]
  ],
  "8 · Final stretch": [
["Prosaic","adj","Ordinary; lacking imagination.","The plan was prosaic but reliable.","mundane · dull · pedestrian"],
["Pugnacious","adj","Eager to argue or fight.","His pugnacious style alienated colleagues.","combative · belligerent · aggressive"],
["Quiescent","adj","In a state of inactivity.","The volcano stayed quiescent for decades.","dormant · inactive · still"],
["Rancor","noun","Bitter, long-lasting resentment.","Old rancor surfaced during the negotiation.","bitterness · animosity · enmity"],
["Recalcitrant","adj","Stubbornly resistant to authority.","The recalcitrant student ignored every rule.","defiant · unruly · obstinate"],
["Reticent","adj","Reserved; reluctant to speak.","He was reticent about his past.","reserved · taciturn · withdrawn"],
["Sagacious","adj","Having keen judgment; wise.","Her sagacious advice saved the firm.","wise · shrewd · prudent"],
["Salient","adj","Most noticeable or important.","List only the salient points.","prominent · key · conspicuous"],
["Sanguine","adj","Optimistic, especially in a bad situation.","He stayed sanguine despite the setbacks.","optimistic · hopeful · upbeat"],
["Sardonic","adj","Grimly mocking or cynical.","She gave a sardonic smile at the excuse.","sarcastic · mocking · wry"],
["Spurious","adj","False; not genuine.","The site spread spurious health claims.","false · bogus · counterfeit"],
["Stymie","verb","To block or hinder.","Red tape stymied the rescue effort.","thwart · obstruct · impede"],
["Taciturn","adj","Reserved in speech.","The taciturn guard never said a word.","quiet · reticent · uncommunicative"],
["Tenuous","adj","Very weak or slight.","The evidence was tenuous at best.","flimsy · slight · insubstantial"],
["Truculent","adj","Aggressively defiant.","The truculent crowd refused to disperse.","belligerent · combative · hostile"]
  ],
  "9 · Power verbs": [
["Undermine","verb","To weaken gradually.","Gossip undermined her authority.","weaken · sabotage · erode"],
["Upbraid","verb","To scold sharply.","The captain upbraided the crew for sloppiness.","scold · rebuke · reproach"],
["Vacillate","verb","To waver between choices.","She vacillated before signing.","waver · oscillate · dither"],
["Venerate","verb","To regard with deep respect.","Students venerated the old teacher.","revere · honor · esteem"],
["Veracity","noun","Conformity to truth.","Reporters checked the source's veracity.","truthfulness · accuracy · honesty"],
["Vex","verb","To annoy or worry.","The delay vexed the waiting passengers.","irritate · annoy · trouble"],
["Vilify","verb","To speak ill of; defame.","The press vilified him before the trial.","defame · malign · slander"],
["Vindicate","verb","To clear of blame; to justify.","The audit vindicated her decisions.","exonerate · justify · absolve"],
["Vituperate","verb","To blame or insult harshly.","He vituperated the referee from the stands.","berate · revile · castigate"],
["Volatile","adj","Likely to change suddenly.","The volatile market swung all week.","unstable · erratic · mercurial"],
["Wary","adj","Cautious of danger.","Be wary of deals that seem too good.","cautious · guarded · careful"],
["Zealous","adj","Full of energy and enthusiasm.","Zealous fans camped out overnight.","fervent · ardent · passionate"],
["Capricious","adj","Given to sudden behavior changes.","The capricious weather ruined the picnic.","fickle · whimsical · unpredictable"],
["Disparate","adj","Fundamentally different.","The team had disparate goals.","distinct · dissimilar · divergent"],
["Quixotic","adj","Idealistic and impractical.","His quixotic quest charmed but failed.","idealistic · unrealistic · romantic"]
  ]
};

const QUIZZES = {
  "Text Completion": [
{meta:"1-blank",q:"Although the report was thorough, its ___ conclusion left readers unsure what the author actually recommended.",opts:["decisive","equivocal","scathing","lucid"],correct:1,exp:"<b>Equivocal</b> = ambiguous, which fits 'unsure what the author recommended.' Decisive and lucid are opposites; scathing means harshly critical."},
{meta:"1-blank",q:"The critic was known for praise so ___ that authors framed her reviews — she rarely found fault with anything.",opts:["grudging","fulsome","tepid","caustic"],correct:1,exp:"<b>Fulsome</b> here = abundant/excessive praise, matching 'rarely found fault.' Grudging, tepid, and caustic all imply little or negative praise."},
{meta:"1-blank",q:"Far from being ___, the senator's remarks were carefully calibrated to offend no one.",opts:["diplomatic","inflammatory","measured","cautious"],correct:1,exp:"'Far from' signals contrast with 'offend no one,' so the blank should mean provocative: <b>inflammatory</b>."},
{meta:"2-blank",q:"The professor's lectures were so ___ that even ___ students struggled to follow the thread.",opts:["lucid … weak","abstruse … diligent","clear … lazy","simple … bright"],correct:1,exp:"'Even ___ students struggled' implies strong students failed, so lectures were <b>abstruse</b> (obscure) and students <b>diligent</b>."},
{meta:"2-blank",q:"Her ___ generosity stood in stark contrast to her brother's ___ habits.",opts:["munificent … profligate","stingy … frugal","lavish … wasteful","munificent … parsimonious"],correct:3,exp:"'Stark contrast' to generosity needs an opposite. <b>Munificent</b> (very generous) vs <b>parsimonious</b> (stingy) is the true contrast."},
{meta:"1-blank",q:"The normally ___ committee surprised everyone by reaching a unanimous decision within minutes.",opts:["harmonious","fractious","efficient","unified"],correct:1,exp:"'Surprised everyone by... unanimous' implies they usually disagree, so <b>fractious</b> (quarrelsome)."},
{meta:"1-blank",q:"His ___ for detail made him the ideal proofreader; nothing escaped his eye.",opts:["disdain","penchant","aversion","indifference"],correct:1,exp:"<b>Penchant</b> = a strong liking, fitting 'ideal proofreader.' The other three mean dislike or not caring."}
  ],
  "Sentence Equiv.": [
{meta:"pick closest to 'praise'",q:"Reviewers were quick to ___ the debut novel for its originality.",opts:["denigrate","extol","ignore","revise"],correct:1,exp:"<b>Extol</b> = praise highly. Denigrate is the opposite."},
{meta:"pick closest to 'weaken'",q:"The scandal threatened to ___ public confidence in the agency.",opts:["bolster","undermine","reflect","sustain"],correct:1,exp:"<b>Undermine</b> = weaken gradually. Bolster and sustain mean strengthen."},
{meta:"pick closest to 'stubborn'",q:"Negotiations stalled because both sides remained ___.",opts:["flexible","intransigent","cordial","attentive"],correct:1,exp:"<b>Intransigent</b> = refusing to compromise, which stalls negotiations."},
{meta:"pick closest to 'short-lived'",q:"Internet fame is often ___, fading within weeks.",opts:["permanent","ephemeral","robust","gradual"],correct:1,exp:"<b>Ephemeral</b> = lasting a very short time, matching 'fading within weeks.'"},
{meta:"pick closest to 'wordy'",q:"The report was needlessly ___, burying its point in paragraphs of filler.",opts:["concise","verbose","lucid","brief"],correct:1,exp:"<b>Verbose</b> = using more words than needed, matching 'paragraphs of filler.'"},
{meta:"pick closest to 'calm'",q:"She handled the emergency with admirable ___.",opts:["panic","equanimity","haste","confusion"],correct:1,exp:"<b>Equanimity</b> = calmness under stress."},
{meta:"pick closest to 'harmful'",q:"Studies link the additive to ___ long-term effects.",opts:["beneficial","deleterious","negligible","temporary"],correct:1,exp:"<b>Deleterious</b> = causing harm."}
  ],
  "Reading & Logic": [
{meta:"Inference",q:"A passage states: 'While the policy reduced emissions, the cost fell disproportionately on low-income households.' The author most likely views the policy as:",opts:["entirely successful","flawed in its distribution of costs","environmentally useless","too lenient"],correct:1,exp:"The 'while' concedes a benefit but flags an equity problem — the author sees it as <b>flawed in how costs are distributed</b>, not useless."},
{meta:"Weaken",q:"Argument: 'Sales rose after the ad campaign, so the campaign caused the rise.' Which most weakens it?",opts:["The ads were expensive","A competitor closed during the same period","The ads ran nationally","Sales are measured monthly"],correct:1,exp:"A <b>competitor closing</b> offers an alternative cause for the rise, undermining the campaign-caused-it claim."},
{meta:"Assumption",q:"'The new app will succeed because it's faster than rivals.' This assumes that:",opts:["speed is what users value most","the app is cheap","rivals are slow","users dislike change"],correct:0,exp:"The argument only works if <b>speed is what users care about</b>; otherwise being faster wouldn't guarantee success."},
{meta:"Strengthen",q:"'Reading aloud improves memory.' Which best strengthens this?",opts:["Many people enjoy reading aloud","A controlled study found higher recall in the read-aloud group","Reading aloud is common in schools","Silent reading is faster"],correct:1,exp:"A <b>controlled study showing higher recall</b> directly supports the causal claim."},
{meta:"Main idea",q:"A paragraph contrasts two theories then notes 'recent data favor the second.' Its main purpose is to:",opts:["dismiss all theory","argue for the second theory","prove both wrong","describe the data set"],correct:1,exp:"Contrasting then favoring one with data signals the purpose is to <b>argue for the second theory</b>."},
{meta:"Tone",q:"An author calls a rival's plan 'a charming fantasy.' The tone is best described as:",opts:["sincere admiration","gentle mockery","neutral reporting","outright fury"],correct:1,exp:"'Charming fantasy' dismisses the plan as unrealistic in a light way — <b>gentle mockery</b>."}
  ],
  "Arithmetic": [
{meta:"Percent",q:"A $120 item is marked up 15%, then discounted 15%. The final price is:",opts:["$120.00","$117.30","$118.80","$115.00"],correct:1,exp:"120×1.15=138; 138×0.85=<b>$117.30</b>. A markup then equal discount nets a small loss, not zero."},
{meta:"Fractions",q:"What is 2/3 of 3/4 of 48?",opts:["24","16","32","18"],correct:0,exp:"3/4 of 48 = 36; 2/3 of 36 = <b>24</b>."},
{meta:"Ratios",q:"If 4 workers build a wall in 6 days, how long for 3 workers (same rate)?",opts:["8 days","4.5 days","6 days","9 days"],correct:0,exp:"Work = 4×6 = 24 worker-days. 24 ÷ 3 = <b>8 days</b>."},
{meta:"Percent change",q:"A value goes from 80 to 100. The percent increase is:",opts:["20%","25%","80%","125%"],correct:1,exp:"(100−80)/80 = 20/80 = <b>25%</b>. Always divide by the original."},
{meta:"Averages",q:"Five tests average 82. If one test of 70 is dropped, the new average of the remaining four is:",opts:["85","84","86","83"],correct:0,exp:"Sum = 5×82 = 410. Remove 70 → 340. 340/4 = <b>85</b>."},
{meta:"Number properties",q:"How many integers between 1 and 30 are divisible by both 2 and 3?",opts:["5","6","10","15"],correct:0,exp:"Divisible by 6: 6,12,18,24,30 = <b>5</b> numbers."}
  ],
  "Algebra": [
{meta:"Linear",q:"If 5(x−2) = 3x + 4, then x =",opts:["7","3","5","−7"],correct:0,exp:"5x−10 = 3x+4 → 2x = 14 → x = <b>7</b>."},
{meta:"Exponents",q:"Simplify (x³)² · x⁴ :",opts:["x⁹","x¹⁰","x²⁴","x¹²"],correct:1,exp:"(x³)² = x⁶; x⁶·x⁴ = <b>x¹⁰</b>."},
{meta:"Quadratic",q:"The solutions to x² − 5x + 6 = 0 are:",opts:["2 and 3","−2 and −3","1 and 6","−1 and 6"],correct:0,exp:"Factor: (x−2)(x−3)=0 → x = <b>2 and 3</b>."},
{meta:"Inequality",q:"If −3x + 7 > 1, then:",opts:["x < 2","x > 2","x < −2","x > −2"],correct:0,exp:"−3x > −6 → divide by −3 and flip: <b>x < 2</b>."},
{meta:"Systems",q:"If x + y = 10 and x − y = 4, then xy =",opts:["21","24","16","20"],correct:0,exp:"Adding: 2x=14 → x=7, y=3. xy = <b>21</b>."},
{meta:"FOIL",q:"(a + 3)(a − 3) =",opts:["a² − 9","a² + 9","a² − 6a + 9","a² − 6"],correct:0,exp:"Difference of squares: <b>a² − 9</b>."},
{meta:"Functions",q:"If f(x) = 2x² − 1, then f(3) =",opts:["17","11","35","18"],correct:0,exp:"2(9) − 1 = 18 − 1 = <b>17</b>."}
  ],
  "Geometry": [
{meta:"Triangles",q:"A right triangle has legs 9 and 12. The hypotenuse is:",opts:["15","21","13","√63"],correct:0,exp:"9-12-15 is a 3-4-5 triple ×3. √(81+144)=√225=<b>15</b>."},
{meta:"Circles",q:"A circle has radius 5. Its area is:",opts:["25π","10π","5π","50π"],correct:0,exp:"Area = πr² = π·25 = <b>25π</b>."},
{meta:"Angles",q:"Two angles of a triangle are 40° and 75°. The third is:",opts:["65°","75°","55°","45°"],correct:0,exp:"Angles sum to 180°. 180 − 40 − 75 = <b>65°</b>."},
{meta:"Special triangle",q:"In a 45-45-90 triangle, if each leg is 5, the hypotenuse is:",opts:["5√2","10","5√3","2.5"],correct:0,exp:"Ratio 1:1:√2, so hypotenuse = <b>5√2</b>."},
{meta:"Area",q:"A rectangle's length is twice its width. If area is 72, the width is:",opts:["6","8","12","9"],correct:0,exp:"w·2w = 72 → 2w² = 72 → w² = 36 → w = <b>6</b>."},
{meta:"Coordinate",q:"Distance between (0,0) and (6,8) is:",opts:["10","14","√48","48"],correct:0,exp:"√(6²+8²)=√100=<b>10</b>."}
  ],
  "Data & Stats": [
{meta:"Mean/Median",q:"Set: 3, 7, 7, 10, 13. The median is:",opts:["7","8","10","9"],correct:0,exp:"Ordered, the middle (3rd of 5) value is <b>7</b>."},
{meta:"Probability",q:"A fair die is rolled once. P(rolling a number > 4) =",opts:["1/3","1/2","2/3","1/6"],correct:0,exp:"Favorable: 5,6 → 2 of 6 = <b>1/3</b>."},
{meta:"Combinations",q:"How many ways to choose 2 from 5 distinct items?",opts:["10","20","25","5"],correct:0,exp:"C(5,2)=5!/(2!3!)=<b>10</b>."},
{meta:"Standard dev",q:"Which data set has the larger standard deviation? A: {5,5,5,5}  B: {1,4,6,9}",opts:["A","B","Equal","Cannot tell"],correct:1,exp:"<b>B</b> — its values spread out, while A has zero spread (SD = 0)."},
{meta:"Quant compare",q:"Quantity A: the median of 2,4,9 . Quantity B: the mean of 2,4,9 .",opts:["A greater","B greater","Equal","Cannot determine"],correct:1,exp:"Median = 4; mean = 15/3 = 5. <b>B is greater.</b>"},
{meta:"Data interp",q:"If a pie chart shows 'Rent' as 90°, what percent of the budget is rent?",opts:["25%","30%","45%","90%"],correct:0,exp:"90°/360° = <b>25%</b>."}
  ]
};

// ---------- PLAN ----------

// ===== EXTRA CONTENT (decks 10-19, more quizzes, essay) =====
// Additional decks 10-19 to push toward ~285 words total
const DECKS_EXTRA = {
  "10 · Roots & rigor": [
["Abate","verb","To become less intense or widespread.","The storm finally abated by dawn.","subside · diminish · wane"],
["Acerbic","adj","Sharp and forthright in speech.","Her acerbic wit left no one unscathed.","caustic · biting · tart"],
["Acquiesce","verb","To accept reluctantly without protest.","He acquiesced to the new rules to keep peace.","comply · consent · yield"],
["Adulterate","verb","To make impure by adding inferior elements.","The vendor adulterated the honey with syrup.","contaminate · dilute · taint"],
["Alleviate","verb","To make suffering less severe.","The medicine alleviated her headache.","ease · relieve · lessen"],
["Amalgamate","verb","To combine into one.","The two firms amalgamated last year.","merge · unite · blend"],
["Anomalous","adj","Deviating from the standard.","An anomalous spike appeared in the data.","abnormal · irregular · atypical"],
["Approbation","noun","Approval or praise.","The plan won the board's approbation.","approval · endorsement · acclaim"],
["Arcane","adj","Understood by few; mysterious.","The ritual followed arcane rules.","esoteric · obscure · cryptic"],
["Assuage","verb","To make an unpleasant feeling less intense.","Nothing could assuage his guilt.","soothe · ease · mollify"],
["Audacious","adj","Showing a willingness to take bold risks.","Her audacious plan stunned investors.","bold · daring · brazen"],
["Austere","adj","Severe or strict; plain.","They lived an austere, frugal life.","stern · spartan · ascetic"],
["Avarice","noun","Extreme greed for wealth.","His avarice cost him every friend.","greed · cupidity · rapacity"],
["Banal","adj","Lacking originality; boring.","The speech was full of banal clichés.","trite · hackneyed · insipid"],
["Bombastic","adj","High-sounding but with little meaning.","His bombastic promises convinced no one.","pompous · grandiloquent · inflated"]
  ],
  "11 · Sharp edges": [
["Brazen","adj","Bold and without shame.","She told a brazen lie to his face.","shameless · audacious · impudent"],
["Burgeon","verb","To grow or expand rapidly.","Tech startups burgeoned in the district.","flourish · proliferate · thrive"],
["Cantankerous","adj","Bad-tempered and argumentative.","The cantankerous old man complained daily.","irritable · grumpy · quarrelsome"],
["Censure","verb","To express severe disapproval.","The senate voted to censure the official.","condemn · reprimand · rebuke"],
["Chicanery","noun","Trickery used to deceive.","The deal collapsed amid legal chicanery.","deception · trickery · subterfuge"],
["Coddle","verb","To treat with excessive care.","Critics said the policy coddled offenders.","pamper · indulge · baby"],
["Cogent","adj","Clear, logical, and convincing.","She gave a cogent defense of the budget.","compelling · persuasive · forceful"],
["Complacent","adj","Smugly self-satisfied.","Success made the team complacent.","smug · self-satisfied · unconcerned"],
["Conciliatory","adj","Intended to placate or pacify.","He struck a conciliatory tone.","appeasing · placatory · pacifying"],
["Connoisseur","noun","An expert judge in matters of taste.","A connoisseur of wine, she knew every vintage.","expert · authority · aficionado"],
["Contrite","adj","Feeling deep regret.","His contrite apology seemed sincere.","remorseful · penitent · repentant"],
["Copious","adj","Abundant in supply.","She took copious notes all semester.","abundant · plentiful · ample"],
["Cursory","adj","Hasty and not thorough.","A cursory glance missed the error.","hasty · perfunctory · superficial"],
["Daunt","verb","To make someone lose courage.","The challenge did not daunt her.","intimidate · discourage · dishearten"],
["Debacle","noun","A sudden, humiliating failure.","The launch was a public debacle.","fiasco · disaster · catastrophe"]
  ],
  "12 · Heavy hitters": [
["Decorous","adj","Polite and in good taste.","Their behavior was perfectly decorous.","proper · seemly · dignified"],
["Defunct","adj","No longer existing or functioning.","The defunct factory stood empty.","extinct · obsolete · dead"],
["Demur","verb","To raise objections; to hesitate.","She demurred at the steep price.","object · hesitate · balk"],
["Deprecate","verb","To express disapproval of.","He deprecated the use of jargon.","disparage · belittle · decry"],
["Despot","noun","A ruler with absolute power.","The despot crushed all dissent.","tyrant · autocrat · dictator"],
["Diaphanous","adj","Light, delicate, and translucent.","The curtains were diaphanous and pale.","sheer · gossamer · filmy"],
["Disparate","adj","Fundamentally different.","The committee held disparate views.","distinct · divergent · dissimilar"],
["Dilatory","adj","Slow; meant to cause delay.","Dilatory replies stalled the deal.","tardy · sluggish · procrastinating"],
["Dubious","adj","Hesitating or doubtful.","She was dubious about the claim.","doubtful · skeptical · suspect"],
["Ductile","adj","Able to be deformed without breaking; pliable.","Copper is highly ductile.","pliable · malleable · flexible"],
["Egregious","adj","Outstandingly bad; shocking.","An egregious error cost them the case.","flagrant · glaring · gross"],
["Elegy","noun","A mournful poem, often for the dead.","He wrote an elegy for his friend.","lament · dirge · requiem"],
["Embellish","verb","To make more attractive by adding detail.","He embellished the story for effect.","decorate · adorn · exaggerate"],
["Empirical","adj","Based on observation, not theory.","Empirical data backed the claim.","observed · experimental · factual"],
["Emulate","verb","To imitate in order to match or surpass.","Young writers emulate her style.","imitate · mimic · copy"]
  ],
  "13 · Exam favorites": [
["Enmity","noun","A state of deep hostility.","Old enmity divided the families.","hostility · animosity · antagonism"],
["Ephemeral","adj","Lasting a very short time.","Trends are often ephemeral.","fleeting · transient · short-lived"],
["Equivocal","adj","Open to more than one meaning.","His equivocal reply settled nothing.","ambiguous · vague · uncertain"],
["Erudition","noun","Extensive knowledge from study.","Her erudition impressed the panel.","learning · scholarship · knowledge"],
["Eschew","verb","To deliberately avoid.","He eschewed luxury for simple living.","avoid · shun · forgo"],
["Evanescent","adj","Quickly fading; vanishing.","An evanescent glow lit the sky.","fleeting · transitory · ephemeral"],
["Exigent","adj","Pressing; demanding immediate action.","The exigent crisis required fast calls.","urgent · pressing · critical"],
["Expedient","adj","Convenient and practical, though possibly improper.","They chose the expedient route.","convenient · advantageous · pragmatic"],
["Extant","adj","Still in existence.","Only three copies are extant.","surviving · existing · remaining"],
["Facetious","adj","Treating serious issues with inappropriate humor.","His facetious remark fell flat.","flippant · glib · tongue-in-cheek"],
["Fatuous","adj","Silly and pointless.","A fatuous grin spread across his face.","foolish · inane · vacuous"],
["Fecund","adj","Highly fertile or productive.","A fecund imagination filled her novels.","fertile · prolific · productive"],
["Felicitous","adj","Well-chosen; apt; pleasing.","A felicitous phrase ended the toast.","apt · fitting · well-judged"],
["Fervid","adj","Intensely enthusiastic.","Fervid supporters packed the hall.","ardent · impassioned · zealous"],
["Florid","adj","Excessively ornate; flowery.","His florid prose buried the meaning.","ornate · elaborate · flamboyant"]
  ],
  "14 · The grind": [
["Forestall","verb","To prevent by acting in advance.","They cut prices to forestall losses.","preempt · avert · thwart"],
["Fortuitous","adj","Happening by chance, often luckily.","A fortuitous meeting changed her career.","chance · accidental · lucky"],
["Garish","adj","Obtrusively bright and showy.","The garish sign clashed with the street.","gaudy · flashy · lurid"],
["Glib","adj","Fluent but insincere.","His glib answers dodged the issue.","slick · facile · smooth-talking"],
["Grandiose","adj","Impressive but overly ambitious.","Grandiose plans rarely got finished.","pompous · ambitious · pretentious"],
["Gratuitous","adj","Uncalled for; without good reason.","The film's gratuitous violence drew flak.","unwarranted · needless · unjustified"],
["Hapless","adj","Unlucky.","The hapless team lost again.","unfortunate · ill-fated · luckless"],
["Hegemony","noun","Dominance of one group over others.","The empire's hegemony spanned the sea.","dominance · supremacy · control"],
["Iconoclastic","adj","Attacking cherished beliefs.","Her iconoclastic theory upset the field.","rebellious · heretical · subversive"],
["Idiosyncrasy","noun","A peculiar individual trait.","Tapping his pen was his idiosyncrasy.","quirk · eccentricity · peculiarity"],
["Impassive","adj","Showing no emotion.","His impassive face hid his fear.","expressionless · stoic · unmoved"],
["Impetuous","adj","Acting quickly without thought.","An impetuous decision he later regretted.","rash · impulsive · hasty"],
["Implacable","adj","Unable to be appeased.","An implacable foe, she never forgave.","relentless · unyielding · inexorable"],
["Inane","adj","Silly; lacking sense.","The chatter was utterly inane.","silly · vacuous · fatuous"],
["Incessant","adj","Continuing without pause.","The incessant noise wore them down.","constant · ceaseless · relentless"]
  ],
  "15 · Push through": [
["Incipient","adj","In an early stage.","An incipient crisis loomed.","beginning · nascent · emerging"],
["Indigent","adj","Very poor; needy.","The clinic served indigent families.","impoverished · destitute · needy"],
["Ineluctable","adj","Unable to be avoided.","Death is ineluctable.","inevitable · inescapable · certain"],
["Inimical","adj","Harmful; hostile.","Damp air is inimical to old books.","hostile · adverse · injurious"],
["Innocuous","adj","Harmless.","The remark seemed innocuous enough.","harmless · benign · inoffensive"],
["Insidious","adj","Proceeding harmfully in a subtle way.","An insidious rumor spread quietly.","stealthy · subtle · treacherous"],
["Intractable","adj","Hard to control or solve.","An intractable problem stumped them.","stubborn · unmanageable · obstinate"],
["Inveigh","verb","To protest strongly.","He inveighed against the new tax.","rail · protest · fulminate"],
["Irascible","adj","Easily angered.","The irascible chef yelled all shift.","irritable · testy · hot-tempered"],
["Jejune","adj","Naive and simplistic; dull.","The essay's jejune ideas disappointed.","insipid · childish · vapid"],
["Jocular","adj","Fond of joking; humorous.","His jocular tone lightened the room.","jovial · playful · facetious"],
["Juxtapose","verb","To place side by side for contrast.","The show juxtaposed old and new art.","contrast · compare · pair"],
["Laud","verb","To praise highly.","Critics lauded her performance.","praise · extol · acclaim"],
["Levity","noun","Humor or lack of seriousness.","A bit of levity eased the tension.","humor · frivolity · lightness"],
["Loquacity","noun","The quality of talking a great deal.","His loquacity filled every silence.","talkativeness · garrulity · chattiness"]
  ],
  "16 · Almost there": [
["Maladroit","adj","Clumsy or ineffective.","A maladroit reply made things worse.","clumsy · inept · awkward"],
["Malleable","adj","Easily shaped or influenced.","Young minds are highly malleable.","pliable · adaptable · impressionable"],
["Maverick","noun","An independent-minded person.","A maverick, she ignored convention.","nonconformist · individualist · rebel"],
["Mawkish","adj","Excessively sentimental.","The card's mawkish verse made her wince.","sentimental · maudlin · saccharine"],
["Meticulous","adj","Showing great attention to detail.","A meticulous planner, he forgot nothing.","careful · precise · scrupulous"],
["Mollify","verb","To soothe or appease.","Free refunds mollified the crowd.","appease · placate · pacify"],
["Morose","adj","Sullen and gloomy.","He grew morose after the loss.","sullen · glum · sulky"],
["Mundane","adj","Lacking interest; ordinary.","Mundane chores filled the day.","ordinary · banal · humdrum"],
["Nadir","noun","The lowest point.","The defeat marked the team's nadir.","low point · bottom · rock-bottom"],
["Nebulous","adj","Vague or ill-defined.","His plans stayed nebulous.","vague · hazy · unclear"],
["Nonchalant","adj","Casually calm and relaxed.","She gave a nonchalant shrug.","casual · unconcerned · indifferent"],
["Obfuscate","verb","To deliberately make unclear.","The memo obfuscated the real cost.","obscure · confuse · muddle"],
["Obstinate","adj","Stubbornly refusing to change.","An obstinate child, he wouldn't budge.","stubborn · headstrong · intransigent"],
["Officious","adj","Asserting authority in an annoying way.","The officious clerk demanded forms.","meddlesome · interfering · bossy"],
["Opprobrium","noun","Harsh public disgrace.","The scandal brought him opprobrium.","disgrace · scorn · condemnation"]
  ],
  "17 · Home stretch": [
["Ostensible","adj","Apparent but perhaps not real.","His ostensible reason hid the truth.","apparent · supposed · purported"],
["Palliate","verb","To make less severe without curing.","The drug only palliated the pain.","alleviate · ease · mitigate"],
["Panacea","noun","A cure-all.","No single law is a panacea.","cure-all · remedy · elixir"],
["Paradigm","noun","A typical model or pattern.","The discovery shifted the paradigm.","model · pattern · framework"],
["Pedantic","adj","Overly concerned with minor detail or rules.","His pedantic corrections annoyed all.","nitpicking · fussy · hairsplitting"],
["Penchant","noun","A strong liking.","She has a penchant for old films.","liking · fondness · inclination"],
["Perfunctory","adj","Done with minimal effort.","A perfunctory nod was all he gave.","cursory · token · halfhearted"],
["Pervasive","adj","Spreading widely throughout.","A pervasive smell of paint hung about.","widespread · prevalent · ubiquitous"],
["Petulant","adj","Childishly sulky or bad-tempered.","A petulant sigh met every request.","peevish · sulky · sullen"],
["Pithy","adj","Brief and full of meaning.","Her pithy advice stuck with him.","concise · terse · succinct"],
["Placid","adj","Calm and peaceful.","The placid lake mirrored the sky.","calm · serene · tranquil"],
["Plausible","adj","Seeming reasonable or probable.","A plausible excuse, but untrue.","credible · believable · convincing"],
["Polemic","noun","A strong verbal or written attack.","Her polemic against the policy went viral.","critique · diatribe · invective"],
["Ponderous","adj","Slow and clumsy; dull.","The ponderous lecture dragged on.","laborious · heavy · plodding"],
["Precipitate","verb","To cause to happen suddenly.","The news precipitated a sell-off.","trigger · provoke · hasten"]
  ],
  "18 · Final push": [
["Predilection","noun","A preference or special liking.","A predilection for spicy food.","preference · penchant · fondness"],
["Presumptuous","adj","Overstepping bounds; too bold.","It was presumptuous to assume yes.","overconfident · forward · arrogant"],
["Pristine","adj","In original, unspoiled condition.","The beach was pristine at dawn.","immaculate · pure · untouched"],
["Probity","noun","Strong moral integrity.","His probity made him a trusted judge.","integrity · honesty · uprightness"],
["Proclivity","noun","A tendency toward something.","A proclivity for risk-taking.","tendency · inclination · predisposition"],
["Profuse","adj","Plentiful; abundant.","Profuse apologies followed the mistake.","abundant · lavish · copious"],
["Proliferate","verb","To increase rapidly in number.","Knockoff brands proliferated online.","multiply · burgeon · mushroom"],
["Propriety","noun","Conformity to accepted standards.","She questioned the propriety of the gift.","decorum · etiquette · correctness"],
["Prosaic","adj","Commonplace; unimaginative.","A prosaic solution, but it worked.","dull · mundane · pedestrian"],
["Pungent","adj","Sharp in taste or smell; biting.","A pungent aroma filled the kitchen.","sharp · acrid · piquant"],
["Quell","verb","To put an end to; to suppress.","Troops quelled the unrest.","suppress · subdue · stifle"],
["Querulous","adj","Complaining in a whining way.","A querulous tone soured the meeting.","peevish · grumbling · fretful"],
["Quiescent","adj","In a state of inactivity.","The disease stayed quiescent for years.","dormant · inactive · latent"],
["Rarefied","adj","Of a select, exclusive group.","The rarefied world of fine art.","exclusive · elevated · select"],
["Rebuke","verb","To express sharp disapproval.","The judge rebuked the lawyer.","reprimand · scold · admonish"]
  ],
  "19 · Last words": [
["Recondite","adj","Little known; abstruse.","A recondite branch of mathematics.","obscure · esoteric · arcane"],
["Redolent","adj","Strongly reminiscent or smelling of.","Air redolent of pine and rain.","evocative · fragrant · suggestive"],
["Refractory","adj","Stubborn; resistant to control.","A refractory patient ignored advice.","unmanageable · obstinate · defiant"],
["Relegate","verb","To assign to a lower position.","He was relegated to a minor role.","downgrade · demote · consign"],
["Repudiate","verb","To reject or disown.","She repudiated the earlier claim.","disown · renounce · reject"],
["Rescind","verb","To revoke or cancel.","The board rescinded the offer.","revoke · annul · cancel"],
["Sanction","noun","Official approval — or a penalty (contronym).","The plan received official sanction.","approval · authorization · penalty"],
["Scrupulous","adj","Diligent and thorough; principled.","Scrupulous records left no doubt.","meticulous · conscientious · careful"],
["Sedulous","adj","Showing dedication and diligence.","Sedulous practice paid off.","diligent · assiduous · industrious"],
["Soporific","adj","Tending to induce sleep.","The droning talk was soporific.","sleep-inducing · drowsy · sedative"],
["Spurn","verb","To reject with contempt.","She spurned every compromise.","reject · rebuff · scorn"],
["Strident","adj","Loud and harsh.","Strident demands drowned the debate.","harsh · grating · shrill"],
["Sublime","adj","Of great beauty or excellence.","A sublime view from the ridge.","majestic · glorious · transcendent"],
["Surfeit","noun","An excessive amount.","A surfeit of choices paralyzed him.","excess · glut · overabundance"],
["Trenchant","adj","Vigorous and incisive in expression.","A trenchant critique of the bill.","incisive · cutting · penetrating"]
  ]
};

// Extra quiz questions appended to existing categories
const QUIZZES_EXTRA = {
  "Text Completion": [
{meta:"1-blank",q:"The scientist's ___ refusal to publish until every result was verified frustrated her eager collaborators.",opts:["cavalier","scrupulous","reckless","hasty"],correct:1,exp:"<b>Scrupulous</b> = diligent and principled, fitting 'verified every result.' The others imply carelessness."},
{meta:"2-blank",q:"Once ___ in the press, the author later enjoyed a ___ as critics rediscovered her work.",opts:["lauded … decline","vilified … renaissance","praised … collapse","ignored … obscurity"],correct:1,exp:"'Once X, later Y' as critics rediscover signals reversal: first <b>vilified</b>, then a <b>renaissance</b> (revival)."},
{meta:"1-blank",q:"His arguments were so ___ that opponents struggled to find a single weak point.",opts:["specious","cogent","fatuous","nebulous"],correct:1,exp:"<b>Cogent</b> = logically forceful, fitting 'no weak point.' Specious means false-but-plausible; the rest are weak."},
{meta:"1-blank",q:"The committee's ___ pace meant the simple proposal took months to approve.",opts:["expeditious","dilatory","brisk","efficient"],correct:1,exp:"'Took months' for something simple → a <b>dilatory</b> (delaying, slow) pace."}
  ],
  "Sentence Equiv.": [
{meta:"closest to 'scold'",q:"The editor was quick to ___ any reporter who missed a deadline.",opts:["commend","rebuke","reward","ignore"],correct:1,exp:"<b>Rebuke</b> = sharply criticize, fitting a missed deadline."},
{meta:"closest to 'abundant'",q:"The garden produced a ___ harvest that year.",opts:["meager","copious","scant","modest"],correct:1,exp:"<b>Copious</b> = abundant. The others mean small."},
{meta:"closest to 'unclear'",q:"His ___ instructions left the team guessing.",opts:["lucid","nebulous","precise","explicit"],correct:1,exp:"<b>Nebulous</b> = vague. The others mean clear."},
{meta:"closest to 'praise'",q:"Reviewers were quick to ___ the restaurant's bold menu.",opts:["pan","laud","dismiss","mock"],correct:1,exp:"<b>Laud</b> = praise highly."}
  ],
  "Reading & Logic": [
{meta:"Flaw",q:"'Most successful CEOs wake at 5 a.m., so waking early will make you a successful CEO.' This reasoning:",opts:["is airtight","confuses correlation with causation","uses too small a sample","relies on expert testimony"],correct:1,exp:"It assumes a shared habit causes success — a classic <b>correlation-causation</b> error."},
{meta:"Parallel",q:"'No reptiles are warm-blooded. All snakes are reptiles. Therefore no snakes are warm-blooded.' This argument is:",opts:["valid","invalid","circular","based on opinion"],correct:0,exp:"The conclusion follows necessarily from the premises — it is logically <b>valid</b>."},
{meta:"Inference",q:"'Ticket sales doubled after the venue cut prices, though attendance at rival venues also rose.' We can most safely conclude:",opts:["the price cut alone caused the rise","a broader trend may also be at work","rivals copied the venue","prices will keep falling"],correct:1,exp:"Since rivals rose too, a <b>broader trend</b> may contribute — we can't credit the price cut alone."}
  ],
  "Arithmetic": [
{meta:"Percent",q:"40 is what percent of 160?",opts:["20%","25%","40%","30%"],correct:1,exp:"40/160 = 1/4 = <b>25%</b>."},
{meta:"Ratios",q:"A map scale is 1 cm : 5 km. Two towns are 7 cm apart on the map. Real distance?",opts:["12 km","35 km","25 km","57 km"],correct:1,exp:"7 × 5 = <b>35 km</b>."},
{meta:"Mixture",q:"How many liters of pure water must be added to 10 L of 50% saline to make it 25% saline?",opts:["5 L","10 L","20 L","15 L"],correct:1,exp:"Salt = 5 L stays fixed. Need 5 = 25% of total → total = 20 L → add <b>10 L</b>."},
{meta:"Sequences",q:"What is the next term: 3, 6, 12, 24, ...?",opts:["36","48","30","60"],correct:1,exp:"Each term doubles: 24 × 2 = <b>48</b>."}
  ],
  "Algebra": [
{meta:"Word problem",q:"A number tripled, then increased by 4, equals 25. The number is:",opts:["7","9","21","3"],correct:0,exp:"3n + 4 = 25 → 3n = 21 → n = <b>7</b>."},
{meta:"Exponents",q:"If 2ˣ = 32, then x =",opts:["4","5","6","16"],correct:1,exp:"2⁵ = 32, so x = <b>5</b>."},
{meta:"Absolute value",q:"How many solutions does |x − 3| = 5 have?",opts:["0","1","2","infinite"],correct:2,exp:"x − 3 = 5 or x − 3 = −5 → x = 8 or −2 → <b>2</b> solutions."}
  ],
  "Geometry": [
{meta:"Volume",q:"A cube has edge length 4. Its volume is:",opts:["16","48","64","12"],correct:2,exp:"Volume = s³ = 4³ = <b>64</b>."},
{meta:"Perimeter",q:"An equilateral triangle has perimeter 18. Each side is:",opts:["6","9","3","4.5"],correct:0,exp:"18 ÷ 3 = <b>6</b>."},
{meta:"Circles",q:"A circle has circumference 10π. Its radius is:",opts:["5","10","20","2.5"],correct:0,exp:"C = 2πr → 10π = 2πr → r = <b>5</b>."}
  ],
  "Data & Stats": [
{meta:"Probability",q:"Two fair coins are flipped. P(both heads) =",opts:["1/2","1/3","1/4","2/3"],correct:2,exp:"½ × ½ = <b>1/4</b> (AND multiplies)."},
{meta:"Mode",q:"Set: 2, 4, 4, 4, 7, 9. The mode is:",opts:["4","5","7","2"],correct:0,exp:"The most frequent value is <b>4</b> (appears 3×)."},
{meta:"Range",q:"Set: 12, 5, 8, 20, 3. The range is:",opts:["15","17","20","8"],correct:1,exp:"Range = max − min = 20 − 3 = <b>17</b>."}
  ]
};

// Essay templates and tips for the AWA walkthrough
const ESSAY = {
  intro: "The GRE Analytical Writing section is one 30-minute task: <b>Analyze an Issue</b>. You're given a claim and asked to argue your position with reasons and examples. You don't need to be 'right' — you're scored on clarity, structure, and the strength of your reasoning.",
  template: [
    ["Paragraph 1 — Intro (4–5 min)","Restate the issue in your own words, take a clear position, and preview your two or three reasons. End with a one-sentence thesis.","Template: \"While some argue X, a closer look reveals Y. This essay contends that ___, for three reasons: A, B, and C.\""],
    ["Paragraph 2 — Strongest reason (6–7 min)","Lead with your best point. State it, explain why it's true, then give one concrete example (history, science, current events, or a realistic hypothetical).","Template: \"Most compellingly, ___. For instance, ___. This demonstrates that ___.\""],
    ["Paragraph 3 — Second reason (6–7 min)","A different angle, not a repeat. New example. Connect it back to your thesis.","Template: \"Furthermore, ___. Consider ___. Here too, the evidence supports ___.\""],
    ["Paragraph 4 — Counterargument + rebuttal (5–6 min)","Concede a reasonable opposing point, then show why your position still holds. This is what separates a 5 from a 4.","Template: \"Critics might object that ___. Yet this overlooks ___, which ultimately reinforces ___.\""],
    ["Paragraph 5 — Conclusion (3–4 min)","Restate your thesis in fresh words and end with the broader significance. No new arguments.","Template: \"In sum, though ___ has merit, ___. Ultimately, ___.\""]
  ],
  scoring: [
    "<b>6 — Outstanding:</b> insightful, well-supported, fluent, varied sentences.",
    "<b>5 — Strong:</b> clear position, logical, good examples, minor errors only.",
    "<b>4 — Adequate:</b> competent but generic; this is the median target — aim for 4.5+.",
    "<b>3 and below:</b> limited development, unclear logic, or frequent errors."
  ],
  tips: [
    "Spend the first 3–4 minutes outlining before writing — it shows in structure.",
    "Specific examples beat vague ones. 'The 2008 financial crisis' &gt; 'a bad economy.'",
    "Vary sentence length. Use transition words: moreover, however, consequently, admittedly.",
    "Leave 2 minutes to proofread for typos and missing words.",
    "Length helps to a point: aim for ~450–600 words across 4–5 paragraphs.",
    "Memorize the 5-paragraph skeleton so you spend brainpower on content, not structure."
  ],
  prompts: [
    "Governments should focus spending on the arts as much as on infrastructure.",
    "The best ideas arise from a process of collaboration rather than solitary work.",
    "Technology has made people less capable of thinking for themselves.",
    "A society's success should be measured by the well-being of its least fortunate.",
    "Universities should require every student to take courses outside their major."
  ]
};

Object.assign(DECKS, DECKS_EXTRA);
Object.keys(QUIZZES_EXTRA).forEach(k=>{ QUIZZES[k] = (QUIZZES[k]||[]).concat(QUIZZES_EXTRA[k]); });

const PLAN = [
[1,"Diagnostic + setup","Take a free PowerPrep full test (or 1 Quant + 1 Verbal section). Note your baseline & weak areas.","90 min weekend slot"],
[1,"Vocab launch + arithmetic","15 flashcards (Set 1). Review fractions, decimals, percents, ratios. 6 quant Qs.","60 min"],
[1,"Text completion basics","15 flashcards. Learn the 1-blank strategy: predict before reading options. 7 verbal Qs.","55 min"],
[1,"Number properties","15 flashcards (Set 2). Factors, multiples, primes, odd/even rules. 6 quant Qs.","55 min"],
[1,"Sentence equivalence","15 flashcards. Find two synonyms yielding the same meaning. 7 verbal Qs.","55 min"],
[1,"Algebra I","15 flashcards (Set 3). Linear equations, inequalities, plug-in method. 7 quant Qs.","60 min"],
[1,"Catch-up + review week 1","Re-test your weakest topic. Redo missed flashcards. Light day.","45 min"],
[2,"Reading comprehension","15 flashcards. Main idea, tone, inference. Reading & Logic quiz set.","60 min"],
[2,"Algebra II + exponents","15 flashcards (Set 4). Exponents, roots, quadratics. 7 quant Qs.","60 min"],
[2,"2-blank text completion","15 flashcards. Tackle harder multi-blank logic. 7 verbal Qs.","55 min"],
[2,"Ratios, proportions, rates","15 flashcards. Speed/distance, work problems. 6 quant Qs.","60 min"],
[2,"Critical reasoning","15 flashcards. Argument structure, assumptions, weaken/strengthen.","55 min"],
[2,"Geometry I","15 flashcards (Set 5). Lines, angles, triangles, special triangles. 6 quant Qs.","60 min"],
[2,"Half practice test","Timed: 1 Verbal + 1 Quant section. Review every error.","75 min weekend slot"],
[3,"Geometry II","15 flashcards. Circles, coordinate geometry, area & volume. 6 quant Qs.","60 min"],
[3,"Vocab in context","15 flashcards (Set 6). Practice hard SE sets. 7 verbal Qs.","55 min"],
[3,"Data interpretation","15 flashcards. Graphs, tables, reading data fast. Data & Stats quiz set.","60 min"],
[3,"AWA: Issue essay","Learn the 4-paragraph template. Write 1 timed essay (30 min).","55 min"],
[3,"Statistics & probability","15 flashcards (Set 7). Mean/median/mode, SD, probability. 6 quant Qs.","60 min"],
[3,"Reading speed drills","15 flashcards. 3 passages, focus on pacing.","60 min"],
[3,"Quantitative comparison","15 flashcards. The QC strategy: compare, don't compute.","65 min weekend slot"],
[4,"Mixed verbal set","15 flashcards (Set 8). All verbal quiz categories, timed.","60 min"],
[4,"Mixed quant set","15 flashcards. All quant quiz categories, timed.","60 min"],
[4,"Second AWA essay","Write 1 more timed Issue essay. Self-score with the rubric.","45 min"],
[4,"Weak-area blitz","Target your 2 worst topics from diagnostics. Drill 15 Qs.","60 min"],
[4,"Full practice test","PowerPrep test 2, full & timed. The dress rehearsal.","2 hr weekend slot"],
[4,"Review the mock","Go through every mistake. Re-flash weak words (Set 9). No new material.","55 min"],
[4,"Light review + logistics","Skim cheat-sheets. Confirm test center/online setup, ID, timing.","40 min"],
[4,"Rest day","Light vocab only. Sleep early. You're ready.","20 min"],
[4,"TEST DAY","Hydrate, breakfast, arrive early. Trust the prep. Good luck! 🎯","—"]
];

const RESOURCES = [
["E","ETS PowerPrep & free test","free","Official practice tests in the real test interface. Start here.","https://www.ets.org/gre/test-takers/general-test/prepare.html"],
["g","ETS Official Guide","paid","The definitive book — real retired questions. Worth buying.","https://www.ets.org/gre/test-takers/general-test/prepare/official-guide.html"],
["M","Magoosh GRE","paid","Video lessons, huge question bank, vocab app. Great value.","https://gre.magoosh.com/"],
["r","Manhattan Prep 5 lb Book","paid","1,800+ practice problems. Best for sheer drilling volume.","https://www.manhattanprep.com/gre/"],
["m","Khan Academy (Math)","free","Free quant refreshers for any weak topic. ETS-endorsed for quant.","https://www.khanacademy.org/math"],
["E","GregMat+","paid","Affordable, highly-rated structured plans and live sessions.","https://www.gregmat.com/"],
["g","Quizlet GRE decks","free","Thousands of shared vocab flashcard sets for extra reps.","https://quizlet.com/subject/gre/"],
["r","GRE strategy videos","free","Free strategy walkthroughs for verbal and quant question types.","https://www.youtube.com/results?search_query=gre+prep+strategy"]
];

