# Dad Bard v5.11

Fixed mobile Apothecary tool label wrapping. Ingredient finder now includes all named songs, styles and distinct recipe versions, showing complete matches plus partial matches sorted by missing ingredient count. Generic Rum includes standard rum types but not infused/overproof; other inputs match exact ingredients. Hidden songs remain excluded. Search is accent-insensitive. Recipe versions with identical specifications are not double listed.

Slushee: Scratch recipe option; category-specific Add ingredient picker; one name per ingredient row; X removes; duplicates blocked. Base quantities remain single-recipe inputs; final batch quantities scale all base ingredients together. Additional Brix syrup is separately labeled. Changes recalculate immediately. Scratch state and edits persist after reload.

Validation: 67 built-in checks pass, zero failures. Phone-sized Chromium interaction tests passed, no page errors. All indexed recipes match when supplied their own required inputs. 666 Daiquiri batch combinations passed Brix, volume, ABV and rum/lime ratio checks. Lime scales from 75 ml at 1 L to 150 ml at 2 L under default 8% ABV settings. Physical iPhone and machine testing not performed. Ingredient sugar/density values remain estimates; freezing is not guaranteed.

Update: Export JSON backup in Tavern. Replace the existing app files with the same filenames. Open online once to update offline cache.
