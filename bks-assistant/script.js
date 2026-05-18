var clickcounter1 = 0;
var messages1 = [
    '<a href="https://schulnetz.bks-campus.ch/loginto.php?mode=0&lang=" target="_blank">schulNetz</a>',
    '<a href="https://bkscampusch.sharepoint.com/sites/Schulhandbuch2/Freigegebene%20Dokumente/Forms/AllItems.aspx" target="_blank">Schulhandbuch</a>',
    '<a href="http://webmail.bks-campus.ch" target="_blank">Outlook</a>',
    '<a href="https://www.gr.ch/DE/institutionen/verwaltung/ekud/ahb/wvb/muenzmuehle/menueplan/Seiten/default.aspx" target="_blank">Menüplan</a>',
    '<a href="https://portal.bks-campus.ch" target="_blank">Portal</a>',
    ];
  
function BKSLinks() {
    document.getElementById("BKSLinks").innerHTML = messages1[clickcounter1 % messages1.length];
    clickcounter1 += 1;
}

var clickcounter2 = 0;
var messages2 = [
    '<a href="https://quizlet.com/user/bks_chur/folders/medias-in-res" target="_blank">Latein</a>',
    '<a href="https://quizlet.com/user/bks_chur/folders/spanisch-puente-nuevo-1-2" target="_blank">Spanisch</a>',
    '<a href="https://quizlet.com/user/bks_chur/folders/franzosisch-le-cours-intensif-1-2-3" target="_blank">Französisch</a>',
    '<a href="https://quizlet.com/user/bks_chur/folders/italienisch-espresso-ragazzi-1-2-3" target="_blank">Italienisch</a>',
    '<a href="https://quizlet.com/user/bks_chur/folders/romanisch-sursilvan-en-lingia-directa-1-2" target="_blank">Romanisch Surilvan</a>',
    '<a href="https://quizlet.com/user/bks_chur/folders/englisch-headway-intermediate-ready-for-c1-advanced" target="_blank">Englisch</a>',
    '<a href="https://rr-utilities.github.io/hexalengua/webCards/index.html" target="_blank">HexaLengua: Vokabeln</a>',
    '<a href="https://quizlet.com/user/bks_chur/folders/mini-enzyklopadie" target="_blank">Mini-Enzyklopädie</a>',
    ];

function Sprachen() {
    document.getElementById("Sprachen").innerHTML = messages2[clickcounter2 % messages2.length];
    clickcounter2 += 1;
}