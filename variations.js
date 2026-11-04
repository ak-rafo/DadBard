/* ============================================================
   VARIATIONS + GLARING MISSES
   1) Adds the big classics and tiki drinks that were missing.
   2) Folds "<modifier> <Base>" drinks (Dirty Martini, Tommy's Margarita…)
      into one entry with a variation picker. Andrew's originals are never folded.
   Every variation keeps its own id, so old links and your notes still work.
   ============================================================ */
(function (root) {
var DATA = root.CC_DATA, ING = DATA.ING, D = DATA.DRINKS;
function byId(id) { for (var i = 0; i < D.length; i++) if (D[i].id === id) return D[i]; }

/* ---------- ingredients ---------- */
var NEW = {
  oldtom:{n:'Old Tom gin',abv:.43,sug:.02,t:'spirit'},
  irishwhiskey:{n:'Irish whiskey',abv:.40,t:'spirit'},
  applejack:{n:'Applejack / apple brandy',abv:.50,t:'spirit'},
  cachaca:{n:'Cachaça',abv:.40,t:'spirit'},
  blackrum:{n:'Black rum (e.g., Gosling’s)',abv:.40,t:'spirit'},
  amerpicon:{n:'Amer Picon (or Ramazzotti)',abv:.18,sug:.20,t:'liqueur'},
  cherryheering:{n:'Cherry Heering',abv:.24,sug:.30,t:'liqueur'},
  cacaowhite:{n:'White crème de cacao',abv:.24,sug:.35,t:'liqueur'},
  cacaodark:{n:'Dark crème de cacao',abv:.24,sug:.35,t:'liqueur'},
  mentheGreen:{n:'Green crème de menthe',abv:.24,sug:.35,t:'liqueur'},
  mentheWhite:{n:'White crème de menthe',abv:.24,sug:.35,t:'liqueur'},
  redwine:{n:'Dry red wine',abv:.13,acid:.006,t:'wine'},
  roseslime:{n:'Lime cordial (Rose’s style)',sug:.30,acid:.02,t:'syrup'},
  gardenia:{n:'Gardenia mix (butter, honey, spice)',sug:.45,t:'syrup'},
  grapefruitsoda:{n:'Grapefruit soda',sug:.10,acid:.003,t:'mixer'},
  tomatojuice:{n:'Tomato juice',sug:.03,acid:.004,t:'juice'},
  hotcoffee:{n:'Hot coffee',t:'juice'},
  worcestershire:{n:'Worcestershire sauce',t:'bitters'},
  hotsauce:{n:'Hot sauce',t:'bitters'},
  orangeflower:{n:'Orange flower water',t:'bitters'},
  onion:{n:'Cocktail onions',t:'solid'},
  pepper:{n:'Black pepper',t:'solid'},
  sugarcube:{n:'Sugar (or 2 tsp superfine)',t:'solid'}
};
for (var k in NEW) ING[k] = NEW[k];

/* ---------- glaring misses: classics ---------- */
function add(o) { D.push(o); }
add({id:'martinez',name:'Martinez',cat:'Classic',fam:'Martini',base:'Gin',m:'stir',glass:'Coupe',ice:'Up',garnish:'Orange twist',
 spec:[[1.5,'oz','oldtom'],[1.5,'oz','sweetvermouth'],[1,'tsp','maraschino'],[2,'dash','angostura']],
 flav:['rich','herbal'],tech:['stir'],parent:'manhattan',changed:'Old Tom gin for whiskey, plus maraschino.',
 prov:{who:'Unknown (printed by O. H. Byron, 1884)',where:'United States',year:'1880s',conf:'medium',note:'The sweet, gin-based ancestor of the Martini. San Francisco and Martinez, CA both claim it.'}});
add({id:'brooklyn',name:'Brooklyn',cat:'Classic',fam:'Martini',base:'Whiskey',m:'stir',glass:'Coupe',ice:'Up',garnish:'Cherry',
 spec:[[2,'oz','rye'],[1,'oz','dryvermouth'],[0.25,'oz','maraschino'],[0.25,'oz','amerpicon']],
 flav:['spirit-forward','bitter'],tech:['stir'],parent:'manhattan',changed:'Dry vermouth, maraschino and Amer Picon.',
 prov:{who:'Unknown',where:'New York',year:'c. 1908 (printed)',conf:'medium',note:'Faded with Amer Picon’s US availability, then came back as the parent of the Brooklyn-neighborhood riffs.'}});
add({id:'hanky-panky',name:'Hanky Panky',cat:'Classic',fam:'Martini',base:'Gin',m:'stir',glass:'Coupe',ice:'Up',garnish:'Orange twist',
 spec:[[1.5,'oz','gin'],[1.5,'oz','sweetvermouth'],[2,'dash','fernet']],
 flav:['bitter','herbal','rich'],tech:['stir'],parentText:'Sweet Martini',changed:'A couple of dashes of Fernet-Branca.',
 prov:{who:'Ada “Coley” Coleman',where:'American Bar, The Savoy, London',year:'early 1900s',conf:'high',note:''}});
add({id:'el-presidente',name:'El Presidente',cat:'Classic',fam:'Martini',base:'Rum',m:'stir',glass:'Coupe',ice:'Up',garnish:'Orange twist',
 spec:[[1.5,'oz','whiterum'],[0.75,'oz','blancvermouth'],[0.25,'oz','curacao'],[1,'bsp','grenadine']],
 flav:['fruity','rich'],tech:['stir'],parentText:'Rum Manhattan',changed:'Blanc vermouth, curaçao and a touch of grenadine.',
 prov:{who:'Unknown',where:'Havana, Cuba',year:'1910s–20s',conf:'medium',note:'A Prohibition-era Havana favorite.'}});
add({id:'stinger',name:'Stinger',cat:'Classic',fam:'Martini',base:'Brandy',m:'stir',glass:'Rocks',ice:'Crushed',garnish:'Mint sprig',
 spec:[[2,'oz','cognac'],[0.75,'oz','mentheWhite']],
 flav:['herbal','rich'],tech:['stir'],parentText:'Brandy + liqueur “duo”',changed:'White crème de menthe.',
 prov:{who:'Unknown',where:'United States',year:'c. 1900s',conf:'medium',note:'A society after-dinner drink; often served over crushed ice today.'}});
add({id:'tom-collins',name:'Tom Collins',cat:'Classic',fam:'Whiskey Highball',base:'Gin',m:'shake',glass:'Collins',ice:'Cubes',garnish:'Lemon wheel, cherry',
 spec:[[2,'oz','gin'],[0.75,'oz','lemon'],[0.75,'oz','simple'],[2,'top','soda']],
 flav:['refreshing','citrusy'],tech:['shake','top'],parentText:'Sour',changed:'Lengthened with soda.',
 prov:{who:'Jerry Thomas (first printed, 1876)',where:'United States / London',year:'1870s',conf:'medium',note:'Related to London’s John Collins; the 1874 “Tom Collins hoax” helped popularize the name.'}});
add({id:'gin-fizz',name:'Gin Fizz',cat:'Classic',fam:'Whiskey Highball',base:'Gin',m:'shake',glass:'Fizz / small highball',ice:'Up',garnish:'None',
 spec:[[2,'oz','gin'],[0.75,'oz','lemon'],[0.75,'oz','simple'],[1,'top','soda']],
 flav:['refreshing','citrusy'],tech:['shake','top'],parentText:'Sour',changed:'Shaken hard and served short, with no ice, and topped with soda.',
 prov:{who:'Jerry Thomas (first printed)',where:'United States',year:'1876',conf:'medium',note:''}});
add({id:'ramos-gin-fizz',name:'Ramos Gin Fizz',cat:'Classic',fam:'Whiskey Highball',base:'Gin',m:'dryshake',glass:'Collins',ice:'Up',garnish:'None',
 spec:[[2,'oz','gin'],[0.5,'oz','lemon'],[0.5,'oz','lime'],[0.75,'oz','simple'],[1,'oz','heavycream'],[1,'white','eggwhite'],[3,'drop','orangeflower'],[1,'top','soda']],
 flav:['creamy','floral','citrusy'],tech:['dry-shake','shake','top'],parent:'gin-fizz',changed:'Cream, egg white, both citruses and orange flower water, shaken a very long time.',
 prov:{who:'Henry C. Ramos',where:'Imperial Cabinet Saloon, New Orleans',year:'1888',conf:'high',note:''}});
add({id:'mint-julep',name:'Mint Julep',cat:'Classic',fam:'Old-Fashioned',base:'Whiskey',m:'build',glass:'Julep cup',ice:'Crushed',garnish:'Big mint bouquet',
 spec:[[2.5,'oz','bourbon'],[0.5,'oz','simple'],[10,'leaf','mint']],
 flav:['refreshing','herbal','spirit-forward'],tech:['muddle','build'],parentText:'Julep (1700s)',changed:'Bourbon became the standard base.',
 prov:{who:'Unknown',where:'American South',year:'1700s–1800s',conf:'medium',note:'The Kentucky Derby’s drink since the 1930s.'}});
add({id:'moscow-mule',name:'Moscow Mule',cat:'Classic',fam:'Whiskey Highball',base:'Vodka',m:'build',glass:'Copper mug',ice:'Cubes',garnish:'Lime wedge',
 spec:[[2,'oz','vodka'],[0.5,'oz','lime'],[4,'top','gingerbeer']],
 flav:['refreshing','spicy'],tech:['build','top'],parentText:'Buck',changed:'Vodka and ginger beer in a copper mug.',
 prov:{who:'John G. Martin, Jack Morgan and others',where:'Cock ’n’ Bull, Los Angeles',year:'c. 1941',conf:'medium',note:'Largely a marketing push for Smirnoff vodka and Cock ’n’ Bull ginger beer.'}});
add({id:'dark-n-stormy',name:'Dark ’n’ Stormy',cat:'Classic',fam:'Whiskey Highball',base:'Rum',m:'build',glass:'Highball',ice:'Cubes',garnish:'Lime wedge',
 spec:[[4,'top','gingerbeer'],[2,'oz','blackrum',{post:true,label:'Black rum, floated on top'}]],
 flav:['spicy','refreshing','rich'],tech:['build','float'],parentText:'Buck',changed:'Black rum floated over ginger beer.',
 prov:{who:'Gosling family (trademark)',where:'Bermuda',year:'after WWI',conf:'medium',note:'Trademarked by Gosling’s; officially made with Gosling’s Black Seal.'}});
add({id:'bees-knees',name:'Bee’s Knees',cat:'Classic',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'Lemon twist',
 spec:[[2,'oz','gin'],[0.75,'oz','lemon'],[0.75,'oz','honey']],
 flav:['citrusy','floral'],tech:['shake'],parentText:'Gin Sour',changed:'Honey syrup replaces sugar.',
 prov:{who:'Often credited to Frank Meier',where:'Ritz Bar, Paris',year:'1920s–30s',conf:'low',note:'The name is 1920s slang for “the best.”'}});
add({id:'southside',name:'Southside',cat:'Classic',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'Mint leaf',
 spec:[[2,'oz','gin'],[0.75,'oz','lime'],[0.75,'oz','simple'],[8,'leaf','mint']],
 flav:['refreshing','herbal','citrusy'],tech:['muddle','shake'],parent:'gimlet',changed:'Mint shaken in.',
 prov:{who:'Unknown',where:'New York (21 Club and others claim it)',year:'1910s–30s',conf:'low',note:''}});
add({id:'jack-rose',name:'Jack Rose',cat:'Classic',fam:'Daiquiri',base:'Brandy',m:'shake',glass:'Coupe',ice:'Up',garnish:'Lemon twist',
 spec:[[2,'oz','applejack'],[0.75,'oz','lemon'],[0.5,'oz','grenadine']],
 flav:['fruity','citrusy'],tech:['shake'],parentText:'Sour',changed:'Applejack and grenadine.',
 prov:{who:'Unknown',where:'New Jersey / New York',year:'c. 1900s',conf:'low',note:'Named for its rosy color, or a gangster, or a rose. Stories vary.'}});
add({id:'pegu-club',name:'Pegu Club',cat:'Classic',fam:'Sidecar',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'Lime wheel',
 spec:[[2,'oz','gin'],[0.75,'oz','curacao'],[0.5,'oz','lime'],[1,'dash','angostura'],[1,'dash','orangebitters']],
 flav:['citrusy','bitter'],tech:['shake'],parent:'sidecar',changed:'Gin, lime and two bitters.',
 prov:{who:'Pegu Club (officers’ club)',where:'Rangoon, Burma',year:'1920s',conf:'medium',note:'Its name went on Audrey Saunders’s influential NYC bar in 2005.'}});
add({id:'caipirinha',name:'Caipirinha',cat:'Classic',fam:'Daiquiri',base:'Cachaça',m:'build',glass:'Rocks',ice:'Cubes',garnish:'None',
 spec:[[2,'oz','cachaca'],[0.75,'oz','lime',{label:'Lime (½, cut in wedges and muddled)'}],[0.5,'oz','simple',{label:'Sugar (2 tsp) or simple syrup'}]],
 flav:['citrusy','refreshing'],tech:['muddle','build'],parentText:'Folk remedy (lime, garlic, honey)',changed:'Became a sugar-and-lime drink in rural São Paulo.',
 prov:{who:'Unknown',where:'São Paulo state, Brazil',year:'early 1900s',conf:'low',note:'Brazil’s national cocktail.'}});
add({id:'paloma',name:'Paloma',cat:'Classic',fam:'Whiskey Highball',base:'Agave',m:'build',glass:'Highball',ice:'Cubes',garnish:'Salt rim (half), lime wedge',vlabel:'Classic (soda)',
 spec:[[2,'oz','blanco'],[0.5,'oz','lime'],[4,'top','grapefruitsoda'],[1,'pinch','salt']],
 flav:['refreshing','citrusy'],tech:['build','top'],parent:'margarita',changed:'Grapefruit soda lengthens tequila and lime.',
 prov:{who:'Unknown',where:'Mexico',year:'mid-1900s',conf:'low',note:'Mexico’s everyday tequila highball.'}});
add({id:'americano',name:'Americano',cat:'Classic',fam:'Whiskey Highball',base:'Amaro & Liqueur',m:'build',glass:'Highball',ice:'Cubes',garnish:'Orange slice',
 spec:[[1.5,'oz','campari'],[1.5,'oz','sweetvermouth'],[2,'top','soda']],
 flav:['bitter','refreshing'],tech:['build','top'],parentText:'Milano-Torino',changed:'Soda added to the Campari-and-vermouth Milano-Torino.',
 prov:{who:'Gaspare Campari’s bar lineage',where:'Milan',year:'1860s–1910s',conf:'medium',note:'Parent of the Negroni.'}});
add({id:'spritz',name:'Spritz',cat:'Classic',fam:'Whiskey Highball',base:'Wine & Sherry',m:'build',glass:'Wine glass',ice:'Cubes',garnish:'Orange slice',vlabel:'Aperol',
 spec:[[3,'top','prosecco'],[2,'oz','aperol'],[1,'top','soda']],
 flav:['bitter','refreshing'],tech:['build','top'],parentText:'Wine + water (Veneto)',changed:'Bitter aperitivo added.',
 prov:{who:'Veneto tradition; Aperol formula popularized it',where:'Venice / Padua',year:'1800s; Aperol version 1950s',conf:'medium',note:''}});
add({id:'bloody-mary',name:'Bloody Mary',cat:'Classic',fam:'Whiskey Highball',base:'Vodka',m:'build',glass:'Highball',ice:'Cubes',garnish:'Celery, lemon wedge',
 method:'Combine everything in a shaker tin with ice and “roll” it gently between two tins a few times (shaking thins the tomato). Strain over fresh ice.',
 spec:[[1.5,'oz','vodka'],[4,'oz','tomatojuice'],[0.5,'oz','lemon'],[2,'dash','worcestershire'],[2,'dash','hotsauce'],[1,'pinch','salt'],[1,'pinch','pepper']],
 flav:['savory','spicy'],tech:['build'],
 prov:{who:'Fernand Petiot (contested)',where:'Harry’s New York Bar, Paris / St. Regis, NYC',year:'1920s–30s',conf:'low',note:'Several claimants.'}});
add({id:'irish-coffee',name:'Irish Coffee',cat:'Classic',fam:'Whiskey Highball',base:'Whiskey',m:'build',glass:'Irish coffee glass',ice:'Hot',garnish:'Lightly whipped cream',
 method:'Warm the glass. Add whiskey, syrup and hot coffee and stir. Float lightly whipped cream over the back of a spoon. Don’t stir it in.',
 spec:[[1.5,'oz','irishwhiskey'],[0.5,'oz','demerarasyrup'],[4,'oz','hotcoffee'],[1,'oz','heavycream',{post:true,label:'Lightly whipped cream, float'}]],
 flav:['coffee','rich','creamy'],tech:['build','float'],parentText:'Hot toddy',changed:'Coffee instead of hot water; cream float.',
 prov:{who:'Joe Sheridan; popularized by the Buena Vista Cafe',where:'Foynes, Ireland → San Francisco',year:'1940s; SF 1952',conf:'high',note:''}});
add({id:'white-russian',name:'White Russian',cat:'Classic',fam:'Flip',base:'Vodka',m:'build',glass:'Rocks',ice:'Cubes',garnish:'None',vlabel:'White',
 spec:[[2,'oz','vodka'],[1,'oz','coffeeliqueur'],[1,'oz','heavycream',{post:true,label:'Heavy cream, float'}]],
 flav:['coffee','creamy','sweet'],tech:['build','float'],parentText:'Black Russian',changed:'Cream added.',
 prov:{who:'Unknown (Black Russian: Gustave Tops, Brussels, 1949)',where:'—',year:'1960s',conf:'medium',note:''}});
add({id:'brandy-alexander',name:'Brandy Alexander',cat:'Classic',fam:'Flip',base:'Brandy',m:'shake',glass:'Coupe',ice:'Up',garnish:'Grated nutmeg',
 spec:[[1.5,'oz','cognac'],[1,'oz','cacaodark'],[1,'oz','heavycream']],
 flav:['creamy','rich','sweet'],tech:['shake'],parentText:'Alexander (gin, 1910s)',changed:'Brandy replaces gin.',
 prov:{who:'Unknown',where:'United States / London',year:'1920s',conf:'low',note:''}});
add({id:'grasshopper',name:'Grasshopper',cat:'Classic',fam:'Flip',base:'Amaro & Liqueur',m:'shake',glass:'Coupe',ice:'Up',garnish:'Mint leaf',
 spec:[[1,'oz','mentheGreen'],[1,'oz','cacaowhite'],[1,'oz','heavycream']],
 flav:['creamy','sweet','herbal'],tech:['shake'],parent:'brandy-alexander',changed:'Crème de menthe and cacao, no spirit.',
 prov:{who:'Philibert Guichet (claimed)',where:'Tujague’s, New Orleans',year:'1918',conf:'medium',note:''}});

/* ---------- glaring misses: tiki & tropical ---------- */
add({id:'pina-colada',name:'Piña Colada',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'blend',glass:'Hurricane',ice:'Crushed',garnish:'Pineapple wedge, cherry',
 spec:[[2,'oz','whiterum'],[1.5,'oz','creamcoconut'],[1.5,'oz','pineapple'],[0.5,'oz','lime']],
 flav:['tropical','creamy','sweet'],tech:['flash-blend'],parentText:'Pineapple–coconut drinks',changed:'Blended with cream of coconut.',
 prov:{who:'Ramón “Monchito” Marrero (contested)',where:'Caribe Hilton, San Juan',year:'1954',conf:'medium',note:'Puerto Rico’s national drink. Barrachina restaurant also claims it.'}});
add({id:'hurricane',name:'Hurricane',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'shake',glass:'Hurricane',ice:'Crushed',garnish:'Orange wheel, cherry',
 spec:[[2,'oz','darkrum'],[1,'oz','lemon'],[1,'oz','passionsyrup']],
 flav:['tropical','fruity'],tech:['shake'],parentText:'Rum sour',changed:'Passion fruit syrup.',
 prov:{who:'Pat O’Brien’s',where:'New Orleans',year:'1940s',conf:'medium',note:'Today’s bar versions are often made from a red mix. This is the fresh build.'}});
add({id:'scorpion',name:'Scorpion',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'blend',glass:'Double rocks',ice:'Crushed',garnish:'Gardenia or mint',
 spec:[[1.5,'oz','whiterum'],[0.5,'oz','cognac'],[1.5,'oz','orange'],[1,'oz','lemon'],[0.5,'oz','orgeat']],
 flav:['tropical','citrusy','nutty'],tech:['flash-blend'],parentText:'Punch',changed:'Rum and brandy with orgeat; built for one here, originally a shared bowl.',
 prov:{who:'Victor “Trader Vic” Bergeron',where:'Trader Vic’s',year:'1940s',conf:'medium',note:'Usually served as a flaming communal bowl.'}});
add({id:'planters-punch',name:'Planter’s Punch',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'shake',glass:'Collins',ice:'Crushed',garnish:'Mint, orange slice',
 spec:[[2,'oz','jamaicanrum'],[0.75,'oz','lime'],[0.75,'oz','demerarasyrup'],[1,'tsp','grenadine'],[2,'dash','angostura'],[1,'top','soda']],
 flav:['tropical','spicy','citrusy'],tech:['shake','top'],parentText:'Punch',changed:'Single serving; Jamaican rum.',
 prov:{who:'Unknown (Jamaican tradition; Myers’s popularized it)',where:'Jamaica',year:'late 1800s',conf:'medium',note:'Old rhyme: one of sour, two of sweet, three of strong, four of weak.'}});
add({id:'queens-park-swizzle',name:'Queen’s Park Swizzle',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'swizzle',glass:'Collins',ice:'Crushed',garnish:'Mint bouquet; Angostura layered on top',
 spec:[[2,'oz','demerararum'],[0.75,'oz','lime'],[0.75,'oz','demerarasyrup'],[8,'leaf','mint'],[6,'dash','angostura',{post:true,label:'Angostura, layered on top'}]],
 flav:['herbal','refreshing','spicy'],tech:['muddle','swizzle','float'],parent:'mojito',changed:'Demerara rum, swizzled, crowned with bitters.',
 prov:{who:'Queen’s Park Hotel',where:'Port of Spain, Trinidad',year:'1920s',conf:'medium',note:''}});
add({id:'suffering-bastard',name:'Suffering Bastard',cat:'Tiki',fam:'Whiskey Highball',base:'Gin',m:'shake',glass:'Highball or mug',ice:'Cubes',garnish:'Mint, cucumber, orange',
 spec:[[1,'oz','gin'],[1,'oz','cognac'],[0.5,'oz','lime'],[2,'dash','angostura'],[4,'top','gingerbeer']],
 flav:['spicy','refreshing'],tech:['shake','top'],parentText:'Buck',changed:'Gin and brandy split, topped with ginger beer.',
 prov:{who:'Joe Scialom',where:'Shepheard’s Hotel, Cairo',year:'1942',conf:'high',note:'A hangover cure for WWII officers. Trader Vic later made a rum version.'}});
add({id:'missionarys-downfall',name:'Missionary’s Downfall',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'blend',glass:'Coupe or tiki glass',ice:'Crushed',garnish:'Mint sprig',
 spec:[[1,'oz','whiterum'],[0.5,'oz','peachliqueur'],[0.5,'oz','honey'],[0.5,'oz','lime'],[1,'oz','pineapple'],[10,'leaf','mint']],
 flav:['herbal','tropical','refreshing'],tech:['flash-blend'],parentText:'Daiquiri',changed:'Mint, pineapple, peach and honey, blended.',
 prov:{who:'Donn Beach',where:'Don the Beachcomber, Hollywood',year:'1940s',conf:'medium',note:''}});
add({id:'pearl-diver',name:'Pearl Diver',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'blend',glass:'Pearl Diver glass',ice:'Crushed',garnish:'None',
 spec:[[1.5,'oz','goldrum'],[0.5,'oz','demerararum'],[0.5,'oz','lime'],[0.5,'oz','orange'],[1,'oz','gardenia'],[1,'dash','angostura']],
 flav:['tropical','rich','creamy'],tech:['flash-blend'],parentText:'Daiquiri',changed:'Gardenia mix (butter, honey, spice) blended in.',
 prov:{who:'Donn Beach; reconstructed by Jeff “Beachbum” Berry',where:'Don the Beachcomber',year:'1937',conf:'medium',note:''}});
add({id:'singapore-sling',name:'Singapore Sling',cat:'Tiki',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Highball / hurricane',ice:'Cubes',garnish:'Pineapple, cherry',
 spec:[[1.5,'oz','gin'],[0.5,'oz','cherryheering'],[0.25,'oz','cointreau'],[0.25,'oz','benedictine'],[2,'oz','pineapple'],[0.5,'oz','lime'],[1,'tsp','grenadine'],[1,'dash','angostura']],
 flav:['fruity','tropical','herbal'],tech:['shake'],parentText:'Gin Sling',changed:'Cherry Heering, Bénédictine and pineapple.',
 prov:{who:'Ngiam Tong Boon (credited)',where:'Raffles Hotel, Singapore',year:'c. 1915',conf:'low',note:'The original recipe is lost; today’s build is a later reconstruction.'}});

/* ---------- lineage fix-ups now that parents exist ---------- */
['red-hook', 'greenpoint', 'slope', 'carroll-gardens', 'cobble-hill'].forEach(function (id) { var d = byId(id); d.parent = 'brooklyn'; delete d.parentText; });
[['negroni', 'americano'], ['rome-with-a-view', 'americano'], ['eastside', 'southside'], ['midnight-stinger', 'stinger'], ['espresso-martini', 'white-russian'], ['hugo', 'spritz']].forEach(function (p) { var d = byId(p[0]); d.parent = p[1]; delete d.parentText; });
var ts = byId('trinidad-sour'); delete ts.parent; ts.parentText = 'Pisco Sour'; ts.changed = 'An ounce and a half of Angostura becomes the base.';
var cr = byId('corpse-reviver-2'); cr.name = 'Corpse Reviver';
byId('martini').name = 'Martini';

/* ---------- variation groups ----------
   fold: existing drinks become variations [id, label]
   add:  new variations; anything not given is inherited from the main drink */
var DEFAULT_PROV = { who: 'Traditional variation', where: '—', year: '—', conf: 'low', note: '' };
var GROUPS = {
  'martini': { label: 'Dry', items: [
    { id: 'martini-wet', label: 'Wet', name: 'Wet Martini', spec: [[2, 'oz', 'gin'], [1, 'oz', 'dryvermouth'], [1, 'dash', 'orangebitters']], changed: 'More vermouth: about 2 : 1.',
      prov: { who: 'Pre-WWII standard', where: 'United States', year: '1900s–1930s', conf: 'medium', note: 'How most Martinis were made before the drink dried out.' } },
    { id: 'martini-fifty', label: 'Fifty-Fifty', name: 'Fifty-Fifty Martini', spec: [[1.5, 'oz', 'gin'], [1.5, 'oz', 'dryvermouth'], [1, 'dash', 'orangebitters']], changed: 'Equal gin and vermouth.', flav: ['herbal'],
      prov: { who: 'Early 1900s; revived at Pegu Club', where: 'New York', year: '1900s', conf: 'medium', note: '' } },
    { id: 'martini-perfect', label: 'Perfect', name: 'Perfect Martini', spec: [[2, 'oz', 'gin'], [0.5, 'oz', 'dryvermouth'], [0.5, 'oz', 'sweetvermouth']], changed: 'Vermouth split dry and sweet.' },
    ['dirty-martini', 'Dirty'],
    { id: 'gibson', label: 'Gibson', name: 'Gibson', garnish: 'Cocktail onions', spec: [[2.5, 'oz', 'gin'], [0.5, 'oz', 'dryvermouth'], [3, 'whole', 'onion', { label: 'Cocktail onions (garnish)' }]], changed: 'No bitters; onion garnish.',
      prov: { who: 'Unclear (several Gibsons credited)', where: 'San Francisco / New York', year: 'c. 1900', conf: 'low', note: '' } },
    { id: 'vesper', label: 'Vesper', name: 'Vesper', m: 'shake', garnish: 'Long lemon peel', spec: [[3, 'oz', 'gin'], [1, 'oz', 'vodka'], [0.5, 'oz', 'lillet']], changed: 'Gin and vodka with Lillet, shaken.', tech: ['shake'],
      prov: { who: 'Ian Fleming (Casino Royale)', where: 'Fiction, 1953', year: '1953', conf: 'high', note: 'The original Kina Lillet no longer exists; Lillet Blanc is the usual stand-in.' } }
  ] },
  'manhattan': { label: 'Classic', items: [
    { id: 'manhattan-perfect', label: 'Perfect', name: 'Perfect Manhattan', spec: [[2, 'oz', 'rye'], [0.5, 'oz', 'sweetvermouth'], [0.5, 'oz', 'dryvermouth'], [2, 'dash', 'angostura']], changed: 'Vermouth split sweet and dry.', garnish: 'Lemon twist' },
    { id: 'manhattan-dry', label: 'Dry', name: 'Dry Manhattan', spec: [[2, 'oz', 'rye'], [1, 'oz', 'dryvermouth'], [2, 'dash', 'angostura']], changed: 'Dry vermouth only.', garnish: 'Lemon twist' },
    { id: 'rob-roy', label: 'Rob Roy', name: 'Rob Roy', spec: [[2, 'oz', 'scotch'], [1, 'oz', 'sweetvermouth'], [2, 'dash', 'angostura']], changed: 'Scotch instead of rye.',
      prov: { who: 'Waldorf-Astoria bar (credited)', where: 'New York', year: '1894', conf: 'medium', note: 'Named for an operetta.' } },
    ['black-manhattan', 'Black']
  ] },
  'old-fashioned': { label: 'Whiskey', items: [
    { id: 'rum-old-fashioned', label: 'Rum', name: 'Rum Old Fashioned', base: 'Rum', spec: [[2, 'oz', 'agedrum'], [1, 'tsp', 'demerarasyrup'], [2, 'dash', 'angostura']], changed: 'Aged rum base.' },
    ['oaxaca-of', 'Oaxaca'], ['bentons', 'Benton’s']
  ] },
  'negroni': { label: 'Classic', items: [['negroni-sbagliato', 'Sbagliato'], ['white-negroni', 'White'], ['kingston-negroni', 'Kingston']] },
  'daiquiri': { label: 'Classic', items: [
    { id: 'hemingway-daiquiri', label: 'Hemingway', name: 'Hemingway Daiquiri', spec: [[2, 'oz', 'whiterum'], [0.75, 'oz', 'lime'], [0.5, 'oz', 'grapefruit'], [0.25, 'oz', 'maraschino']], changed: 'Grapefruit and maraschino; no sugar.', flav: ['citrusy', 'refreshing'],
      prov: { who: 'Constantino Ribalaigua (for Hemingway)', where: 'El Floridita, Havana', year: '1930s', conf: 'medium', note: 'Also called the Papa Doble.' } },
    { id: 'frozen-daiquiri', label: 'Frozen', name: 'Frozen Daiquiri', m: 'blend', ice: 'Crushed', tech: ['flash-blend'], spec: [[2, 'oz', 'whiterum'], [0.75, 'oz', 'lime'], [0.75, 'oz', 'simple']], changed: 'Blended with crushed ice.',
      prov: { who: 'Constantino Ribalaigua (popularized)', where: 'El Floridita, Havana', year: '1930s', conf: 'medium', note: '' } },
    ['nuclear-daiquiri', 'Nuclear']
  ] },
  'margarita': { label: 'Classic', items: [['tommys', 'Tommy’s']] },
  'whiskey-sour': { label: 'Classic', items: [
    { id: 'new-york-sour', label: 'New York', name: 'New York Sour', spec: [[2, 'oz', 'bourbon'], [0.75, 'oz', 'lemon'], [0.75, 'oz', 'simple'], [0.5, 'oz', 'redwine', { post: true, label: 'Dry red wine, float' }]], changed: 'Red wine floated on top.', tech: ['shake', 'float'],
      prov: { who: 'Unknown (first known as the Continental Sour)', where: 'Chicago / New York', year: '1880s', conf: 'medium', note: '' } }
  ] },
  'mai-tai': { label: 'Trader Vic 1944', items: [['monkeypod-mai-tai', 'Monkeypod'], ['bitter-mai-tai', 'Bitter']] },
  'gimlet': { label: 'Fresh lime', items: [
    { id: 'gimlet-cordial', label: 'Cordial', name: 'Gimlet (cordial)', spec: [[2, 'oz', 'gin'], [0.75, 'oz', 'roseslime']], changed: 'Lime cordial instead of fresh lime and sugar: the original style.' }
  ] },
  'sazerac': { label: 'Rye', items: [
    { id: 'sazerac-cognac', label: 'Cognac', name: 'Sazerac (cognac)', base: 'Brandy', spec: [[2, 'oz', 'cognac'], [1, 'tsp', 'rich'], [3, 'dash', 'peychauds'], [1, 'rinse', 'absinthe']], changed: 'Cognac, the original base before phylloxera.' }
  ] },
  'trinidad-sour': { label: 'Sour', items: [['trinidad-especial', 'Especial']] },
  'corpse-reviver-2': { label: 'No. 2', items: [
    { id: 'corpse-reviver-1', label: 'No. 1', name: 'Corpse Reviver No. 1', base: 'Brandy', m: 'stir', tech: ['stir'], spec: [[1.5, 'oz', 'cognac'], [0.75, 'oz', 'calvados'], [0.75, 'oz', 'sweetvermouth']], changed: 'Stirred brandy, calvados and sweet vermouth.', flav: ['rich', 'spirit-forward'], garnish: 'None',
      prov: { who: 'Harry Craddock (published)', where: 'The Savoy, London', year: '1930', conf: 'high', note: '' } }
  ] },
  'painkiller': { label: 'No. 2', items: [
    { id: 'painkiller-3', label: 'No. 3', name: 'Painkiller No. 3', spec: [[3, 'oz', 'navyrum'], [4, 'oz', 'pineapple'], [1, 'oz', 'orange'], [1, 'oz', 'creamcoconut']], changed: '3 oz rum.' },
    { id: 'painkiller-4', label: 'No. 4', name: 'Painkiller No. 4', spec: [[4, 'oz', 'navyrum'], [4, 'oz', 'pineapple'], [1, 'oz', 'orange'], [1, 'oz', 'creamcoconut']], changed: '4 oz rum.' }
  ] },
  'pisco-sour': { label: 'Peruvian', items: [
    { id: 'pisco-sour-chile', label: 'Chilean', name: 'Pisco Sour (Chilean)', m: 'shake', tech: ['shake'], garnish: 'None', spec: [[2, 'oz', 'pisco'], [0.75, 'oz', 'lemon'], [0.75, 'oz', 'simple']], changed: 'Lemon; often no egg or bitters.',
      prov: { who: 'Chilean tradition', where: 'Chile', year: '—', conf: 'low', note: 'Chile and Peru both claim the pisco sour.' } }
  ] },
  'french-75': { label: 'Gin', items: [
    { id: 'french-75-cognac', label: 'Cognac', name: 'French 75 (cognac)', base: 'Brandy', spec: [[1, 'oz', 'cognac'], [0.5, 'oz', 'lemon'], [0.5, 'oz', 'simple'], [3, 'top', 'champagne']], changed: 'Cognac base, the New Orleans favorite.' }
  ] },
  'spritz': { label: 'Aperol', items: [
    { id: 'campari-spritz', label: 'Campari', name: 'Campari Spritz', spec: [[3, 'top', 'prosecco'], [1.5, 'oz', 'campari'], [1, 'top', 'soda']], changed: 'Campari for a drier, more bitter spritz.' },
    ['hugo', 'Hugo']
  ] },
  'tom-collins': { label: 'Tom', items: [
    { id: 'john-collins', label: 'John', name: 'John Collins', base: 'Whiskey', spec: [[2, 'oz', 'bourbon'], [0.75, 'oz', 'lemon'], [0.75, 'oz', 'simple'], [2, 'top', 'soda']], changed: 'Bourbon instead of gin (older versions used genever).' }
  ] },
  'gin-fizz': { label: 'Gin', items: [
    { id: 'silver-fizz', label: 'Silver', name: 'Silver Fizz', m: 'dryshake', tech: ['dry-shake', 'shake', 'top'], spec: [[2, 'oz', 'gin'], [0.75, 'oz', 'lemon'], [0.75, 'oz', 'simple'], [1, 'white', 'eggwhite'], [1, 'top', 'soda']], changed: 'Egg white.', flav: ['creamy', 'citrusy'] },
    { id: 'royal-fizz', label: 'Royal', name: 'Royal Fizz', m: 'dryshake', tech: ['dry-shake', 'shake', 'top'], spec: [[2, 'oz', 'gin'], [0.75, 'oz', 'lemon'], [0.75, 'oz', 'simple'], [1, 'egg', 'egg'], [1, 'top', 'soda']], changed: 'Whole egg.', flav: ['creamy', 'rich'] }
  ] },
  'moscow-mule': { label: 'Moscow', items: [
    { id: 'mexican-mule', label: 'Mexican', name: 'Mexican Mule', base: 'Agave', spec: [[2, 'oz', 'blanco'], [0.5, 'oz', 'lime'], [4, 'top', 'gingerbeer']], changed: 'Tequila.' },
    { id: 'kentucky-mule', label: 'Kentucky', name: 'Kentucky Mule', base: 'Whiskey', spec: [[2, 'oz', 'bourbon'], [0.5, 'oz', 'lime'], [4, 'top', 'gingerbeer']], changed: 'Bourbon.' }
  ] },
  'paloma': { label: 'Classic (soda)', items: [
    { id: 'paloma-fresh', label: 'Fresh', name: 'Paloma (fresh)', spec: [[2, 'oz', 'blanco'], [2, 'oz', 'grapefruit'], [0.5, 'oz', 'lime'], [0.5, 'oz', 'agave'], [2, 'top', 'soda'], [1, 'pinch', 'salt']], changed: 'Fresh grapefruit, agave and soda instead of grapefruit soda.' }
  ] },
  'white-russian': { label: 'White', items: [
    { id: 'black-russian', label: 'Black', name: 'Black Russian', spec: [[2, 'oz', 'vodka'], [1, 'oz', 'coffeeliqueur']], changed: 'No cream: the 1949 original.', flav: ['coffee', 'sweet'], tech: ['build'],
      prov: { who: 'Gustave Tops', where: 'Hotel Metropole, Brussels', year: '1949', conf: 'medium', note: '' } }
  ] }
};
DATA.ALIAS = {};
var INHERIT = ['cat', 'fam', 'base', 'm', 'glass', 'ice', 'garnish', 'flav', 'tech'];
Object.keys(GROUPS).forEach(function (mid) {
  var main = byId(mid), g = GROUPS[mid];
  main.vlabel = main.vlabel || g.label; main.vars = [];
  g.items.forEach(function (it) {
    var v;
    if (Array.isArray(it)) {
      v = byId(it[0]); D.splice(D.indexOf(v), 1); v.vlabel = it[1];
    } else {
      v = {}; INHERIT.forEach(function (k) { v[k] = main[k]; });
      for (var key in it) if (key !== 'label') v[key] = it[key];
      v.vlabel = it.label; v.prov = it.prov || DEFAULT_PROV;
    }
    if (!v.parent && !v.parentText) v.parent = mid;
    v.variantOf = mid;
    main.vars.push(v); DATA.ALIAS[v.id] = mid;
  });
});
DATA.ALL = [];
D.forEach(function (d) { DATA.ALL.push(d); (d.vars || []).forEach(function (v) { DATA.ALL.push(v); }); });
})(typeof self !== 'undefined' ? self : this);
