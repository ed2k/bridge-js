# bridge-js
bridge like card game UI frame work that can run in browser

learning from q-plus bridge web version

globals, QB, QBM, theEngine, theConfig, theFilters, theLang, theAudioPlayer, theMemory, theULogger

initial flow
LoginWindow extens View
  init, onclick Demo Verson button, QB.start2(\"demo\")
    QBModel.nextGame() this.dealControl.request("IDS_NEXT_DEAL")

response back ? child class of view.onChanged

QB QBApp.js

interaction,
 TableTab bind $(".QB .cardInHand").click(QB.playWin.tableTab.cardClicked);
   get card from event.currentTarget.currentSrc then QBM.game.playCard(player, card)

shengji code study
https://github.com/rbtying/shengji
