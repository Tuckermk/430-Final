Purpose:
   The purpose being this application is a easy way to manage a block-based inventory. imagined for use for a DND party that would prefer their character to have a reasonable carrying capacity while not having to do math, instead they get to play Tetris and arrange the block-based representations of their items in their inventory.

React Usage:
   I am using React for basically every part of the project that is not on the nav bar. Starting from the bottom, each individual Block is a component nested in a relevant group into a Item component that defines a which is then intern nested within Inventory which additionally has 2 drop layers which are React components using React-DND to move items around  