import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, BookOpen, DollarSign, Award, Target, ChevronRight, ExternalLink } from "lucide-react";

const SCENARIOS = [
  {
    id:"conservative",label:"CONSERVATIVE",gate:"Gate 1 Complete",color:"blue",borderColor:"border-blue/40",bgColor:"bg-blue/5",
    condition:"Artifacts resolved. No external validation. Agent submission with current LSTE 82.2.",
    metrics:[
      {label:"Agent Requests",value:"3-5",unit:"of 15 queried"},{label:"Advance (small press)",value:"$8K-$25K",unit:"on offer"},
      {label:"Advance (mid press)",value:"$25K-$75K",unit:"on offer"},{label:"First-Year Sales",value:"2K-6K",unit:"copies"},
      {label:"Award Consideration",value:"Regional",unit:"circuit only"},{label:"Adaptation Interest",value:"Low",unit:"no external proof"},
    ],
    note:"Viable path. Leaves ~$200K+ on the table vs Base Case.",
  },
  {
    id:"base",label:"BASE CASE",gate:"All Sprints + Gate 2",color:"gold",borderColor:"border-gold/40",bgColor:"bg-gold/5",highlighted:true,
    condition:"All 5 sprints complete. Gate 2 corpus assembled. CL-MoE gap partially closed. Award-circuit submission 2027.",
    metrics:[
      {label:"Agent Requests",value:"8-12",unit:"of 20 queried"},{label:"Advance (Big Five)",value:"$75K-$250K",unit:"on offer"},
      {label:"Advance (lit press)",value:"$40K-$100K",unit:"on offer"},{label:"First-Year Sales",value:"8K-25K",unit:"copies"},
      {label:"Award Nominations",value:"2-4",unit:"national circuits"},{label:"Adaptation Option",value:"$50K-$150K",unit:"film/TV option"},
    ],
    note:"Target outcome. Omega mean >= 106.50 post-fix. CL-MoE clean.",
  },
  {
    id:"optimistic",label:"OPTIMISTIC",gate:"Full 3-Gate Program",color:"teal",borderColor:"border-teal/40",bgColor:"bg-teal/5",
    condition:"External cohort validation. Pulitzer/NBA submission. Adaptation rights optioned.",
    metrics:[
      {label:"Agent Requests",value:"15+",unit:"competitive auction"},{label:"Advance (Big Five)",value:"$250K-$750K",unit:"auction scenario"},
      {label:"First-Year Sales",value:"25K-80K",unit:"copies"},{label:"Award Nominations",value:"Pulitzer/NBA",unit:"primary circuits"},
      {label:"Adaptation Deal",value:"$150K-$500K+",unit:"optioned rights"},{label:"Academic Adoption",value:"15-40",unit:"courses Year 1"},
    ],
    note:"Achievable with full execution. LitCentral as differentiator for submission packages.",
  },
];

const MILESTONE_TRAJECTORY = [
  {milestone:"Sprint 1: 5 artifacts deleted",month:"Month 1",omega:"Omega 105.80",lste:"5 to 0 critical errors",trigger:"$0 direct; clears submission path"},
  {milestone:"Sprint 2: Structural repairs complete",month:"Month 2",omega:"Omega 105.90",lste:"Continuity clean",trigger:"$0 direct; agent queries begin"},
  {milestone:"Sprint 3: Ch.36 + Ch.42 expanded",month:"Month 3",omega:"Omega 106.20",lste:"GOLD+ 16 to 18",trigger:"$0 direct; manuscript locks"},
  {milestone:"Sprint 4: LSTE pass complete",month:"Month 4-5",omega:"Omega 106.50",lste:"OMEGA ELITE 3 to 5",trigger:"First agent offer possible"},
  {milestone:"Gate 2: External corpus ingested",month:"Month 6",omega:"Validated",lste:"External comp data live",trigger:"Advance negotiation begins"},
  {milestone:"Gate 3: Cohort validation complete",month:"Month 8-10",omega:"vs comp set",lste:"Criterion validity proven",trigger:"Advance + option trigger"},
  {milestone:"Publication Day",month:"Month 18-24",omega:"FINAL",lste:"Reader-validated",trigger:"Royalty + adaptation income"},
];

const ANALYTICS_AUDIT = [
  {publisher:"Trilogy AI (Jan 2026)",capability:"Basic sentiment analysis, genre matching, market comps.",litcentralEq:"0% - no behavioral vectors, no SII/MRF, no Omega scoring",verdict:"FAR BELOW",verdictColor:"text-red"},
  {publisher:"Penguin Random House",capability:"Reader behavior, sales curve analysis, social listening.",litcentralEq:"0% - operational analytics only. No predictive quality model.",verdict:"BELOW",verdictColor:"text-orange"},
  {publisher:"Simon & Schuster",capability:"Standard comps + editorial judgment + marketing data.",litcentralEq:"0% - editorial intuition model, not quantified.",verdict:"BELOW",verdictColor:"text-orange"},
  {publisher:"HarperCollins",capability:"BookScan integration + social listening.",litcentralEq:"0% - sales-first model, not quality-first.",verdict:"BELOW",verdictColor:"text-orange"},
  {publisher:"Algonquin Books",capability:"Literary fiction specialist. Editorial taste + market potential.",litcentralEq:"0% - editorial taste, no quantified architecture.",verdict:"ALIGNED FIT",verdictColor:"text-gold"},
  {publisher:"Restless Books",capability:"Diaspora lit specialist. Editorial cultural alignment process.",litcentralEq:"50% cultural fit - no quantified behavioral vectors.",verdict:"STRONG FIT",verdictColor:"text-teal"},
  {publisher:"Arte Publico Press",capability:"Largest Chicano/Latino lit publisher. Scholarly + community model.",litcentralEq:"Highest alignment - CLS/SII directly address their criteria.",verdict:"BEST FIT",verdictColor:"text-gold"},
];

const TARGET_PUBLISHERS = [
  {tier:"TIER 1 - BIG FIVE LITERARY",color:"gold",publishers:["Farrar Straus & Giroux (FSG)","W.W. Norton & Company","Penguin Press","Random House (Vintage imprint)","Simon & Schuster (Scribner imprint)"],note:"Query with full LitCentral data package. Omega mean + LSTE + comp set = differentiated submission."},
  {tier:"TIER 2 - INDEPENDENT LITERARY",color:"blue",publishers:["Algonquin Books","Graywolf Press","Restless Books","Akashic Books","Soho Press"],note:"High editorial alignment. More receptive to debut literary fiction with cultural specificity."},
  {tier:"TIER 3 - CULTURAL SPECIALISTS",color:"purple",publishers:["Arte Publico Press","Bilingual Press / Editorial Bilingue","University of Arizona Press","University of New Mexico Press"],note:"Highest cultural alignment. Potential co-publishing or series consideration."},
];

const GRANTS = [
  {tier:"TIER 1",color:"gold",name:"NEH Fellowship",amount:"$60,000",eligibility:"US citizen/resident, doctoral candidates",alignment:"DIRECT FIT",deadline:"2026 - NEH.gov",action:"Submit as doctoral candidate. Frame as American History of Erasure. Pair with Prof. Romley endorsement."},
  {tier:"TIER 1",color:"gold",name:"MacArthur Fellowship",amount:"$800,000",eligibility:"Nomination only - cannot apply directly",alignment:"HIGH LONG-TERM",deadline:"Rolling - September annually",action:"3-5 year cultivation: Publish then awards then academic citations then MacArthur nominator contact."},
  {tier:"TIER 1",color:"gold",name:"$50M Literary Arts Fund",amount:"Fund TBD",eligibility:"Writers, small presses, nonprofits",alignment:"STRONG FIT",deadline:"Oct 2025 launch - Mellon",action:"Apply through AUMER Foundation. Frame: literary arts + cultural preservation + Chicano/Yaqui heritage."},
  {tier:"TIER 2",color:"blue",name:"Lannan Foundation",amount:"$200,000",eligibility:"Invitation / nomination",alignment:"STRONG FIT",deadline:"No open call",action:"Build path through award nominations and literary press publication. 2027 target."},
  {tier:"TIER 2",color:"blue",name:"PEN/Faulkner Award",amount:"$15,000",eligibility:"Published US fiction - must publish first",alignment:"DIRECT FIT",deadline:"Annual post-publication",action:"Submit in publication year. War literature + cultural specificity = strong committee alignment."},
  {tier:"TIER 2",color:"blue",name:"PEN Open Book Award",amount:"$5,000",eligibility:"Exceptional debut from underrepresented writer",alignment:"DIRECT FIT",deadline:"Annual",action:"Submit post-publication. Chicano/Yaqui author + erased soldiers = exact criteria."},
  {tier:"TIER 2",color:"blue",name:"American Book Award",amount:"National recognition",eligibility:"Any US multicultural work",alignment:"HIGH FIT",deadline:"Annual post-publication",action:"Submit post-publication. NERO framework aligns with Before Columbus criteria."},
  {tier:"TIER 3",color:"purple",name:"Whiting Award",amount:"$50,000",eligibility:"Early-career US writers - nomination only",alignment:"STRONG FIT",deadline:"Nomination - 2028 target",action:"Cultivation play: 2028 target after publication and initial reviews."},
  {tier:"TIER 3",color:"purple",name:"NEA Literature Fellowship",amount:"$25,000",eligibility:"US writer - prose or poetry",alignment:"DIRECT FIT",deadline:"Annual - NEA.gov",action:"Submit in first year post-publication. Strongest with publication + early press."},
  {tier:"TIER 3",color:"purple",name:"California Arts Council",amount:"$10,000",eligibility:"California resident artist",alignment:"HIGH FIT",deadline:"Annual - apply now",action:"Apply immediately as CA resident. Fastest available cash funding for manuscript completion work."},
];

const REVENUE_MODEL = [
  {stream:"Advance - Base Case",low:"$75,000",mid:"$150,000",high:"$250,000",timing:"On signing + delivery",color:"gold"},
  {stream:"First-Year Royalties",low:"$8,000",mid:"$20,000",high:"$50,000",timing:"6-12 mos post-pub",color:"gold"},
  {stream:"Adaptation Option",low:"$50,000",mid:"$150,000",high:"$500,000",timing:"18-36 mos post-pub",color:"teal"},
  {stream:"Foreign Rights",low:"$15,000",mid:"$45,000",high:"$120,000",timing:"18-24 mos",color:"teal"},
  {stream:"Audio Rights",low:"$10,000",mid:"$25,000",high:"$75,000",timing:"12-18 mos",color:"blue"},
  {stream:"NEH / NEA Fellowships",low:"$25,000",mid:"$60,000",high:"$85,000",timing:"Grant cycle dependent",color:"purple"},
  {stream:"Award Cash (if nominated)",low:"$5,000",mid:"$15,000",high:"$50,000",timing:"Post-publication",color:"purple"},
  {stream:"Academic Adoption Royalties",low:"$3,000",mid:"$12,000",high:"$35,000",timing:"Yrs 2-5",color:"blue"},
  {stream:"LitCentral Platform (SaaS)",low:"$0",mid:"$50,000",high:"$500,000+",timing:"Post-validation",color:"orange"},
];

// %% SELF-PUB DATA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const UNIT_ECONOMICS = [
  {format:"Ebook (KDP)",retail:"$9.99",selfRoyalty:"70%",selfNet:"$6.99",tradRoyalty:"25% net",tradNet:"$1.50",advantage:"SELF-PUB 4.7x"},
  {format:"Print (KDP/IngramSpark)",retail:"$24.99",selfRoyalty:"40-60%",selfNet:"$6.50-$10",tradRoyalty:"8-10% list",tradNet:"$2.00-$2.50",advantage:"SELF-PUB 3-4x"},
  {format:"Audiobook (ACX/Findaway)",retail:"$24.99",selfRoyalty:"25-40%",selfNet:"$6.25",tradRoyalty:"10-25% net",tradNet:"$2.00-$3.50",advantage:"SELF-PUB 2-3x"},
  {format:"Hardcover (Special Ed.)",retail:"$34.99",selfRoyalty:"45%",selfNet:"$10-$12",tradRoyalty:"10% list",tradNet:"$3.50",advantage:"SELF-PUB 3x"},
];

const SELFPUB_ASSETS = [
  {n:1,asset:"Strategic Communication Plan",detail:"GCD-triggered, 18-month, 5-phase — fully built, launch-ready. No publisher provides this.",color:"gold"},
  {n:2,asset:"TruthEngine360 Platform",detail:"Built-in discovery engine: every DCAS forensic visitor is a potential book reader. Platform drives book; book drives platform.",color:"blue"},
  {n:3,asset:"AUMER Foundation (albavoice.org)",detail:"Nonprofit publisher entity. Can apply for grants that individual authors cannot. Institutional credibility.",color:"teal"},
  {n:4,asset:"USC Doctoral Candidate Status",detail:"Academic network for course adoption (Berkeley 91, UT Austin 90 in LSTE). Direct educator relationships.",color:"purple"},
  {n:5,asset:"Influencer Roster - 8 Identified",detail:"Viet T. Nguyen (112K, Fit 73), Sandra Cisneros (143K, Fit 70), Latino Vets Coalition (31.2K, Fit 80).",color:"orange"},
  {n:6,asset:"Communication Management Background",detail:"Earned media, PR, audience segmentation. The skills publishers hire agencies for.",color:"gold"},
  {n:7,asset:"DCAS Forensic Research",detail:"Earned media machine. 349 vs. 2,300+ is a story every major outlet covers without a single paid placement.",color:"red"},
  {n:8,asset:"Missing Equation Educational Tour",detail:"Direct community pipeline. Tour attendees are readers, advocates, adopters.",color:"teal"},
];

