// Shortcut for document queryselector
let QS = (selector) => document.querySelector(selector);
// Shortcut for document queryselector-all
let QSA = (selector) => document.querySelectorAll(selector);
let refreshWIndowSize = () => {
    // re-calculate body height for background graphics
    //get height of target section 
    let targetheight = target.getBoundingClientRect().height;
    //get height of footer section 
    let footerheight = QS("#footerSection").getBoundingClientRect().height;
    // get height of window
    let windowheight = window.innerHeight;
    document.body.style.minHeight = (windowheight - footerheight > targetheight ?
        windowheight + "px" : // if window minus footer is higher than section, body is windowheight
        "calc(" + targetheight + "px + 15vh + " + footerheight + "px)"); // else body is the height of target section + footer space + 15vh header space
}
// Filters a set of element that match given selector by inner text. Sets display none or unset.
let filterElements = (selectorElements, selectorResult, searchText) => {
    // split search text to tags
    let searchTags = searchText.toLowerCase().trim().split(" ");
    let found = 0;
    // iterate through elements to filter
    QSA(selectorElements).forEach(b => {
        // if search tags are empty, make element visible (again)
        if (!searchTags || searchTags.length < 1) { b.style.display = ""; found++; }
        // if every search tag is contained in inner text, make element visible
        else if (searchTags.every(t => b.innerText.toLowerCase().includes(t))) {
            b.style.display = "";
            found++;
        }
        // else hide element
        else b.style.display = "none";
    });
    // show result count on element with passed selector
    QS(selectorResult).innerText = found;
    refreshWIndowSize();
}
// Orders sprites
let orderSprites = (e) => {
    // if orderby button triggered, switch mode
    if (e.target.id == "spritesOrderBy") e.target.value = e.target.value == "By Price" ? "By ID" : "By Price";
    // else switch direction
    else if (e.target.id == "spritesOrderDirection") e.target.value = e.target.value == "Ascending" ? "Descending" : "Ascending";
    // get sprites and set flex order to mode value
    let sprites = QSA(".sprite");
    sprites.forEach(s => {
        s.style.order = QS("#spritesOrderBy").value == "By ID" ? s.getAttribute("data-id") : s.getAttribute("data-price");
    });
    // set flex direction to selected order direction
    QS("#spriteList").style.flexFlow = QS("#spritesOrderDirection").value == "Ascending" ? "row wrap" : "row-reverse wrap-reverse";
}
// Animates the navigation-planet zoom
let shownav = () => {
    // get position of current planet peek
    let planRect = QS("#navPlanCont").getBoundingClientRect();
    // create stylesheet
    let style = document.createElement("style");
    document.head.appendChild(style);
    style.id = "navStyle";
    style.type = "text/css";
    // make peek planet disappear and show the clone at exact the same position
    style.innerHTML = `
        #navPlanCont{
            opacity:0;
        }
        #navBack{
            opacity:0;
            position:fixed;
            z-index:3;
            background:black;
            width:100vw;
            height:100vh;
            top:0; left:0;
        }
        #navClone{
            position:fixed;
            height:${planRect.height}px;
            width:${planRect.width}px;
            top:${planRect.top}px;
            left:${planRect.left}px;    
            background-image: url(res/navPlan.gif);
            background-size: cover;
            z-index:4;
            filter: drop-shadow(0px 0px 1em rgba(255, 255, 255, 0.3));
            transition: all 0.5s ease !important;
        }
    `;
    // set the end position of the navigation planet; animates a zoom move to the center
    setTimeout(() => {
        style.innerHTML += `
        #navClone{
            height:80vh;
            width:80vh;
            top:10vh;
            animation-name:hopUp;
            animation-duration: 4s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            left:calc(50vw - 40vh);    
        }
        #navClone h1{
            transition: opacity 0.5s;
            transition-delay: 0.25s;
            opacity: 1;
        }
        #navBack{opacity:0.7;}
        .backgroundSide{opacity:0 !important}
        .contentSection{opacity:0 !important}
    `;
    }, 50);
}
// Shows a section by its ID and hides every other
let showsection = (sectionID) => {
    // get all sections
    let sections = QSA(".contentSection");
    let target;
    // if section id is empty, section is set to home section
    if (sectionID == null || sectionID.trim() == "") target = QS("#home");
    else {
        // else get setion element
        target = QS("#" + sectionID);
        // if section element is null, section is set to home section
        if (!target) target = QS("#home");
    }
    // hide all sections
    sections.forEach(s => s.classList.add("hidden"));
    // remove hidden class from target section
    target.classList.remove("hidden");
    //refresh window height
    refreshWIndowSize();
}
// Shows the info card for UI elements of the interface section dummies
let setInfo = e => {
    e = e.target;
    let info = "";
    // get info string of element
    if (e.id == 'imageagent') {
        info = "ImageAgent <br><br>"
        info += "When it's your turn to draw, you can choose to display a small picture of the term to draw above the chat.";
        info += "<br>You can choose between topics (logo, flag, or just the term) or enter your own term to search.<br><br>"
        info += "Click on the image to show the next search result."
    }
    else if (e.id == 'tablet') {
        info = "Tablet <br><br>"
        info += "Tablet support! Enables pressure sensitivity of your graphics tablet.<br>";
    }
    else if (e.id == 'markup') {
        info = "Markup <br><br>"
        info += "Changes the background color of your chat messages so it's easier for you to keep view.<br>";
    }
    else if (e.id == 'controls') {
        info = "Side Controls <br><br>"
        info += "Show or hide side controls like sound, fullscreen, gallery cloud and tablet mode.<br>";
    }
    else if (e.id == 'clear') {
        info = "Dont Clear <br><br>"
        info += "Prevents the canvas from being cleared after someone finished drawing.<br>Fun in custom lobbies when everyone activates this!.<br>";
    }
    else if (e.id == 'holy') {
        info = "Holy <br><br>"
        info += "Nothing except a small ego boost :D.<br>";
    }
    else if (e.id == 'originalPalette') {
        info = "Original Palette<br><br>"
        info += "Choose of color palettes! Default palette is the original skribbl palette. <br>Get more colors by choosing the sketchful palette!<br>";
    }
    else if (e.id == 'paletteJSON' || e.id == 'enterJSON') {
        info = "Palette JSON <br><br>"
        info += "Create a custom color palette!<br>The palette has to be created in JSON format, example given:<br>"
            + '{"rowCount":13, "name":"sketchfulPalette", "colors":[{"color":"rgb(255, 255, 255)","index":100},{"color":"rgb(211, 209, 210)","index":101},{"color":"rgb(247, 15, 15)","index":102},{"color":"rgb(255, 114, 0)","index":103},{"color":"rgb(252, 231, 0)","index":104},{"color":"rgb(2, 203, 0)","index":105}]}<br>'
            + "That's an incomplete sketchful palette.<br>"
            + "The JSON has to contain following things:<br>"
            + "- rowCount: the count of color boxes in a row, important for the formatting<br>"
            + "- name: the name of the palette; just don't choose anything too fancy<br>"
            + "- colors: the colors. They contain of two things:<br>"
            + "- index: rather an id than index, but that's how it is called in skribbl. Important that NONE of your colors have an index of a color of another palette! <br>Skribbl colors have indexes from 0-20, the sketchful palette from 100 to 138. Choose anything else.<br>"
            + "- color: your color. Can be in hex, rgb, anything (rgba didn't work).<br>";
    }
    else if (e.id == 'backbutton') {
        info = "BackButton <br><br>"
        info += "Shows a beta-backbutton.<br>e is kinda hacky and just redraws the whole image.";
        info += "<br>Sadly also still buggy.";
    }
    else if (e.id == 'charbar') {
        info = "CharBar <br><br>"
        info += "Displays a small field under the chat input. The color indicates if the typed text matches the word length/hints.";
    }
    else if (e.id == 'randomToggle') {
        info = "Random Color <br><br>"
        info += "Switches the brush color automatically (VERY fast). Doesn't set white.<br>";
        info += "<br>Click the dice in the color field to activate and click any color to deactivate.";
    }
    else if (e.id == 'palantirToggle') {
        info = "Discord Lobbies <br><br>"
        info += "If activated, your lobby will show up in the bot message of any of your added discord servers.<br>";
        info += "If you want to stay incongito, turn this off - especially in private lobbies.";
    }
    else if (e.id == 'help') {
        info = "Hello there! ❤️<br><br>"
        info += "Pls gift me nitro :*";
    }
    else if (e.id == 'loginSubmit') {
        info = "Login <br><br>"
        info += "Connect to the discord bot to show and send active lobbies.<br>";
        info += "Message the Palantir bot '>login' and enter the login number here.<br>";
    }
    else if (e.id == 'loginSubmit') {
        info = "Login <br><br>"
        info += "Connect to the discord bot to show and send active lobbies.<br>";
        info += "Message the Palantir bot '>login' and enter the login number here.<br>";
    }
    else if (e.id == 'verifyToken') {
        info = "Verify <br><br>"
        info += "Add a discord server which you would like to send and see active lobbies.<br>";
        info += "Copy the server token from the bot message or ask your server admin about it.<br>";
    }
    else if (e.parentElement.id == 'sensSlider') {
        info = "Sensitivity <br><br>"
        info += "Set the pressure sensitivity of the tablet.<br>";
        info += "Very low will probably fit best; check out your graphics tablet driver for deeper control.<br>";
    }
    else if (e.parentElement.id == 'markupSlider') {
        info = "Markup Color <br><br>"
        info += "Set color of the markup for your chat messages.<br>";
        info += "The slider thumb indicates the selected color.<br>";
    }
    else if (e.parentElement.id == 'randomSlider') {
        info = "Random Interval <br><br>"
        info += "Sets the interval of random color switches.<br>";
        info += "Minimum is 10ms, maximum 500ms.<br>";
    }
    else info = "Wait what";
    // get dummy of clicked element
    let dummy = e.closest(".dummy");
    // get current dummy height
    let height = dummy.getBoundingClientRect().height;
    // get dummy html for restoring
    let dummymu = dummy.innerHTML;
    // set dummy html to infocard
    dummy.innerHTML = "<div class='flexcol flexcenter label' style='width:100%;height:100%;font-family: \"Roboto Mono\", monospace;' >" + info + "<br><br></div>";
    // set height of dummy so no resize occurs
    dummy.style.height = height + "px";
    // add a back-button to the infocard
    let btn = document.createElement("button");
    btn.innerText = "Got it!";
    btn.style.width = "calc(100% - 2em)";
    btn.style.margin = "1em;"
    dummy.firstChild.appendChild(btn);
    // on back button click, restore dummy html
    btn.addEventListener("click", () => {
        dummy.innerHTML = dummymu;
        // restore events of dummy inputs
        dummy.querySelectorAll("button, input[type='range']").forEach((o) => {
            o.addEventListener("click", setInfo);
            o.addEventListener("input", setInfo);
        });
        dummy.style.height = "";
    });
}
// UI setup when DOM loaded
document.addEventListener("DOMContentLoaded", () => {
    let nav = QS("#navPlanCont");
    nav.addEventListener("click", shownav);
    // Close nav planet if anything except the anchors s clicked
    QSA("#navBack, #navClone, navClone>a").forEach(e => e.addEventListener("click", () => {
        let style = QS("#navStyle");
        // remove added nav planet stylesheet
        if (style) style.remove();
    }));
    // show initial section by url hash
    showsection(window.location.hash.substr(1));
    // perform filter function when typed in the documentation filter input
    QS("#filterCommands").addEventListener("input", (e) => {
        filterElements("#documentation .contentBox", "#queryRes", e.target.value);
    });
    // show initial filter result count on documentation filter
    QS("#queryRes").innerText = QSA("#documentation .contentBox").length;
    // add dummy inout events to show infocards
    QSA("button, input[type='range']").forEach((o) => {
        o.addEventListener("click", setInfo);
        o.addEventListener("input", setInfo);
    });
});
// Async UI setup when DOM is loaded, fetches sprite data from server
document.addEventListener("DOMContentLoaded", async () => {
    // load sprites json from server
    let response = (await (await fetch("https://tobeh.host/Orthanc/sprites/")).json());
    let sprites = response.Sprites;
    let drops = response.Drops;
    // get sprites container
    let container = QS("#spriteList");
    // create sprite card for each sprite
    sprites.forEach(s => {
        // build card html
        let eventdrop = drops.find(d => d.EventDropID == s.EventDropID);
        let sprite = `
            <div class="sprite" data-id="${s.ID}" data-price="${s.Cost}">
                <div><h3>#${s.ID}</h3></div>
                <div><h3>Price: ${s.Cost} ${(eventdrop ? eventdrop.Name : "Bubbles")}</h3></div>
                <div class="flexrow flexcenter fullwidth"><img src="${s.URL}"></div>
                <div><h3>${s.Name}</h3></div>
                <h3>${(s.Special > 0 ? "#special" : "")} ${(eventdrop ? "#event #" + eventdrop.Name + " #" + eventdrop.EventName : "#regular")}</h3>
            </div>`;
        container.innerHTML += sprite;
    });
    setTimeout(() => {
        // if sprites section is active when sprites are loaded, re-set section so background height is adjusted
        if (window.location.hash.substr(1) == "sprites") showsection("sprites");
        // add filter function to sprite fiter input
        QS("#filterSprites").addEventListener("input", (e) => {
            filterElements(".sprite", "#spriteRes", e.target.value);
        });
        QSA("#spritesOrderBy, #spritesOrderDirection").forEach(b => {
            b.addEventListener("click", orderSprites);
        });
        // set initial filter to regular
        QS("#filterSprites").value = "#regular";
        QS("#filterSprites").dispatchEvent(new Event("input"));
    }, 100);
});
// When hash in url changed (eg through navigation anchors) set displayed section
window.addEventListener("hashchange", () => {
    showsection(window.location.hash.substr(1));
});