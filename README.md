### ERD

![erd](assets/ERD.png)

### Access patterns

- :dart: Main
  - [x] Create user
  - [x] Find user
  - [x] Rank 3 favorite themes
  - [ ] Create theme
  - [x] List themes
  - [X] Find theme and list its newest propositions
  - [ ] [Needs processing]Find theme and list its politicians ordered by relevance in theme
    - [x] Most propositions overall
    - [ ] By state
      - [ ] any region
  - [x] Show rank stat of theme
    - Most relevant themes among users (show a #1/2/3 by the theme name)
  - [ ] Create proposition
  - [x] Find proposition and list its authors
  - [x] List x lastest author propositions
  - [ ] Create politician
  - [x] Show follow count of politician
  - [ ] Find politician and list its newest propositions
  - [x] Follow politicians
    - [ ] Notify user of every new proposition by this politician
  - [x] List Politicians followed by user
- :star: Extras
  - [ ] Watch themes
    - [ ] Notify user of every new proposition in this theme
  - [ ] Find theme and list its politicians ordered by relevance in theme
    - [ ] Most contributions by period (last `x` years)

### Dynamodb Entity chart

| Entity | PK | SK |
| :------------ |:--------------| :-----|
| User      | USER#\<Username> | USER#\<Username> |
| PoliticianFollow | USER#\<UserName>      | POLITICIAN#\<PoliticianId> |
| Politician | POLITICIAN#\<PoliticianId>      | POLITICIAN#\<PoliticianId> |
| Proposition | PROPOSITION#\<PropositionId>      | PROPOSITION#\<PropositionId> |
| PropositionTheme | PROPOSITION#\<PropositionId>      | THEME#\<ThemeId> |
| PropositionAuthor | PROPOSITION#\<PropositionId>      | AUTHOR#\<AuthorId> |
| Themes | THEMES      | THEMES |
| Theme | THEME#\<ThemeId>      | THEME#\<ThemeId> |
| PoliticianTheme | THEME#\<PoliticianId>      | POLITICIAN#\<PoliticianId> |


| Entity | GSI1PK | GSI1SK |
| :------------ |:--------------| :-----|
|AuthorPropositions | AUTHOR#\<AuthorId>| PROPOSITION#\<PropositionId>|
|ThemePropositions | THEME#\<ThemeId>| #PROPOSITION#\<PropositionId>|
|PoliticianFollowees | POLITICIAN#\<PoliticianId>      | USER#\<UserName> |
|PoliticianThemeOrderedByCount | THEME#\<PoliticianId>      | z\<ZeroPaddedContributionToThemeCount>POLITICIAN#\<PoliticianId> |

<!-- | Entity | GSI2PK | GSI2SK |
| :------------ |:--------------| :-----| -->