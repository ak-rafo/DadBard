/* ============================================================
   DATA — ingredients, drinks, techniques
   Specs are ingredient lists (facts). Descriptions/method text are original wording.
   Every drink carries a provenance confidence. Tick sources in-app as you verify
   against your own books; nothing here claims a spec is copied from a specific book.
   ============================================================ */
(function (root) {

/* ---------- Ingredient table ----------
   abv  = fraction
   sug  = grams sugar per ml (approx.)
   acid = grams acid per ml, i.e. fraction w/v (lime/lemon ~ 0.06)
   Values are working approximations; edit as you learn better numbers. */
var ING = {
  // Spirits
  gin:{n:'London dry gin',abv:.44,t:'spirit'},
  plymouth:{n:'Plymouth gin',abv:.412,t:'spirit'},
  earlgreygin:{n:'Earl Grey–infused gin',abv:.44,t:'spirit'},
  vodka:{n:'Vodka',abv:.40,t:'spirit'},
  citronvodka:{n:'Citrus vodka',abv:.40,t:'spirit'},
  vanillavodka:{n:'Vanilla vodka',abv:.35,t:'spirit'},
  bourbon:{n:'Bourbon',abv:.45,t:'spirit'},
  bourboncask:{n:'Cask-strength bourbon',abv:.60,t:'spirit'},
  baconbourbon:{n:'Bacon fat-washed bourbon',abv:.44,t:'spirit'},
  rye:{n:'Rye whiskey',abv:.45,t:'spirit'},
  scotch:{n:'Blended Scotch',abv:.40,t:'spirit'},
  islay:{n:'Islay single malt',abv:.43,t:'spirit'},
  highballwhisky:{n:'Japanese or Scotch whisky',abv:.43,t:'spirit'},
  blanco:{n:'Blanco tequila',abv:.40,t:'spirit'},
  reposado:{n:'Reposado tequila',abv:.40,t:'spirit'},
  mezcal:{n:'Mezcal',abv:.44,t:'spirit'},
  whiterum:{n:'White rum',abv:.40,t:'spirit'},
  agedrum:{n:'Aged rum',abv:.40,t:'spirit'},
  goldrum:{n:'Gold Puerto Rican rum',abv:.40,t:'spirit'},
  jamaicanrum:{n:'Aged Jamaican rum',abv:.43,t:'spirit'},
  smithcross:{n:'Navy-strength Jamaican rum (e.g., Smith & Cross)',abv:.57,t:'spirit'},
  overproof:{n:'Overproof white Jamaican rum',abv:.63,t:'spirit'},
  demerararum:{n:'Demerara rum',abv:.40,t:'spirit'},
  demerara151:{n:'151-proof Demerara rum',abv:.755,t:'spirit'},
  blackstrap:{n:'Blackstrap rum',abv:.40,t:'spirit'},
  spicedrum:{n:'Spiced rum',abv:.35,t:'spirit'},
  agricole:{n:'Aged rhum agricole',abv:.45,t:'spirit'},
  darkrum:{n:'Dark rum',abv:.40,t:'spirit'},
  navyrum:{n:'Navy rum (e.g., Pusser’s)',abv:.42,t:'spirit'},
  cognac:{n:'Cognac',abv:.40,t:'spirit'},
  calvados:{n:'Calvados',abv:.40,t:'spirit'},
  pisco:{n:'Pisco',abv:.40,t:'spirit'},
  aquavit:{n:'Aquavit',abv:.40,t:'spirit'},
  apricoteau:{n:'Apricot eau-de-vie',abv:.40,t:'spirit'},
  // Aromatized & fortified wine
  sweetvermouth:{n:'Sweet vermouth',abv:.165,sug:.16,acid:.006,t:'wine'},
  dryvermouth:{n:'Dry vermouth',abv:.175,sug:.03,acid:.006,t:'wine'},
  blancvermouth:{n:'Blanc vermouth',abv:.16,sug:.13,acid:.006,t:'wine'},
  puntemes:{n:'Punt e Mes',abv:.16,sug:.17,acid:.006,t:'wine'},
  lillet:{n:'Lillet Blanc',abv:.17,sug:.095,acid:.006,t:'wine'},
  fino:{n:'Fino sherry',abv:.15,acid:.004,t:'wine'},
  manzanilla:{n:'Manzanilla sherry',abv:.15,acid:.004,t:'wine'},
  amontillado:{n:'Amontillado sherry',abv:.18,acid:.004,t:'wine'},
  champagne:{n:'Champagne (brut)',abv:.12,sug:.01,acid:.006,t:'wine'},
  prosecco:{n:'Prosecco',abv:.11,sug:.012,acid:.006,t:'wine'},
  // Liqueurs, amari, bitters
  cointreau:{n:'Cointreau',abv:.40,sug:.25,t:'liqueur'},
  curacao:{n:'Orange curaçao',abv:.40,sug:.25,t:'liqueur'},
  campari:{n:'Campari',abv:.24,sug:.24,t:'liqueur'},
  aperol:{n:'Aperol',abv:.11,sug:.24,t:'liqueur'},
  nonino:{n:'Amaro Nonino',abv:.35,sug:.12,t:'liqueur'},
  cynar:{n:'Cynar',abv:.165,sug:.17,t:'liqueur'},
  averna:{n:'Averna',abv:.29,sug:.24,t:'liqueur'},
  montenegro:{n:'Amaro Montenegro',abv:.23,sug:.22,t:'liqueur'},
  nardini:{n:'Amaro Nardini',abv:.29,sug:.15,t:'liqueur'},
  fernet:{n:'Fernet-Branca',abv:.39,sug:.08,t:'liqueur'},
  greenchartreuse:{n:'Green Chartreuse',abv:.55,sug:.25,t:'liqueur'},
  yellowchartreuse:{n:'Yellow Chartreuse',abv:.40,sug:.31,t:'liqueur'},
  maraschino:{n:'Maraschino liqueur',abv:.32,sug:.35,t:'liqueur'},
  stgermain:{n:'Elderflower liqueur (St-Germain)',abv:.20,sug:.33,t:'liqueur'},
  suze:{n:'Suze',abv:.20,sug:.20,t:'liqueur'},
  benedictine:{n:'Bénédictine',abv:.40,sug:.33,t:'liqueur'},
  cassis:{n:'Crème de cassis',abv:.16,sug:.45,t:'liqueur'},
  mure:{n:'Crème de mûre',abv:.16,sug:.40,t:'liqueur'},
  violette:{n:'Crème de violette',abv:.16,sug:.35,t:'liqueur'},
  coffeeliqueur:{n:'Coffee liqueur',abv:.20,sug:.40,t:'liqueur'},
  amaretto:{n:'Amaretto',abv:.28,sug:.30,t:'liqueur'},
  passionliqueur:{n:'Passion fruit liqueur',abv:.17,sug:.30,t:'liqueur'},
  chambord:{n:'Black raspberry liqueur (Chambord)',abv:.165,sug:.40,t:'liqueur'},
  pearliqueur:{n:'Pear liqueur',abv:.25,sug:.25,t:'liqueur'},
  apricotliqueur:{n:'Apricot liqueur',abv:.24,sug:.30,t:'liqueur'},
  peachliqueur:{n:'Peach brandy (liqueur style)',abv:.30,sug:.25,t:'liqueur'},
  allspice:{n:'Allspice dram',abv:.225,sug:.30,t:'liqueur'},
  falernum:{n:'Falernum',abv:.11,sug:.28,acid:.002,t:'liqueur'},
  jager:{n:'Jägermeister',abv:.35,sug:.25,t:'liqueur'},
  angostura:{n:'Angostura bitters',abv:.447,sug:.04,t:'bitters'},
  peychauds:{n:'Peychaud’s bitters',abv:.35,sug:.06,t:'bitters'},
  orangebitters:{n:'Orange bitters',abv:.28,t:'bitters'},
  molebitters:{n:'Mole bitters',abv:.53,t:'bitters'},
  peachbitters:{n:'Peach bitters',abv:.35,t:'bitters'},
  absinthe:{n:'Absinthe',abv:.68,t:'bitters'},
  // Juices
  lime:{n:'Lime juice',sug:.016,acid:.06,t:'juice'},
  lemon:{n:'Lemon juice',sug:.025,acid:.06,t:'juice'},
  grapefruit:{n:'Grapefruit juice',sug:.06,acid:.024,t:'juice'},
  orange:{n:'Orange juice',sug:.09,acid:.008,t:'juice'},
  pineapple:{n:'Pineapple juice',sug:.10,acid:.008,t:'juice'},
  cranberry:{n:'Cranberry juice (cocktail)',sug:.12,acid:.005,t:'juice'},
  applejuice:{n:'Apple juice (cloudy)',sug:.10,acid:.005,t:'juice'},
  espresso:{n:'Espresso (fresh)',t:'juice'},
  // Syrups & sweeteners
  simple:{n:'Simple syrup (1:1)',sug:.615,t:'syrup'},
  rich:{n:'Rich simple syrup (2:1)',sug:.887,t:'syrup'},
  demerarasyrup:{n:'Rich demerara syrup (2:1)',sug:.887,t:'syrup'},
  canesyrup:{n:'Cane syrup (2:1)',sug:.887,t:'syrup'},
  rockcandy:{n:'Rock candy syrup (2:1)',sug:.887,t:'syrup'},
  honey:{n:'Honey syrup (1:1)',sug:.57,t:'syrup'},
  honeyginger:{n:'Honey-ginger syrup',sug:.57,t:'syrup'},
  agave:{n:'Agave syrup (2:1 nectar:water)',sug:.62,t:'syrup'},
  maple:{n:'Maple syrup (dark)',sug:.88,t:'syrup'},
  orgeat:{n:'Orgeat',sug:.60,t:'syrup'},
  grenadine:{n:'Grenadine',sug:.60,acid:.005,t:'syrup'},
  passionsyrup:{n:'Passion fruit syrup',sug:.60,acid:.01,t:'syrup'},
  vanillasyrup:{n:'Vanilla syrup',sug:.615,t:'syrup'},
  donsmix:{n:'Don’s Mix (2 grapefruit : 1 cinnamon syrup)',sug:.245,acid:.016,t:'syrup'},
  marmalade:{n:'Orange marmalade',sug:.60,acid:.005,t:'syrup'},
  creamcoconut:{n:'Cream of coconut',sug:.50,t:'syrup'},
  // Mixers & other
  soda:{n:'Soda water',t:'mixer'},
  gingerbeer:{n:'Ginger beer',sug:.10,acid:.003,t:'mixer'},
  eggwhite:{n:'Egg white',t:'other'},
  egg:{n:'Whole egg',t:'other'},
  fluffyorange:{n:'Aerated ("fluffy") orange juice',sug:.09,acid:.008,t:'juice'},
  // Solids / aromatics (no volume in the calculator)
  mint:{n:'Mint',t:'solid'}, basil:{n:'Basil leaves',t:'solid'}, cucumber:{n:'Cucumber',t:'solid'},
  strawberry:{n:'Strawberry',t:'solid'}, grapes:{n:'Green grapes',t:'solid'}, orangeslice:{n:'Orange slices',t:'solid'},
  passionfruit:{n:'Passion fruit (half)',t:'solid'}, salt:{n:'Salt',t:'solid'}, rosewater:{n:'Rose water',t:'solid'}
};

/* ---------- Drinks ----------
   m (method): shake | dryshake | stir | build | swizzle | blend
   spec item: [amount, unit, ingredientKey, {post, side, label, note}]
     units: oz, dash, drop, tsp, bsp, top (oz, added after ice), white (egg white), egg,
            leaf, slice, sprig, whole, pinch, handful, piece, rinse
   prov.conf: high | medium | low  (confidence in the creator/venue/date, not the taste)
   parent: id of a drink in this collection; parentText: ancestor not in the collection */
var D = [];
function add(o){ D.push(o); }

/* ===== CLASSICS (20) — includes the six Codex root cocktails ===== */
add({id:'old-fashioned',name:'Old Fashioned',cat:'Classic',fam:'Old-Fashioned',root:true,base:'Whiskey',m:'stir',glass:'Rocks',ice:'Large cube',garnish:'Orange twist',
 spec:[[2,'oz','bourbon',{label:'Bourbon or rye'}],[1,'tsp','demerarasyrup'],[2,'dash','angostura'],[1,'dash','orangebitters']],
 flav:['spirit-forward','rich'],tech:['stir'],
 prov:{who:'Unknown (19th-century "Whiskey Cocktail")',where:'United States',year:'1800s',conf:'medium',note:'The name appears in the 1880s for the older spirit-sugar-bitters-water formula.'}});
add({id:'martini',name:'Dry Martini',cat:'Classic',fam:'Martini',root:true,base:'Gin',m:'stir',glass:'Nick & Nora',ice:'Up',garnish:'Lemon twist or olive',
 spec:[[2.5,'oz','gin'],[0.5,'oz','dryvermouth'],[1,'dash','orangebitters']],
 flav:['spirit-forward','herbal'],tech:['stir'],
 prov:{who:'Unknown',where:'United States',year:'c. 1880s–1900s',conf:'low',note:'Evolved from sweeter Martinez-style drinks; drier form settled in the early 1900s. Origin stories conflict.'}});
add({id:'daiquiri',name:'Daiquiri',cat:'Classic',fam:'Daiquiri',root:true,base:'Rum',m:'shake',glass:'Coupe',ice:'Up',garnish:'Lime wheel (optional)',
 spec:[[2,'oz','whiterum'],[0.75,'oz','lime'],[0.75,'oz','simple']],
 flav:['citrusy','refreshing'],tech:['shake'],
 prov:{who:'Attributed to Jennings Cox',where:'Daiquirí, Cuba',year:'c. 1898–1900',conf:'medium',note:'Rum, lime and sugar were combined in Cuba long before; the Cox story names the drink.'}});
add({id:'sidecar',name:'Sidecar',cat:'Classic',fam:'Sidecar',root:true,base:'Brandy',m:'shake',glass:'Coupe',ice:'Up',garnish:'Sugar rim (optional), orange twist',
 spec:[[1.5,'oz','cognac'],[0.75,'oz','cointreau'],[0.75,'oz','lemon']],
 flav:['citrusy','rich'],tech:['shake'],
 prov:{who:'Unclear (Paris and London both claimed)',where:'Paris / London',year:'c. 1922',conf:'medium',note:'First printed in 1922 bar books; descends from the Brandy Crusta.'}});
add({id:'whisky-highball',name:'Whisky Highball',cat:'Classic',fam:'Whiskey Highball',root:true,base:'Whiskey',m:'build',glass:'Highball',ice:'Cubes or spear',garnish:'Lemon twist',
 spec:[[2,'oz','highballwhisky'],[4,'top','soda']],
 flav:['refreshing'],tech:['build','top'],
 prov:{who:'Unknown',where:'Britain / United States',year:'late 1800s',conf:'medium',note:'Popularized with Scotch and soda; Japan later made it a precision ritual.'}});
add({id:'flip',name:'Brandy Flip',cat:'Classic',fam:'Flip',root:true,base:'Brandy',m:'dryshake',glass:'Coupe',ice:'Up',garnish:'Grated nutmeg',
 spec:[[2,'oz','cognac'],[0.5,'oz','rich'],[1,'egg','egg']],
 flav:['rich','creamy'],tech:['dry-shake','shake'],
 prov:{who:'Unknown',where:'England / colonial America',year:'1600s (hot); cold version printed 1862',conf:'medium',note:'Originally a hot ale drink; the cold shaken whole-egg version appears in Jerry Thomas (1862).'}});
add({id:'manhattan',name:'Manhattan',cat:'Classic',fam:'Martini',base:'Whiskey',m:'stir',glass:'Coupe',ice:'Up',garnish:'Brandied cherry',
 spec:[[2,'oz','rye'],[1,'oz','sweetvermouth'],[2,'dash','angostura']],
 flav:['spirit-forward','rich'],tech:['stir'],
 prov:{who:'Unknown',where:'New York City',year:'c. 1870s–1880s',conf:'medium',note:'The Lady Randolph Churchill / Manhattan Club story does not fit the dates.'}});
add({id:'negroni',name:'Negroni',cat:'Classic',fam:'Martini',base:'Gin',m:'stir',glass:'Rocks',ice:'Large cube',garnish:'Orange half-wheel or twist',
 spec:[[1,'oz','gin'],[1,'oz','campari'],[1,'oz','sweetvermouth']],
 flav:['bitter','spirit-forward'],tech:['stir'],parentText:'Americano',changed:'Gin replaces the soda water.',
 prov:{who:'Attributed to Count Camillo Negroni / bartender Fosco Scarselli',where:'Caffè Casoni, Florence',year:'c. 1919',conf:'medium',note:'Widely repeated; documentary evidence is thin.'}});
add({id:'margarita',name:'Margarita',cat:'Classic',fam:'Sidecar',base:'Agave',m:'shake',glass:'Rocks',ice:'Cubes',garnish:'Salt rim (half), lime wheel',
 spec:[[2,'oz','blanco'],[1,'oz','lime'],[0.75,'oz','cointreau']],
 flav:['citrusy','refreshing'],tech:['shake'],parent:'sidecar',changed:'Tequila for cognac, lime for lemon, salt rim.',
 prov:{who:'Many claimants',where:'Mexico / US border',year:'1930s–1940s',conf:'low',note:'Likely grew out of the Tequila Daisy ("margarita" = daisy).'}});
add({id:'sazerac',name:'Sazerac',cat:'Classic',fam:'Old-Fashioned',base:'Whiskey',m:'stir',glass:'Rocks (no ice)',ice:'Up',garnish:'Lemon peel, expressed and discarded',
 spec:[[2,'oz','rye'],[1,'tsp','rich'],[3,'dash','peychauds'],[1,'dash','angostura'],[1,'rinse','absinthe']],
 flav:['spirit-forward','herbal'],tech:['stir','rinse'],parent:'old-fashioned',changed:'Rye, Peychaud’s, absinthe rinse, served neat in a chilled glass.',
 prov:{who:'Sazerac Coffee House lineage',where:'New Orleans',year:'mid–late 1800s',conf:'medium',note:'Originally cognac-based; rye took over later in the century.'}});
add({id:'last-word',name:'Last Word',cat:'Classic',fam:'Sidecar',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'None or cherry',
 spec:[[0.75,'oz','gin'],[0.75,'oz','greenchartreuse'],[0.75,'oz','maraschino'],[0.75,'oz','lime']],
 flav:['herbal','citrusy'],tech:['shake'],
 prov:{who:'Detroit Athletic Club (revived by Murray Stenson)',where:'Detroit; revived at Zig Zag Café, Seattle',year:'c. 1916; revived c. 2004',conf:'high',note:'Equal-parts template that spawned a large family of riffs.'}});
add({id:'corpse-reviver-2',name:'Corpse Reviver No. 2',cat:'Classic',fam:'Sidecar',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'Orange twist',
 spec:[[0.75,'oz','gin'],[0.75,'oz','cointreau'],[0.75,'oz','lillet'],[0.75,'oz','lemon'],[1,'rinse','absinthe']],
 flav:['citrusy','herbal'],tech:['shake','rinse'],parent:'sidecar',changed:'Gin base, Lillet added as an equal part, absinthe rinse.',
 prov:{who:'Harry Craddock (published)',where:'The Savoy, London',year:'1930',conf:'high',note:'Original used Kina Lillet, which no longer exists.'}});
add({id:'aviation',name:'Aviation',cat:'Classic',fam:'Sidecar',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'Brandied cherry',
 spec:[[2,'oz','gin'],[0.5,'oz','maraschino'],[0.25,'oz','violette'],[0.75,'oz','lemon']],
 flav:['floral','citrusy'],tech:['shake'],
 prov:{who:'Hugo Ensslin',where:'Hotel Wallick, New York',year:'1916 (published)',conf:'high',note:'Violette dropped out of many later printings.'}});
add({id:'vieux-carre',name:'Vieux Carré',cat:'Classic',fam:'Martini',base:'Whiskey',m:'stir',glass:'Rocks',ice:'Large cube',garnish:'Lemon twist',
 spec:[[0.75,'oz','rye'],[0.75,'oz','cognac'],[0.75,'oz','sweetvermouth'],[1,'tsp','benedictine'],[2,'dash','peychauds'],[2,'dash','angostura']],
 flav:['spirit-forward','rich','herbal'],tech:['stir'],parent:'manhattan',changed:'Split rye/cognac base, Bénédictine, both bitters.',
 prov:{who:'Walter Bergeron',where:'Hotel Monteleone, New Orleans',year:'1938',conf:'high',note:''}});
add({id:'boulevardier',name:'Boulevardier',cat:'Classic',fam:'Martini',base:'Whiskey',m:'stir',glass:'Coupe',ice:'Up',garnish:'Orange twist',
 spec:[[1.5,'oz','bourbon'],[1,'oz','campari'],[1,'oz','sweetvermouth']],
 flav:['bitter','rich'],tech:['stir'],parent:'negroni',changed:'Bourbon for gin, whiskey pushed forward.',
 prov:{who:'Erskine Gwynne (published by Harry MacElhone)',where:'Harry’s New York Bar, Paris',year:'1927',conf:'high',note:''}});
add({id:'clover-club',name:'Clover Club',cat:'Classic',fam:'Daiquiri',base:'Gin',m:'dryshake',glass:'Coupe',ice:'Up',garnish:'Raspberries',
 spec:[[1.5,'oz','gin'],[0.5,'oz','dryvermouth'],[0.5,'oz','lemon'],[0.5,'oz','grenadine',{label:'Raspberry syrup'}],[1,'white','eggwhite']],
 flav:['fruity','citrusy'],tech:['dry-shake','shake'],
 prov:{who:'Clover Club (Philadelphia gentlemen’s club)',where:'Bellevue-Stratford Hotel, Philadelphia',year:'pre-1910',conf:'medium',note:'Dry vermouth version popularized by Julie Reiner’s Clover Club bar (Brooklyn).'}});
add({id:'french-75',name:'French 75',cat:'Classic',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Flute',ice:'Up',garnish:'Lemon twist',
 spec:[[1,'oz','gin'],[0.5,'oz','lemon'],[0.5,'oz','simple'],[3,'top','champagne']],
 flav:['citrusy','refreshing'],tech:['shake','top'],parentText:'Tom Collins',changed:'Champagne replaces soda.',
 prov:{who:'Unknown (named for a French 75 mm field gun)',where:'Paris / London',year:'1920s',conf:'medium',note:'Printed versions vary (gin vs cognac).'}});
add({id:'whiskey-sour',name:'Whiskey Sour',cat:'Classic',fam:'Daiquiri',base:'Whiskey',m:'shake',glass:'Rocks',ice:'Large cube',garnish:'Angostura drops (if using egg white)',
 spec:[[2,'oz','bourbon'],[0.75,'oz','lemon'],[0.75,'oz','simple']],
 flav:['citrusy'],tech:['shake'],
 prov:{who:'Jerry Thomas (first printed)',where:'United States',year:'1862',conf:'high',note:'Older than the Daiquiri; same sour template. Add an egg white for the silky style.'}});
add({id:'mojito',name:'Mojito',cat:'Classic',fam:'Daiquiri',base:'Rum',m:'shake',glass:'Highball',ice:'Crushed',garnish:'Mint bouquet',
 spec:[[2,'oz','whiterum'],[0.75,'oz','lime'],[0.75,'oz','simple'],[8,'leaf','mint'],[1,'top','soda']],
 flav:['refreshing','herbal','citrusy'],tech:['muddle','shake','top'],
 prov:{who:'Unknown',where:'Havana, Cuba',year:'by the 1930s',conf:'low',note:'Linked to the older El Draque; Drake legends are unverifiable.'}});
add({id:'gimlet',name:'Gimlet',cat:'Classic',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'Lime wheel',
 spec:[[2,'oz','gin'],[0.75,'oz','lime'],[0.75,'oz','simple']],
 flav:['citrusy','refreshing'],tech:['shake'],
 prov:{who:'Royal Navy tradition (name origin unconfirmed)',where:'Britain',year:'early 1900s',conf:'low',note:'Classic form used Rose’s lime cordial; this is the fresh-lime build.'}});

/* ===== TIKI (10) ===== */
add({id:'mai-tai',name:'Mai Tai',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'shake',glass:'Double rocks',ice:'Crushed',garnish:'Mint sprig, spent lime shell',
 spec:[[2,'oz','jamaicanrum'],[1,'oz','lime'],[0.5,'oz','curacao'],[0.25,'oz','orgeat'],[0.25,'oz','rockcandy']],
 flav:['tropical','nutty','citrusy'],tech:['shake'],
 prov:{who:'Victor “Trader Vic” Bergeron',where:'Trader Vic’s, Oakland, CA',year:'1944',conf:'high',note:'Original rum (17-year J. Wray & Nephew) is long gone; modern builds use a blend.'}});
add({id:'zombie',name:'Zombie (1934)',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'blend',glass:'Collins / Zombie glass',ice:'Crushed',garnish:'Mint sprig',
 spec:[[1.5,'oz','goldrum'],[1.5,'oz','jamaicanrum'],[1,'oz','demerara151'],[0.75,'oz','lime'],[0.5,'oz','donsmix'],[0.5,'oz','falernum'],[1,'tsp','grenadine'],[6,'drop','absinthe',{label:'Pernod or absinthe'}],[1,'dash','angostura']],
 flav:['tropical','spicy'],tech:['flash-blend'],
 prov:{who:'Donn Beach (Don the Beachcomber); recipe reconstructed by Jeff “Beachbum” Berry',where:'Don the Beachcomber, Hollywood',year:'1934',conf:'medium',note:'Don coded his recipes; this spec comes from Berry’s research.'}});
add({id:'jungle-bird',name:'Jungle Bird',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'shake',glass:'Double rocks',ice:'Large cube or crushed',garnish:'Pineapple wedge',
 spec:[[1.5,'oz','blackstrap'],[0.75,'oz','campari'],[1.5,'oz','pineapple'],[0.5,'oz','lime'],[0.5,'oz','demerarasyrup']],
 flav:['bitter','tropical'],tech:['shake'],
 prov:{who:'Attributed to Jeffrey Ong; modern blackstrap spec popularized by Giuseppe González',where:'Aviary Bar, Kuala Lumpur Hilton',year:'1978',conf:'medium',note:'Original used more pineapple and a darker Jamaican rum.'}});
add({id:'saturn',name:'Saturn',cat:'Tiki',fam:'Daiquiri',base:'Gin',m:'blend',glass:'Coupe or tiki glass',ice:'Crushed',garnish:'Lemon peel “ring”, cherry',
 spec:[[1.25,'oz','gin'],[0.5,'oz','lemon'],[0.5,'oz','passionsyrup'],[0.25,'oz','orgeat'],[0.25,'oz','falernum']],
 flav:['tropical','floral','citrusy'],tech:['flash-blend'],
 prov:{who:'J. “Popo” Galsini',where:'California',year:'1967',conf:'medium',note:'A rare gin-based tiki classic; won a 1967 cocktail competition.'}});
add({id:'painkiller',name:'Painkiller',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'shake',glass:'Tiki mug or hurricane',ice:'Crushed',garnish:'Fresh nutmeg, orange wheel',
 spec:[[2,'oz','navyrum'],[4,'oz','pineapple'],[1,'oz','orange'],[1,'oz','creamcoconut']],
 flav:['tropical','creamy','sweet'],tech:['shake'],
 prov:{who:'Daphne Henderson',where:'Soggy Dollar Bar, Jost Van Dyke, BVI',year:'1970s',conf:'high',note:'The name is now a Pusser’s trademark.'}});
add({id:'three-dots',name:'Three Dots and a Dash',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'blend',glass:'Tulip / tiki glass',ice:'Crushed',garnish:'Three cherries and a pineapple chunk on a pick',
 spec:[[1.5,'oz','agricole'],[0.5,'oz','demerararum'],[0.5,'oz','lime'],[0.5,'oz','orange'],[0.5,'oz','honey'],[0.25,'oz','falernum'],[0.25,'oz','allspice'],[1,'dash','angostura']],
 flav:['tropical','spicy'],tech:['flash-blend'],
 prov:{who:'Donn Beach',where:'Don the Beachcomber, Hollywood',year:'1940s',conf:'high',note:'Morse code for “V” (Victory) — a WWII-era drink.'}});
add({id:'test-pilot',name:'Test Pilot',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'blend',glass:'Double rocks',ice:'Crushed',garnish:'Cherry',
 spec:[[1.5,'oz','jamaicanrum'],[0.75,'oz','goldrum'],[0.5,'oz','lime'],[0.5,'oz','falernum'],[0.5,'oz','cointreau'],[1,'dash','angostura'],[6,'drop','absinthe',{label:'Pernod or absinthe'}]],
 flav:['tropical','spicy'],tech:['flash-blend'],
 prov:{who:'Donn Beach',where:'Don the Beachcomber, Hollywood',year:'1941',conf:'medium',note:'Parent of the Space Pilot and Ace Pilot.'}});
add({id:'ancient-mariner',name:'Ancient Mariner',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'shake',glass:'Double rocks',ice:'Crushed',garnish:'Lime shell, mint',
 spec:[[1,'oz','demerararum'],[1,'oz','jamaicanrum'],[0.75,'oz','lime'],[0.5,'oz','grapefruit'],[0.5,'oz','simple'],[0.25,'oz','allspice']],
 flav:['tropical','spicy'],tech:['shake'],
 prov:{who:'Jeff “Beachbum” Berry',where:'Los Angeles',year:'1994',conf:'high',note:'A modern drink written in vintage Don-era style.'}});
add({id:'navy-grog',name:'Navy Grog',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'blend',glass:'Double rocks',ice:'Ice cone or crushed',garnish:'Ice cone with straw',
 spec:[[1,'oz','demerararum'],[1,'oz','jamaicanrum'],[1,'oz','whiterum'],[0.75,'oz','lime'],[0.75,'oz','grapefruit'],[1,'oz','honey'],[0.75,'oz','soda']],
 flav:['tropical','citrusy'],tech:['flash-blend'],
 prov:{who:'Donn Beach',where:'Don the Beachcomber, Hollywood',year:'1941',conf:'medium',note:'Trader Vic made a different version with allspice.'}});
add({id:'fog-cutter',name:'Fog Cutter',cat:'Tiki',fam:'Daiquiri',base:'Rum',m:'shake',glass:'Tiki mug',ice:'Crushed',garnish:'Mint sprig',
 spec:[[2,'oz','whiterum'],[1,'oz','cognac'],[0.5,'oz','gin'],[2,'oz','lemon'],[1,'oz','orange'],[0.5,'oz','orgeat'],[0.5,'oz','amontillado',{post:true,label:'Cream or amontillado sherry, float'}]],
 flav:['tropical','citrusy'],tech:['shake','float'],
 prov:{who:'Victor “Trader Vic” Bergeron',where:'Trader Vic’s, Oakland, CA',year:'1940s',conf:'medium',note:'Sherry float is the signature.'}});

/* ===== MODERN CLASSICS (70) ===== */
add({id:'penicillin',name:'Penicillin',cat:'Modern',fam:'Daiquiri',base:'Whiskey',m:'shake',glass:'Rocks',ice:'Large cube',garnish:'Candied ginger',
 spec:[[2,'oz','scotch'],[0.75,'oz','lemon'],[0.75,'oz','honeyginger'],[0.25,'oz','islay',{post:true,label:'Islay Scotch, float'}]],
 flav:['smoky','citrusy','spicy'],tech:['shake','float'],parent:'gold-rush',changed:'Blended Scotch base, honey-ginger syrup, Islay float.',
 prov:{who:'Sam Ross',where:'Milk & Honey, NYC',year:'2005',conf:'high',note:''}});
add({id:'paper-plane',name:'Paper Plane',cat:'Modern',fam:'Sidecar',base:'Whiskey',m:'shake',glass:'Coupe',ice:'Up',garnish:'None (or a tiny paper plane)',
 spec:[[0.75,'oz','bourbon'],[0.75,'oz','aperol'],[0.75,'oz','nonino'],[0.75,'oz','lemon']],
 flav:['bitter','citrusy'],tech:['shake'],parent:'last-word',changed:'Keeps the equal-parts frame; bourbon, Aperol, Amaro Nonino, lemon.',
 prov:{who:'Sam Ross',where:'Created for The Violet Hour, Chicago',year:'2007',conf:'high',note:'Early version used Campari before settling on Aperol.'}});
add({id:'gold-rush',name:'Gold Rush',cat:'Modern',fam:'Daiquiri',base:'Whiskey',m:'shake',glass:'Rocks',ice:'Large cube',garnish:'None',
 spec:[[2,'oz','bourbon'],[0.75,'oz','lemon'],[0.75,'oz','honey',{note:'Honey syrup ratios vary (1:1 to 3:1); verify'}]],
 flav:['citrusy','rich'],tech:['shake'],parent:'whiskey-sour',changed:'Honey syrup replaces simple syrup.',
 prov:{who:'T.J. Siegal',where:'Milk & Honey, NYC',year:'c. 2000',conf:'medium',note:''}});
add({id:'old-cuban',name:'Old Cuban',cat:'Modern',fam:'Daiquiri',base:'Rum',m:'shake',glass:'Coupe',ice:'Up',garnish:'Mint leaf',
 spec:[[1.5,'oz','agedrum'],[0.75,'oz','lime'],[1,'oz','simple'],[6,'leaf','mint'],[2,'dash','angostura'],[2,'top','champagne']],
 flav:['refreshing','herbal'],tech:['muddle','shake','top'],parent:'mojito',changed:'Aged rum, Angostura, topped with Champagne instead of soda, served up.',
 prov:{who:'Audrey Saunders',where:'Bemelmans Bar, NYC',year:'2001',conf:'high',note:''}});
add({id:'gin-gin-mule',name:'Gin-Gin Mule',cat:'Modern',fam:'Whiskey Highball',base:'Gin',m:'shake',glass:'Highball',ice:'Cubes',garnish:'Mint sprig, candied ginger',
 spec:[[1.75,'oz','gin'],[0.75,'oz','lime'],[1,'oz','simple'],[6,'leaf','mint'],[1,'top','gingerbeer']],
 flav:['refreshing','spicy','herbal'],tech:['muddle','shake','top'],parentText:'Moscow Mule',changed:'Gin, mint and a Mojito-style build; house ginger beer.',
 prov:{who:'Audrey Saunders',where:'Beacon, NYC (later Pegu Club)',year:'2000',conf:'medium',note:''}});
add({id:'oaxaca-of',name:'Oaxaca Old Fashioned',cat:'Modern',fam:'Old-Fashioned',base:'Agave',m:'stir',glass:'Rocks',ice:'Large cube',garnish:'Flamed orange twist',
 spec:[[1.5,'oz','reposado'],[0.5,'oz','mezcal'],[1,'tsp','agave'],[2,'dash','angostura']],
 flav:['smoky','spirit-forward'],tech:['stir','flamed-twist'],parent:'old-fashioned',changed:'Reposado and mezcal split base, agave syrup.',
 prov:{who:'Phil Ward',where:'Death & Co, NYC',year:'2007',conf:'high',note:''}});
add({id:'naked-famous',name:'Naked and Famous',cat:'Modern',fam:'Sidecar',base:'Agave',m:'shake',glass:'Coupe',ice:'Up',garnish:'None',
 spec:[[0.75,'oz','mezcal'],[0.75,'oz','yellowchartreuse'],[0.75,'oz','aperol'],[0.75,'oz','lime']],
 flav:['smoky','herbal','bitter'],tech:['shake'],parent:'paper-plane',changed:'Mezcal, yellow Chartreuse, lime; Aperol stays.',
 prov:{who:'Joaquín Simó',where:'Death & Co, NYC',year:'2011',conf:'high',note:'Simó described it as a Last Word / Paper Plane mash-up.'}});
add({id:'division-bell',name:'Division Bell',cat:'Modern',fam:'Sidecar',base:'Agave',m:'shake',glass:'Coupe',ice:'Up',garnish:'Grapefruit twist',
 spec:[[1,'oz','mezcal'],[0.75,'oz','aperol'],[0.5,'oz','maraschino'],[0.75,'oz','lime']],
 flav:['smoky','bitter','citrusy'],tech:['shake'],parent:'last-word',changed:'Mezcal, Aperol replaces Chartreuse, uneven ratios.',
 prov:{who:'Phil Ward',where:'Mayahuel, NYC',year:'2009',conf:'medium',note:''}});
add({id:'final-ward',name:'Final Ward',cat:'Modern',fam:'Sidecar',base:'Whiskey',m:'shake',glass:'Coupe',ice:'Up',garnish:'None',
 spec:[[0.75,'oz','rye'],[0.75,'oz','greenchartreuse'],[0.75,'oz','maraschino'],[0.75,'oz','lemon']],
 flav:['herbal','citrusy'],tech:['shake'],parent:'last-word',changed:'Rye for gin, lemon for lime.',
 prov:{who:'Phil Ward',where:'Death & Co, NYC',year:'2007',conf:'high',note:''}});
add({id:'trinidad-especial',name:'Trinidad Especial',cat:'Modern',fam:'Daiquiri',base:'Amaro & Liqueur',m:'shake',glass:'Coupe',ice:'Up',garnish:'None',
 spec:[[1,'oz','angostura'],[1,'oz','pisco'],[0.75,'oz','lime'],[0.75,'oz','orgeat']],
 flav:['spicy','nutty','bitter'],tech:['shake'],parentText:'Pisco Sour',changed:'An ounce of Angostura moves into the base.',
 prov:{who:'Valentino Bolognese',where:'Italy (competition entry)',year:'c. 2008',conf:'medium',note:'Credited as the inspiration for the Trinidad Sour; verify date.'}});
add({id:'trinidad-sour',name:'Trinidad Sour',cat:'Modern',fam:'Daiquiri',base:'Amaro & Liqueur',m:'shake',glass:'Coupe',ice:'Up',garnish:'None',
 spec:[[1.5,'oz','angostura'],[1,'oz','orgeat'],[0.75,'oz','lemon'],[0.5,'oz','rye']],
 flav:['spicy','nutty','bitter'],tech:['shake'],parent:'trinidad-especial',changed:'More Angostura, rye replaces pisco, lemon replaces lime.',
 prov:{who:'Giuseppe González',where:'Clover Club, Brooklyn',year:'2009',conf:'medium',note:''}});
add({id:'bramble',name:'Bramble',cat:'Modern',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Rocks',ice:'Crushed',garnish:'Blackberry, lemon wheel',
 spec:[[2,'oz','gin'],[1,'oz','lemon'],[0.5,'oz','simple'],[0.5,'oz','mure',{post:true,label:'Crème de mûre, drizzled over'}]],
 flav:['fruity','citrusy'],tech:['shake','float'],parentText:'Gin Sour / Fix',changed:'Crushed ice and a blackberry-liqueur drizzle.',
 prov:{who:'Dick Bradsell',where:'Fred’s Club, London',year:'1984',conf:'high',note:''}});
add({id:'espresso-martini',name:'Espresso Martini',cat:'Modern',fam:'Martini',base:'Vodka',m:'shake',glass:'Coupe',ice:'Up',garnish:'Three coffee beans',
 spec:[[1.75,'oz','vodka'],[1,'oz','espresso'],[0.5,'oz','coffeeliqueur'],[0.25,'oz','simple']],
 flav:['coffee','rich'],tech:['shake'],parentText:'Black Russian',changed:'Fresh espresso, shaken hard for crema; served up.',famNote:'Family placement is my call (spirit + modifier, no acid).',
 prov:{who:'Dick Bradsell',where:'London (first called the Vodka Espresso)',year:'c. 1983',conf:'medium',note:'Venue is reported differently in different sources.'}});
add({id:'cosmopolitan',name:'Cosmopolitan',cat:'Modern',fam:'Sidecar',base:'Vodka',m:'shake',glass:'Coupe',ice:'Up',garnish:'Flamed orange twist or lime wheel',
 spec:[[1.5,'oz','citronvodka'],[0.75,'oz','cointreau'],[0.75,'oz','lime'],[0.5,'oz','cranberry']],
 flav:['fruity','citrusy'],tech:['shake'],parentText:'Kamikaze',changed:'Citrus vodka and a splash of cranberry.',
 prov:{who:'Toby Cecchini (popular version); earlier claims include Cheryl Cook',where:'The Odeon, NYC',year:'1988',conf:'medium',note:''}});
add({id:'tommys',name:'Tommy’s Margarita',cat:'Modern',fam:'Daiquiri',base:'Agave',m:'shake',glass:'Rocks',ice:'Cubes',garnish:'Lime wheel',
 spec:[[2,'oz','blanco'],[1,'oz','lime'],[0.5,'oz','agave']],
 flav:['citrusy','refreshing'],tech:['shake'],parent:'margarita',changed:'Agave syrup replaces orange liqueur, which moves it back to the Daiquiri template.',
 prov:{who:'Julio Bermejo',where:'Tommy’s Mexican Restaurant, San Francisco',year:'c. 1990',conf:'high',note:''}});
add({id:'siesta',name:'Siesta',cat:'Modern',fam:'Daiquiri',base:'Agave',m:'shake',glass:'Coupe',ice:'Up',garnish:'Grapefruit twist',
 spec:[[1.5,'oz','blanco'],[0.5,'oz','campari'],[0.5,'oz','lime'],[0.5,'oz','grapefruit'],[0.5,'oz','simple']],
 flav:['bitter','citrusy'],tech:['shake'],parentText:'Hemingway Daiquiri',changed:'Tequila for rum, Campari for maraschino.',
 prov:{who:'Katie Stipe',where:'Flatiron Lounge, NYC',year:'2006',conf:'medium',note:''}});
add({id:'enzoni',name:'Enzoni',cat:'Modern',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Rocks',ice:'Large cube',garnish:'Grape',
 spec:[[1,'oz','gin'],[1,'oz','campari'],[0.75,'oz','lemon'],[0.5,'oz','simple'],[5,'whole','grapes']],
 flav:['bitter','fruity'],tech:['muddle','shake'],parent:'negroni',changed:'Vermouth out; lemon, syrup and muddled grapes make it a sour.',
 prov:{who:'Vincenzo Errico',where:'Milk & Honey, NYC',year:'c. 2003',conf:'medium',note:''}});
add({id:'little-italy',name:'Little Italy',cat:'Modern',fam:'Martini',base:'Whiskey',m:'stir',glass:'Coupe',ice:'Up',garnish:'Brandied cherries',
 spec:[[2,'oz','rye'],[0.75,'oz','sweetvermouth'],[0.5,'oz','cynar']],
 flav:['bitter','spirit-forward'],tech:['stir'],parent:'manhattan',changed:'Cynar replaces the bitters and part of the vermouth.',
 prov:{who:'Audrey Saunders',where:'Pegu Club, NYC',year:'2005',conf:'high',note:''}});
add({id:'red-hook',name:'Red Hook',cat:'Modern',fam:'Martini',base:'Whiskey',m:'stir',glass:'Coupe',ice:'Up',garnish:'Cherry',
 spec:[[2,'oz','rye'],[0.5,'oz','puntemes'],[0.5,'oz','maraschino']],
 flav:['spirit-forward','bitter'],tech:['stir'],parentText:'Brooklyn',changed:'Punt e Mes and maraschino; first of the Brooklyn-neighborhood riffs.',
 prov:{who:'Vincenzo Errico',where:'Milk & Honey, NYC',year:'2003',conf:'high',note:''}});
add({id:'greenpoint',name:'Greenpoint',cat:'Modern',fam:'Martini',base:'Whiskey',m:'stir',glass:'Coupe',ice:'Up',garnish:'Lemon twist',
 spec:[[2,'oz','rye'],[0.5,'oz','yellowchartreuse'],[0.5,'oz','sweetvermouth'],[1,'dash','angostura'],[1,'dash','orangebitters']],
 flav:['herbal','spirit-forward'],tech:['stir'],parentText:'Brooklyn',changed:'Yellow Chartreuse with sweet vermouth.',
 prov:{who:'Michael McIlroy',where:'Milk & Honey, NYC',year:'2006',conf:'high',note:''}});
add({id:'slope',name:'Slope',cat:'Modern',fam:'Martini',base:'Whiskey',m:'stir',glass:'Coupe',ice:'Up',garnish:'Cherry',
 spec:[[2.5,'oz','rye'],[0.75,'oz','puntemes'],[0.25,'oz','apricotliqueur'],[1,'dash','angostura']],
 flav:['spirit-forward','fruity'],tech:['stir'],parentText:'Brooklyn',changed:'Punt e Mes and apricot liqueur.',
 prov:{who:'Julie Reiner',where:'Clover Club, Brooklyn',year:'c. 2008',conf:'medium',note:''}});
add({id:'carroll-gardens',name:'Carroll Gardens',cat:'Modern',fam:'Martini',base:'Whiskey',m:'stir',glass:'Coupe',ice:'Up',garnish:'Lemon twist',
 spec:[[2.5,'oz','rye'],[0.5,'oz','puntemes'],[0.5,'oz','nardini'],[1,'tsp','maraschino']],
 flav:['bitter','spirit-forward'],tech:['stir'],parentText:'Brooklyn',changed:'Amaro Nardini and Punt e Mes.',
 prov:{who:'Joaquín Simó',where:'NYC',year:'c. 2008',conf:'medium',note:''}});
add({id:'cobble-hill',name:'Cobble Hill',cat:'Modern',fam:'Martini',base:'Whiskey',m:'stir',glass:'Coupe',ice:'Up',garnish:'Cucumber slice',
 spec:[[2,'oz','rye'],[0.75,'oz','dryvermouth'],[0.25,'oz','montenegro'],[3,'slice','cucumber']],
 flav:['refreshing','spirit-forward'],tech:['muddle','stir'],parentText:'Brooklyn',changed:'Dry vermouth, Montenegro and muddled cucumber.',
 prov:{who:'Sam Ross',where:'Milk & Honey, NYC',year:'c. 2007',conf:'medium',note:''}});
add({id:'bentons',name:'Benton’s Old Fashioned',cat:'Modern',fam:'Old-Fashioned',base:'Whiskey',m:'stir',glass:'Rocks',ice:'Large cube',garnish:'Orange twist',
 spec:[[2,'oz','baconbourbon'],[0.25,'oz','maple'],[2,'dash','angostura']],
 flav:['smoky','rich'],tech:['fat-wash','stir'],parent:'old-fashioned',changed:'Bacon fat-washed bourbon, maple syrup.',
 prov:{who:'Don Lee',where:'PDT, NYC',year:'2007',conf:'high',note:''}});
add({id:'whiskey-smash',name:'Whiskey Smash',cat:'Modern',fam:'Daiquiri',base:'Whiskey',m:'shake',glass:'Rocks',ice:'Crushed',garnish:'Mint sprig',
 spec:[[2,'oz','bourbon'],[0.75,'oz','lemon',{label:'Lemon (3 wedges, muddled)'}],[0.75,'oz','simple'],[8,'leaf','mint']],
 flav:['refreshing','herbal','citrusy'],tech:['muddle','shake'],parentText:'Smash / Julep (Jerry Thomas era)',changed:'Muddled lemon wedges turn the old Smash into a sour.',
 prov:{who:'Dale DeGroff (modern revival)',where:'Rainbow Room, NYC',year:'1990s (Smash printed 1887)',conf:'medium',note:''}});
add({id:'gin-basil-smash',name:'Gin Basil Smash',cat:'Modern',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Rocks',ice:'Cubes',garnish:'Basil sprig',
 spec:[[2,'oz','gin'],[0.75,'oz','lemon'],[0.5,'oz','simple'],[1,'handful','basil']],
 flav:['herbal','refreshing'],tech:['muddle','shake'],parent:'whiskey-smash',changed:'Gin and a big handful of basil instead of whiskey and mint.',
 prov:{who:'Jörg Meyer',where:'Le Lion, Hamburg',year:'2008',conf:'high',note:''}});
add({id:'kentucky-buck',name:'Kentucky Buck',cat:'Modern',fam:'Whiskey Highball',base:'Whiskey',m:'shake',glass:'Collins',ice:'Cubes',garnish:'Lemon wheel, strawberry',
 spec:[[2,'oz','bourbon'],[0.75,'oz','lemon'],[0.75,'oz','simple'],[1,'whole','strawberry'],[2,'dash','angostura'],[1.5,'top','gingerbeer']],
 flav:['fruity','spicy','refreshing'],tech:['muddle','shake','top'],parentText:'Buck (spirit, citrus, ginger beer)',changed:'Muddled strawberry and Angostura.',
 prov:{who:'Erick Castro',where:'Rickhouse, San Francisco',year:'c. 2008',conf:'medium',note:''}});
add({id:'white-negroni',name:'White Negroni',cat:'Modern',fam:'Martini',base:'Gin',m:'stir',glass:'Rocks',ice:'Large cube',garnish:'Lemon twist',
 spec:[[1.5,'oz','gin'],[1,'oz','lillet'],[0.75,'oz','suze']],
 flav:['bitter','floral'],tech:['stir'],parent:'negroni',changed:'Suze for Campari, Lillet Blanc for sweet vermouth.',
 prov:{who:'Wayne Collins',where:'Bordeaux, France (VinExpo)',year:'2001',conf:'high',note:''}});
add({id:'kingston-negroni',name:'Kingston Negroni',cat:'Modern',fam:'Martini',base:'Rum',m:'stir',glass:'Rocks',ice:'Large cube',garnish:'Orange twist',
 spec:[[1,'oz','smithcross'],[1,'oz','campari'],[1,'oz','sweetvermouth']],
 flav:['bitter','rich'],tech:['stir'],parent:'negroni',changed:'Funky navy-strength Jamaican rum replaces gin.',
 prov:{who:'Joaquín Simó',where:'Death & Co, NYC',year:'c. 2009',conf:'medium',note:''}});
add({id:'negroni-sbagliato',name:'Negroni Sbagliato',cat:'Modern',fam:'Martini',base:'Wine & Sherry',m:'build',glass:'Rocks or wine glass',ice:'Cubes',garnish:'Orange slice',
 spec:[[1,'oz','campari'],[1,'oz','sweetvermouth'],[1.5,'top','prosecco']],
 flav:['bitter','refreshing'],tech:['build','top'],parent:'negroni',changed:'Sparkling wine replaces the gin ("sbagliato" = mistaken).',
 prov:{who:'Mirko Stocchetto',where:'Bar Basso, Milan',year:'1972',conf:'medium',note:'Date is reported anywhere from the late 1960s to early 1970s.'}});
add({id:'conference',name:'Conference',cat:'Modern',fam:'Old-Fashioned',base:'Whiskey',m:'stir',glass:'Rocks',ice:'Large cube',garnish:'Lemon and orange twists',
 spec:[[0.5,'oz','rye'],[0.5,'oz','bourbon'],[0.5,'oz','calvados'],[0.5,'oz','cognac'],[1,'tsp','demerarasyrup'],[2,'dash','angostura'],[1,'dash','molebitters']],
 flav:['spirit-forward','rich'],tech:['stir'],parent:'old-fashioned',changed:'Four-way split base.',
 prov:{who:'Brian Miller',where:'Death & Co, NYC',year:'2008',conf:'high',note:''}});
add({id:'elder-fashion',name:'Elder Fashion',cat:'Modern',fam:'Old-Fashioned',base:'Gin',m:'stir',glass:'Rocks',ice:'Large cube',garnish:'Grapefruit twist',
 spec:[[2,'oz','plymouth'],[0.5,'oz','stgermain'],[1,'dash','orangebitters']],
 flav:['floral','spirit-forward'],tech:['stir'],parent:'old-fashioned',changed:'Gin base; elderflower liqueur is the sweetener.',
 prov:{who:'Phil Ward',where:'Death & Co, NYC',year:'c. 2007',conf:'medium',note:''}});
add({id:'rome-with-a-view',name:'Rome with a View',cat:'Modern',fam:'Whiskey Highball',base:'Amaro & Liqueur',m:'shake',glass:'Collins',ice:'Cubes',garnish:'Orange slice',
 spec:[[1,'oz','campari'],[1,'oz','dryvermouth'],[0.75,'oz','lime'],[0.75,'oz','simple'],[2,'top','soda']],
 flav:['bitter','refreshing'],tech:['shake','top'],parentText:'Americano',changed:'Dry vermouth, lime and syrup; shaken and lengthened like a Collins.',
 prov:{who:'Michael McIlroy',where:'Milk & Honey, NYC',year:'c. 2007',conf:'medium',note:''}});
add({id:'bitter-giuseppe',name:'Bitter Giuseppe',cat:'Modern',fam:'Martini',base:'Amaro & Liqueur',m:'stir',glass:'Rocks',ice:'Large cube',garnish:'Lemon twist',
 spec:[[2,'oz','cynar'],[1,'oz','sweetvermouth'],[0.25,'oz','lemon'],[6,'dash','orangebitters']],
 flav:['bitter','rich'],tech:['stir'],parent:'manhattan',changed:'Cynar becomes the base; a touch of lemon.',
 prov:{who:'Stephen Cole',where:'The Violet Hour, Chicago',year:'c. 2008',conf:'medium',note:''}});
add({id:'industry-sour',name:'Industry Sour',cat:'Modern',fam:'Daiquiri',base:'Amaro & Liqueur',m:'shake',glass:'Coupe',ice:'Up',garnish:'None',
 spec:[[1,'oz','fernet'],[1,'oz','greenchartreuse'],[0.75,'oz','lime'],[0.75,'oz','simple']],
 flav:['bitter','herbal'],tech:['shake'],parentText:'Sour template',changed:'Fernet and green Chartreuse as a split base.',
 prov:{who:'Unverified',where:'—',year:'2010s',conf:'low',note:'Creator is not reliably documented; confirm before citing.'}});
add({id:'earl-grey-marteani',name:'Earl Grey MarTEAni',cat:'Modern',fam:'Daiquiri',base:'Gin',m:'dryshake',glass:'Coupe',ice:'Up',garnish:'Lemon twist, half sugar rim',
 spec:[[1.5,'oz','earlgreygin'],[0.75,'oz','lemon'],[1,'oz','simple'],[1,'white','eggwhite']],
 flav:['floral','citrusy'],tech:['infusion','dry-shake','shake'],parentText:'Gin Sour',changed:'Tea-infused gin and egg white.',
 prov:{who:'Audrey Saunders',where:'Pegu Club, NYC',year:'c. 2005',conf:'medium',note:''}});
add({id:'chartreuse-swizzle',name:'Chartreuse Swizzle',cat:'Modern',fam:'Daiquiri',base:'Amaro & Liqueur',m:'swizzle',glass:'Collins',ice:'Crushed',garnish:'Mint sprig, nutmeg',
 spec:[[1.5,'oz','greenchartreuse'],[1,'oz','pineapple'],[0.75,'oz','lime'],[0.5,'oz','falernum']],
 flav:['herbal','tropical'],tech:['swizzle'],parentText:'Queen’s Park Swizzle',changed:'Green Chartreuse as the base, pineapple and falernum.',
 prov:{who:'Marcovaldo Dionysos',where:'San Francisco',year:'c. 2002',conf:'high',note:''}});
add({id:'fitzgerald',name:'Fitzgerald',cat:'Modern',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Rocks',ice:'Cubes',garnish:'Lemon wheel',
 spec:[[1.5,'oz','gin'],[0.75,'oz','lemon'],[0.75,'oz','simple'],[2,'dash','angostura']],
 flav:['citrusy'],tech:['shake'],parentText:'Gin Sour',changed:'Angostura added; served on the rocks.',
 prov:{who:'Dale DeGroff',where:'Rainbow Room, NYC',year:'1990s',conf:'medium',note:''}});
add({id:'revolver',name:'Revolver',cat:'Modern',fam:'Martini',base:'Whiskey',m:'stir',glass:'Coupe',ice:'Up',garnish:'Flamed orange twist',
 spec:[[2,'oz','bourbon'],[0.5,'oz','coffeeliqueur'],[2,'dash','orangebitters']],
 flav:['coffee','spirit-forward'],tech:['stir','flamed-twist'],parent:'manhattan',changed:'Coffee liqueur replaces sweet vermouth.',
 prov:{who:'Jon Santer',where:'Bruno’s, San Francisco',year:'2004',conf:'high',note:''}});
add({id:'black-manhattan',name:'Black Manhattan',cat:'Modern',fam:'Martini',base:'Whiskey',m:'stir',glass:'Coupe',ice:'Up',garnish:'Brandied cherry',
 spec:[[2,'oz','rye'],[1,'oz','averna'],[1,'dash','angostura'],[1,'dash','orangebitters']],
 flav:['bitter','rich'],tech:['stir'],parent:'manhattan',changed:'Averna replaces sweet vermouth.',
 prov:{who:'Todd Smith',where:'Bourbon & Branch, San Francisco',year:'2005',conf:'high',note:''}});
add({id:'juliet-romeo',name:'Juliet & Romeo',cat:'Modern',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'Mint leaf, rose water and Angostura drops',
 spec:[[2,'oz','gin'],[0.75,'oz','lime'],[0.75,'oz','simple'],[3,'slice','cucumber'],[3,'sprig','mint'],[1,'pinch','salt'],[3,'drop','rosewater']],
 flav:['floral','refreshing'],tech:['muddle','shake'],parent:'gimlet',changed:'Cucumber, mint, salt and rose.',
 prov:{who:'Toby Maloney',where:'The Violet Hour, Chicago',year:'2007',conf:'medium',note:''}});
add({id:'eastside',name:'Eastside',cat:'Modern',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'Cucumber slice',
 spec:[[2,'oz','gin'],[0.75,'oz','lime'],[0.75,'oz','simple'],[3,'slice','cucumber'],[8,'leaf','mint']],
 flav:['refreshing','herbal'],tech:['muddle','shake'],parentText:'Southside',changed:'Muddled cucumber.',
 prov:{who:'Attributed to George Delgado',where:'NYC',year:'2000s',conf:'low',note:'Attribution varies; verify.'}});
add({id:'kentucky-maid',name:'Kentucky Maid',cat:'Modern',fam:'Daiquiri',base:'Whiskey',m:'shake',glass:'Rocks',ice:'Large cube',garnish:'Cucumber wheel',
 spec:[[2,'oz','bourbon'],[0.75,'oz','lime'],[0.75,'oz','simple'],[2,'slice','cucumber'],[8,'leaf','mint']],
 flav:['refreshing','herbal'],tech:['muddle','shake'],parent:'eastside',changed:'Bourbon for gin.',
 prov:{who:'Sam Ross',where:'Milk & Honey, NYC',year:'c. 2005',conf:'medium',note:''}});
add({id:'cable-car',name:'Cable Car',cat:'Modern',fam:'Sidecar',base:'Rum',m:'shake',glass:'Coupe',ice:'Up',garnish:'Cinnamon-sugar rim, orange spiral',
 spec:[[1.5,'oz','spicedrum'],[0.75,'oz','curacao'],[0.75,'oz','lemon'],[0.5,'oz','simple']],
 flav:['spicy','citrusy'],tech:['shake'],parent:'sidecar',changed:'Spiced rum, orange curaçao, cinnamon-sugar rim.',
 prov:{who:'Tony Abou-Ganim',where:'Starlight Room, San Francisco',year:'1996',conf:'high',note:''}});
add({id:'too-soon',name:'Too Soon?',cat:'Modern',fam:'Daiquiri',base:'Amaro & Liqueur',m:'shake',glass:'Coupe',ice:'Up',garnish:'Orange twist',
 spec:[[1,'oz','gin'],[1,'oz','cynar'],[0.75,'oz','lemon'],[0.5,'oz','simple'],[2,'slice','orangeslice']],
 flav:['bitter','citrusy'],tech:['shake'],parentText:'Gin Sour',changed:'Half the base becomes Cynar; orange slices shaken in.',
 prov:{who:'Sam Ross',where:'Milk & Honey / Attaboy, NYC',year:'c. 2008',conf:'low',note:'Verify date and venue.'}});
add({id:'water-lily',name:'Water Lily',cat:'Modern',fam:'Sidecar',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'Orange twist',
 spec:[[0.75,'oz','gin'],[0.75,'oz','cointreau'],[0.75,'oz','violette'],[0.75,'oz','lemon']],
 flav:['floral','citrusy'],tech:['shake'],parent:'corpse-reviver-2',changed:'Crème de violette takes Lillet’s slot; no absinthe.',
 prov:{who:'Richard Boccato',where:'NYC',year:'c. 2007',conf:'medium',note:''}});
add({id:'gin-blossom',name:'Gin Blossom',cat:'Modern',fam:'Martini',base:'Gin',m:'stir',glass:'Coupe',ice:'Up',garnish:'Orange twist',
 spec:[[1.5,'oz','gin'],[1.5,'oz','blancvermouth'],[0.75,'oz','apricoteau'],[2,'dash','orangebitters']],
 flav:['floral','fruity'],tech:['stir'],parent:'martini',changed:'50/50 with blanc vermouth plus apricot eau-de-vie.',
 prov:{who:'Julie Reiner',where:'Clover Club, Brooklyn',year:'2008',conf:'medium',note:''}});
add({id:'trident',name:'Trident',cat:'Modern',fam:'Martini',base:'Aquavit',m:'stir',glass:'Coupe',ice:'Up',garnish:'Lemon twist',
 spec:[[1,'oz','aquavit'],[1,'oz','fino'],[1,'oz','cynar'],[2,'dash','peachbitters']],
 flav:['bitter','herbal'],tech:['stir'],parent:'negroni',changed:'Aquavit, dry sherry and Cynar in the three slots.',
 prov:{who:'Robert Hess',where:'Seattle',year:'c. 2002',conf:'high',note:''}});
add({id:'breakfast-martini',name:'Breakfast Martini',cat:'Modern',fam:'Sidecar',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'Orange twist',
 spec:[[1.75,'oz','gin'],[0.5,'oz','cointreau'],[0.5,'oz','lemon'],[1,'bsp','marmalade']],
 flav:['citrusy','rich'],tech:['shake'],parentText:'White Lady',changed:'Orange marmalade shaken in.',
 prov:{who:'Salvatore Calabrese',where:'The Lanesborough, London',year:'1996',conf:'high',note:''}});
add({id:'porn-star',name:'Porn Star Martini',cat:'Modern',fam:'Daiquiri',base:'Vodka',m:'shake',glass:'Coupe',ice:'Up',garnish:'Half passion fruit; shot of sparkling wine on the side',
 spec:[[1.5,'oz','vanillavodka'],[0.5,'oz','passionliqueur'],[0.5,'oz','lime'],[0.5,'oz','vanillasyrup'],[1,'whole','passionfruit'],[2,'oz','prosecco',{side:true,label:'Prosecco, served on the side'}]],
 flav:['tropical','sweet','fruity'],tech:['shake'],parentText:'Vodka Sour',changed:'Passion fruit and vanilla; sparkling sidecar.',
 prov:{who:'Douglas Ankrah',where:'Townhouse, London',year:'2002',conf:'medium',note:''}});
add({id:'french-martini',name:'French Martini',cat:'Modern',fam:'Daiquiri',base:'Vodka',m:'shake',glass:'Coupe',ice:'Up',garnish:'Raspberry',
 spec:[[2,'oz','vodka'],[0.5,'oz','chambord'],[1.5,'oz','pineapple']],
 flav:['fruity','sweet'],tech:['shake'],parentText:'— (“Martini” in name only)',changed:'Pineapple shaken hard for foam.',
 prov:{who:'Attributed to Keith McNally’s NYC restaurants',where:'NYC',year:'late 1980s',conf:'low',note:''}});
add({id:'tia-mia',name:'Tia Mia',cat:'Modern',fam:'Daiquiri',base:'Agave',m:'shake',glass:'Double rocks',ice:'Crushed',garnish:'Mint sprig, lime wheel, orchid',
 spec:[[1,'oz','mezcal'],[1,'oz','jamaicanrum'],[0.5,'oz','curacao'],[0.75,'oz','lime'],[0.5,'oz','orgeat']],
 flav:['smoky','tropical','nutty'],tech:['shake'],parent:'mai-tai',changed:'Half the rum becomes mezcal.',
 prov:{who:'Ivy Mix',where:'Lani Kai, NYC',year:'2009',conf:'medium',note:''}});
add({id:'bitter-mai-tai',name:'Bitter Mai Tai',cat:'Modern',fam:'Daiquiri',base:'Amaro & Liqueur',m:'shake',glass:'Double rocks',ice:'Crushed',garnish:'Mint sprig',
 spec:[[1.5,'oz','campari'],[0.75,'oz','smithcross'],[0.5,'oz','curacao'],[0.75,'oz','lime'],[0.5,'oz','orgeat']],
 flav:['bitter','tropical'],tech:['shake'],parent:'mai-tai',changed:'Campari becomes the base; navy-strength rum as support.',
 prov:{who:'Jeremy Oertel',where:'Dram, Brooklyn',year:'c. 2012',conf:'medium',note:''}});
add({id:'midnight-stinger',name:'Midnight Stinger',cat:'Modern',fam:'Daiquiri',base:'Amaro & Liqueur',m:'shake',glass:'Rocks',ice:'Crushed',garnish:'Mint bouquet',
 spec:[[1,'oz','bourbon'],[1,'oz','fernet'],[0.75,'oz','lemon'],[0.75,'oz','simple']],
 flav:['bitter','herbal','refreshing'],tech:['shake'],parentText:'Stinger',changed:'Fernet stands in for crème de menthe; lemon makes it a sour.',
 prov:{who:'Attributed to Sam Ross',where:'NYC',year:'2010s',conf:'low',note:'Verify creator.'}});
add({id:'bourbon-renewal',name:'Bourbon Renewal',cat:'Modern',fam:'Daiquiri',base:'Whiskey',m:'shake',glass:'Rocks',ice:'Cubes',garnish:'Lemon wheel',
 spec:[[2,'oz','bourbon'],[1,'oz','lemon'],[0.5,'oz','cassis'],[0.25,'oz','simple'],[1,'dash','angostura']],
 flav:['fruity','citrusy'],tech:['shake'],parent:'whiskey-sour',changed:'Crème de cassis carries most of the sweetness.',
 prov:{who:'Jeffrey Morgenthaler',where:'Portland, OR',year:'c. 2004',conf:'medium',note:''}});
add({id:'amaretto-sour',name:'Amaretto Sour (Morgenthaler)',cat:'Modern',fam:'Daiquiri',base:'Amaro & Liqueur',m:'dryshake',glass:'Rocks',ice:'Cubes',garnish:'Lemon peel, brandied cherries',
 spec:[[1.5,'oz','amaretto'],[0.75,'oz','bourboncask'],[1,'oz','lemon'],[1,'tsp','rich'],[0.5,'oz','eggwhite']],
 flav:['nutty','citrusy'],tech:['dry-shake','shake'],parentText:'Amaretto Sour (1970s)',changed:'Cask-strength bourbon for backbone, fresh lemon, egg white.',
 prov:{who:'Jeffrey Morgenthaler',where:'Clyde Common, Portland, OR',year:'2012',conf:'high',note:''}});
add({id:'flor-de-jerez',name:'Flor de Jerez',cat:'Modern',fam:'Daiquiri',base:'Wine & Sherry',m:'shake',glass:'Coupe',ice:'Up',garnish:'None',
 spec:[[1.5,'oz','amontillado'],[0.5,'oz','jamaicanrum'],[0.25,'oz','apricotliqueur'],[0.75,'oz','lemon'],[0.5,'oz','canesyrup'],[1,'dash','angostura']],
 flav:['nutty','fruity'],tech:['shake'],parentText:'Sherry Sour',changed:'Sherry as base, rum as the modifier.',
 prov:{who:'Joaquín Simó',where:'Death & Co, NYC',year:'c. 2009',conf:'medium',note:''}});
add({id:'jasmine',name:'Jasmine',cat:'Modern',fam:'Sidecar',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'Lemon twist',
 spec:[[1.5,'oz','gin'],[0.25,'oz','cointreau'],[0.25,'oz','campari'],[0.75,'oz','lemon']],
 flav:['bitter','citrusy'],tech:['shake'],parent:'sidecar',changed:'Gin base; Campari joins Cointreau. Reads like grapefruit.',
 prov:{who:'Paul Harrington',where:'Townhouse Bar & Grill, Emeryville, CA',year:'c. 1990',conf:'high',note:''}});
add({id:'garibaldi',name:'Garibaldi (fluffy)',cat:'Modern',fam:'Whiskey Highball',base:'Amaro & Liqueur',m:'build',glass:'Highball',ice:'Cubes',garnish:'Orange wedge',
 spec:[[1.5,'oz','campari'],[4,'top','fluffyorange']],
 flav:['bitter','fruity','refreshing'],tech:['build','fluffy-juice'],parentText:'Campari & orange (Italian classic)',changed:'Juice aerated in a high-speed juicer for a foamy texture.',
 prov:{who:'Naren Young (fluffy version)',where:'Dante, NYC',year:'c. 2015',conf:'medium',note:'The Campari-orange pairing itself is much older.'}});
add({id:'monte-cassino',name:'Monte Cassino',cat:'Modern',fam:'Sidecar',base:'Whiskey',m:'shake',glass:'Coupe',ice:'Up',garnish:'Lemon twist',
 spec:[[0.75,'oz','rye'],[0.75,'oz','benedictine'],[0.75,'oz','yellowchartreuse'],[0.75,'oz','lemon']],
 flav:['herbal','rich'],tech:['shake'],parent:'last-word',changed:'Rye, Bénédictine, yellow Chartreuse, lemon.',
 prov:{who:'Damon Dyer',where:'Louis 649, NYC',year:'2010',conf:'medium',note:''}});
add({id:'la-perla',name:'La Perla',cat:'Modern',fam:'Martini',base:'Agave',m:'stir',glass:'Coupe',ice:'Up',garnish:'Lemon twist',
 spec:[[1.5,'oz','reposado'],[1.5,'oz','manzanilla'],[0.75,'oz','pearliqueur']],
 flav:['nutty','fruity'],tech:['stir'],parentText:'Bamboo / Adonis (sherry cocktails)',changed:'Tequila split with sherry, pear liqueur.',
 prov:{who:'Jacques Bezuidenhout',where:'San Francisco',year:'c. 2005',conf:'medium',note:''}});
add({id:'nuclear-daiquiri',name:'Nuclear Daiquiri',cat:'Modern',fam:'Daiquiri',base:'Rum',m:'shake',glass:'Coupe',ice:'Up',garnish:'None',
 spec:[[0.75,'oz','overproof'],[0.75,'oz','greenchartreuse'],[0.75,'oz','lime'],[0.5,'oz','falernum']],
 flav:['herbal','tropical'],tech:['shake'],parent:'daiquiri',changed:'Overproof rum, green Chartreuse, falernum.',
 prov:{who:'Gregor de Gruyther',where:'LAB, London',year:'2005',conf:'medium',note:'Ratios vary by source; verify.'}});
add({id:'seelbach',name:'Seelbach',cat:'Modern',fam:'Whiskey Highball',base:'Whiskey',m:'build',glass:'Flute',ice:'Up',garnish:'Orange twist',
 spec:[[1,'oz','bourbon'],[0.5,'oz','cointreau'],[7,'dash','angostura'],[7,'dash','peychauds'],[4,'top','champagne']],
 flav:['spicy','refreshing'],tech:['build','top'],parentText:'Champagne Cocktail',changed:'Bourbon, Cointreau and a heavy dose of two bitters.',
 prov:{who:'Adam Seger',where:'Seelbach Hotel, Louisville',year:'1995',conf:'high',note:'Presented as pre-Prohibition; the creator later said the backstory was invented. Good provenance lesson.'}});
add({id:'infante',name:'Infante',cat:'Modern',fam:'Daiquiri',base:'Agave',m:'shake',glass:'Rocks',ice:'Cubes',garnish:'Grated nutmeg',
 spec:[[2,'oz','blanco'],[0.75,'oz','lime'],[0.5,'oz','orgeat'],[3,'drop','rosewater']],
 flav:['nutty','floral','citrusy'],tech:['shake'],parent:'margarita',changed:'Orgeat and rose water replace orange liqueur.',
 prov:{who:'Giuseppe González',where:'NYC',year:'c. 2010',conf:'low',note:'Verify venue/date.'}});
add({id:'london-calling',name:'London Calling',cat:'Modern',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'Grapefruit twist',
 spec:[[1.5,'oz','gin'],[0.5,'oz','fino'],[0.5,'oz','lemon'],[0.5,'oz','simple'],[2,'dash','orangebitters']],
 flav:['citrusy','nutty'],tech:['shake'],parentText:'Gin Sour',changed:'Fino sherry and orange bitters.',
 prov:{who:'Chris Jepson',where:'Milk & Honey, London',year:'2002',conf:'medium',note:''}});
add({id:'treacle',name:'Treacle',cat:'Modern',fam:'Old-Fashioned',base:'Rum',m:'stir',glass:'Rocks',ice:'Large cube',garnish:'Lemon twist',
 spec:[[2,'oz','darkrum'],[1,'tsp','simple'],[2,'dash','angostura'],[0.5,'oz','applejuice',{post:true,label:'Apple juice, float'}]],
 flav:['rich','fruity'],tech:['stir','float'],parent:'old-fashioned',changed:'Dark rum base, apple juice float.',
 prov:{who:'Dick Bradsell',where:'London',year:'1990s',conf:'medium',note:''}});
add({id:'russian-spring-punch',name:'Russian Spring Punch',cat:'Modern',fam:'Daiquiri',base:'Vodka',m:'shake',glass:'Highball',ice:'Cubes',garnish:'Berries, lemon wheel',
 spec:[[1,'oz','vodka'],[0.5,'oz','cassis'],[0.75,'oz','lemon'],[0.25,'oz','simple'],[3,'top','champagne']],
 flav:['fruity','refreshing'],tech:['shake','top'],parent:'french-75',changed:'Vodka and crème de cassis, served long over ice.',
 prov:{who:'Dick Bradsell',where:'London',year:'1980s',conf:'low',note:'Venue reported inconsistently.'}});
add({id:'hugo',name:'Hugo Spritz',cat:'Modern',fam:'Whiskey Highball',base:'Wine & Sherry',m:'build',glass:'Wine glass',ice:'Cubes',garnish:'Mint, lime wheel',
 spec:[[0.75,'oz','stgermain',{label:'Elderflower liqueur or syrup'}],[4,'top','prosecco'],[1,'top','soda'],[6,'leaf','mint']],
 flav:['floral','refreshing'],tech:['build','top'],parentText:'Spritz',changed:'Elderflower and mint instead of a bitter aperitivo.',
 prov:{who:'Roland Gruber',where:'South Tyrol, Italy',year:'2005',conf:'medium',note:'Original used elderflower syrup.'}});
add({id:'death-flip',name:'Death Flip',cat:'Modern',fam:'Flip',base:'Agave',m:'dryshake',glass:'Coupe',ice:'Up',garnish:'Grated nutmeg',
 spec:[[1,'oz','blanco'],[0.5,'oz','yellowchartreuse'],[0.5,'oz','jager'],[0.25,'oz','simple'],[1,'egg','egg']],
 flav:['herbal','creamy','rich'],tech:['dry-shake','shake'],parent:'flip',changed:'Tequila, yellow Chartreuse and Jägermeister.',
 prov:{who:'Chris Hysted',where:'Black Pearl, Melbourne',year:'2010',conf:'medium',note:''}});
add({id:'business',name:'The Business',cat:'Modern',fam:'Daiquiri',base:'Gin',m:'shake',glass:'Coupe',ice:'Up',garnish:'None',
 spec:[[2,'oz','gin'],[0.75,'oz','lime'],[0.75,'oz','honey']],
 flav:['citrusy','floral'],tech:['shake'],parentText:'Bee’s Knees',changed:'Lime replaces lemon.',
 prov:{who:'Milk & Honey house drink',where:'NYC',year:'2000s',conf:'low',note:'Creator unconfirmed.'}});

/* ---------- Technique pages (original wording) ----------
   tag: home = home-feasible | equipment = equipment required */
var TECH = {
  'shake':{t:'Shake',tag:'home',infl:'Morgenthaler',eq:['Shaker tins','Hawthorne strainer','Fine strainer'],
    body:['Use it when the drink has citrus, egg, cream or fruit. Shaking chills, dilutes and aerates all at once.',
          'Fill the large tin with solid cubes, seal, and shake hard for about 10–12 seconds. Past that point you gain very little more cold or water.',
          'Fine-strain drinks served up so ice shards and pulp stay out.']},
  'stir':{t:'Stir',tag:'home',infl:'Morgenthaler',eq:['Mixing glass','Bar spoon','Julep strainer'],
    body:['Use it for all-spirit or spirit-plus-wine drinks where you want clarity and a silky texture.',
          'Fill the glass with cold, dry cubes and stir smoothly for 20–30 seconds. Taste: you want cold, a little rounder, not watery.',
          'Stirring adds less water than shaking. The calculator reflects that.']},
  'build':{t:'Build',tag:'home',infl:'Morgenthaler',eq:['Serving glass','Bar spoon'],
    body:['Pour straight into the serving glass over ice. Best for highballs and spritzes where carbonation matters.',
          'Chill the glass and mixers first. Pour the bubbles last and down the bar spoon, then give one gentle lift to mix.']},
  'dry-shake':{t:'Dry shake & reverse dry shake',tag:'home',infl:'Morgenthaler',eq:['Shaker tins'],
    body:['For egg white or whole egg. Shake once without ice to build foam, then again with ice to chill.',
          'Reverse dry shake: shake with ice first, strain out the ice, then shake again without it. Usually gives a tighter, more stable foam.']},
  'whip-shake':{t:'Whip shake',tag:'home',infl:'Morgenthaler',eq:['Shaker tins','Crushed or pebble ice'],
    body:['A short shake with just a few pieces of crushed ice. It mixes and aerates without much dilution, for drinks poured over crushed ice where more water is coming anyway.']},
  'swizzle':{t:'Swizzle',tag:'home',infl:'Morgenthaler',eq:['Swizzle stick or bar spoon','Crushed ice'],
    body:['Build in the glass over crushed ice and spin the stick between your palms until frost forms on the outside. Top with more crushed ice.',
          'Expect more dilution than the shaken estimate.']},
  'flash-blend':{t:'Flash blend',tag:'equipment',infl:'Tiki tradition',eq:['Spindle or stick blender','Crushed ice'],
    body:['A few seconds on a spindle mixer with crushed ice, then dump everything into the glass. This is how Don-era tiki drinks were made.',
          'A hard shake with crushed ice is a fine home stand-in.']},
  'muddle':{t:'Muddle',tag:'home',infl:'Morgenthaler',eq:['Muddler'],
    body:['Press gently to release oils and juice. Herbs like mint and basil only need a light press; tearing them up turns them bitter.',
          'Fruit and cucumber can take more pressure. Always fine-strain.']},
  'float':{t:'Float & drizzle',tag:'home',infl:'Morgenthaler',eq:['Bar spoon'],
    body:['Pour slowly over the back of a spoon so the ingredient sits on top. The first sips taste mostly of the float, so it matters more than its volume suggests.']},
  'top':{t:'Top with bubbles',tag:'home',infl:'Morgenthaler',eq:[],
    body:['Add carbonated ingredients after ice and never shake them. Cold bubbles hold their fizz much better.']},
  'rinse':{t:'Rinse',tag:'home',infl:'—',eq:['Atomizer (optional)'],
    body:['Coat the inside of a chilled glass with a small amount (absinthe, Islay Scotch) and pour out the extra. An atomizer gives a more even coat.']},
  'flamed-twist':{t:'Flamed twist',tag:'home',infl:'—',eq:['Matches or lighter'],
    body:['Warm the peel, then squeeze it skin-side toward a flame over the drink. The oils catch and caramelize.',
          'It is mostly theater; it does add a toasted orange aroma.']},
  'fat-wash':{t:'Fat-washing',tag:'home',infl:'Arnold (method family)',eq:['Freezer','Jar','Fine strainer or coffee filter'],
    body:['Mix melted fat (bacon, butter, oil) with spirit, let it sit, then freeze so the fat solidifies. Remove the fat and filter.',
          'The flavor stays in the spirit; most of the fat comes out. Note your ratio and steep time here.']},
  'infusion':{t:'Infusion (tea, spice, fruit)',tag:'home',infl:'—',eq:['Jar','Strainer'],
    body:['Steep, taste often, strain. Tea gets tannic quickly, so check it in minutes, not hours.']},
  'rapid-infusion':{t:'Rapid N₂O infusion',tag:'equipment',infl:'Arnold',eq:['iSi whipper','N₂O chargers'],
    body:['Pressure pushes liquid into the solids; a fast vent pulls the flavor back out. Results in minutes instead of days.',
          'Add your tested times and amounts here.']},
  'fluffy-juice':{t:'Aerated ("fluffy") juice',tag:'equipment',infl:'—',eq:['Centrifugal juicer'],
    body:['A high-speed juicer whips air into orange juice, which gives the long, foamy body of a fluffy Garibaldi. Use it right away; the foam fades within minutes.']},
  'clarification':{t:'Clarification',tag:'equipment',infl:'Arnold',eq:['Centrifuge (fastest)','Agar + fine filter (home method)','Milk (milk-punch method)'],
    body:['Removing solids from juice gives you clear drinks you can carbonate or stir.',
          'At home: agar clarification or milk-washing works with time and patience. With a centrifuge it takes minutes.']},
  'carbonation':{t:'Force carbonation',tag:'equipment',infl:'Arnold',eq:['CO₂ tank and regulator, or a carbonation cap','Very cold, clear liquid'],
    body:['Carbonating the whole cocktail gives bubbles all the way through, not just from a topper.',
          'Clarify first, chill hard, and pre-dilute so the finished ABV is right before you gas it.']},
  'nitro-muddle':{t:'Liquid-nitrogen muddling',tag:'equipment',infl:'Arnold',eq:['Liquid nitrogen','Proper safety gear and training'],
    body:['Freezing herbs before muddling keeps them from browning and turning bitter. Needs safe handling; not a casual home method.']},
  'ice':{t:'Ice types',tag:'home',infl:'Morgenthaler',eq:['Silicone molds','Lewis bag'],
    body:['Large cube: slow melt for stirred drinks and spirit-forward rocks drinks.',
          'Cubes (1–1.25 in): the all-rounder for shaking and highballs.',
          'Crushed/pebble: fast chill and lots of dilution for swizzles, juleps and tiki.',
          'Directional freezing (a cooler in the freezer) gives you clear ice at home.']},
  'dilution-math':{t:'How the calculator works',tag:'home',infl:'Arnold',eq:[],
    body:['Starting ABV = total ethanol ÷ total volume of everything that meets the ice.',
          'Shaken dilution ≈ 1.567·A² + 1.742·A + 0.203. Stirred dilution ≈ −1.21·A² + 1.246·A + 0.145. A is the starting ABV as a decimal; the result is how much water gets added, as a fraction of the starting volume.',
          'Toppers and floats go in after the ice, so they add volume without extra melt. Built highballs assume chilled ingredients and no melt.',
          'Sugar is shown as g/100 ml and acid as % of the finished drink. Ingredient values are approximations you can edit in data.js.',
          'Swizzled and blended drinks reuse the shaken curve and will under-read. Open More → Calculator check to rerun the validation tests.']}
};

root.CC_DATA = { ING: ING, DRINKS: D, TECH: TECH };
})(typeof self !== 'undefined' ? self : this);
