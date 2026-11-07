# Dad Bard November 7 update

Changes: Acid Adjust now offers only Orange, Grapefruit and Pineapple, centered as three equal tiles. Removed orange save button. Sourness choices display Lime or Lemon. Syrup selection options collapse independently of the recipe and calculator, with the collapsed state saved. Supplied JSON recipe edits and preferences are applied once on first load; existing local state is backed up before merging.

Automated Chromium checks passed at widths 320, 375, 390, 430, 768 and 1440 pixels: all three fruit selections and both sourness targets; calculator input changes; syrup collapse/expand and persistence after reload; JSON recipe edit presence and Ray Gun quantity; navigation smoke checks; no JavaScript page errors. No document horizontal overflow on Acid Adjust and Syrups at 390 and 1440 pixels. Screenshots reviewed for mobile Acid Adjust and desktop Syrups.

Limitations: simulated browser viewports, not physical iPhone testing. Safari and Firefox were not tested. Navigation checks are smoke tests, not exhaustive verification of every app feature.