const SELFPUB_SCENARIOS = [
  {id:"d1",label:"D1 - LEAN",color:"blue",assumption:"Ebook + print only. Minimal StrComm Plan execution. No tour, no influencer budget.",yr1:"$11K-$35K",yr2:"$18K-$60K",yr35:"$45K-$150K",total:"$74K-$245K",upfront:"$15K-$30K production"},
  {id:"d2",label:"D2 - BASE CASE",color:"gold",highlighted:true,assumption:"Full format stack. StrComm Plan Phases 1-3 executing. AUMER grants secured. Influencer activations.",yr1:"$45K-$120K",yr2:"$80K-$200K",yr35:"$270K-$780K",total:"$395K-$1.1M",upfront:"$50K-$80K production + marketing"},
  {id:"d3",label:"D3 - OPTIMISTIC",color:"teal",assumption:"Full StrComm Plan. Adaptation option. Award nominations. Academic adoption 15-40 courses. DCAS media wave.",yr1:"$120K-$350K",yr2:"$300K-$900K",yr35:"$2.1M-$7.7M",total:"$2.5M-$9M+",upfront:"$80K-$120K production + full campaign"},
];

const TRAD_VS_SELF = [
  {dim:"Upfront Cash",trad:"$75K-$300K advance",self:"$0 advance - invest in production + marketing",winner:"TRADITIONAL (Y0)",winColor:"text-blue",why:"Publisher funds launch. Self-pub requires StrComm budget ($170K lean). If cash-constrained, advance solves this."},
  {dim:"Year 1 Revenue",trad:"Advance only (already paid)",self:"$11K-$211K depending on scenario",winner:"SELF-PUB (Y1+)",winColor:"text-gold",why:"Once advance is earned back, self-pub generates 3-7x per unit. But earning-back takes 2-3 years."},
  {dim:"5-Year (Base)",trad:"$335K-$855K",self:"$395K-$1.1M (Base Case)",winner:"SELF-PUB (slight)",winColor:"text-gold",why:"Self-pub Base Case slightly exceeds traditional over 5 years, primarily from higher ebook/audio royalties and grants."},
  {dim:"5-Year (Optimistic)",trad:"$1.3M-$4.5M",self:"$2.5M-$9M+",winner:"SELF-PUB",winColor:"text-teal",why:"Full adaptation rights retained (no publisher split) + 4.7x ebook royalty = massive upside."},
  {dim:"Rights Ownership",trad:"Publisher owns primary rights",self:"Gabriel owns ALL rights - forever",winner:"SELF-PUB",winColor:"text-teal",why:"Adaptation, foreign, audio, digital - all retained. No reversion needed."},
  {dim:"Speed to Market",trad:"18-36 months post-deal",self:"6-12 months after manuscript lock",winner:"SELF-PUB",winColor:"text-gold",why:"Traditional editorial/production cycles are slow. Self-pub can launch on GCD timeline."},
  {dim:"Award Eligibility",trad:"Full eligibility",self:"Eligible for most (PEN, NBA, Pulitzer)",winner:"TIE",winColor:"text-muted-foreground",why:"Pulitzer accepts self-published work. NBA accepts. Some boutique awards require Big Five imprint."},
  {dim:"Academic Adoption",trad:"Publisher reps + catalog",self:"Direct USC/educator relationships",winner:"ADVANTAGE TRAD",winColor:"text-blue",why:"Publisher academic reps reach courses more efficiently. But LSTE 91/90 at Berkeley/UT = strong direct pitch."},
  {dim:"Credibility Signal",trad:"Big Five imprint = instant signal",self:"AUMER + LitCentral data package",winner:"TRADITIONAL",winColor:"text-blue",why:"Imprint credibility matters for prize committees. Offset by LitCentral differentiator."},
  {dim:"LitCentral Platform",trad:"Publisher owns usage rights",self:"Full platform rights retained",winner:"SELF-PUB",winColor:"text-teal",why:"LitCentral SaaS value ($50K-$200K/license) belongs entirely to Gabriel. No publisher takes a cut."},
];

const STRCOMM_PHASES = [
  {phase:"1 - FOUNDATION",window:"GCD to GCD+90",criteria:"Personas validated, positioning locked, legal/ethics live, CRM instrumented",selfPub:"$7.5K-$15K (grants)",trad:"$0 (advance not signed)",events:"AUMER grants (Mellon USLDH $7.5K) + Brand equity research + Platform setup"},
  {phase:"2 - SEEDING",window:"GCD+91 to GCD+210",criteria:"Content cadence running, influencer roster onboarded, press kit released, Partner MOUs signed",selfPub:"$5K-$25K pre-orders",trad:"Publisher PR machine begins",events:"Pre-order/pledge drive + Viet T. Nguyen (112K) + Sandra Cisneros (143K) + DCAS media coverage begins"},
  {phase:"3 - AMPLIFICATION",window:"GCD+211 to GCD+360",criteria:"Launch executed, DCAS forensic coverage live, Missing Equation Tour begins",selfPub:"$50K-$180K launch",trad:"$25K-$75K advance + PR",events:"Book launch + Educational tour + DCAS 349 vs 2300+ story breaks nationally + Academic course adoptions"},
  {phase:"4 - SUSTAIN",window:"GCD+361 to GCD+450",criteria:"Adaptation pitch complete, award submissions filed",selfPub:"$30K-$100K sustain",trad:"Royalties begin",events:"Adaptation scout outreach + PEN/Faulkner + NBA submissions + Foreign rights pitches"},
  {phase:"5 - EXPANSION",window:"GCD+451 to GCD+540",criteria:"International rights, academic catalog, LitCentral licensing conversations begin",selfPub:"$50K-$200K expansion",trad:"$40K-$120K royalties Yr 2",events:"Foreign rights deals + LitCentral pilot licensing + Academic catalog expansion + Award results"},
];

const ALL_SCENARIOS_MASTER = [
  {scenario:"A - CONSERVATIVE",type:"Traditional",advance:"$25K-$50K",yr1:"$5K-$12K",yr2:"$15K-$30K",yr35:"$35K-$125K",total:"$80K-$217K",dep:"Agent + publisher deal; long timeline; 247K word risk",color:"blue"},
  {scenario:"B - BASE CASE",type:"Traditional",advance:"$75K-$150K",yr1:"$15K-$35K",yr2:"$40K-$80K",yr35:"$130K-$355K",total:"$260K-$620K",dep:"Sprints 1-4 complete; CL-MoE crossover; award submissions",color:"gold"},
  {scenario:"C - OPTIMISTIC",type:"Traditional",advance:"$150K-$300K",yr1:"$40K-$100K",yr2:"$100K-$250K",yr35:"$500K-$2.5M+",total:"$790K-$3.15M+",dep:"Pulitzer/NBA; adaptation produced; full Gate 3 validation",color:"gold"},
  {scenario:"D1 - LEAN",type:"Self-Pub",advance:"$0",yr1:"$11K-$35K",yr2:"$18K-$60K",yr35:"$45K-$150K",total:"$74K-$245K",dep:"Ebook + print only. Minimal StrComm execution",color:"blue"},
  {scenario:"D2 - BASE CASE",type:"Self-Pub",advance:"$0",yr1:"$45K-$120K",yr2:"$80K-$200K",yr35:"$270K-$780K",total:"$395K-$1.1M",dep:"Full format stack. StrComm Ph 1-3. AUMER grants. Influencer activations",color:"gold",highlight:true},
  {scenario:"D3 - OPTIMISTIC",type:"Self-Pub",advance:"$0",yr1:"$120K-$350K",yr2:"$300K-$900K",yr35:"$2.1M-$7.7M",total:"$2.5M-$9M+",dep:"Full StrComm Plan. Adaptation. Awards. 15-40 academic courses",color:"teal"},
  {scenario:"E - HYBRID",type:"Hybrid",advance:"$50K-$150K",yr1:"$25K-$70K",yr2:"$60K-$150K",yr35:"$250K-$900K",total:"$385K-$1.27M",dep:"Boutique press + AUMER co-pub. Gabriel retains ebook/audio/adaptation. Publisher takes print/foreign",color:"purple"},
];

// %% STRCOMM SS NEW DATA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const KPI_SCORECARD_DATA = [
  {family:"Brand Equity",metric:"Aided Awareness (%)",baseline:"~0%",m3:"5%",m6:"15%",m12:"22%",m18:"30%",source:"Quarterly brand survey"},
  {family:"Brand Equity",metric:"Unaided Awareness (%)",baseline:"~0%",m3:"1%",m6:"3%",m12:"5%",m18:"8%",source:"Quarterly brand survey"},
  {family:"Brand Equity",metric:"Brand Equity Index (BEI)",baseline:"0",m3:"8",m6:"18",m12:"30",m18:"46",source:"Composite: awareness+credibility+distinctiveness"},
  {family:"Brand Equity",metric:"Credibility Score (1-10)",baseline:"--",m3:"5",m6:"6",m12:"7",m18:"8",source:"Brand tracking survey"},
  {family:"Reach",metric:"Total Unique Reach / mo",baseline:"0",m3:"5K",m6:"25K",m12:"60K",m18:"120K",source:"Platform analytics combined"},
  {family:"Reach",metric:"Email List Size",baseline:"0",m3:"500",m6:"2K",m12:"6K",m18:"12K",source:"CRM (HubSpot Hub 46948033)"},
  {family:"Reach",metric:"Podcast Downloads / mo",baseline:"0",m3:"--",m6:"1K",m12:"5K",m18:"12K",source:"Hosting platform analytics"},
  {family:"Engagement",metric:"Video Completion Rate",baseline:"--",m3:"35%",m6:"45%",m12:"55%",m18:"60%",source:"Platform analytics"},
  {family:"Engagement",metric:"Email Open Rate",baseline:"--",m3:"30%",m6:"35%",m12:"40%",m18:"42%",source:"HubSpot"},
  {family:"Conversion",metric:"Email Signup Rate",baseline:"--",m3:"3%",m6:"5%",m12:"6%",m18:"7%",source:"GA4 + CRM"},
  {family:"Conversion",metric:"Educator Inquiry Rate",baseline:"0",m3:"--",m6:"5",m12:"25",m18:"60",source:"CRM outreach tracker"},
  {family:"Market Share",metric:"Share of Voice (niche %)",baseline:"~0",m3:"0.5%",m6:"1.5%",m12:"3%",m18:"5%",source:"Social listening + search console"},
  {family:"Market Share",metric:"Niche Category Share",baseline:"0",m3:"0",m6:"0.05%",m12:"0.2%",m18:"0.42%",source:"Retailer dashboards + syndicated data"},
  {family:"Institutional",metric:"Academic Inquiries",baseline:"0",m3:"--",m6:"3",m12:"15",m18:"40",source:"CRM outreach tracker"},
  {family:"Institutional",metric:"Partner MOUs Signed",baseline:"0",m3:"2",m6:"8",m12:"20",m18:"35",source:"CRM + event records"},
];

const BUDGET_DATA = [
  {scenario:"LEAN",range:"$300K - $600K",staffing:"Fractional senior talent; strong internal owner; limited live events",distribution:"Owned + earned first; highly selective creator spend",recommended:false,note:"Fallback only"},
  {scenario:"STANDARD",range:"$900K - $1.8M",staffing:"Dedicated campaign team with paid support",distribution:"Balanced owned/earned/paid; robust creator + institutional",recommended:true,note:"RECOMMENDED"},
  {scenario:"EXPANSION",range:"$2.5M - $4.5M",staffing:"Full-stack external + internal team",distribution:"National creator bursts; significant events; research tracking",recommended:false,note:"Post-Gate 3"},
];

const BUDGET_BUCKETS = [
  {bucket:"Strategy + Program Management",share:"12%-18%",note:"Keeps the campaign from fragmenting into channel noise"},
  {bucket:"Creative Production",share:"18%-25%",note:"Trailer, photography, motion, landing pages, excerpts"},
  {bucket:"PR + Media Relations",share:"12%-18%",note:"Podcasting, long-lead features, reactive issues management"},
  {bucket:"Creator + Partner Activations",share:"10%-20%",note:"Fees, affiliate tooling, event support, travel where needed"},
  {bucket:"Paid Media",share:"20%-35%",note:"Only after message-market fit is confirmed"},
  {bucket:"Community + Events",share:"8%-15%",note:"Moderation, webinars, activation kits, local programming"},
  {bucket:"Analytics, Surveys + Tooling",share:"5%-10%",note:"Social listening, dashboards, brand tracking, testing infrastructure"},
  {bucket:"Legal + Compliance",share:"3%-6%",note:"Endorsements, marks, rights, contracts, issue review"},
];

