/* ============================================================
   ANDREW'S LAYER: your notes, kept separate from the core 100.
   - av:    "Andrew's version" attached to a traditional drink
   - match: your notes agree with the traditional spec
   - src:'andrew' drinks: your originals / riffs (your spec is the main spec)
   - said:  your line as written in "Cocktail Notes, Organized"
   - flags: things marked [?] or listed under "Needs your check"
   Bare numbers in your notes are treated as oz. Ranges use {to:x}; the calculator uses the midpoint.
   ============================================================ */
(function (root) {
var DATA = root.CC_DATA, ING = DATA.ING, TECH = DATA.TECH, D = DATA.DRINKS;
function byId(id) { for (var i = 0; i < D.length; i++) if (D[i].id === id) return D[i]; }

/* ---------- ingredients from your notes ---------- */
var NEW = {
  ryebib:{n:'Rye whiskey (50% ABV)',abv:.50,t:'spirit'},
  mellowcorn:{n:'Mellow Corn whisky',abv:.50,t:'spirit'},
  botanivore:{n:'St. George Botanivore gin',abv:.45,t:'spirit'},
  rum:{n:'Rum',abv:.40,t:'spirit'},
  threestars:{n:'Plantation (now Planteray) 3 Stars white rum',abv:.41,t:'spirit'},
  oftd:{n:'Plantation (now Planteray) O.F.T.D. overproof rum',abv:.69,t:'spirit'},
  plantation5:{n:'Plantation (now Planteray) 5 Year rum',abv:.40,t:'spirit'},
  strawrum:{n:'Strawberry-infused white rum',abv:.38,sug:.01,t:'spirit',prep:'strawberry-rum'},
  pinerum:{n:'Pineapple rum',abv:.40,sug:.02,t:'spirit',prep:'pineapple-rum'},
  pineoftd:{n:'Pineapple-soaked O.F.T.D.',abv:.60,sug:.03,t:'spirit',prep:'pineapple-rum'},
  bacardiinf:{n:'Bacardi, infused',abv:.40,t:'spirit',prep:'infused-bacardi'},
  sake:{n:'Sake',abv:.15,sug:.02,acid:.002,t:'wine'},
  spicedpear:{n:'St. George Spiced Pear liqueur',abv:.20,sug:.20,t:'liqueur'},
  lofi:{n:'Lo-Fi Gentian Amaro',abv:.175,sug:.12,t:'liqueur'},
  triplesec:{n:'Triple sec',abv:.30,sug:.28,t:'liqueur'},
  mrblack:{n:'Mr Black coffee liqueur',abv:.25,sug:.25,t:'liqueur'},
  licor43:{n:'Licor 43',abv:.31,sug:.33,t:'liqueur'},
  bananaliq:{n:'Banana liqueur',abv:.25,sug:.30,t:'liqueur'},
  midori:{n:'Midori',abv:.20,sug:.30,t:'liqueur'},
  chocbitters:{n:'Chocolate bitters',abv:.40,t:'bitters'},
  mintextract:{n:'Mint extract',abv:.80,t:'bitters'},
  carrot:{n:'Carrot juice',sug:.04,acid:.002,t:'juice'},
  olivebrine:{n:'Olive brine',t:'juice'},
  passionpuree:{n:'Passion fruit purée',sug:.12,acid:.03,t:'juice'},
  superlime:{n:'Lime super juice',sug:.005,acid:.06,t:'juice',prep:'super-juice'},
  coffee:{n:'Strong coffee',t:'juice'},
  water:{n:'Water',t:'mixer'},
  heavycream:{n:'Heavy cream',sug:.03,t:'other'},
  raspberrysyrup:{n:'Raspberry simple syrup',sug:.60,acid:.005,t:'syrup',prep:'raspberry-syrup'},
  cinnamonsyrup:{n:'Cinnamon syrup',sug:.615,t:'syrup',prep:'cinnamon-syrup'},
  greenteasyrup:{n:'Green tea syrup',sug:.615,t:'syrup',prep:'green-tea-syrup'},
  rosemarysyrup:{n:'Rosemary syrup',sug:.615,t:'syrup',prep:'rosemary-syrup'},
  tomatosyrup:{n:'Salted tomato syrup',sug:.50,acid:.003,t:'syrup',prep:'salted-tomato-syrup'},
  cherrysyrup:{n:'Cherry syrup',sug:.60,t:'syrup',prep:'cherry-syrup'},
  bananaoleo:{n:'Banana oleo',sug:.80,t:'syrup',prep:'banana-oleo'},
  agavenectar:{n:'Agave nectar',sug:.95,t:'syrup'},
  mojitocordial:{n:'Mojito cordial',sug:.33,acid:.019,t:'syrup',prep:'mojito-cordial'},
  gingercoin:{n:'Fresh ginger coins, muddled',t:'solid'},
  fennel:{n:'Ground fennel',t:'solid'},
  olives:{n:'Olives',t:'solid'},
  oliveoil:{n:'Olive oil beads',t:'solid'},
  orangepeel:{n:'Orange peel (shaken in)',t:'solid'},
  nutmeg:{n:'Grated nutmeg',t:'solid'},
  amaro:{n:'Gentian amaro',t:'liqueur',abv:.175,sug:.12}
};
for (var k in NEW) ING[k] = NEW[k];
// link existing ingredients to your prep pages
ING.honey.prep = 'honey-syrup'; ING.orgeat.prep = 'orgeat'; ING.simple.prep = 'simple-syrup';
ING.coffeeliqueur.prep = 'coffee-liqueur';

/* ---------- Andrew's versions of drinks already in the 100 ---------- */
var AV = {
  'whiskey-sour': { said:'2oz bourbon; 3/4oz simple syrup; 1oz lemon juice; 1 egg white', av:{ m:'dryshake', tech:['dry-shake','shake'],
    spec:[[2,'oz','bourbon'],[0.75,'oz','simple'],[1,'oz','lemon'],[1,'white','eggwhite']] } },
  'clover-club': { said:'1.5oz gin; 3/4 lemon juice; 1/4 raspberry liqueur; 1/2oz raspberry simple syrup; 1 whole egg white', av:{
    spec:[[1.5,'oz','gin'],[0.75,'oz','lemon'],[0.25,'oz','chambord',{label:'Raspberry liqueur'}],[0.5,'oz','raspberrysyrup'],[1,'white','eggwhite']] } },
  'trinidad-sour': { said:'1oz Angostura; 1oz orgeat; 3/4oz lemon juice; 1oz rye; 1 egg white', av:{ m:'dryshake', tech:['dry-shake','shake'],
    spec:[[1,'oz','angostura'],[1,'oz','orgeat'],[0.75,'oz','lemon'],[1,'oz','rye'],[1,'white','eggwhite']] } },
  'penicillin': { said:'2oz blended scotch; 3/4oz lemon juice; 3/4oz honey syrup; 3–4 muddled ginger coins; float of single islay scotch (1/4oz or less)', av:{ tech:['muddle','shake','float'],
    spec:[[2,'oz','scotch'],[0.75,'oz','lemon'],[0.75,'oz','honey'],[3,'coin','gingercoin',{to:4}],[0.25,'oz','islay',{post:true,label:'Islay single malt, float',note:'¼ oz or less'}]] } },
  'paper-plane': { said:'1oz whiskey; 1oz Amaro Nonino; 1oz Aperol; 1oz lemon juice', av:{ note:'Same equal-parts ratio, scaled up to 1 oz each.',
    spec:[[1,'oz','bourbon',{label:'Whiskey'}],[1,'oz','nonino'],[1,'oz','aperol'],[1,'oz','lemon']] } },
  'last-word': { said:'3/4oz gin; 3/4 maraschino liqueur; 3/4 green Chartreuse; 3/4 lime', match:true },
  'final-ward': { said:'3/4oz rye; 3/4 maraschino liqueur; 3/4 green Chartreuse; 3/4 lime', av:{ note:'Lime instead of the traditional lemon.',
    spec:[[0.75,'oz','rye'],[0.75,'oz','maraschino'],[0.75,'oz','greenchartreuse'],[0.75,'oz','lime']] } },
  'margarita': { said:'2oz tequila (Mezcalrita: swap mezcal); 3/4oz lime juice; 1/4oz agave (1/2oz syrup)',
    flags:['Your Margarita note says “Mezcalrita: swap mezcal,” but your Mezcalrita is its own spec with 1 oz lime and orange liqueur. Which is current?'],
    av:{ note:'No orange liqueur, so your build sits closer to a Tommy’s. For mezcal, swap the tequila 1:1.',
    spec:[[2,'oz','blanco',{label:'Tequila'}],[0.75,'oz','lime'],[0.25,'oz','agavenectar',{note:'or ½ oz agave syrup'}]] } },
  'manhattan': { said:'2oz rye (50% ABV); 1oz sweet vermouth; 2 dashes Angostura; optional: bar spoon cherry syrup and 1 orange bitters', av:{
    spec:[[2,'oz','ryebib'],[1,'oz','sweetvermouth'],[2,'dash','angostura'],[1,'bsp','cherrysyrup',{opt:true}],[1,'dash','orangebitters',{opt:true}]] } },
  'jungle-bird': { said:'1 1/2 dark rum (2oz can be too busy); 3/4 Campari; 1 1/2 pineapple; 1/2 lime; 1/4 cinnamon syrup; 1/4 syrup [?]',
    flags:['Two syrup lines: cinnamon syrup and plain “syrup.” Is the second one simple syrup?'], av:{
    spec:[[1.5,'oz','darkrum',{note:'2 oz can be too busy'}],[0.75,'oz','campari'],[1.5,'oz','pineapple'],[0.5,'oz','lime'],[0.25,'oz','cinnamonsyrup'],[0.25,'oz','simple',{label:'Syrup [?]'}]] } },
  'painkiller': { said:'3 pineapple; 2 rum; 1 orange juice; 1 coconut (Goya). Batch and let sit.',
    flags:['“1 coconut (Goya)”: assumed Goya cream of coconut. Confirm.'], av:{ note:'Less pineapple than the traditional 4 oz. Batch it and let it sit before serving.',
    spec:[[3,'oz','pineapple'],[2,'oz','rum'],[1,'oz','orange'],[1,'oz','creamcoconut',{label:'Cream of coconut (Goya) [?]'}]] } },
  'espresso-martini': { said:'Espresso Martini (rum): shake with orange peel. 1.5oz rum; 1oz Mr Black; 1.5oz espresso; 1/4oz Amaro Montenegro; 1/4oz honey syrup',
    av:{ label:'Andrew’s version (rum)', note:'Shake with an orange peel in the tin.',
    spec:[[1.5,'oz','rum'],[1,'oz','mrblack'],[1.5,'oz','espresso'],[0.25,'oz','montenegro'],[0.25,'oz','honey'],[1,'piece','orangepeel']] } }
};
Object.keys(AV).forEach(function (id) {
  var d = byId(id), a = AV[id];
  d.said = a.said; d.fromNotes = true;
  if (a.match) d.match = true;
  if (a.av) d.av = a.av;
  if (a.flags) d.flags = a.flags;
});

/* ---------- established drinks from your notes that weren't in the 100 ---------- */
function add(o) { o.fromNotes = true; D.push(o); }
add({id:'pisco-sour',name:'Pisco Sour',cat:'Classic',fam:'Daiquiri',base:'Brandy',m:'dryshake',glass:'Coupe',ice:'Up',garnish:'Angostura drops on the foam',
 spec:[[2,'oz','pisco'],[1,'oz','lime'],[0.75,'oz','simple'],[1,'white','eggwhite']],
 flav:['citrusy','creamy'],tech:['dry-shake','shake'],parent:'whiskey-sour',changed:'Pisco base and lime, finished with bitters on the foam.',
 prov:{who:'Victor Morris (widely credited)',where:'Morris’ Bar, Lima, Peru',year:'1920s',conf:'medium',note:'Peru and Chile both claim the pisco tradition.'},
 said:'2oz pisco; 1oz lemon and lime juice 50/50; 3/4oz simple syrup; 1 egg white or 1oz aquafaba',
 av:{ note:'Split citrus. Aquafaba works for a vegan foam.', spec:[[2,'oz','pisco'],[0.5,'oz','lemon'],[0.5,'oz','lime'],[0.75,'oz','simple'],[1,'white','eggwhite',{note:'or 1 oz aquafaba'}]] }});
add({id:'army-navy',name:'Army & Navy',cat:'Classic',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'Lemon twist',
 spec:[[2,'oz','gin'],[0.75,'oz','lemon'],[0.5,'oz','orgeat']],
 flav:['nutty','citrusy'],tech:['shake'],parentText:'Gin Sour',changed:'Orgeat replaces sugar.',
 prov:{who:'Unknown',where:'United States',year:'printed 1948 (Embury)',conf:'medium',note:'Popularized by David Embury’s book, which also argued for a drier ratio.'},
 said:'2oz gin; 1/2–3/4oz orgeat; 1/2–3/4oz lemon juice; dash Angostura',
 av:{ spec:[[2,'oz','gin'],[0.5,'oz','orgeat',{to:0.75}],[0.5,'oz','lemon',{to:0.75}],[1,'dash','angostura']] }});
add({id:'dirty-martini',name:'Dirty Martini',cat:'Classic',fam:'Martini',base:'Gin',m:'stir',glass:'Coupe or Martini',ice:'Up',garnish:'Olives',
 spec:[[2.5,'oz','gin',{label:'Gin or vodka'}],[0.5,'oz','dryvermouth'],[0.5,'oz','olivebrine']],
 flav:['savory','spirit-forward'],tech:['stir'],parent:'martini',changed:'Olive brine added.',
 prov:{who:'Unknown',where:'United States',year:'early 1900s onward',conf:'low',note:'Olive-brine Martinis show up early; the FDR stories are folklore.'},
 said:'2oz vodka; 1/2–1oz olive brine (how dirty?); 1/2oz dry vermouth; 3 olives',
 av:{ base:'Vodka', note:'Brine to taste: how dirty?', spec:[[2,'oz','vodka'],[0.5,'oz','olivebrine',{to:1}],[0.5,'oz','dryvermouth'],[3,'whole','olives']] }});
add({id:'bijou',name:'Bijou',cat:'Classic',fam:'Martini',base:'Gin',m:'stir',glass:'Coupe',ice:'Up',garnish:'Lemon twist, cherry',
 spec:[[1,'oz','gin'],[1,'oz','greenchartreuse'],[1,'oz','sweetvermouth'],[1,'dash','orangebitters']],
 flav:['herbal','rich'],tech:['stir'],parentText:'Sweet Martini (gin + sweet vermouth)',changed:'Green Chartreuse in equal parts.',
 prov:{who:'Harry Johnson (published)',where:'United States',year:'1900',conf:'high',note:'Named for the jewels: gin (diamond), vermouth (ruby), Chartreuse (emerald).'},
 said:'Bijou (Anders E): 1.25oz gin; 1/4 green Chartreuse; 3/4oz sweet vermouth',
 flags:['Your ¼ oz green Chartreuse is far below the classic equal-parts build. Intentional (Anders E’s version)?'],
 av:{ label:'Andrew’s version (Anders E)', note:'Much drier and gin-led than the equal-parts original.', spec:[[1.25,'oz','gin'],[0.25,'oz','greenchartreuse'],[0.75,'oz','sweetvermouth']] }});
add({id:'carajillo',name:'Carajillo',cat:'Classic',fam:'Martini',base:'Amaro & Liqueur',m:'shake',glass:'Rocks',ice:'Cubes',garnish:'None',famNote:'Family placement is my call (liqueur + coffee, no acid).',
 spec:[[1.5,'oz','licor43'],[2,'oz','espresso',{label:'Espresso (double shot)'}]],
 flav:['coffee','sweet'],tech:['shake'],parentText:'Café con licor (Spanish coffee-and-spirit tradition)',changed:'Licor 43 and fresh espresso, shaken or layered over ice.',
 prov:{who:'Unknown',where:'Spain; the Licor 43 version is hugely popular in Mexico',year:'—',conf:'low',note:'Older versions used brandy or rum.'},
 said:'double shot espresso; 1.5oz Licor 43; optional 1/2oz tequila', match:true,
 av:{ note:'Matches the traditional build, plus your optional tequila.', spec:[[2,'oz','espresso',{label:'Espresso (double shot)'}],[1.5,'oz','licor43'],[0.5,'oz','blanco',{opt:true,label:'Tequila'}]] }});
add({id:'monkeypod-mai-tai',name:'Monkeypod Mai Tai',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'shake',glass:'Double rocks',ice:'Crushed',garnish:'',
 spec:[[1,'oz','whiterum'],[1,'oz','darkrum'],[0.5,'oz','cointreau',{label:'Orange liqueur'}],[0.75,'oz','lime'],[0.5,'oz','orgeat']],
 components:[{name:'Passion fruit foam',spec:[[1.5,'oz','water',{label:'Cold water'}],[1,'oz','passionpuree',{note:'or 1.5 oz pineapple juice'}],[1,'oz','simple'],[0.5,'oz','honey'],[1,'white','eggwhite']],note:'Shake hard without ice (or charge in an iSi) and spoon over the drink. Not counted in the stats.'}],
 flav:['tropical','nutty'],tech:['shake','foam'],parent:'mai-tai',changed:'White and dark rum split, crowned with a honey–passion fruit foam.',
 prov:{who:'Monkeypod Kitchen bar team',where:'Monkeypod Kitchen, Hawaii',year:'2010s',conf:'low',note:'Spec here is from your notes. I haven’t checked it against the restaurant’s.'},
 said:'1oz white rum; 1oz dark rum; 1/2oz orange liqueur; 3/4oz lime juice; 1/2oz orgeat; plus passion fruit foam. Foam: 1.5oz cold water; 1oz passion fruit purée (or 1.5oz pineapple juice); 1oz simple syrup; 1/2oz honey syrup; 1 egg white',
 mineMain:true});

/* ---------- Andrew's originals and riffs ---------- */
var OWN = {who:'Andrew (Dad Bard)',where:'Home bar',year:'—',conf:'own',note:''};
function own(o) { o.cat = 'Andrew’s'; o.src = 'andrew'; o.prov = o.prov || OWN; o.glass = o.glass || ''; o.ice = o.ice || ''; o.garnish = o.garnish || ''; add(o); }

// Sours
own({id:'farnsworth',name:'Farnsworth',fam:'Daiquiri',base:'Whiskey',m:'shake',garnish:'Ground fennel dusted on top',
 spec:[[2,'oz','mellowcorn'],[0.75,'oz','carrot'],[0.75,'oz','cinnamonsyrup'],[0.75,'oz','lemon'],[1,'pinch','fennel',{label:'Ground fennel, on top'}]],
 flav:['spicy','savory','citrusy'],tech:['shake'],parent:'whiskey-sour',changed:'Corn whisky, carrot juice, cinnamon syrup, fennel dust.',
 said:'2 mellow corn whisky; 3/4 carrot juice; 3/4 cinnamon simple syrup; 3/4 lemon juice; top with ground fennel',
 prov:{who:'Not noted',where:'—',year:'—',conf:'low',note:''}, flags:['Creator isn’t in your notes. Your own, or someone else’s?']});
own({id:'xmas-in-july',name:'Xmas in July',exp:true,fam:'Daiquiri',base:'Gin',m:'shake',
 spec:[[1.5,'oz','botanivore'],[0.5,'oz','spicedpear'],[1,'oz','lemon'],[0.5,'oz','orgeat'],[3,'dash','angostura']],
 flav:['spicy','nutty','fruity'],tech:['shake'],parent:'army-navy',changed:'Botanivore gin, spiced pear liqueur, more lemon, Angostura.',
 said:'1 1/2oz St. George Botanivore gin; 1/2oz St. George spiced pear; 1oz lemon juice; 1/2oz orgeat; 3 dashes Angostura'});
own({id:'pink-panther',name:'Pink Panther',exp:true,fam:'Daiquiri',base:'Gin',m:'shake',
 spec:[[1,'oz','gin'],[1,'oz','lofi'],[0.75,'oz','lemon'],[0.75,'oz','simple',{note:'try ½ oz'}],[4,'dash','angostura']],
 flav:['bitter','citrusy'],tech:['shake'],parent:'too-soon',changed:'Lo-Fi gentian amaro takes Cynar’s half of the base; heavy Angostura.',
 said:'1oz gin; 1oz Lo-Fi amaro; 3/4 lemon juice; 3/4 simple syrup (try 1/2oz); 4 dashes Angostura'});
own({id:'drink-has-no-name',name:'A Drink Has No Name',exp:true,fam:'Daiquiri',base:'Gin',m:'shake',
 spec:[[1,'oz','gin'],[0.75,'oz','overproof',{label:'Overproof rum'}],[0.75,'oz','cinnamonsyrup'],[1,'oz','lemon']],
 flav:['spicy','citrusy'],tech:['shake'],parentText:'Gin Sour',changed:'Overproof rum splits the base; cinnamon syrup.',
 said:'1oz gin; 3/4oz overproof rum; 3/4oz cinnamon syrup; 1oz lemon juice'});
own({id:'ginori',name:'Ginori',exp:true,fam:'Daiquiri',base:'Gin',m:'shake',mainLabel:'Version A',
 spec:[[1.5,'oz','gin'],[0.5,'oz','sake'],[0.5,'oz','greenteasyrup'],[0.75,'oz','lemon']],
 alts:[{label:'Version B',spec:[[2,'oz','gin'],[0.75,'oz','sake'],[1,'oz','lemon'],[0.5,'oz','greenteasyrup'],[0.25,'oz','honey']]}],
 flav:['floral','citrusy'],tech:['shake'],parentText:'Gin Sour',changed:'Sake and green tea syrup.',
 said:'Version A: 1.5oz gin; 1/2oz sake; 1/2oz green tea syrup; 3/4oz lemon juice. Version B: 2oz gin; 3/4 sake; 1oz lemon; 1/2oz green tea syrup; 1/4oz honey syrup'});
own({id:'summer-salad-gimlet',name:'Summer Salad Gimlet',fam:'Daiquiri',base:'Gin',m:'shake',
 spec:[[2,'oz','gin'],[3,'slice','cucumber',{label:'Cucumber, muddled with the gin'}],[0.75,'oz','tomatosyrup'],[0.75,'oz','lime']],
 flav:['savory','refreshing'],tech:['muddle','shake'],parent:'gimlet',changed:'Muddled cucumber and salted tomato syrup.',
 said:'2oz gin with muddled cucumber; 3/4oz salted tomato syrup; 3/4oz lime', flags:['Cucumber amount isn’t noted. Shown as 3 slices.']});
// Daiquiri & Margarita
own({id:'ak-improved-daiquiri',name:'AK’s Improved Daiquiri',fam:'Daiquiri',base:'Rum',m:'shake',
 spec:[[1.5,'oz','overproof',{label:'Overproof rum',note:'or 2 oz regular rum'}],[1,'oz','lemon',{note:'try ¾ oz'}],[0.5,'oz','cinnamonsyrup'],[0.25,'oz','triplesec']],
 flav:['spicy','citrusy'],tech:['shake'],parent:'daiquiri',changed:'Overproof rum, lemon for lime, cinnamon syrup, a touch of triple sec.',
 said:'1.5oz overproof rum (or 2oz regular); 1oz lemon juice (try 3/4); 1/2oz cinnamon syrup; 1/4oz triple sec'});
own({id:'strawberry-banana-daiquiri',name:'Strawberry Banana Daiquiri',fam:'Daiquiri',base:'Rum',m:'shake',
 spec:[[2,'oz','strawrum'],[0.5,'oz','bananaoleo'],[0.75,'oz','lime']],
 flav:['fruity','tropical'],tech:['shake'],parent:'daiquiri',changed:'Strawberry-infused rum; banana oleo replaces simple.',
 said:'2oz strawberry-infused white rum; 1/2 banana oleo; 3/4oz lime'});
own({id:'fruit-salad-daiquiri',name:'Fruit Salad Daiquiri',exp:true,fam:'Daiquiri',base:'Rum',m:'shake',
 spec:[[1,'oz','strawrum'],[0.25,'oz','overproof',{label:'Funky overproof rum'}],[0.5,'oz','bananaoleo'],[0.5,'oz','lime']],
 flav:['fruity','tropical'],tech:['shake'],parent:'strawberry-banana-daiquiri',changed:'Smaller pour, with a funky overproof kicker.',
 said:'1oz strawberry-infused rum; 1/4oz funky overproof rum; 1/2oz banana oleo; 1/2oz lime'});
own({id:'mezcalrita',name:'Mezcalrita',fam:'Sidecar',base:'Agave',m:'shake',
 spec:[[2,'oz','mezcal'],[1,'oz','lime'],[0.5,'oz','cointreau',{label:'Orange liqueur'}],[0.25,'oz','agavenectar',{label:'Agave'}]],
 flav:['smoky','citrusy'],tech:['shake'],parent:'margarita',changed:'Mezcal, plus a touch of agave alongside the orange liqueur.',
 said:'2oz mezcal; 1oz lime juice; 1/2oz orange liqueur; 1/4 agave',
 flags:['Conflicts with the “swap mezcal” note on your Margarita. Which is current?']});
// Stirred
own({id:'fall-old-fashioned',name:'Fall Old Fashioned',fam:'Old-Fashioned',base:'Whiskey',m:'stir',glass:'Rocks',ice:'Large cube',
 spec:[[2,'oz','rye'],[1,'bsp','cinnamonsyrup'],[0.5,'oz','spicedpear'],[2,'dash','angostura']],
 flav:['spicy','fruity','spirit-forward'],tech:['stir'],parent:'old-fashioned',changed:'Cinnamon syrup and spiced pear liqueur.',
 said:'2oz rye; 1 bar spoon cinnamon syrup; 1/2oz spiced pear; 2 dashes Angostura'});
own({id:'tiki-old-fashioned',name:'Tiki Old Fashioned',fam:'Old-Fashioned',base:'Rum',m:'stir',glass:'Rocks',ice:'Large cube',
 spec:[[2,'oz','pineoftd'],[1,'bsp','bananaoleo',{to:2}],[1,'dash','orangebitters',{to:2}],[2,'dash','angostura',{to:4}]],
 flav:['tropical','spirit-forward'],tech:['stir'],parent:'old-fashioned',changed:'Pineapple-soaked overproof rum, banana oleo.',
 said:'2oz pineapple-soaked O.F.T.D. rum; 1–2 bar spoons banana peel oleo syrup; 1–2 dashes orange bitters; 2–4 dashes Angostura',
 flags:['Confirm: “OFTD” = Plantation (now Planteray) O.F.T.D. overproof.']});
own({id:'rosa-maria',name:'Rosa María',exp:true,fam:'Old-Fashioned',base:'Agave',m:'stir',glass:'Rocks',ice:'Large cube',garnish:'Mezcal mist, lemon twist, olive oil beads',
 spec:[[2,'oz','blanco',{label:'Tequila'}],[0.5,'oz','rosemarysyrup'],[1,'bsp','suze'],[2,'dash','orangebitters',{to:4}],[1,'rinse','mezcal',{label:'Mezcal mist'}],[1,'garnish','oliveoil']],
 flav:['herbal','bitter','smoky'],tech:['stir','rinse'],parent:'old-fashioned',changed:'Tequila, rosemary syrup and Suze, with a mezcal mist.',
 said:'2oz tequila; 1/2oz rosemary syrup; bar spoon Suze; 2–4 dashes orange bitters; mezcal mist, lemon twist, olive oil beads'});
own({id:'ray-gun',name:'Ray Gun',exp:true,fam:'Old-Fashioned',base:'Whiskey',m:'stir',glass:'Rocks',ice:'Large cube',
 spec:[[1.5,'oz','bourbon'],[0.5,'oz','mrblack'],[0.25,'oz','licor43'],[1,'dash','angostura'],[1,'dash','chocbitters'],[1,'dash','orangebitters']],
 flav:['coffee','rich','spirit-forward'],tech:['stir'],parent:'revolver',changed:'Mr Black and Licor 43, plus a three-bitters stack.',
 said:'1.5 bourbon; 1/2 Mr Black; 1/4 Licor 43; 1 dash Angostura; 1 dash chocolate bitters; 1 dash orange bitters'});
// Coffee
own({id:'amaretto-espresso-martini',name:'Amaretto Espresso Martini',fam:'Martini',base:'Brandy',m:'shake',glass:'Coupe',ice:'Up',
 spec:[[1,'oz','cognac'],[1,'oz','mrblack'],[1.5,'oz','espresso'],[0.25,'oz','montenegro'],[0.25,'oz','honey'],[0.5,'oz','amaretto']],
 flav:['coffee','nutty','rich'],tech:['shake'],parent:'espresso-martini',changed:'Cognac base and amaretto, built on your rum version’s frame.',
 said:'1oz cognac; 1oz Mr Black; 1.5oz espresso; 1/4oz Montenegro; 1/4oz honey syrup; 1/2oz amaretto'});
own({id:'balanced-espresso-martini',name:'Balanced Espresso Martini',fam:'Martini',base:'Rum',m:'shake',glass:'Coupe',ice:'Up',garnish:'Drizzle of cherry syrup',
 spec:[[0.5,'oz','smithcross'],[1.5,'oz','threestars'],[1,'oz','coffeeliqueur'],[0.5,'oz','allspice'],[1,'oz','espresso',{label:'Espresso (1 shot)'}],[1,'piece','orangepeel'],[1,'dash','cherrysyrup',{label:'Cherry syrup, drizzled'}],[1,'pinch','salt']],
 flav:['coffee','spicy','tropical'],tech:['shake'],parent:'espresso-martini',changed:'Two rums, allspice dram, salt and a cherry drizzle.',
 said:'1/2oz Smith & Cross; 1 1/2oz Plantation 3 Stars; 1oz coffee liqueur; 1/2oz allspice dram; 1 shot espresso; orange peel; dash (drizzle) of cherry syrup; pinch of salt',
 flags:['Confirm: “3 star” = Plantation (now Planteray) 3 Stars.']});
own({id:'fancy-xpressi-martini',name:'Fancy Xpressi Martini',exp:true,fam:'Martini',base:'Agave',m:'shake',glass:'Coupe',ice:'Up',
 spec:[[1,'oz','blanco',{label:'Tequila'}],[1,'oz','mezcal'],[0.75,'oz','coffeeliqueur'],[0.25,'oz','sweetvermouth'],[1,'oz','espresso',{label:'Espresso (1 shot)'}]],
 flav:['coffee','smoky'],tech:['shake'],parent:'espresso-martini',changed:'Tequila and mezcal split, with a touch of sweet vermouth.',
 said:'1oz tequila; 1oz mezcal; 3/4oz coffee liqueur; 1/4oz sweet vermouth; shot of espresso'});
own({id:'cinnamon-toast-coffee',name:'Cinnamon Toast Coffee',exp:true,fam:'Flip',base:'Rum',m:'dryshake',
 spec:[[2,'oz','coffee'],[2,'oz','rum'],[0.75,'oz','mrblack'],[0.5,'oz','licor43'],[0.25,'oz','cinnamonsyrup'],[1,'dash','orangebitters'],[1,'dash','chocbitters'],[1,'egg','egg']],
 flav:['coffee','creamy','spicy'],tech:['dry-shake','shake'],parent:'flip',changed:'Coffee, rum and Licor 43 in a whole-egg flip.',
 said:'2oz strong coffee; 2oz rum; 3/4oz Mr Black; 1/2oz Licor 43; 1/4oz cinnamon simple syrup; dash orange bitters; dash chocolate bitters; whole egg'});
own({id:'tropical-coffee-sour',name:'Tropical Coffee Sour',exp:true,fam:'Daiquiri',base:'Rum',m:'shake',
 spec:[[2,'bsp','coffeeliqueur'],[0.25,'oz','allspice'],[0.25,'oz','cinnamonsyrup'],[0.5,'oz','lemon',{note:'try lime juice'}],[0.5,'oz','orange'],[1.9,'oz','agedrum',{label:'Dark aged rum [?]'}],[0.1,'oz','smithcross',{label:'Smith & Cross [?]',note:'try more'}]],
 flav:['coffee','tropical','spicy'],tech:['shake'],parentText:'Rum Sour',changed:'Coffee liqueur, allspice and cinnamon over a mostly-aged-rum base.',
 said:'2 bar spoons coffee liqueur; 1/4 allspice; 1/4 cinnamon syrup; 1/2 lemon (try lime juice); 1/2 orange juice; 1.9 [?] dark aged rum; .1 [?] Smith & Cross (try more S&C)',
 flags:['1.9 dark aged rum + .1 Smith & Cross: a 2 oz split?','Lemon or lime still undecided.']});
own({id:'cafe-granita',name:'Café Granita',fam:'Martini',base:'Rum',m:'freeze',glass:'Chilled coupe or small bowl',
 method:'Stir everything until the sugar is dissolved. Pour into a shallow tray and freeze, scraping with a fork every 30–45 minutes until it’s flaky. Spoon into a chilled glass.',
 spec:[[2,'oz','rum',{label:'Rum or vodka'}],[2,'oz','espresso',{label:'Espresso, fresh-pulled'}],[1,'oz','simple'],[1,'oz','water']],
 flav:['coffee','refreshing'],tech:['freeze'],parent:'espresso-martini',changed:'Frozen and scraped into a granita.',
 said:'Café Granita (freeze): 2oz rum or vodka; 2oz fresh-pulled espresso; 1oz 1:1 simple syrup; 1oz water'});
own({id:'rum-runnings',name:'Rum Runnings',exp:true,fam:'Martini',base:'Rum',m:'stir',
 method:'Stir the base with ice and strain [?]. Shake the foam ingredients hard and spoon the foam on top.',
 spec:[[2,'oz','darkrum'],[1,'oz','coffeeliqueur'],[0.5,'oz','triplesec'],[0.5,'oz','sweetvermouth']],
 components:[{name:'Amaretto cream foam (makes several)',spec:[[4,'oz','heavycream'],[4,'oz','amaretto'],[1,'egg','egg'],[0.5,'oz','simple'],[0.5,'oz','orgeat'],[4,'dash','orangebitters'],[4,'dash','chocbitters']],note:'Batch-sized. Not counted in the stats.'}],
 flav:['coffee','rich','creamy'],tech:['stir','foam'],parentText:'White Russian (cream-topped coffee liqueur drink)',changed:'Dark rum, triple sec and vermouth under an amaretto cream foam.',
 said:'2oz dark rum; 1oz coffee liqueur; 1/2oz triple sec; 1/2oz sweet vermouth. Foam (placement assumed): 4oz heavy cream; 4oz amaretto; whole egg; 1/2oz simple; 1/2oz orgeat; 4 dashes orange bitters; 4 dashes chocolate bitters',
 flags:['The foam block sat under this drink, so I assumed it belongs here.','Method isn’t noted. Shown as stirred.']});
// Tiki
own({id:'tropic-blunder',name:'Tropic Blunder',exp:true,fam:'Daiquiri',base:'Rum',m:'shake',garnish:'Grated nutmeg',
 spec:[[1.5,'oz','pinerum'],[1,'oz','jamaicanrum'],[0.75,'oz','lime'],[0.5,'oz','creamcoconut'],[0.25,'oz','bananaoleo'],[1,'dash','angostura']],
 flav:['tropical','creamy'],tech:['shake'],parent:'painkiller',changed:'Pineapple and Jamaican rums, lime instead of juice, banana oleo.',
 said:'1.5oz pineapple rum; 1oz Jamaican rum; 3/4oz lime; 1/2oz cream of coconut; 1/4oz banana oleo; dash Angostura; grated nutmeg'});
own({id:'iron-ranger',name:'Iron Ranger',exp:true,fam:'Daiquiri',base:'Whiskey',m:'shake',
 spec:[[2,'oz','bourbon'],[0.5,'oz','falernum'],[1,'oz','pineapple'],[0.75,'oz','lemon'],[0.25,'oz','simple'],[2,'dash','angostura']],
 flav:['tropical','spicy','citrusy'],tech:['shake'],parent:'whiskey-sour',changed:'Falernum and pineapple turn a bourbon sour tiki.',
 said:'2oz bourbon; 1/2oz falernum; 1oz pineapple; 3/4oz lemon; 1/4oz simple; 2 dashes Angostura',
 prov:{who:'Andrew (experimental)',where:'Home bar',year:'—',conf:'own',note:'A published bourbon-tiki drink also goes by this name. Worth comparing.'}});
own({id:'rum-n-stuff',name:'Rum n Stuff',exp:true,fam:'Daiquiri',base:'Rum',m:'shake',
 spec:[[1.5,'oz','plantation5',{label:'Plantation 5 Year rum [?]'}],[0.5,'oz','oftd'],[0.5,'oz','falernum'],[0.5,'oz','bananaliq'],[0.75,'oz','superlime'],[1,'dash','angostura',{opt:true,label:'Angostura (small dash)'}],[2,'dash','orangebitters',{opt:true,label:'Orange bitters (small dashes)'}]],
 flav:['tropical'],tech:['shake'],parent:'daiquiri',changed:'Two rums, falernum and banana liqueur on super juice.',
 said:'1/12oz [?] 5yr Plantation rum; 1/2oz O.F.T.D.; 1/2oz falernum; 1/2oz banana liqueur; 3/4 lime super juice; optional: 1 small dash Angostura + 2 small dashes orange bitters',
 flags:['Your notes say 1/12 oz Plantation 5 Year. Shown as 1½ oz; confirm.','Confirm: “OFTD” = Plantation (now Planteray) O.F.T.D. overproof.']});
// Low-ABV
own({id:'lofi-spritz',name:'Lo-Fi Spritz',fam:'Whiskey Highball',base:'Amaro & Liqueur',m:'build',glass:'Wine glass',ice:'Cubes',
 method:'Build over ice. Pour both from the heart.',
 spec:[[0,'free','lofi',{label:'Gentian amaro (Lo-Fi)'}],[0,'free','champagne']],
 flav:['bitter','refreshing'],tech:['build','top'],parentText:'Spritz',changed:'Gentian amaro and Champagne.',
 said:'pour both from the heart: gentian amaro and champagne'});
// Batch & frozen
own({id:'slushy-mojito',name:'Slushy Mojito',batch:true,fam:'Daiquiri',base:'Rum',m:'freeze',glass:'Highball',ice:'Slush',
 method:'Combine everything, chill, and run it through a slushie machine (or freeze in a container and re-blend before serving).',
 spec:[[40,'oz','whiterum'],[20,'oz','mojitocordial'],[40,'oz','water'],[10,'oz','midori'],[3,'oz','lime'],[6,'drop','mintextract']],
 flav:['refreshing','herbal'],tech:['freeze'],parent:'mojito',changed:'Batched with mojito cordial and Midori, then frozen.',
 said:'40oz white rum; 20oz mojito cordial; 40oz water; 10oz Midori; plus 3oz lime; plus 6 drops mint extract. Mojito cordial: big handful of mint; 100ml lime juice; 150ml water; 100g sugar; 3g lime peel',
 flags:['Is the +3 oz lime on top of the lime already in the cordial? And what is the total yield?']});
own({id:'slushee',name:'Slushee',batch:true,fam:'Daiquiri',base:'Rum',m:'freeze',glass:'Highball',ice:'Slush',
 method:'Combine everything, chill, and run it through a slushie machine (or freeze in a container and re-blend before serving).',
 spec:[[1750,'ml','bacardiinf'],[500,'ml','lime'],[750,'ml','simple',{label:'Syrup'}],[1750,'ml','water'],[200,'ml','overproof',{to:250,label:'Jamaican / overproof rum'}]],
 flav:['citrusy','refreshing'],tech:['freeze'],parent:'daiquiri',changed:'A Daiquiri, batched and frozen.',
 said:'1.75L Bacardi (infused); 500ml lime; 750ml syrup; 1.75L water; 200–250ml Jamaican/overproof rum'});

/* ---------- your prep & technique notes ---------- */
function mine(id, lines, extra) { TECH[id].mine = lines; if (extra) for (var k in extra) TECH[id][k] = extra[k]; }
mine('clarification', ['Agar clarification (lemon/lime juice): 300 ml juice, with 75 ml set aside. 0.6 g agar. Add the remaining 225 ml into the warm 75 ml juice. Freeze about an hour, break up with a whisk, strain.'],
  { flags:['Your note doesn’t say the agar is dissolved into the heated 75 ml. Confirm.'] });
mine('fat-wash', ['Coconut: 2:1 by weight.', 'Bacon grease: 4 oz per 500 ml (strong).']);
mine('infusion', ['Tea: 10 g per 250 ml liquor. Steep 20 min to 1 hr, stirring occasionally.']);

var P = {
  'milk-washing':{t:'Milk washing',tag:'home',infl:'—',eq:['Jar','Coffee filter or fine cloth'],
    body:['Acid curdles the milk, and the curds trap tannins and haze on their way out. You get a softer, rounder, clearer spirit or punch.'],
    mine:['250 ml liquor poured over 2+ oz milk. Rest 10–15 min.','Add 4 g of 15% citric acid solution, stir gently, and let it curdle a few minutes.','Strain out the curds.'],
    links:[{n:'Reference: Lemon Bar Clarified Milk Punch (Liquor.com)',u:'https://www.liquor.com/recipes/lemon-bar-clarified-milk-punch/'}]},
  'foam':{t:'Foams & cream toppers',tag:'home',infl:'—',eq:['Shaker tins or iSi whipper'],
    body:['A foam is a separate little drink you spoon on top. Shake it hard without ice to whip in air, or charge it in an iSi for the tightest texture.'],
    mine:['Basic foam: 2 egg whites, 3 oz cold water, 1 oz simple syrup, 1 oz lemon juice.','Whipped cream: 4 oz cream to 1 tbsp maple syrup.']},
  'freeze':{t:'Granitas & slushies',tag:'home',infl:'—',eq:['Shallow tray and fork, or a slushie machine'],
    body:['Alcohol and sugar both lower the freezing point. Too much of either and it won’t set; too little and it freezes into a brick. Water in the recipe is how you tune it.',
          'Granita: freeze in a shallow tray and scrape every 30–45 minutes. Slushie: chill the batch first so the machine has less work.']},
  'gelatin':{t:'Gelatin conversion',tag:'prep',mine:['2 sheets = 3 g powder (1 tsp).']},
  'super-juice':{t:'Super juice',tag:'prep',mine:['Equal parts peel and citric acid by weight. Combine and rest to make an oleo citrate.','After 15 min, add water equal to peel weight × 16.66.','Blend with the fruit’s juice and strain out the solids.'],
    note:'Your notes describe the lemon version; Rum n Stuff uses lime.'},
  'acid-adjusted-oj':{t:'Acid-adjusted orange juice',tag:'prep',mine:['1 L orange juice, 20 g malic acid, 32 g citric acid.']},
  'orgeat':{t:'Orgeat',tag:'prep',mine:['2 cups almond milk, 3 cups sugar, ½ tsp almond extract, ½ tsp rose water, 1 tsp orange blossom water.']},
  'banana-oleo':{t:'Banana oleo',tag:'prep',mine:['1 banana peel to ½ cup sugar.']},
  'simple-syrup':{t:'Simple syrup',tag:'prep',mine:['Rule of thumb: 1 oz simple syrup is about 15 g sugar.']},
  'coffee-liqueur':{t:'House coffee liqueur',tag:'prep',mine:['50 g ground coffee, 250 ml vodka, 1 g cinnamon stick, 4 g organic orange peel. Sit 24 hours.','Then add 1 tsp vanilla extract, 100 g demerara sugar and 85 ml hot water.']},
  'mojito-cordial':{t:'Mojito cordial',tag:'prep',mine:['Big handful of mint, 100 ml lime juice, 150 ml water, 100 g sugar, 3 g lime peel.']},
  'basic-foam':{t:'Basic foam',tag:'prep',mine:['2 egg whites, 3 oz cold water, 1 oz simple syrup, 1 oz lemon juice.']},
  'whipped-cream':{t:'Whipped cream',tag:'prep',mine:['4 oz cream to 1 tbsp maple syrup.']}
};
// house preparations used in specs but not written down
[['honey-syrup','Honey syrup','Ratio not noted (1:1? 2:1?). The calculator assumes 1:1.'],['cinnamon-syrup','Cinnamon syrup',''],['raspberry-syrup','Raspberry simple syrup',''],
 ['green-tea-syrup','Green tea syrup',''],['rosemary-syrup','Rosemary syrup',''],['salted-tomato-syrup','Salted tomato syrup',''],['cherry-syrup','Cherry syrup',''],
 ['strawberry-rum','Strawberry-infused rum',''],['pineapple-rum','Pineapple-infused rum','Covers “pineapple rum” and “pineapple-soaked O.F.T.D.”'],['infused-bacardi','Infused Bacardi (Slushee)','What is it infused with?']
].forEach(function (x) { P[x[0]] = { t:x[1], tag:'prep', missing:true, mine:[], note:x[2] }; });
for (var pk in P) { var p = P[pk]; p.eq = p.eq || []; p.body = p.body || []; p.infl = p.infl || '—'; TECH[pk] = p; }

DATA.NORMALIZED = ['“mr back” → Mr Black','“pisco y” → pisco','“Jamaican run” → Jamaican rum','“ango” → Angostura','“AKs” → AK’s',
  '“OFTD” → O.F.T.D. (Plantation O.F.T.D. overproof, please confirm)','“3 star” → Plantation 3 Stars (please confirm)','“all spice” → allspice'];
})(typeof self !== 'undefined' ? self : this);
