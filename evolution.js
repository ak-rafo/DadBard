/* ============================================================
   EVOLUTION: how the cocktail grew from the 1806 "cock tail"
   (the Old Fashioned's ancestor) into today's styles.
   Wording is original; dates are approximate and given as eras.
   parent = the style it grew from. also = a second influence.
   ex = drink ids in your songbook. root = Codex family for color.
   ============================================================ */
(function (root) {
var ERAS = [
  { k: 'roots',       n: 'Before the cocktail', span: '1600s–1700s', icon: '🏺' },
  { k: 'golden',      n: 'The Golden Age',      span: '1806–1919',   icon: '🎩' },
  { k: 'prohibition', n: 'Prohibition & exile', span: '1920–1933',   icon: '🕵️' },
  { k: 'midcentury',  n: 'Tiki & mid-century',  span: '1934–1969',   icon: '🌺' },
  { k: 'dark',        n: 'The dark ages',       span: '1970s–1990s', icon: '🪩' },
  { k: 'revival',     n: 'Craft revival',       span: '1987–2014',   icon: '🧔' },
  { k: 'today',       n: 'Today',               span: '2015–now',    icon: '🧪' }
];
var TYPES = [
  { k: 'spirit', n: 'Spirit-forward', icon: '🥃' },
  { k: 'sour', n: 'Sours', icon: '🍋' },
  { k: 'long', n: 'Long & fizzy', icon: '🫧' },
  { k: 'tropical', n: 'Tropical', icon: '🌴' },
  { k: 'rich', n: 'Rich, creamy & coffee', icon: '☕' },
  { k: 'aperitivo', n: 'Aperitivo & low', icon: '🍷' },
  { k: 'frozen', n: 'Frozen', icon: '❄️' },
  { k: 'lab', n: 'Lab & technique', icon: '⚗️' }
];
var S = [
  // ---- roots
  { id: 'sling', n: 'Sling & toddy', era: 'roots', year: '1700s', type: 'spirit', root: 'Old-Fashioned', parent: null,
    formula: 'Spirit · sugar · water', blurb: 'The plainest mixed drink: spirit softened with sugar and water. Served hot, it’s a toddy. Add bitters and it becomes the cocktail.', ex: ['singapore-sling'] },
  { id: 'punch', n: 'Punch', era: 'roots', year: '1600s', type: 'sour', root: 'Daiquiri', parent: null,
    formula: 'Spirit · citrus · sugar · water · spice', blurb: 'Big shared bowls that British sailors and traders brought home from the East. Punch is the grandparent of every sour and every tiki drink.', ex: ['planters-punch'] },
  { id: 'flip-style', n: 'Flip & nog', era: 'roots', year: '1600s', type: 'rich', root: 'Flip', parent: null,
    formula: 'Spirit or ale · sugar · egg', blurb: 'Started as hot ale and rum frothed with a red-hot iron. By the 1800s it was served cold and shaken with a whole egg.', ex: ['flip', 'death-flip', 'cinnamon-toast-coffee'] },
  { id: 'milk-punch', n: 'Milk punch', era: 'roots', year: '1700s', type: 'lab', root: 'Daiquiri', parent: 'punch',
    formula: 'Punch · milk to clarify', blurb: 'Curdling milk into punch and straining it gave a clear, silky drink that kept for ages. It came back in a big way with modern clarification.', ex: [], tech: 'milk-washing' },
  { id: 'julep', n: 'Julep', era: 'roots', year: 'late 1700s', type: 'spirit', root: 'Old-Fashioned', parent: 'sling',
    formula: 'Spirit · sugar · mint · crushed ice', blurb: 'A Southern American morning drink that became a status symbol once crushed ice was cheap.', ex: ['mint-julep'] },

  // ---- golden age
  { id: 'cocktail', n: 'The Cocktail → Old Fashioned', era: 'golden', year: '1806', type: 'spirit', root: 'Old-Fashioned', parent: 'sling', trunk: true,
    formula: 'Spirit · sugar · water · bitters', blurb: 'In 1806 a New York paper defined the “cock tail” as a bittered sling. When fancier versions arrived, drinkers asked for it the “old-fashioned” way, and the name stuck by the 1880s. This is the trunk of the tree.',
    ex: ['old-fashioned', 'oaxaca-of', 'bentons', 'conference', 'elder-fashion', 'treacle', 'fall-old-fashioned', 'tiki-old-fashioned', 'rosa-maria', 'mint-julep'] },
  { id: 'cobbler', n: 'Cobbler', era: 'golden', year: '1830s–40s', type: 'aperitivo', root: 'Whiskey Highball', parent: 'sling',
    formula: 'Wine or sherry · sugar · fruit · crushed ice', blurb: 'Low-proof, fruity, and served with one of the first drinking straws. The Sherry Cobbler was the hit drink of its day.', ex: ['flor-de-jerez'] },
  { id: 'crusta', n: 'Crusta', era: 'golden', year: '1850s', type: 'sour', root: 'Sidecar', parent: 'cocktail', also: 'sour',
    formula: 'Cocktail · citrus · curaçao · sugar rim', blurb: 'Joseph Santini’s New Orleans drink put a little lemon and curaçao into a cocktail and wrapped the glass in a long peel. It’s the bridge from cocktail to sour.', ex: [] },
  { id: 'sour', n: 'Sour', era: 'golden', year: '1850s–1862', type: 'sour', root: 'Daiquiri', parent: 'punch',
    formula: 'Spirit · citrus · sugar', blurb: 'Punch scaled down to one glass. Jerry Thomas put it in print in 1862, and it became the most-copied template there is.',
    ex: ['whiskey-sour', 'pisco-sour', 'daiquiri', 'gimlet', 'army-navy', 'clover-club', 'business', 'ak-improved-daiquiri', 'strawberry-banana-daiquiri', 'drink-has-no-name', 'ginori', 'xmas-in-july', 'farnsworth', 'iron-ranger', 'bees-knees', 'southside', 'jack-rose', 'caipirinha'] },
  { id: 'improved', n: 'Improved & Fancy cocktails', era: 'golden', year: '1870s', type: 'spirit', root: 'Old-Fashioned', parent: 'cocktail',
    formula: 'Cocktail · dash of liqueur or absinthe', blurb: 'Bartenders “improved” the basic cocktail with maraschino, absinthe or curaçao. The Sazerac is the best-known survivor.', ex: ['sazerac', 'stinger'] },
  { id: 'vermouth', n: 'Vermouth cocktails', era: 'golden', year: '1870s–80s', type: 'spirit', root: 'Martini', parent: 'cocktail',
    formula: 'Spirit · vermouth · bitters', blurb: 'Italian and French vermouth reached American bars and replaced the sugar. Out came the Manhattan and the Martinez.',
    ex: ['manhattan', 'vieux-carre', 'bijou', 'black-manhattan', 'revolver', 'ray-gun', 'martinez', 'brooklyn', 'hanky-panky', 'el-presidente'] },
  { id: 'daisy', n: 'Daisy', era: 'golden', year: '1870s', type: 'sour', root: 'Sidecar', parent: 'sour',
    formula: 'Sour · liqueur or grenadine', blurb: 'A sour sweetened with a liqueur instead of plain sugar. “Margarita” is Spanish for daisy.', ex: ['margarita', 'mezcalrita', 'tommys'] },
  { id: 'fizz', n: 'Fizz & Collins', era: 'golden', year: '1870s', type: 'long', root: 'Whiskey Highball', parent: 'sour',
    formula: 'Sour · soda (or sparkling wine)', blurb: 'Lengthen a sour with bubbles and you have a Collins, a Fizz or, with Champagne, a French 75.',
    ex: ['french-75', 'gin-gin-mule', 'rome-with-a-view', 'mojito', 'russian-spring-punch', 'old-cuban', 'tom-collins', 'gin-fizz', 'ramos-gin-fizz'] },
  { id: 'smash', n: 'Smash', era: 'golden', year: '1880s', type: 'sour', root: 'Daiquiri', parent: 'julep', also: 'sour',
    formula: 'Julep · muddled citrus or herbs', blurb: 'A short, muddled julep. Add lemon and it turns into a sour with herbs.', ex: ['whiskey-smash', 'gin-basil-smash', 'eastside', 'kentucky-maid', 'summer-salad-gimlet'] },
  { id: 'highball', n: 'Highball', era: 'golden', year: '1890s', type: 'long', root: 'Whiskey Highball', parent: 'sling',
    formula: 'Spirit · soda or mixer', blurb: 'Bottled soda water made it easy: spirit and bubbles over ice. Japan later turned it into a ritual.', ex: ['whisky-highball', 'kentucky-buck', 'garibaldi', 'seelbach', 'moscow-mule', 'dark-n-stormy', 'paloma'] },
  { id: 'martini-style', n: 'Dry Martini', era: 'golden', year: '1890s–1900s', type: 'spirit', root: 'Martini', parent: 'vermouth',
    formula: 'Gin · dry vermouth', blurb: 'The sweet Martinez dried out decade by decade into the Dry Martini.', ex: ['martini', 'dirty-martini', 'gin-blossom'] },
  { id: 'spritz', n: 'Spritz', era: 'golden', year: '1800s (Veneto)', type: 'aperitivo', root: 'Whiskey Highball', parent: 'cobbler',
    formula: 'Wine · bitter aperitivo · soda', blurb: 'Wine splashed with water in northern Italy grew into the aperitivo spritz, with bitter liqueurs added in the 20th century.', ex: ['negroni-sbagliato', 'hugo', 'lofi-spritz', 'spritz', 'americano'] },
  { id: 'equal-parts', n: 'Equal-parts', era: 'golden', year: '1916', type: 'sour', root: 'Sidecar', parent: 'sour',
    formula: '¾ · ¾ · ¾ · ¾', blurb: 'The Last Word, from the Detroit Athletic Club, balances four equal parts. It faded away until the 2000s.', ex: ['last-word', 'aviation'] },
  { id: 'aperitivo', n: 'Bitter aperitivo', era: 'golden', year: '1919', type: 'aperitivo', root: 'Martini', parent: 'vermouth',
    formula: 'Spirit · bitter liqueur · vermouth', blurb: 'Florence’s Negroni swapped the soda in an Americano for gin and set up a whole bitter family.', ex: ['negroni', 'boulevardier', 'white-negroni', 'kingston-negroni', 'trident', 'americano'] },

  // ---- prohibition
  { id: 'sidecar-style', n: 'Sidecar', era: 'prohibition', year: '1920s', type: 'sour', root: 'Sidecar', parent: 'crusta', also: 'daisy',
    formula: 'Spirit · orange liqueur · lemon', blurb: 'The Crusta with the fuss stripped out, written down in 1922 in Paris and London.', ex: ['sidecar', 'cable-car', 'breakfast-martini', 'jasmine', 'water-lily', 'pegu-club'] },
  { id: 'exile', n: 'Exile & the Savoy', era: 'prohibition', year: '1920–1933', type: 'sour', root: 'Daiquiri', parent: 'sour',
    formula: 'Sours, aromatized wine, gin', blurb: 'American bartenders took their craft to London, Paris and Havana. The 1930 Savoy book and Havana’s Daiquiris came out of this.',
    ex: ['corpse-reviver-2', 'french-75', 'boulevardier', 'bloody-mary', 'el-presidente', 'pegu-club'] },

  // ---- mid-century
  { id: 'tiki', n: 'Tiki', era: 'midcentury', year: '1934', type: 'tropical', root: 'Daiquiri', parent: 'punch', also: 'sour',
    formula: 'Several rums · several citrus · spiced syrups', blurb: 'Donn Beach in Hollywood rebuilt punch as escapist theater, and Trader Vic followed. Layered rums, secret syrups and crushed ice.',
    ex: ['zombie', 'mai-tai', 'navy-grog', 'three-dots', 'test-pilot', 'fog-cutter', 'saturn', 'painkiller', 'jungle-bird', 'pina-colada', 'hurricane', 'scorpion', 'queens-park-swizzle', 'suffering-bastard', 'missionarys-downfall', 'pearl-diver'] },
  { id: 'frozen', n: 'Frozen', era: 'midcentury', year: '1930s–50s', type: 'frozen', root: 'Daiquiri', parent: 'sour',
    formula: 'Sour · shaved ice · blender', blurb: 'Havana’s frozen Daiquiris and the electric blender made slushy drinks a thing. Slushie machines brought them back as a craft move.',
    ex: ['slushy-mojito', 'slushee', 'cafe-granita', 'pina-colada'] },
  { id: 'cream', n: 'Dessert & cream', era: 'midcentury', year: '1950s–70s', type: 'rich', root: 'Flip', parent: 'flip-style',
    formula: 'Spirit · liqueur · cream', blurb: 'Cream replaced egg in the Grasshopper, the Brandy Alexander and the White Russian.', ex: ['rum-runnings', 'white-russian', 'brandy-alexander', 'grasshopper'] },
  { id: 'coffee', n: 'Coffee cocktails', era: 'midcentury', year: '1940s–', type: 'rich', root: 'Flip', parent: 'sling', also: 'cream',
    formula: 'Spirit · coffee · sugar', blurb: 'The toddy with coffee became Irish Coffee in the 1940s. Spain’s Carajillo and, later, the Espresso Martini carried it forward.',
    ex: ['carajillo', 'espresso-martini', 'amaretto-espresso-martini', 'balanced-espresso-martini', 'fancy-xpressi-martini', 'tropical-coffee-sour', 'irish-coffee', 'white-russian'] },

  // ---- dark ages
  { id: 'disco', n: 'Vodka & disco era', era: 'dark', year: '1970s–90s', type: 'sour', root: 'Sidecar', parent: 'sidecar-style',
    formula: 'Vodka · sour mix · color', blurb: 'Sour mix and neon pushed out fresh citrus. A few London bartenders, Dick Bradsell above all, kept real craft going.',
    ex: ['cosmopolitan', 'french-martini', 'espresso-martini', 'porn-star', 'bramble', 'russian-spring-punch', 'treacle'] },

  // ---- revival
  { id: 'revival', n: 'Fresh-juice revival', era: 'revival', year: '1987–2000s', type: 'sour', root: 'Daiquiri', parent: 'sour',
    formula: 'Fresh citrus · exact specs · good ice', blurb: 'Dale DeGroff brought fresh juice back at the Rainbow Room in 1987. Milk & Honey, Pegu Club, Death & Co and PDT then set the specs and techniques everyone uses now.',
    ex: ['penicillin', 'gold-rush', 'old-cuban', 'gin-gin-mule', 'earl-grey-marteani', 'fitzgerald', 'bourbon-renewal', 'juliet-romeo', 'london-calling'] },
  { id: 'riffs', n: 'Template riffs', era: 'revival', year: '2000s', type: 'spirit', root: 'Martini', parent: 'vermouth', also: 'revival',
    formula: 'Classic frame · swap one or two parts', blurb: 'Keep the frame and change a part or two. The Brooklyn-neighborhood Manhattans (Red Hook, Greenpoint, Slope…) are the textbook case.',
    ex: ['red-hook', 'greenpoint', 'slope', 'carroll-gardens', 'cobble-hill', 'little-italy', 'enzoni', 'tommys'] },
  { id: 'equal-revival', n: 'Equal-parts revival', era: 'revival', year: '2004–', type: 'sour', root: 'Sidecar', parent: 'equal-parts',
    formula: '¾ · ¾ · ¾ · ¾, any four', blurb: 'When Seattle revived the Last Word, the four-equal-parts frame became a playground.', ex: ['final-ward', 'paper-plane', 'naked-famous', 'division-bell', 'monte-cassino'] },
  { id: 'agave', n: 'Agave & mezcal', era: 'revival', year: '2007–', type: 'spirit', root: 'Old-Fashioned', parent: 'revival', also: 'cocktail',
    formula: 'Tequila or mezcal in any template', blurb: 'Tequila and mezcal moved past the Margarita into Old Fashioneds, Negronis and tiki.',
    ex: ['oaxaca-of', 'naked-famous', 'division-bell', 'tia-mia', 'siesta', 'la-perla', 'infante', 'mezcalrita', 'rosa-maria', 'fancy-xpressi-martini'] },
  { id: 'tiki-revival', n: 'Tiki revival', era: 'revival', year: '2009–', type: 'tropical', root: 'Daiquiri', parent: 'tiki', also: 'revival',
    formula: 'Vintage tiki · craft precision', blurb: 'Jeff Berry’s research and bars like Smuggler’s Cove brought tiki back properly, then bartenders blended it with other styles.',
    ex: ['ancient-mariner', 'tia-mia', 'bitter-mai-tai', 'chartreuse-swizzle', 'nuclear-daiquiri', 'monkeypod-mai-tai', 'tropic-blunder', 'rum-n-stuff', 'tiki-old-fashioned', 'fruit-salad-daiquiri'] },

  // ---- today
  { id: 'amaro', n: 'Amaro & split base', era: 'today', year: '2010s–', type: 'spirit', root: 'Martini', parent: 'riffs', also: 'aperitivo',
    formula: 'Bitter or fortified as the base · split spirits', blurb: 'Amari, sherry and even Angostura moved from modifier to base, and split bases became normal.',
    ex: ['trinidad-sour', 'trinidad-especial', 'bitter-giuseppe', 'industry-sour', 'conference', 'midnight-stinger', 'too-soon', 'amaretto-sour', 'pink-panther'] },
  { id: 'lab', n: 'Lab techniques', era: 'today', year: '2010s–', type: 'lab', root: 'Daiquiri', parent: 'revival', also: 'milk-punch',
    formula: 'Fat-washing · clarifying · super juice · acid adjusting · carbonation', blurb: 'Kitchen science went behind the bar. Dave Arnold’s work made it mainstream, and super juice made it cheap.',
    ex: ['bentons', 'garibaldi', 'rum-n-stuff'], tech: 'clarification' },
  { id: 'low', n: 'Low & no', era: 'today', year: '2015–', type: 'aperitivo', root: 'Whiskey Highball', parent: 'spritz', also: 'cobbler',
    formula: 'Wine, sherry, aperitivo or zero-proof', blurb: 'Spritzes, sherry and vermouth builds, and full zero-proof menus. Lighter drinking became a style of its own.',
    ex: ['hugo', 'lofi-spritz', 'negroni-sbagliato', 'rome-with-a-view', 'garibaldi', 'flor-de-jerez'] }
];
root.CC_DATA.EVO = { ERAS: ERAS, TYPES: TYPES, STYLES: S };
})(typeof self !== 'undefined' ? self : this);