const PERSONAS = [
  {persona:"Veteran Memory Keeper",demo:"55-80; veterans, spouses, adult children; often male-skewed",psycho:"Values duty, recognition, historical seriousness, lived-experience credibility",channels:"Facebook / YouTube / Veteran podcasts / Local events / Email newsletters",moves:"Respectful tone, documentary proof, testimony, community recognition",language:"English primary; formal register",format:"Long-form video/audio, email newsletters, documentary segments",phase:"Phases 2-5"},
  {persona:"Latino Civic Storykeeper",demo:"30-65; bilingual/bicultural; community leaders, parents, civic participants",psycho:"Identity-conscious, intergenerational, proud but allergic to empty symbolism",channels:"Instagram / WhatsApp / Facebook / Hispanic digital outlets / Community radio",moves:"Family legacy, representation, cultural truth, teachable pride",language:"English-first; high-value Spanish adaptation (NOT every-post bilingual)",format:"Short video (Reels), community posts, bilingual explainers, email",phase:"Phases 3-5"},
  {persona:"Culture-First Book Discoverer",demo:"18-34; students, early-career readers, creators, book-club natives",psycho:"Discovers through voice, affect, and recommendation before formal authority",channels:"TikTok / Reels / Shorts / Book creators / Podcast clips / Retail previews",moves:"Character, emotional stakes, quotable lines, authenticity",language:"English; slang-tolerant; conversational",format:"Quote reels, reading clips, BookTok duets, short emotional hooks",phase:"Phases 3-4"},
  {persona:"Educator + Curator Gatekeeper",demo:"30-65; professors, teachers, librarians, museum/public-history staff",psycho:"Needs adoption logic, citable material, and pedagogical usefulness",channels:"Email / LinkedIn / Webinars / Academic newsletters / Podcasts",moves:"Course-fit, discussion guides, record trail, clear learning outcomes",language:"English; formal academic register",format:"Webinars, email pitch + one-pager, educator discussion guide, long-form audio",phase:"Phases 2-5"},
  {persona:"Public-Interest Amplifier",demo:"25-55; journalists, podcasters, historians, veteran advocates, nonprofit operators",psycho:"Looks for stakes, originality, angle, and reputational safety",channels:"Email pitches / Long-form podcasting / Earned media / Substack",moves:"News hook, verified facts, clean press kit, strong spokespersoning",language:"English; credible professional register",format:"Email pitch, press kit, video explainer, long-form podcast",phase:"Phases 1-4"},
];

const INFLUENCERS = [
  {n:1,handle:"@rgvet_vive",name:"Miguel Cervantes",followers:"41,000",fit:86,cadence:"Daily",platform:"Instagram/TikTok",tier:"Mid-Tier",comp:"Revenue share OR flat fee",est:"$500-$2,000/post",phase:"Ph.3",role:"Veteran authenticity anchor. Daily 349-story touchpoint. PRIMARY ORGANIC DRIVER."},
  {n:2,handle:"@latinovets",name:"Latino Vets Coalition",followers:"31,200",fit:80,cadence:"Alt. days",platform:"Instagram",tier:"Mid-Tier",comp:"Revenue share OR activation fee",est:"$500-$1,500/activation",phase:"Ph.3",role:"Institutional veteran advocacy reach. Community validation = door-opener."},
  {n:3,handle:"@latinxpub",name:"Latinx in Publishing",followers:"18,500",fit:80,cadence:"3x/week",platform:"Twitter/Instagram",tier:"Micro",comp:"Flat fee + content partnership",est:"$200-$600/post",phase:"Ph.2-3",role:"Publishing community credibility. Every post = publisher/agent sees the book."},
  {n:4,handle:"@ruizchicanowrit",name:"Dr. Elena Ruiz",followers:"18,500",fit:80,cadence:"Alt. days",platform:"Academic Twitter",tier:"Micro/Academic",comp:"Academic honorarium + revenue share",est:"$200-$800/post",phase:"Ph.3-4",role:"Academic credibility. Course adoption pipeline."},
  {n:5,handle:"@barriobooksclub",name:"Barrio Books Club",followers:"14,000",fit:77,cadence:"3x/week",platform:"Instagram/TikTok",tier:"Micro",comp:"Affiliate link + flat fee",est:"$150-$400/post",phase:"Ph.3",role:"Gen Z Chicano readership. Community amplifier."},
  {n:6,handle:"@veteranstories",name:"Veterans Stories Network",followers:"62,000",fit:74,cadence:"Daily",platform:"YouTube",tier:"Mid-Tier",comp:"Revenue share OR flat fee",est:"$1K-$3K/video",phase:"Ph.3-4",role:"Veteran memory keeper audience. Documentary tone alignment."},
  {n:7,handle:"@viet.t.nguyen",name:"Viet Thanh Nguyen",followers:"112,000",fit:73,cadence:"Weekly",platform:"Instagram/Twitter",tier:"Macro/Authority",comp:"Prestige seeded (no fee)",est:"$0 / endorsement",phase:"Ph.2",role:"Pulitzer author. Direct USC colleague. Blurb + social = award-circuit signal."},
  {n:8,handle:"@sandracisneros",name:"Sandra Cisneros",followers:"143,000",fit:70,cadence:"Occasional",platform:"Instagram/Twitter",tier:"Macro/Icon",comp:"Prestige seeded (no fee)",est:"$0 / endorsement",phase:"Ph.3",role:"Chicano canon authority. Macondo Workshop connection. Single post = national coverage."},
  {n:9,handle:"@dancarlin",name:"Dan Carlin",followers:"390,000",fit:67,cadence:"Infrequent",platform:"Twitter/Podcast",tier:"Macro/Authority",comp:"Prestige seeded (no fee)",est:"$0 / podcast mention",phase:"Ph.4",role:"Hardcore History audience = veteran + history buffs. Single mention = 10K+ impressions."},
  {n:10,handle:"@jockowillink",name:"Jocko Willink",followers:"3.1M",fit:65,cadence:"Daily",platform:"Instagram/Podcast",tier:"Macro",comp:"Prestige seeded (no fee)",est:"$0 / podcast appearance",phase:"Ph.4",role:"Military discipline + leadership audience. If he reads and endorses = massive veteran reach."},
];

const CONTENT_CAL = [
  {month:"Feb 2026",focus:"Foundation + Framing",hero:"'What this project is' essay + Founder video + Landing page v1 + DCAS brief (teaser)",cadence:"Low volume, high clarity",kpi:"Baseline conversion rate, email signup",platform:"Website hub + Email list",persona:"Educator + Public-Interest Amplifier"},
  {month:"Mar 2026",focus:"Proof + Credibility",hero:"Source explainer video + Records-and-methods breakdown + FAQ thread + 349 anomaly intro",cadence:"2 short videos/week + weekly email",kpi:"Trust score, dwell time, creator interest",platform:"YouTube + Twitter/X + Email",persona:"Public-Interest Amplifier + Veteran"},
  {month:"Apr 2026",focus:"Identity + Relevance",hero:"'Why this story matters NOW' creator brief + Bilingual explainer (SII bridge) + First partner posts",cadence:"3 shorts/week + 1 long-form/month",kpi:"Saves, shares, creator interest, email open",platform:"Instagram + TikTok + Email",persona:"Latino Civic Storykeeper + Culture-First"},
  {month:"May 2026",focus:"Emotional Entry",hero:"Reading clips + Family/service themes + First partner features + 'El numero' (349) Spanish reel",cadence:"4 shorts/week + email + creator surge",kpi:"Follower quality, email growth, creator CPA",platform:"TikTok + Reels + Instagram",persona:"Culture-First Discoverer + Latino Civic"},
  {month:"Jun 2026",focus:"Public Seeding",hero:"Soft creator posts + Teaser trailer + Press kit release + First earned media pitches out",cadence:"4-5 shorts/week + earned seeding",kpi:"Share of search, earned mentions, creator CPA",platform:"TikTok + Twitter/X + Email",persona:"All segments"},
  {month:"Jul 2026",focus:"Conversion Runway",hero:"Events preview + Preorder/interest capture + Educator deck + Library outreach packets out",cadence:"4 shorts/week + 2 emails/month",kpi:"RSVP rate, signup conversion, library requests",platform:"Website + Email + LinkedIn",persona:"Educator + Veteran Memory Keeper"},
];

const RISK_REGISTER = [
  {id:"NN-1",cat:"Military Marks",severity:"HIGH",rule:"Avoid military service names, insignia, uniforms unless rights + usage boundaries are confirmed. No implied DoD/Army endorsement.",mitigation:"Legal review of all visual assets before publication."},
  {id:"NN-2",cat:"Creator Disclosure",severity:"HIGH",rule:"All paid/material creator relationships must be disclosed. FTC rules apply. Required in contract language.",mitigation:"Disclosure checklist + post-audit process."},
  {id:"NN-3",cat:"Claims Ledger",severity:"HIGH",rule:"Maintain a claims ledger for every factual assertion. DCAS = 349 is a race-field output, not an ethnicity census.",mitigation:"Fact-check advisor reviews all press-facing claims."},
  {id:"NN-4",cat:"Rights + Consent",severity:"HIGH",rule:"Written rights and consent for all oral histories, personal photographs, and family materials.",mitigation:"Rights memo required before any family/archive content goes live."},
  {id:"NN-5",cat:"Tone Discipline",severity:"MED",rule:"Avoid sensationalizing trauma or casualty narratives for engagement bait.",mitigation:"Community review board + sensitivity advisor on all trauma-adjacent content."},
  {id:"NN-6",cat:"Error Correction",severity:"MED",rule:"Publish corrections quickly and visibly when errors are discovered. Speed without correction = expensive hole.",mitigation:"Corrections policy page live on site from Day 1."},
  {id:"R-1",cat:"Implied Endorsement",severity:"HIGH",rule:"Audience may infer official military approval from campaign imagery.",mitigation:"Disclaimers, mark review, legal approval of visual assets."},
  {id:"R-2",cat:"Historical Accuracy",severity:"HIGH",rule:"Journalists or critics challenge a factual claim — one error contaminates the whole forensic spine.",mitigation:"Evidence ledger + fact-check advisor + source-linked press sheet."},
  {id:"R-3",cat:"Tone Backlash",severity:"MED",rule:"Campaign feels exploitative, partisan, or performative.",mitigation:"Community review, sensitivity check, avoid triumphalist framing."},
  {id:"R-4",cat:"Metadata Fragmentation",severity:"MED",rule:"Inconsistent title/subtitle naming hurts search and retail performance.",mitigation:"Canonical naming protocol + retailer QA checklist."},
  {id:"R-5",cat:"Platform Volatility",severity:"MED",rule:"Algorithm or policy shifts reduce distribution efficiency.",mitigation:"Diversify channels and push email capture above all."},
];

const CBBE_LEVELS = [
  {level:"L4 - RESONANCE (top)",dims:"Behavioral loyalty, attitudinal attachment, sense of community, active engagement",buildPhase:"Month 12-18",proxies:"Veterans sharing posts; Educators assigning course; Community events recurring"},
  {level:"L3 - JUDGMENTS",dims:"Quality, credibility, consideration, superiority",buildPhase:"Month 6-12",proxies:"Earned media credibility scores; Educator adoption; Award nominations; Kirkus review"},
  {level:"L3 - FEELINGS",dims:"Warmth, excitement, security, social approval, self-respect",buildPhase:"Month 6-12",proxies:"Reader emotional impact scores; Creator resonance; Community testimonials"},
  {level:"L2 - PERFORMANCE",dims:"Product features, reliability, service, style and design, price",buildPhase:"Month 3-6",proxies:"LitCentral quality metrics; Omega score; LSTE 82.2; SII/BIS scores"},
  {level:"L2 - IMAGERY",dims:"User profiles, purchase situations, history, heritage, experiences",buildPhase:"Month 3-6",proxies:"Social media voice; creator association; community event attendance"},
  {level:"L1 - SALIENCE (base)",dims:"Category identification, awareness breadth and depth",buildPhase:"Month 1-3",proxies:"Search volume; aided awareness %; share of search in niche"},
];

const GANTT_ROWS = [
  {phase:"FOUNDATION",task:"Source audit + rights inventory",owner:"Campaign Dir.",priority:"P0",months:[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {phase:"FOUNDATION",task:"Canonical title lock ('Matherematics'?)",owner:"Campaign Dir.",priority:"P0",months:[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {phase:"FOUNDATION",task:"Proof ledger + fact-risk register",owner:"Research Adv.",priority:"P0",months:[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {phase:"FOUNDATION",task:"Audience research + baseline survey",owner:"Analytics Lead",priority:"P0",months:[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {phase:"FOUNDATION",task:"Website hub + CRM (HubSpot) + GA4 setup",owner:"Dev Lead",priority:"P0",months:[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {phase:"BRAND BUILD",task:"Brand system + visual identity",owner:"Producer/Designer",priority:"P0",months:[0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {phase:"BRAND BUILD",task:"Press kit + partner deck",owner:"PR Lead",priority:"P0",months:[0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {phase:"BRAND BUILD",task:"Message hierarchy testing (paid social panels)",owner:"Analytics Lead",priority:"P1",months:[0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {phase:"SEEDING",task:"Creator identification + onboarding",owner:"Partnerships Lead",priority:"P0",months:[0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0]},
  {phase:"SEEDING",task:"Educator + institutional outreach",owner:"Partnerships Lead",priority:"P1",months:[0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]},
  {phase:"SEEDING",task:"Editorial runway + teaser campaign",owner:"Editorial Lead",priority:"P1",months:[0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]},
  {phase:"LAUNCH",task:"Hispanic Heritage Month activation (Sep-Oct)",owner:"Campaign Dir.",priority:"P0",months:[0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0]},
  {phase:"LAUNCH",task:"Veterans Day peak moment (Nov)",owner:"Campaign Dir.",priority:"P0",months:[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0]},
  {phase:"LAUNCH",task:"Launch media burst + conversion push",owner:"PR Lead",priority:"P0",months:[0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0]},
  {phase:"EXPANSION",task:"Speaking + partnerships + community",owner:"Partnerships Lead",priority:"P1",months:[0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0]},
  {phase:"EXPANSION",task:"Curriculum + library push",owner:"Partnerships Lead",priority:"P1",months:[0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0]},
  {phase:"EXPANSION",task:"Long-tail creator + earned media waves",owner:"PR Lead",priority:"P2",months:[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0]},
  {phase:"EXPANSION",task:"Anniversary + archival programming",owner:"Campaign Dir.",priority:"P2",months:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1]},
];

const MONTHS_LABELS = ["Feb 26","Mar 26","Apr 26","May 26","Jun 26","Jul 26","Aug 26","Sep 26","Oct 26","Nov 26","Dec 26","Jan 27","Feb 27","Mar 27","Apr 27","May 27","Jun 27","Jul 27"];

const COMP_FRAMEWORK = [
  {model:"Seeded Advocate",fit:"Historians, educators, mission-aligned veterans, Jocko, Dan Carlin",comp:"Early access + prestige + event access + modest honorarium (if needed)",guardrails:"Works ONLY when fit is truly high. Never buy low-trust advocacy.",roi:"Earned mention tracking; downstream traffic from tagged links"},
  {model:"Affiliate Creator",fit:"Book creators (Barrio Books, berrybbookpages) + niche commentators",comp:"Tracked link/code + commission (standard: 8-15% of conversion)",guardrails:"Good for conversion measurement; weak as sole compensation.",roi:"Tracked link dashboard; CPA by creator; new-to-file attribution"},
  {model:"Flat-Fee Post",fit:"Mid-tier creators with proven fit and defined deliverables",comp:"One-time fee tied to deliverables + exclusivity window (30 days)",guardrails:"Use sparingly; require FTC disclosure and usage rights in contract.",roi:"Engagement rate; estimated EMV; downstream signup lift"},
  {model:"Hybrid Fee + Performance",fit:"Creators with both reach AND conversion history (best balance)",comp:"Base fee ($500-$2,500) + commission OR CPM cap on views",guardrails:"Best balance for uncertain new categories. Set performance floor.",roi:"CPA + reach efficiency; compare to baseline CAC"},
  {model:"Ambassador Retainer",fit:"Top-fit long-term voices (post-validation only)",comp:"Monthly stipend + exclusive windows + performance bonus",guardrails:"Use only after initial validation shows ROI. No retainer before proof.",roi:"Monthly CPA; attributed email + signup; event attendance lift"},
  {model:"Expert Advisory Creator",fit:"Veteran/history experts, scholars with real authority (Viet T. Nguyen)",comp:"Consulting fee + limited content outputs",guardrails:"Valuable for trust transfer and issue prevention. Not for reach.",roi:"Trust score; earned media downstream; award-circuit recognition"},
];

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// VERIFIED BENCHMARK DATA — 100% Source Disclosure Protocol
// All sources traceable. Unverified metrics flagged. May 24, 2026.
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// VERIFIED COMP TABLE — Rebuilt on authentic / human / academic sources (GG.pdf, June 2026)
// Replaces prior AI-estimated comp metrics. Every datum tagged with source + verification tier.
// Reading-score correction: cross-title Flesch comparison was invalid (book measured, comps converted).
// Pivot to LEXILE (academic standard where published). Flesch claim now states "AutoCrit-measured; comps pending same-instrument measurement."
const VERIFIED_BENCHMARKS = {
  manuscript: {
    title:"SGT George Ramos: The Mathematics of Vietnam",
    author:"Gabriel T. Arce Jr.",
    year:2026,
    flesch:74,fleschSource:"AutoCrit (wd.autocrit.com, report 3/31/26) — VERIFIED external instrument",fleschStatus:"VERIFIED",
    fkGrade:5.0,words:247863,wordsSource:"v6 wc -w canonical (pre-dedup; 3 P0 dup pairs unresolved)",wordsStatus:"VERIFIED",
    passiveVoice:0.58,passiveSource:"AutoCrit (1,404 / 241,117 words)",passiveStatus:"VERIFIED",
    cliches:80,clichesBenchmark:190,clichesSource:"AutoCrit vs Biography & Memoir genre",clichesStatus:"VERIFIED",
    redundancies:15,redundanciesBenchmark:73,redundanciesSource:"AutoCrit vs Biography & Memoir",redundanciesStatus:"VERIFIED",
    readabilityComposite:73.6,readabilitySource:"AutoCrit",readabilityStatus:"VERIFIED",
    tenseDistribution:{past:57,present:39,future:5},tenseSource:"AutoCrit",tenseStatus:"VERIFIED",
    // LC cataloging (modeled by analogy — needs cataloger confirmation before CIP packet)
    lcClass:"PS3601.R... (American fiction, 21st c., author surname Arce)",
    dewey:"813.6",
    lcsh:["Vietnam War, 1961–1975 — Fiction","Mexican Americans — Fiction","Hispanic American soldiers — Fiction","Magic realism (Literature)","Yaqui Indians — Fiction (pending consultation)"],
    bisac:["FIC019000 (Literary)","FIC014090 (Historical / Post-WWII)","FIC125000 (Hispanic & Latino)"],
    lcStatus:"MODELED — needs cataloger confirmation",
  },
  compTitles: [
    {title:"The Things They Carried",author:"Tim O'Brien",year:1990,flesch:"~65 (est.)",fkGrade:7.2,words:"~60K (est.)",pages:256,lexile:"880L",
      awards:"Pulitzer Finalist 1990–91; National Book Critics Circle Award; Chicago Tribune Heartland Prize; France's Prix du Meilleur Livre Étranger; Pritzker Military Literature Award",
      copies:"2M+ (NEA) to 7M+ (publisher) — range",lcClass:"American 20th-c. fiction (PS3565 range)",
      fleschSource:"ReadingVine (FK 7.2 → Flesch est.) — ESTIMATED, not measured",dataQuality:"SOURCED",
      awardsSource:"Pulitzer Board (finalists); publisher; NEA",copiesSource:"NEA Big Read; publisher",lexileSource:"Wake County Library catalog; school review",
      culturalLens:"Anglo-American",warTheater:"Vietnam (Alpha Company)"},
    {title:"The Sympathizer",author:"Viet Thanh Nguyen",year:2015,flesch:"No published Flesch (adult literary)",fkGrade:8.5,words:"~120K (est. from ~371–416 pp)",pages:416,lexile:"No published Lexile (adult literary)",
      awards:"2016 Pulitzer Prize for Fiction; Edgar (Best First Novel); Andrew Carnegie Medal for Excellence in Fiction (ALA); Dayton Literary Peace Prize; Center for Fiction First Novel Prize; California Book Awards Gold; Asian/Pacific American Lit Award; finalist PEN/Faulkner, LA Times, Dublin Literary Award",
      copies:"'500K+' UNVERIFIED — no sourced figure",lcClass:"PS3614.G97 S96 2015; LCCN 2015375327; Dewey 813.6",
      fleschSource:"No published Flesch. Adult literary — no Lexile. Cannot run valid cross-instrument comparison.",dataQuality:"ESTIMATED",
      awardsSource:"Pulitzer Board (pulitzer.org); Grove Atlantic; ALA; author bio",copiesSource:"UNVERIFIED — do not cite in agent materials",lexileSource:"No published Lexile",
      culturalLens:"Vietnamese-American",warTheater:"Vietnam (Fall of Saigon)"},
    {title:"Bless Me, Ultima",author:"Rudolfo Anaya",year:1972,flesch:"~72 (est.)",fkGrade:6.0,words:"~69K (ReadingLength)",pages:262,lexile:"840L",
      awards:"Premio Quinto Sol (1971, national Chicano literary award); Anaya later: American Book Award; National Humanities Medal (2016)",
      copies:"360K+ (NYT/Goodreads)",lcClass:"American fiction; 'Mexican Americans — Fiction'",
      fleschSource:"LightSailed (Lexile 840L → FK ~6.0 → Flesch est. ~72) — ESTIMATED",dataQuality:"SOURCED",
      awardsSource:"Publisher; NEA Big Read; Wikipedia",copiesSource:"NYT; Goodreads",lexileSource:"LightSailed; library catalog",
      culturalLens:"Chicano (New Mexico)",warTheater:"N/A — Coming-of-age"},
    {title:"Matterhorn",author:"Karl Marlantes",year:2010,flesch:"No published Flesch (adult literary)",fkGrade:8.0,words:"~200K (est. from ~592 pp)",pages:600,lexile:"No published Lexile (adult literary)",
      awards:"2011 William E. Colby Award (Pritzker Military Library); Center for Fiction Flaherty-Dunnan First Novel Prize; Indies Choice (Adult Debut); James Webb Award (Marine Corps Heritage Fdn); Washington State Book Award; PNBA Award; W.Y. Boyd Literary Award (ALA)",
      copies:"'250K+' UNVERIFIED",lcClass:"military/Vietnam fiction",
      fleschSource:"No published Flesch or Lexile. Adult literary — cross-instrument comparison not valid.",dataQuality:"ESTIMATED",
      awardsSource:"Publishers Weekly; Pritzker Mil. Library; Grove Atlantic",copiesSource:"UNVERIFIED — do not cite in agent materials",lexileSource:"No published Lexile",
      culturalLens:"Anglo-American (Marine)",warTheater:"Vietnam (Quang Tri)"},
  ],
  rankings: {
    readability: ["SGT Ramos (Flesch 74, AutoCrit-measured)","Bless Me Ultima (Lexile 840L, sourced)","Things They Carried (Lexile 880L, sourced)","The Sympathizer (no Lexile published)","Matterhorn (no Lexile published)"],
    scale: ["SGT Ramos (~248K, wc -w canonical)","Matterhorn (~200K, page-count est.)","The Sympathizer (~120K, page-count est.)","Bless Me Ultima (~69K, ReadingLength)","Things They Carried (~60K, est.)"],
  },
  keyFindings: [
    {id:1,title:"Chicano-Canon Placement — Strongest Verified Hook",text:"Bless Me, Ultima (Premio Quinto Sol, Lexile 840L) is the readability and cultural analog. SGT Ramos extends that tradition at ~3.5× the length. This is a true, sourced comp — the strongest verified claim in the set.",impact:"HIGH",icon:"✓"},
    {id:2,title:"Scale Claim Holds",text:"At ~248K words (v6 wc -w canonical), SGT Ramos is the longest in the set. Matterhorn (~200K) is next. This is a verified, citable figure.",impact:"HIGH",icon:"✓"},
    {id:3,title:"'Most Accessible' is UNVERIFIED — flag until validated",text:"Flesch 74 (AutoCrit) vs. comp Flesch scores estimated from grade-level conversion = apples-to-oranges comparison. The claim becomes defensible only after all five titles run through one instrument (AutoCrit). State as: 'AutoCrit-measured Flesch 74; comps pending same-instrument measurement.'",impact:"CRITICAL",icon:"⚠"},
    {id:4,title:"Awards Comps Were Under-Stated — Helps You",text:"These are not one-prize books — they're multi-award canon. The Sympathizer alone has 7+ major awards. The realistic bar is high: frame SGT Ramos as entering a decorated field, not topping a thin one.",impact:"HIGH",icon:"↑"},
    {id:5,title:"Passive Voice Leader",text:"At 0.58%, lower than To Kill a Mockingbird (1%). Well below industry 3% threshold. Exceptional for 241K+ words. Source: AutoCrit 3/31/26.",impact:"MEDIUM",icon:"↑"},
    {id:6,title:"Copy-Sales Figures Remain UNVERIFIED",text:"Sympathizer '500K+' and Matterhorn '250K+' have no sourced backing. Do not cite in agent-facing materials without a sourced figure. Drop them or replace with sourced alternatives.",impact:"CRITICAL",icon:"⚠"},
    {id:7,title:"Library of Congress Vertical — Credibility Bridge",text:"Modeled LC record: PS3601.R... · Dewey 813.6 · LCSH: Vietnam War 1961–1975 — Fiction; Mexican Americans — Fiction; Hispanic American soldiers — Fiction. BISAC: FIC019000 + FIC014090 + FIC125000. Needs cataloger confirmation before CIP packet.",impact:"HIGH",icon:"←"},
  ],
};

const SOURCE_AUDIT = {
  verified: {count:8, label:"VERIFIED — External Tool Output", color:"teal", items:[
    "Word Count: 241,117 (Novlr)","Chapter Count: 44 (direct)","Flesch Reading Ease: 74 (AutoCrit)",
    "Cliché Count: 80 (AutoCrit)","Redundancy Count: 15 (AutoCrit)","Passive Voice: 1,404 (AutoCrit)",
    "Tense Distribution: 57/39/5 (AutoCrit)","Readability Composite: 73.6 (AutoCrit)",
  ]},
  partial: {count:6, label:"PARTIAL — Real SPSS Math, Claude Inputs", color:"gold", items:[
    "Hybrid Omega R²: 0.947 (SPSS regression on Claude-scored inputs)",
    "Regression Coefficients: CLS=.501, BIS=.487 (SPSS output)",
    "Cronbach's α: 0.938 (SPSS, N=11 pilot — below N=200 minimum)",
    "Per-Chapter Omega Scores: Range 89–111 (formula on Claude inputs)",
    "LITCENTRAL 12 Pillar Scores (Claude text analysis per chapter)",
    "5-Domain Scores: Cog/Cul/Beh/Sen/Gov (aggregated from pillars)",
  ]},
  unverified: {count:12, label:"UNVERIFIED — No External Source", color:"red", items:[
    "Restraint Score: 67/100 — NO SOURCE","CL-MoE: 0.115 — NO BENCHMARK CORPUS",
    "RRP Mean: 86.9% — NO READER PANEL","Per-Chapter Verification: 72–97 — NO HISTORIAN PANEL",
    "Market Advance: $85K–$350K — NOT FROM PUBLISHERS MARKETPLACE",
    "Streaming Score: 88/100 — NO INDUSTRY TOOL","Audio/NI: 94 / 0.87 — CLAUDE-CREATED METRIC",
    "LSTE Composite: 82.2 — CLAUDE COMPOSITE","Pulitzer Probability: 68% — RETIRED (cannot validate)",
    "Sensory Thresholds: >20/1000w — NO CORPUS ANALYSIS",
    "Word Overuse Thresholds — CLAUDE-DEFINED","Tier System — CLAUDE-CREATED CLASSIFICATION",
  ]},
  retired: {count:1, label:"RETIRED — Cannot Be Validated", color:"red", items:[
    "Pulitzer Probability: 68% — Jury deliberations are confidential. No predictive model exists. Replaced with comp analysis.",
  ]},
  principle:"If we don't have the source, we flag it. That's what makes the difference.",
  total:26, lastAudit:"May 24, 2026",
};

const NAV_ITEMS = [
  {id:"verified",label:"✓ Verified Benchmarks",icon:Award},
  {id:"sourceaudit",label:"= Source Audit",icon:Target},
  {id:"overview",label:"Overview",icon:TrendingUp},
  {id:"scenarios",label:"Scenarios",icon:Target},
  {id:"trajectory",label:"Trajectory",icon:BookOpen},
  {id:"publishers",label:"Publisher Intel",icon:ExternalLink},
  {id:"grants",label:"Grants",icon:Award},
  {id:"revenue",label:"Revenue Model",icon:DollarSign},
  {id:"selfpub",label:"Self-Pub (D)",icon:BookOpen},
  {id:"tradvsself",label:"Trad vs Self-Pub",icon:Target},
  {id:"strcomm",label:"StrComm Plan",icon:TrendingUp},
  {id:"allscenarios",label:"All Scenarios",icon:DollarSign},
  {id:"gantt",label:"Gantt Tracker",icon:Target},
  {id:"kpi",label:"KPI Scorecard",icon:TrendingUp},
  {id:"budget",label:"Budget Planner",icon:DollarSign},
  {id:"personas",label:"Personas",icon:BookOpen},
  {id:"influencers",label:"Influencers",icon:Award},
  {id:"calendar",label:"Content Calendar",icon:ExternalLink},
  {id:"risk",label:"Risk Register",icon:Target},
  {id:"brandequity",label:"Brand Equity",icon:TrendingUp},
];

export default function MarketIntelligencePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("verified");

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-gold via-teal to-blue" />

      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-mono">
            <ArrowLeft className="w-3.5 h-3.5" />LITCENTRAL
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-gold font-mono truncate">MARKET INTELLIGENCE + REVENUE PROJECTIONS</div>
            <div className="text-[9px] text-muted-foreground font-mono">SGT George Ramos · v6 Comp-Rebuilt · LSTE 82.2/100 · <span className="text-teal">8 VERIFIED</span> · <span className="text-gold">6 PARTIAL</span> · <span className="text-red">12 FLAGGED</span> · <span className="text-orange">1 RETIRED</span></div>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[9px] font-mono text-teal bg-teal/10 border border-teal/30 px-3 py-1 rounded-full flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            LIVE PROJECTIONS
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-card/50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {NAV_ITEMS.map(n => {
              const Icon = n.icon;
              return (
                <button key={n.id} onClick={() => setActiveSection(n.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold font-mono whitespace-nowrap transition-all ${
                    activeSection === n.id ? "bg-accent text-white" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}>
                  <Icon className="w-3 h-3" />
                  {n.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 space-y-8">

        {/* VERIFIED BENCHMARKS */}
        {activeSection === "verified" && (
          <div className="space-y-8 animate-slide-up">
            <div className="relative overflow-hidden rounded-2xl border border-teal/30 bg-gradient-to-br from-teal/5 via-card to-gold/5 p-8">
              <div className="relative">
                <div className="text-[9px] font-mono text-teal tracking-widest mb-3">100% SOURCE DISCLOSURE PROTOCOL</div>
                <div className="text-3xl md:text-4xl font-black text-foreground font-mono leading-tight mb-1">VERIFIED BENCHMARKS</div>
                <div className="text-sm text-muted-foreground font-sans mb-4">SGT George Ramos vs. Pulitzer-Winner Comp Set — Sourced & Traceable</div>
                <div className="flex gap-3 flex-wrap">
                  {[
                    {count:SOURCE_AUDIT.verified.count,label:"VERIFIED",color:"teal",bg:"bg-teal/10",border:"border-teal/30"},
                    {count:SOURCE_AUDIT.partial.count,label:"PARTIAL",color:"gold",bg:"bg-gold/10",border:"border-gold/30"},
                    {count:SOURCE_AUDIT.unverified.count,label:"UNVERIFIED",color:"red",bg:"bg-red/10",border:"border-red/30"},
                    {count:SOURCE_AUDIT.retired.count,label:"RETIRED",color:"muted-foreground",bg:"bg-background",border:"border-border"},
                  ].map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-lg px-4 py-2 text-center`}>
                      <div className={`text-2xl font-black font-mono text-${s.color}`}>{s.count}</div>
                      <div className={`text-[9px] text-muted-foreground font-mono`}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-teal/20 bg-card p-6">
              <div className="text-xs font-mono text-teal tracking-widest mb-4">MANUSCRIPT — VERIFIED INSTRUMENT DATA (AUTOCRIT 3/31/26)</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {label:"Flesch Reading Ease",value:"74",benchmark:"Genre: 55",delta:"+34.5%",color:"text-teal"},
                  {label:"Passive Voice",value:"0.58%",benchmark:"TKAM: 1%",delta:"OUTPERFORMS",color:"text-teal"},
                  {label:"Clichés",value:"80",benchmark:"Genre: 190",delta:"-57.9%",color:"text-teal"},
                  {label:"Redundancies",value:"15",benchmark:"Genre: 73",delta:"-79.5%",color:"text-teal"},
                  {label:"Word Count (v6 canonical)",value:"247,863",benchmark:"wc -w pre-dedup",delta:"✓",color:"text-foreground"},
                  {label:"Readability Composite",value:"73.6",benchmark:"Verified",delta:"✓",color:"text-foreground"},
                  {label:"Tense (Past/Pres/Fut)",value:"57/39/5%",benchmark:"Verified",delta:"✓",color:"text-foreground"},
                  {label:"FK Grade Level",value:"~5.0",benchmark:"Pulitzer range",delta:"✓",color:"text-foreground"},
                ].map((m, i) => (
                  <div key={i} className="bg-background rounded-lg border border-border p-4">
                    <div className={`text-2xl font-black font-mono ${m.color}`}>{m.value}</div>
                    <div className="text-[10px] font-bold text-foreground font-mono mt-1">{m.label}</div>
                    <div className="text-[9px] text-muted-foreground font-mono">{m.benchmark}</div>
                    <div className="text-[9px] font-bold text-teal font-mono mt-1">{m.delta}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gold/20 bg-card p-6">
              <div className="text-xs font-mono text-gold tracking-widest mb-4">HEAD-TO-HEAD: SGT RAMOS vs. COMP TITLES</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground">NOVEL</th>
                      <th className="text-center py-2 text-muted-foreground">FLESCH</th>
                      <th className="text-center py-2 text-muted-foreground">FK GRADE</th>
                      <th className="text-center py-2 text-muted-foreground">WORDS</th>
                      <th className="text-center py-2 text-muted-foreground">AWARDS</th>
                      <th className="text-center py-2 text-muted-foreground">COPIES</th>
                      <th className="text-center py-2 text-muted-foreground">SOURCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-teal/20 bg-teal/5">
                      <td className="py-3 font-bold text-teal">SGT George Ramos (2026)</td>
                      <td className="text-center font-black text-teal text-lg">74 ✓</td>
                      <td className="text-center text-teal">~5.0</td>
                      <td className="text-center font-bold text-teal">~248K ✓</td>
                      <td className="text-center text-muted-foreground text-[9px]">TBD</td>
                      <td className="text-center text-muted-foreground">TBD</td>
                      <td className="text-center text-teal text-[9px]">AutoCrit (VERIFIED)</td>
                    </tr>
                    {VERIFIED_BENCHMARKS.compTitles.map((c, i) => (
                      <tr key={i} className="border-b border-border hover:bg-secondary/20">
                        <td className="py-3 font-bold text-foreground">{c.title} ({c.year})</td>
                        <td className="text-center text-[9px] text-muted-foreground">{typeof c.flesch === "string" ? c.flesch.split("(")[0] : `~${c.flesch}`}</td>
                        <td className="text-center">{c.fkGrade}</td>
                        <td className="text-center text-[9px]">{c.words}</td>
                        <td className="text-center text-[8px]">{c.awards.split(";")[0]}</td>
                        <td className="text-center text-[9px]">{c.copies}</td>
                        <td className="text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] ${c.dataQuality === "SOURCED" ? "bg-teal/10 text-teal" : "bg-gold/10 text-gold"}`}>{c.dataQuality}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {[
                  {label:"READING MEASURE RANK — Lexile (sourced) where available; Flesch AutoCrit for SGT Ramos only",data:VERIFIED_BENCHMARKS.rankings.readability},
                  {label:"SCALE RANK (by word count / scope)",data:VERIFIED_BENCHMARKS.rankings.scale},
                ].map(r => (
                  <div key={r.label} className="bg-background rounded-lg border border-border p-4">
                    <div className="text-[10px] font-bold font-mono text-gold mb-2">{r.label}</div>
                    {r.data.map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 py-1 ${i === 0 ? "text-teal font-bold" : "text-muted-foreground"}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${i === 0 ? "bg-teal text-white" : "bg-secondary text-muted-foreground"}`}>{i+1}</span>
                        <span className="text-xs font-mono">{item}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="text-xs font-mono text-gold tracking-widest mb-4">KEY FINDINGS</div>
              <div className="space-y-3">
                {VERIFIED_BENCHMARKS.keyFindings.map(f => (
                  <div key={f.id} className={`rounded-lg border p-4 ${f.impact === "CRITICAL" ? "border-red/30 bg-red/5" : "border-border bg-background"}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{f.icon}</span>
                      <div>
                        <div className="text-xs font-bold font-mono text-foreground">{f.title}</div>
                        <div className="text-[11px] text-muted-foreground mt-1">{f.text}</div>
                      </div>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full ml-auto flex-shrink-0 ${f.impact === "HIGH" ? "bg-teal/10 text-teal" : f.impact === "CRITICAL" ? "bg-red/10 text-red" : "bg-gold/10 text-gold"}`}>{f.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-teal/20 bg-teal/5 p-4">
              <div className="text-[10px] font-mono text-teal font-bold mb-1">SOURCE DISCLOSURE — v6 Rebuilt (GG.pdf June 2026)</div>
              <div className="text-[9px] font-mono text-muted-foreground space-y-1">
                <div>✓ SGT Ramos metrics: AutoCrit (verified external instrument, report 3/31/26)</div>
                <div>✓ SGT Ramos word count: v6 wc -w canonical 247,863 (pre-dedup)</div>
                <div>✓ Things They Carried awards: Pulitzer Board (finalists); publisher; NEA · Lexile 880L: Wake County Library catalog</div>
                <div>✓ The Sympathizer awards: Pulitzer Board (pulitzer.org); Grove Atlantic; ALA · LC: PS3614.G97 S96 2015; LCCN 2015375327</div>
                <div>✓ Bless Me Ultima: Premio Quinto Sol — Publisher; NEA Big Read · Lexile 840L: LightSailed · Words ~69K: ReadingLength</div>
                <div>✓ Matterhorn awards: Publishers Weekly; Pritzker Mil. Library; Grove Atlantic</div>
                <div>~ Comp Flesch scores: ESTIMATED from grade-level conversion — NOT direct instrument measurement. Cross-instrument comparison invalid.</div>
                <div>⚠ Copy sales (Sympathizer 500K+, Matterhorn 250K+): UNVERIFIED — do not cite in agent materials without sourced figure.</div>
                <div>~ SGT Ramos LC/LCSH: MODELED by analogy to Sympathizer — needs cataloger confirmation before CIP packet.</div>
                <div className="text-teal font-bold pt-1">To make readability claim VERIFIED: run all five comps through AutoCrit (same instrument). Until then: "Flesch 74 (AutoCrit); comps pending same-instrument measurement."</div>
              </div>
            </div>
          </div>
        )}

        {/* SOURCE AUDIT */}
        {activeSection === "sourceaudit" && (
          <div className="space-y-8 animate-slide-up">
            <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-red/5 via-card to-teal/5 p-8">
              <div className="relative">
                <div className="text-[9px] font-mono text-gold tracking-widest mb-3">METRIC VERIFICATION AUDIT — {SOURCE_AUDIT.total} METRICS</div>
                <div className="text-3xl md:text-4xl font-black text-foreground font-mono leading-tight mb-1">SOURCE AUDIT</div>
                <div className="text-sm text-muted-foreground font-sans mb-2">Last audit: {SOURCE_AUDIT.lastAudit}</div>
                <div className="text-sm font-bold text-gold font-mono italic">"{SOURCE_AUDIT.principle}"</div>
              </div>
            </div>

            {[SOURCE_AUDIT.verified, SOURCE_AUDIT.partial, SOURCE_AUDIT.unverified, SOURCE_AUDIT.retired].map((section, si) => (
              <div key={si} className={`rounded-xl border bg-card p-6 border-${section.color}/20`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-2xl font-black font-mono text-${section.color}`}>{section.count}</span>
                  <div className={`text-xs font-bold font-mono text-${section.color}`}>{section.label}</div>
                </div>
                <div className="space-y-2">
                  {section.items.map((item, ii) => (
                    <div key={ii} className={`flex items-start gap-2 py-1.5 px-3 rounded text-[11px] font-mono ${
                      si === 0 ? "bg-teal/5 text-teal" : si === 1 ? "bg-gold/5 text-gold" : "bg-red/5 text-red"
                    }`}>
                      <span>{si === 0 ? "✓" : si === 1 ? "~" : "⚠"}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="text-xs font-mono text-gold tracking-widest mb-4">VALIDATION SOURCING PLAN</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {tier:"Tier 1 — Free",items:"Goodreads/Amazon reviews, AutoCrit on comp novels, professional reviews (Kirkus, PW, NYT)",cost:"$0",color:"teal"},
                  {tier:"Tier 2 — Low Cost",items:"Amazon MTurk at $0.25-$0.50/respondent. N=2,000 at $0.50 = ~$1,250 total.",cost:"$500-$1,500",color:"blue"},
                  {tier:"Tier 3 — Premium",items:"Prolific (academic 33.3% fee) or Qualtrics Panel ($5/respondent). For complex scoring.",cost:"$5K-$16K",color:"gold"},
                  {tier:"Tier 4 — Expert",items:"10 military historians + 20 Vietnam veterans + Publishers Marketplace + coverage services.",cost:"$2K-$5K",color:"purple"},
                ].map((t, i) => (
                  <div key={i} className={`rounded-lg border border-${t.color}/20 bg-background p-4`}>
                    <div className={`text-[10px] font-bold font-mono text-${t.color}`}>{t.tier}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{t.items}</div>
                    <div className={`text-sm font-black font-mono text-${t.color} mt-2`}>{t.cost}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-teal/20 bg-teal/5 p-4">
              <div className="text-[10px] font-mono text-teal font-bold mb-2">SPSS SAMPLE SIZE GUIDANCE (Published Literature)</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-[9px] font-mono">
                <div className="text-center"><div className="font-bold">200</div><div className="text-muted-foreground">Minimum</div></div>
                <div className="text-center"><div className="font-bold">300</div><div className="text-muted-foreground">Adequate</div></div>
                <div className="text-center"><div className="font-bold">500</div><div className="text-muted-foreground">Good (USC)</div></div>
                <div className="text-center"><div className="font-bold">1,000</div><div className="text-muted-foreground">Excellent</div></div>
                <div className="text-center"><div className="font-bold text-teal">2,000</div><div className="text-teal">AUMER TARGET</div></div>
              </div>
            </div>
          </div>
        )}

        {/* OVERVIEW */}
        {activeSection === "overview" && (
          <div className="space-y-8 animate-slide-up">
            <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 via-card to-teal/5 p-8">
              <div className="relative">
                <div className="text-[9px] font-mono text-gold tracking-widest mb-3">THE MATHEMATICAL CASE FOR THE MANUSCRIPT</div>
                <div className="text-3xl md:text-5xl font-black text-foreground font-mono leading-tight mb-1">SGT GEORGE RAMOS</div>
                <div className="text-lg text-muted-foreground font-sans mb-6">The Mathematics of Vietnam</div>
                <div className="font-mono text-sm text-foreground/80 bg-background/60 rounded-xl p-5 border border-border mb-6 leading-loose">
                  <span className="text-gold font-bold">Omega</span> = 71.443 + 0.124(<span className="text-purple font-bold">CLS 84.9</span>) + 0.118(<span className="text-orange font-bold">BIS 88.9</span>) + 0.089(<span className="text-cyan font-bold">SII 81.4</span>) + 0.067(<span className="text-blue font-bold">MRF 83.8</span>) = <span className="text-gold font-black text-2xl">104.94</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    {val:"45",label:"Chapters",color:"text-foreground"},
                    {val:"3",label:"Omega Elite",color:"text-gold"},
                    {val:"16",label:"Gold+",color:"text-gold"},
                    {val:"26",label:"Gold",color:"text-blue"},
                    {val:"82.2",label:"LSTE / 100",color:"text-teal"},
                  ].map(s => (
                    <div key={s.label} className="text-center bg-background/60 border border-border rounded-xl p-4">
                      <div className={`text-3xl font-black font-mono ${s.color}`}>{s.val}</div>
                      <div className="text-[9px] text-muted-foreground font-mono mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {label:"Publication Threshold",val:"82.2",note:"Above threshold by 7.2 pts",badge:"ABOVE",color:"teal"},
                {label:"Critical Theory Score",val:"87.4",note:"Deepens under scholarly scrutiny",badge:"HIGHEST",color:"gold"},
                {label:"War Lit Percentile",val:"97th",note:"Top 3% nationally",badge:"ELITE",color:"gold"},
              ].map(s => (
                <div key={s.label} className={`bg-card border border-${s.color}/30 rounded-xl p-5`}>
                  <div className={`text-4xl font-black font-mono text-${s.color}`}>{s.val}</div>
                  <div className="text-xs font-bold text-foreground mt-1">{s.label}</div>
                  <div className="text-[9px] text-muted-foreground mt-1 mb-2">{s.note}</div>
                  <div className={`text-[8px] font-bold font-mono px-2 py-0.5 inline-block rounded border border-${s.color}/30 bg-${s.color}/10 text-${s.color}`}>{s.badge}</div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-gold/20 rounded-xl p-6">
              <div className="text-[10px] font-bold font-mono text-gold mb-3">INDUSTRY FINDING - FIRST-MOVER ADVANTAGE</div>
              <p className="text-sm text-foreground font-sans leading-relaxed mb-3">
                No publisher currently has anything approaching LitCentral's architecture. This manuscript arrives with documentation the industry cannot produce internally.
                LitCentral scores behavioral vectors, cultural language authenticity, sensory immersion indices, and multi-register frequency
                metrics <span className="text-gold font-bold">no acquisition editor in 2026 has access to</span>.
              </p>
              <button onClick={() => setActiveSection("publishers")}
                className="flex items-center gap-1.5 text-xs font-mono text-gold hover:opacity-80 transition-opacity">
                View full publisher analytics audit <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SCENARIOS.map(s => (
                <div key={s.id} onClick={() => setActiveSection("scenarios")}
                  className={`cursor-pointer rounded-xl border ${s.borderColor} ${s.bgColor} p-5 hover:opacity-90 transition-all group relative`}>
                  {s.highlighted && <div className="absolute -top-2.5 left-4 text-[8px] font-bold font-mono text-gold border border-gold/40 bg-card px-2 py-0.5 rounded-full">TARGET</div>}
                  <div className={`text-[9px] font-bold font-mono text-${s.color} mb-1`}>{s.label}</div>
                  <div className={`text-2xl font-black font-mono text-${s.color}`}>
                    {s.id === "conservative" ? "$8K - $75K" : s.id === "base" ? "$75K - $250K" : "$250K - $750K+"}
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-1">{s.gate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCENARIOS */}
        {activeSection === "scenarios" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">THREE SCENARIOS — BASED ON WORKBOOK EXECUTION</div>
            {SCENARIOS.map(s => (
              <div key={s.id} className={`rounded-2xl border ${s.borderColor} ${s.bgColor} p-6 relative`}>
                {s.highlighted && <div className="absolute -top-3 left-6 text-[8px] font-bold font-mono text-gold border border-gold/40 bg-card px-3 py-1 rounded-full">TARGET OUTCOME</div>}
                <div className="mb-5">
                  <div className={`text-[9px] font-bold font-mono text-${s.color} mb-1`}>{s.label}</div>
                  <div className="text-xl font-black text-foreground font-mono">{s.gate}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.condition}</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {s.metrics.map((m, i) => (
                    <div key={i} className="bg-background/60 border border-border rounded-lg p-3">
                      <div className={`text-xl font-black font-mono text-${s.color}`}>{m.value}</div>
                      <div className="text-[9px] font-bold text-foreground mt-0.5">{m.label}</div>
                      <div className="text-[8px] text-muted-foreground">{m.unit}</div>
                    </div>
                  ))}
                </div>
                <div className={`text-[10px] bg-background/40 border border-${s.color}/20 rounded-lg px-3 py-2 text-${s.color}`}>{s.note}</div>
              </div>
            ))}
          </div>
        )}

        {/* TRAJECTORY */}
        {activeSection === "trajectory" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">MILESTONE TRAJECTORY</div>
            <div className="space-y-2">
              {MILESTONE_TRAJECTORY.map((m, i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-card border border-border hover:border-gold/20 transition-colors">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <span className="text-[10px] font-black font-mono text-gold">{i+1}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <div className="text-[11px] font-bold text-foreground">{m.milestone}</div>
                      <div className="text-[9px] text-gold font-mono mt-0.5">{m.month}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-muted-foreground font-mono mb-0.5">OMEGA / LSTE</div>
                      <div className="text-[10px] text-teal font-mono font-bold">{m.omega}</div>
                      <div className="text-[9px] text-blue mt-0.5">{m.lste}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-muted-foreground font-mono mb-0.5">FINANCIAL TRIGGER</div>
                      <div className="text-[10px] text-gold font-bold">{m.trigger}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PUBLISHERS */}
        {activeSection === "publishers" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">PUBLISHER INTELLIGENCE</div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/20">
                <div className="text-[10px] font-bold font-mono">INDUSTRY ANALYTICS AUDIT — What Publishers Actually Have</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-border text-[8px] text-muted-foreground font-mono">
                      <th className="text-left px-4 py-2">PUBLISHER</th>
                      <th className="text-left px-4 py-2">CAPABILITY</th>
                      <th className="text-left px-4 py-2">LITCENTRAL EQUIVALENT</th>
                      <th className="text-center px-4 py-2">VERDICT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ANALYTICS_AUDIT.map((a, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
                        <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">{a.publisher}</td>
                        <td className="px-4 py-3 text-muted-foreground max-w-xs">{a.capability}</td>
                        <td className="px-4 py-3 text-muted-foreground max-w-xs">{a.litcentralEq}</td>
                        <td className={`px-4 py-3 text-center font-black font-mono whitespace-nowrap ${a.verdictColor}`}>{a.verdict}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="space-y-3">
              {TARGET_PUBLISHERS.map((tier, i) => (
                <div key={i} className={`bg-card border border-${tier.color}/20 rounded-xl p-5`}>
                  <div className={`text-[9px] font-bold font-mono text-${tier.color} mb-3`}>{tier.tier}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {tier.publishers.map((p, j) => (
                      <div key={j} className="flex items-center gap-2 text-[10px] text-foreground">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 bg-${tier.color}`} />
                        {p}
                      </div>
                    ))}
                  </div>
                  <div className={`text-[9px] text-muted-foreground border-t border-${tier.color}/20 pt-2`}>{tier.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GRANTS */}
        {activeSection === "grants" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">GRANTS + FOUNDATION SUPPORT</div>
            {["TIER 1","TIER 2","TIER 3"].map(tier => (
              <div key={tier}>
                <div className={`text-[9px] font-bold font-mono mb-2 ${tier==="TIER 1"?"text-gold":tier==="TIER 2"?"text-blue":"text-purple"}`}>
                  {tier} — {tier==="TIER 1"?"MAJOR FELLOWSHIPS ($50K+)":tier==="TIER 2"?"AWARDS + MID-RANGE ($5K-$50K)":"FELLOWSHIPS + REGIONAL ($10K-$50K)"}
                </div>
                <div className="space-y-2">
                  {GRANTS.filter(g => g.tier === tier).map((g, i) => (
                    <div key={i} className={`bg-card border border-${g.color}/20 rounded-xl p-4`}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className={`text-xs font-black text-${g.color} font-mono`}>{g.name}</div>
                          <div className={`text-2xl font-black font-mono text-${g.color} mt-0.5`}>{g.amount}</div>
                        </div>
                        <div className={`text-[8px] font-bold font-mono px-2 py-1 rounded-full border border-${g.color}/30 bg-${g.color}/10 text-${g.color} flex-shrink-0`}>{g.alignment}</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] mb-3">
                        <div><div className="text-[8px] font-mono text-muted-foreground mb-0.5">ELIGIBILITY</div><div className="text-foreground">{g.eligibility}</div></div>
                        <div><div className="text-[8px] font-mono text-muted-foreground mb-0.5">DEADLINE</div><div className="text-foreground">{g.deadline}</div></div>
                      </div>
                      <div className={`text-[9px] bg-${g.color}/5 border border-${g.color}/20 rounded-lg px-3 py-2 text-foreground/80`}>
                        <span className={`font-bold text-${g.color}`}>ACTION: </span>{g.action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REVENUE */}
        {activeSection === "revenue" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">REVENUE MODEL — TRADITIONAL PATH</div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-border text-[8px] text-muted-foreground font-mono">
                      <th className="text-left px-4 py-2">STREAM</th>
                      <th className="text-right px-4 py-2">CONSERVATIVE</th>
                      <th className="text-right px-4 py-2">BASE CASE</th>
                      <th className="text-right px-4 py-2">OPTIMISTIC</th>
                      <th className="text-left px-4 py-2">TIMING</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REVENUE_MODEL.map((r, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
                        <td className={`px-4 py-3 font-bold text-${r.color}`}>{r.stream}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground font-mono">{r.low}</td>
                        <td className={`px-4 py-3 text-right font-black font-mono text-${r.color}`}>{r.mid}</td>
                        <td className="px-4 py-3 text-right text-teal font-mono font-bold">{r.high}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.timing}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gold/30 bg-gold/5">
                      <td className="px-4 py-3 font-black text-gold font-mono">TOTAL (excl. LitCentral SaaS)</td>
                      <td className="px-4 py-3 text-right font-black text-blue font-mono">~$116K</td>
                      <td className="px-4 py-3 text-right font-black text-gold font-mono">~$477K</td>
                      <td className="px-4 py-3 text-right font-black text-teal font-mono">~$1.46M+</td>
                      <td className="px-4 py-3 text-[8px] text-muted-foreground font-mono">5-year cumulative</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SELF-PUB */}
        {activeSection === "selfpub" && (
          <div className="space-y-8 animate-slide-up">
            <div>
              <div className="text-xl font-black text-foreground font-mono mb-1">SCENARIO D — SELF-PUBLISHING COMMAND CENTER</div>
              <div className="text-xs text-muted-foreground">Author-led distribution using AUMER Foundation + TruthEngine360 + StrComm Plan. Full rights retained.</div>
            </div>
            <div className="bg-gradient-to-br from-gold/10 via-card to-teal/5 border border-gold/30 rounded-xl p-6">
              <div className="text-[10px] font-bold font-mono text-gold mb-3">WHY SELF-PUBLISHING IS VIABLE — ASSETS GABRIEL ALREADY HAS</div>
              <p className="text-sm text-foreground font-sans leading-relaxed mb-4">
                Most authors self-publish without infrastructure. Gabriel is not most authors.
                The <span className="text-gold font-bold">reverse marketing strategy:</span> TruthEngine360 is the funnel.
                DCAS coverage is the earned media. The book is the product that converts attention into revenue.
                This is not self-publishing as a fallback. This is <span className="text-teal font-bold">self-publishing as a strategic choice</span> to retain rights and revenue.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {SELFPUB_ASSETS.map(a => (
                  <div key={a.n} className={`flex gap-3 p-3 rounded-lg bg-${a.color}/5 border border-${a.color}/20`}>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-${a.color}/20 border border-${a.color}/40 flex items-center justify-center text-[9px] font-black font-mono text-${a.color}`}>{a.n}</div>
                    <div>
                      <div className={`text-[10px] font-bold text-${a.color} font-mono`}>{a.asset}</div>
                      <div className="text-[9px] text-foreground/70 font-sans mt-0.5">{a.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/20">
                <div className="text-[10px] font-bold font-mono">UNIT ECONOMICS — SELF-PUB vs. TRADITIONAL PER COPY</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-border text-[8px] text-muted-foreground font-mono">
                      <th className="text-left px-4 py-2">FORMAT</th>
                      <th className="text-right px-4 py-2">RETAIL</th>
                      <th className="text-right px-4 py-2">SELF-PUB ROYALTY</th>
                      <th className="text-right px-4 py-2">SELF-PUB NET</th>
                      <th className="text-right px-4 py-2">TRAD ROYALTY</th>
                      <th className="text-right px-4 py-2">TRAD NET</th>
                      <th className="text-center px-4 py-2">ADVANTAGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UNIT_ECONOMICS.map((r, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
                        <td className="px-4 py-3 font-bold text-foreground">{r.format}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground font-mono">{r.retail}</td>
                        <td className="px-4 py-3 text-right text-teal font-mono font-bold">{r.selfRoyalty}</td>
                        <td className="px-4 py-3 text-right text-teal font-mono font-black">{r.selfNet}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground font-mono">{r.tradRoyalty}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground font-mono">{r.tradNet}</td>
                        <td className="px-4 py-3 text-center font-black text-gold font-mono text-[9px]">{r.advantage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SELFPUB_SCENARIOS.map(s => (
                <div key={s.id} className={`rounded-xl border border-${s.color}/30 bg-${s.color}/5 p-5 relative`}>
                  {s.highlighted && <div className="absolute -top-2.5 left-4 text-[8px] font-bold font-mono text-gold border border-gold/40 bg-card px-2 py-0.5 rounded-full">TARGET</div>}
                  <div className={`text-[9px] font-bold font-mono text-${s.color} mb-2`}>{s.label}</div>
                  <div className="text-[9px] text-muted-foreground font-sans mb-4">{s.assumption}</div>
                  <div className="space-y-1.5">
                    {[{label:"Year 1",val:s.yr1},{label:"Year 2",val:s.yr2},{label:"Yrs 3-5",val:s.yr35}].map(m => (
                      <div key={m.label} className="flex items-center justify-between">
                        <span className="text-[9px] text-muted-foreground font-mono">{m.label}</span>
                        <span className={`text-[11px] font-black font-mono text-${s.color}`}>{m.val}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-border mt-2 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-muted-foreground font-mono">5-YR TOTAL</span>
                      <span className={`text-sm font-black font-mono text-${s.color}`}>{s.total}</span>
                    </div>
                    <div className="text-[8px] text-muted-foreground font-mono pt-1">Upfront: {s.upfront}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRAD VS SELF */}
        {activeSection === "tradvsself" && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <div className="text-xl font-black text-foreground font-mono mb-1">TRADITIONAL vs. SELF-PUBLISHING</div>
              <div className="text-xs text-muted-foreground">Side-by-side decision matrix across 10 dimensions</div>
            </div>
            <div className="space-y-2">
              {TRAD_VS_SELF.map((r, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-gold/20 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
                    <div>
                      <div className="text-[9px] font-bold font-mono text-muted-foreground mb-1">DIMENSION</div>
                      <div className="text-xs font-black text-foreground">{r.dim}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground mb-1">TRADITIONAL</div>
                      <div className="text-[10px] text-foreground/80">{r.trad}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground mb-1">SELF-PUB (AUMER)</div>
                      <div className="text-[10px] text-foreground/80">{r.self}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground mb-1">WINNER</div>
                      <div className={`text-[10px] font-black font-mono ${r.winColor}`}>{r.winner}</div>
                      <div className="text-[8px] text-muted-foreground mt-1">{r.why}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STRCOMM */}
        {activeSection === "strcomm" && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <div className="text-xl font-black text-foreground font-mono mb-1">STRATEGIC COMMUNICATION PLAN</div>
              <div className="text-xs text-muted-foreground">GCD-Triggered, 18-Month, 5-Phase — Version 1.0 April 2026 — Already Built</div>
            </div>
            <div className="bg-gold/5 border border-gold/30 rounded-xl p-5">
              <div className="text-[10px] font-bold font-mono text-gold mb-2">KEY INSIGHT</div>
              <p className="text-sm text-foreground font-sans leading-relaxed">
                The StrComm Plan already exists. It is not aspirational. It is a built, versioned, 18-month execution document.
                The financial projections below map revenue events directly against each phase gate.
                <span className="text-gold font-bold"> No traditional publisher provides a communication plan of this sophistication.</span>
              </p>
            </div>
            <div className="space-y-3">
              {STRCOMM_PHASES.map((ph, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-gold/20 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <span className="text-[10px] font-black font-mono text-gold">{i+1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-xs font-black text-gold font-mono">PHASE {ph.phase}</div>
                        <div className="text-[9px] font-mono text-muted-foreground border border-border px-2 py-0.5 rounded-full">{ph.window}</div>
                      </div>
                      <div className="text-[9px] text-muted-foreground mb-3">{ph.criteria}</div>
                      <div className="text-[9px] text-foreground/80 bg-secondary/20 rounded-lg px-3 py-2 mb-3">
                        <span className="text-gold font-bold">Revenue events: </span>{ph.events}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-teal/5 border border-teal/20 rounded-lg p-2">
                          <div className="text-[8px] font-mono text-teal mb-0.5">SELF-PUB REVENUE</div>
                          <div className="text-[11px] font-black text-teal font-mono">{ph.selfPub}</div>
                        </div>
                        <div className="bg-blue/5 border border-blue/20 rounded-lg p-2">
                          <div className="text-[8px] font-mono text-blue mb-0.5">TRADITIONAL EQUIV.</div>
                          <div className="text-[11px] font-black text-blue font-mono">{ph.trad}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALL SCENARIOS */}
        {activeSection === "allscenarios" && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <div className="text-xl font-black text-foreground font-mono mb-1">ALL SCENARIOS — MASTER COMPARISON</div>
              <div className="text-xs text-muted-foreground">Traditional (A/B/C) vs. Self-Publishing (D1/D2/D3) vs. Hybrid (E) — Gabriel's full option landscape</div>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-border text-[8px] text-muted-foreground font-mono">
                      <th className="text-left px-4 py-2">SCENARIO</th>
                      <th className="text-center px-4 py-2">TYPE</th>
                      <th className="text-right px-4 py-2">ADVANCE</th>
                      <th className="text-right px-4 py-2">YR 1</th>
                      <th className="text-right px-4 py-2">YR 2</th>
                      <th className="text-right px-4 py-2">YRS 3-5</th>
                      <th className="text-right px-4 py-2 font-black">5-YR TOTAL</th>
                      <th className="text-left px-4 py-2">KEY DEPENDENCY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALL_SCENARIOS_MASTER.map((r, i) => (
                      <tr key={i} className={`border-b border-border/30 hover:bg-secondary/10 ${r.highlight ? "bg-gold/5" : ""}`}>
                        <td className={`px-4 py-3 font-black font-mono text-${r.color}`}>{r.scenario}</td>
                        <td className="px-4 py-3 text-center text-muted-foreground whitespace-nowrap">{r.type}</td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground whitespace-nowrap">{r.advance}</td>
                        <td className="px-4 py-3 text-right font-mono text-foreground whitespace-nowrap">{r.yr1}</td>
                        <td className="px-4 py-3 text-right font-mono text-foreground whitespace-nowrap">{r.yr2}</td>
                        <td className="px-4 py-3 text-right font-mono text-foreground whitespace-nowrap">{r.yr35}</td>
                        <td className={`px-4 py-3 text-right font-black font-mono whitespace-nowrap text-${r.color}`}>{r.total}</td>
                        <td className="px-4 py-3 text-muted-foreground max-w-xs text-[9px]">{r.dep}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {label:"Best Traditional Outcome",val:"$790K - $3.15M+",note:"C Optimistic — requires Pulitzer/NBA + adaptation",color:"gold"},
                {label:"Best Self-Pub Outcome",val:"$2.5M - $9M+",note:"D3 Optimistic — full StrComm + rights retained",color:"teal"},
                {label:"Recommended Path (Base)",val:"D2 then E",note:"Self-pub base with hybrid door open after award run",color:"purple"},
              ].map(c => (
                <div key={c.label} className={`bg-card border border-${c.color}/30 rounded-xl p-5`}>
                  <div className={`text-2xl font-black font-mono text-${c.color}`}>{c.val}</div>
                  <div className="text-xs font-bold text-foreground mt-1">{c.label}</div>
                  <div className="text-[9px] text-muted-foreground mt-1">{c.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GANTT */}
        {activeSection === "gantt" && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <div className="text-xl font-black text-foreground font-mono mb-1">18-MONTH CAMPAIGN GANTT TRACKER</div>
              <div className="text-xs text-muted-foreground">GCD Feb 15, 2026 → Aug 2027 | 5 Phases | Hispanic Heritage Month + Veterans Day launch corridor</div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-2">
              {[{label:"Sep-Nov 2026",note:"Launch Corridor",color:"gold"},{label:"BEI Target",note:"46/100 Month 18",color:"teal"},{label:"SOV Target",note:"5% niche",color:"blue"},{label:"Market Share",note:"0.42% niche cat.",color:"purple"},{label:"Partners",note:"35 active M18",color:"orange"}].map(s => (
                <div key={s.label} className={`bg-card border border-${s.color}/30 rounded-xl p-3 text-center`}>
                  <div className={`text-sm font-black font-mono text-${s.color}`}>{s.label}</div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">{s.note}</div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl overflow-x-auto">
              <table className="text-[8px] font-mono w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-3 py-2 text-muted-foreground w-16">PHASE</th>
                    <th className="text-left px-3 py-2 text-muted-foreground min-w-[180px]">WORKSTREAM</th>
                    <th className="text-left px-3 py-2 text-muted-foreground">OWNER</th>
                    <th className="text-center px-2 py-2 text-muted-foreground">P</th>
                    {MONTHS_LABELS.map(m => (
                      <th key={m} className={`text-center px-1 py-2 text-muted-foreground whitespace-nowrap ${m.includes("Sep") || m.includes("Oct") || m.includes("Nov") ? "text-gold font-bold" : ""}`}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {GANTT_ROWS.map((row, i) => {
                    const prevPhase = i > 0 ? GANTT_ROWS[i-1].phase : null;
                    const phaseColors = {FOUNDATION:"text-blue","BRAND BUILD":"text-purple",SEEDING:"text-teal",LAUNCH:"text-gold",EXPANSION:"text-orange"};
                    return (
                      <>
                        {prevPhase !== row.phase && (
                          <tr key={`ph-${row.phase}`} className="border-t border-border/50">
                            <td colSpan={22} className={`px-3 py-1 text-[8px] font-black ${phaseColors[row.phase]} bg-secondary/20`}>{row.phase}</td>
                          </tr>
                        )}
                        <tr key={i} className="border-b border-border/20 hover:bg-secondary/10">
                          <td className="px-3 py-1.5" />
                          <td className="px-3 py-1.5 text-foreground/90">{row.task}</td>
                          <td className="px-3 py-1.5 text-muted-foreground whitespace-nowrap">{row.owner}</td>
                          <td className={`px-2 py-1.5 text-center font-bold ${row.priority==="P0"?"text-red":row.priority==="P1"?"text-gold":"text-blue"}`}>{row.priority}</td>
                          {row.months.map((active, mi) => (
                            <td key={mi} className={`px-1 py-1.5 text-center ${mi >= 7 && mi <= 9 ? "bg-gold/5" : ""}`}>
                              {active ? <span className={`inline-block w-4 h-2 rounded-sm ${phaseColors[row.phase]?.replace("text-","bg-")}`} /> : null}
                            </td>
                          ))}
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="text-[9px] font-mono text-muted-foreground">Gold columns = Sep-Nov 2026 launch corridor (Hispanic Heritage Month + Veterans Day)</div>
          </div>
        )}

        {/* KPI SCORECARD */}
        {activeSection === "kpi" && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <div className="text-xl font-black text-foreground font-mono mb-1">KPI SCORECARD — Live Tracking Dashboard</div>
              <div className="text-xs text-muted-foreground">Update monthly. Data sources in right column. Baseline = May 23, 2026.</div>
            </div>
            {["Brand Equity","Reach","Engagement","Conversion","Market Share","Institutional"].map(fam => (
              <div key={fam}>
                <div className="text-[9px] font-bold font-mono text-gold mb-2">{fam.toUpperCase()}</div>
                <div className="bg-card border border-border rounded-xl overflow-x-auto">
                  <table className="w-full text-[10px]">
                    <thead><tr className="border-b border-border bg-secondary/20 text-[8px] font-mono text-muted-foreground">
                      <th className="text-left px-3 py-2">METRIC</th>
                      <th className="text-center px-3 py-2">BASELINE</th>
                      <th className="text-center px-3 py-2 text-blue">M3</th>
                      <th className="text-center px-3 py-2 text-teal">M6</th>
                      <th className="text-center px-3 py-2 text-gold">M12</th>
                      <th className="text-center px-3 py-2 text-gold font-black">M18</th>
                      <th className="text-left px-3 py-2">DATA SOURCE</th>
                    </tr></thead>
                    <tbody>
                      {KPI_SCORECARD_DATA.filter(k => k.family === fam).map((k, i) => (
                        <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
                          <td className="px-3 py-2.5 font-bold text-foreground">{k.metric}</td>
                          <td className="px-3 py-2.5 text-center text-muted-foreground font-mono">{k.baseline}</td>
                          <td className="px-3 py-2.5 text-center text-blue font-mono">{k.m3}</td>
                          <td className="px-3 py-2.5 text-center text-teal font-mono">{k.m6}</td>
                          <td className="px-3 py-2.5 text-center text-gold font-mono">{k.m12}</td>
                          <td className="px-3 py-2.5 text-center text-gold font-black font-mono">{k.m18}</td>
                          <td className="px-3 py-2.5 text-muted-foreground text-[9px]">{k.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BUDGET */}
        {activeSection === "budget" && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <div className="text-xl font-black text-foreground font-mono mb-1">BUDGET PLANNER — 3 Scenarios</div>
              <div className="text-xs text-muted-foreground">Standard = Recommended Operating Model. These are planning scaffolds, not quotes.</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BUDGET_DATA.map((b, i) => (
                <div key={i} className={`rounded-xl border p-5 ${b.recommended ? "border-gold/40 bg-gold/5" : "border-border bg-card"} relative`}>
                  {b.recommended && <div className="absolute -top-2.5 left-4 text-[8px] font-bold font-mono text-gold border border-gold/40 bg-card px-2 py-0.5 rounded-full">RECOMMENDED</div>}
                  <div className={`text-[9px] font-bold font-mono mb-1 ${b.recommended ? "text-gold" : "text-muted-foreground"}`}>{b.scenario}</div>
                  <div className={`text-2xl font-black font-mono mb-3 ${b.recommended ? "text-gold" : "text-foreground"}`}>{b.range}</div>
                  <div className="space-y-2 text-[10px]">
                    <div><div className="text-[8px] font-mono text-muted-foreground mb-0.5">STAFFING MODEL</div><div className="text-foreground/80">{b.staffing}</div></div>
                    <div><div className="text-[8px] font-mono text-muted-foreground mb-0.5">DISTRIBUTION</div><div className="text-foreground/80">{b.distribution}</div></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/20">
                <div className="text-[10px] font-bold font-mono">BUDGET BUCKET BREAKDOWN — Allocation Guides (% of total)</div>
              </div>
              <div className="divide-y divide-border/30">
                {BUDGET_BUCKETS.map((b, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/10">
                    <div className="flex-1 text-[10px] font-bold text-foreground">{b.bucket}</div>
                    <div className="text-sm font-black font-mono text-gold flex-shrink-0 w-24 text-right">{b.share}</div>
                    <div className="text-[9px] text-muted-foreground flex-1">{b.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PERSONAS */}
        {activeSection === "personas" && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <div className="text-xl font-black text-foreground font-mono mb-1">AUDIENCE PERSONAS + CHANNEL STRATEGY</div>
              <div className="text-xs text-muted-foreground">5 primary segments. Language strategy: English-first with selective Spanish adaptation — NOT every-post bilingual duplication.</div>
            </div>
            <div className="space-y-4">
              {PERSONAS.map((p, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-gold/20 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="text-sm font-black text-gold font-mono">{p.persona}</div>
                    <span className="text-[8px] font-mono text-muted-foreground border border-border px-2 py-0.5 rounded">{p.phase}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px]">
                    <div><div className="text-[8px] font-mono text-muted-foreground mb-1">DEMOGRAPHICS</div><div className="text-foreground/80">{p.demo}</div></div>
                    <div><div className="text-[8px] font-mono text-muted-foreground mb-1">PSYCHOGRAPHICS</div><div className="text-foreground/80">{p.psycho}</div></div>
                    <div><div className="text-[8px] font-mono text-muted-foreground mb-1">WHAT MOVES THEM</div><div className="text-foreground/80">{p.moves}</div></div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                    <div className="bg-secondary/20 rounded-lg px-3 py-2"><span className="text-[8px] font-mono text-blue font-bold">CHANNELS: </span>{p.channels}</div>
                    <div className="bg-secondary/20 rounded-lg px-3 py-2"><span className="text-[8px] font-mono text-teal font-bold">FORMAT: </span>{p.format}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INFLUENCERS */}
        {activeSection === "influencers" && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <div className="text-xl font-black text-foreground font-mono mb-1">INFLUENCER TRACKER</div>
              <div className="text-xs text-muted-foreground">Fit Scores, Compensation, Status, Activation Timeline. Rule: do not pay the highest price for the lowest trust.</div>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead><tr className="border-b border-border bg-secondary/20 text-[8px] font-mono text-muted-foreground">
                  <th className="text-left px-3 py-2">#</th>
                  <th className="text-left px-3 py-2">HANDLE</th>
                  <th className="text-left px-3 py-2">NAME</th>
                  <th className="text-left px-3 py-2">FOLLOWERS</th>
                  <th className="text-center px-3 py-2">FIT</th>
                  <th className="text-left px-3 py-2">PLATFORM</th>
                  <th className="text-left px-3 py-2">TIER</th>
                  <th className="text-left px-3 py-2">COMP MODEL</th>
                  <th className="text-left px-3 py-2">EST. COST</th>
                  <th className="text-left px-3 py-2">PHASE</th>
                  <th className="text-left px-3 py-2 max-w-xs">ROLE IN CAMPAIGN</th>
                </tr></thead>
                <tbody>
                  {INFLUENCERS.map((inf, i) => (
                    <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
                      <td className="px-3 py-2.5 text-muted-foreground font-mono">{inf.n}</td>
                      <td className="px-3 py-2.5 font-bold text-teal font-mono">{inf.handle}</td>
                      <td className="px-3 py-2.5 font-bold text-foreground whitespace-nowrap">{inf.name}</td>
                      <td className="px-3 py-2.5 text-muted-foreground font-mono">{inf.followers}</td>
                      <td className={`px-3 py-2.5 text-center font-black font-mono ${inf.fit >= 80 ? "text-gold" : inf.fit >= 70 ? "text-blue" : "text-muted-foreground"}`}>{inf.fit}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{inf.platform}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{inf.tier}</td>
                      <td className="px-3 py-2.5 text-foreground/80">{inf.comp}</td>
                      <td className="px-3 py-2.5 text-teal font-mono font-bold whitespace-nowrap">{inf.est}</td>
                      <td className="px-3 py-2.5 text-gold font-mono">{inf.phase}</td>
                      <td className="px-3 py-2.5 text-foreground/70 max-w-xs">{inf.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div className="text-[10px] font-bold font-mono text-gold mb-3">COMPENSATION FRAMEWORK — Match to Role, Not Follower Count</div>
              <div className="space-y-2">
                {COMP_FRAMEWORK.map((c, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-gold/20 transition-all">
                    <div className="text-[11px] font-bold text-gold font-mono mb-2">{c.model}</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[9px]">
                      <div><div className="text-[8px] font-mono text-muted-foreground mb-0.5">BEST FIT</div><div className="text-foreground/80">{c.fit}</div></div>
                      <div><div className="text-[8px] font-mono text-muted-foreground mb-0.5">COMPENSATION</div><div className="text-teal font-bold">{c.comp}</div></div>
                      <div><div className="text-[8px] font-mono text-muted-foreground mb-0.5">GUARDRAILS</div><div className="text-foreground/70">{c.guardrails}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CALENDAR */}
        {activeSection === "calendar" && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <div className="text-xl font-black text-foreground font-mono mb-1">6-MONTH EDITORIAL CALENDAR</div>
              <div className="text-xs text-muted-foreground">Feb-Jul 2026 | Foundation through Seeding Window</div>
            </div>
            <div className="space-y-3">
              {CONTENT_CAL.map((m, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-gold/20 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gold/10 border border-gold/30 flex flex-col items-center justify-center">
                      <div className="text-sm font-black font-mono text-gold leading-none">{m.month.split(" ")[0]}</div>
                      <div className="text-[9px] font-mono text-muted-foreground">{m.month.split(" ")[1]}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-black text-gold font-mono mb-2">{m.focus}</div>
                      <div className="text-[10px] text-foreground/80 mb-3">{m.hero}</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[9px]">
                        <div className="bg-secondary/20 rounded-lg px-2 py-1.5"><span className="font-bold text-teal">CADENCE: </span>{m.cadence}</div>
                        <div className="bg-secondary/20 rounded-lg px-2 py-1.5"><span className="font-bold text-blue">KPI: </span>{m.kpi}</div>
                        <div className="bg-secondary/20 rounded-lg px-2 py-1.5"><span className="font-bold text-purple">PERSONA: </span>{m.persona}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RISK */}
        {activeSection === "risk" && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <div className="text-xl font-black text-foreground font-mono mb-1">RISK REGISTER — Campaign Governance + Compliance</div>
              <div className="text-xs text-muted-foreground">6 Non-Negotiables + active risk matrix. Compliance is a design input, not a cleanup task.</div>
            </div>
            <div className="bg-red/5 border border-red/20 rounded-xl p-5">
              <div className="text-[10px] font-bold font-mono text-red mb-2">NON-NEGOTIABLE GOVERNANCE RULES (NN-1 through NN-6)</div>
              <div className="space-y-2">
                {RISK_REGISTER.filter(r => r.id.startsWith("NN")).map((r, i) => (
                  <div key={i} className="flex items-start gap-3 text-[10px]">
                    <span className="text-[9px] font-bold font-mono text-red flex-shrink-0 w-10">{r.id}</span>
                    <div className="flex-1">
                      <span className="font-bold text-foreground">{r.cat}: </span>
                      <span className="text-foreground/80">{r.rule}</span>
                    </div>
                    <div className="text-[9px] text-muted-foreground max-w-[220px] flex-shrink-0">{r.mitigation}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/20">
                <div className="text-[10px] font-bold font-mono">ACTIVE RISK MATRIX</div>
              </div>
              {RISK_REGISTER.filter(r => r.id.startsWith("R-")).map((r, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-3 border-b border-border/30 hover:bg-secondary/10 last:border-0">
                  <span className="text-[9px] font-bold font-mono text-muted-foreground w-8 flex-shrink-0">{r.id}</span>
                  <div className="w-24 flex-shrink-0">
                    <div className="text-[9px] font-bold text-foreground">{r.cat}</div>
                    <span className={`text-[8px] font-mono ${r.severity==="HIGH"?"text-red":"text-gold"}`}>{r.severity}</span>
                  </div>
                  <div className="flex-1 text-[10px] text-foreground/80">{r.rule}</div>
                  <div className="text-[9px] text-muted-foreground max-w-[200px] flex-shrink-0">{r.mitigation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BRAND EQUITY */}
        {activeSection === "brandequity" && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <div className="text-xl font-black text-foreground font-mono mb-1">BRAND EQUITY SCORECARD</div>
              <div className="text-xs text-muted-foreground">Keller CBBE Framework — Quarterly Tracking + Competitive Radar | BEI Target: 46/100 by Month 18</div>
            </div>
            <div className="bg-gold/5 border border-gold/30 rounded-xl p-5">
              <div className="text-[10px] font-bold font-mono text-gold mb-3">CBBE PYRAMID — Building Brand Equity Layer by Layer</div>
              <div className="space-y-2">
                {CBBE_LEVELS.map((l, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 bg-background/60 rounded-lg border border-border hover:border-gold/20 transition-all">
                    <div className="flex-shrink-0 w-32">
                      <div className={`text-[9px] font-bold font-mono ${i === 0 ? "text-gold" : i <= 2 ? "text-teal" : i <= 4 ? "text-blue" : "text-muted-foreground"}`}>{l.level}</div>
                      <div className="text-[8px] font-mono text-muted-foreground mt-0.5">{l.buildPhase}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[9px] font-bold text-foreground mb-1">{l.dims}</div>
                      <div className="text-[9px] text-muted-foreground">{l.proxies}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {scenario:"WORST",bei:28,sov:"1.5%",share:"0.12%",color:"red",desc:"Delayed metadata cleanup, low creator fit, weak earned media"},
                {scenario:"LIKELY",bei:46,sov:"5%",share:"0.42%",color:"gold",desc:"Competent execution, moderate paid support, 1-2 earned media spikes"},
                {scenario:"BEST",bei:60,sov:"9%",share:"1.05%",color:"teal",desc:"Breakout creator resonance, high-quality earned media, strong institutional adoption"},
              ].map(s => (
                <div key={s.scenario} className={`bg-card border border-${s.color}/30 rounded-xl p-5`}>
                  <div className={`text-[9px] font-bold font-mono text-${s.color} mb-2`}>{s.scenario} — Month 18</div>
                  <div className="space-y-2">
                    {[{label:"BEI",val:String(s.bei)},{label:"SOV",val:s.sov},{label:"Niche Share",val:s.share}].map(m => (
                      <div key={m.label} className="flex items-center justify-between">
                        <span className="text-[9px] text-muted-foreground font-mono">{m.label}</span>
                        <span className={`text-lg font-black font-mono text-${s.color}`}>{m.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-3 pt-3 border-t border-border/50">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}