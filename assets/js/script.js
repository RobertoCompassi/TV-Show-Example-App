/**
 * @author: Roberto Compassi from São José do Rio Preto - SP, Brazil
 * @description: JavaScript file for control and manipulation of
 *  DOM elements executing http requests for details of the TV
 * program and its epsodios when available.
 * This code uses pure JavaScript only with the EcmaScript6 updates.
 * Compiled with MS TypeScript TSC was generated to generate compiled .js file.
 *
 *      use the command to compile in the correct folder:
 *      tsc --lib dom,es6 --out assets/js/script.js assets/ts/scriptES6.ts
 */
//
window.onload = function () {
    //executes the loadShowTvDetails() function when the DOM tree is ready
    loadShowTvDetails();
};
/**
 * executes HTTP request using Fetch API for TV show details
 */
function loadShowTvDetails() {
    var urlData = "https://sample-api-78c77.firebaseio.com/tv-shows/SHOW123.json";
    fetch(urlData, { headers: { "Content-Type": "application/json; charset=utf-8" } })
        .then(function (res) { return res.json(); })
        .then(function (response) {
        bindShowDetails(response);
    })["catch"](function (err) {
        console.log(err);
        document.querySelector("body").innerHTML = "<div class='erro-load'>Unable to load show, please try again later.</div>";
    });
}
/**
 * Execute http request using Fetch API to get the list of episodes
 */
function loadListEpisodes() {
    var urlData = "https://sample-api-78c77.firebaseio.com/episodes/SHOW123.json";
    fetch(urlData, { headers: { "Content-Type": "application/json; charset=utf-8" } })
        .then(function (res) { return res.json(); })
        .then(function (response) {
        bindSessionEpisodesList(response);
    })["catch"](function (err) {
        console.log(err);
        document.querySelector("body").innerHTML = "<div class='erro-load'>Unable to load show, please try again later.</div>";
    });
}
;
/**
 * binds the showDetails object in the html document
 * @param showDetails
 */
function bindShowDetails(showDetails) {
    if (showDetails != undefined && showDetails != null) {
        //set background tv show
        document.getElementById("main").setAttribute("style", "background-image: url(\"" + showDetails.Images.Background + "\")");
        //get tv show details header element
        var headerDetails_1 = document.querySelector(".main__header__details");
        //Title 
        document.querySelector(".main__header__title").textContent = showDetails.Title;
        //Genres
        showDetails.Genres.forEach(function (genre, index) {
            var headerDetailsItemGenre = document.createElement("span");
            headerDetailsItemGenre.setAttribute("class", "main__header__details__item genre");
            headerDetailsItemGenre.textContent = genre.Title;
            headerDetails_1.appendChild(headerDetailsItemGenre);
        });
        //Year
        var headerDetailsItemYear = document.createElement("span");
        headerDetailsItemYear.setAttribute("class", "main__header__details__item year");
        headerDetailsItemYear.textContent = showDetails.Year;
        headerDetails_1.appendChild(headerDetailsItemYear);
        //Synopsis
        document.querySelector(".m-general-synopsis p").textContent = showDetails.Synopsis;
        //Main Cast
        if (showDetails.Cast && showDetails.Cast.length > 0) {
            var mainCastList_1 = document.querySelector("#main-cast");
            showDetails.Cast.forEach(function (cast, index) {
                var actorItem = document.createElement("li");
                actorItem.setAttribute("class", "cast__actor");
                actorItem.textContent = cast.Name;
                mainCastList_1.appendChild(actorItem);
            });
        }
        else {
            document.querySelector("#main-cast").textContent = "Not available Cast Information";
        }
        document.querySelector(".l-wrapper").setAttribute("style", "opacity: 1");
        loadListEpisodes();
    }
}
;
/**
 * binds the episode list, organizing by season
 * @param episodesData
 */
function bindSessionEpisodesList(episodesData) {
    if (episodesData != null && episodesData != undefined) {
        for (var _i = 0, episodesData_1 = episodesData; _i < episodesData_1.length; _i++) {
            var episode = episodesData_1[_i];
            try {
                //var episode  = episodesData[i];
                if (episode != null || episode != undefined) {
                    //console.log(episode);
                    //set img element with episode image 
                    var episodeImg = document.createElement("div");
                    episodeImg.setAttribute("style", "background-image: url(" + episode.Image + ")");
                    episodeImg.setAttribute("class", "episode__details__thumb");
                    var progressBar = document.createElement("div");
                    progressBar.setAttribute("class", "episode__details__thumb__progress");
                    progressBar.innerHTML = "<span class='episode__details__thumb__progress__bar'></span>";
                    episodeImg.appendChild(progressBar);
                    //set ep title line
                    var episodeHeader = document.createElement("div");
                    episodeHeader.classList.add("episode__header");
                    episodeHeader.innerHTML = "<p class=\"episode__header__title\">" + episode.EpisodeNumber + " " + episode.Title + "</p>";
                    episodeHeader.innerHTML += "<button class=\"btn--play episode__header__btn__play\" arial-label=\"Play\"></button>";
                    var episodeDetails = document.createElement("div");
                    episodeDetails.classList.add("episode__details");
                    var episodeSynopsis = document.createElement("p");
                    episodeSynopsis.textContent = episode.Synopsis;
                    episodeSynopsis.classList.add("episode__details__synopsis");
                    //build details episode
                    episodeDetails.appendChild(episodeImg);
                    episodeDetails.appendChild(episodeSynopsis);
                    //build and insert the item in the episode list
                    //parent container item episode in list
                    var episodeItem = document.createElement("li");
                    episodeItem.setAttribute("data-season", episode.SeasonNumber);
                    episodeItem.setAttribute("data-id", episode.ID);
                    episodeItem.classList.add("season__list__item");
                    episodeItem.classList.add("episode");
                    episodeItem.appendChild(episodeHeader);
                    episodeItem.appendChild(episodeDetails);
                    pushEpisodeInList(episodeItem);
                }
            }
            catch (ex) {
                //show error ep item
                console.log(ex);
            }
        }
        selectSeason(1);
        document.getElementById("seasonsContainer").setAttribute("style", "transform: translateX(-100%);");
    }
}
;
/**
 * binds the episode to the correct season on the screen
 * @param episodeItem
 */
function pushEpisodeInList(episodeItem) {
    var seasonSelected = parseInt(episodeItem.getAttribute("data-season"));
    //console.log("Ep seasson number: " + seasonSelected);
    //try find season list, else create new list season and insert in list
    if (document.querySelector('ul[data-season-number="' + seasonSelected + '"]') != null) {
        var ul = document.querySelector('ul[data-season-number="' + seasonSelected + '"]');
        ul.appendChild(episodeItem);
    }
    else {
        //get seasons list container parent
        var seasonsContainer = document.getElementById('seasonsContainer');
        //get the selector of seasons controls parent
        var seasonSelectedElement = document.getElementById("seasonSelect");
        //create a selector to show only episodes of the selected season
        var liSeasonTab = document.createElement("li");
        liSeasonTab.setAttribute("class", "season__select__tab");
        liSeasonTab.setAttribute("data-season-target", seasonSelected.toString());
        liSeasonTab.textContent = "T" + seasonSelected;
        seasonSelectedElement.appendChild(liSeasonTab);
        //set the episode in the list
        var ul = document.createElement("ul");
        ul.setAttribute("data-season-number", seasonSelected.toString());
        ul.setAttribute("class", "season__list");
        ul.appendChild(episodeItem);
        seasonsContainer.appendChild(ul);
    }
}
;
/**
 * manipulate the DOM element responsible for displaying the selected season
 * @param seasonTarget
 */
function selectSeason(seasonTarget) {
    //check if the season exists
    if (document.querySelector(".season__select__tab[data-season-target='" + seasonTarget + "']")) {
        //hide others seasons
        var allSeasonsElements = document.getElementsByClassName("season--selected");
        for (var i = 0; i < allSeasonsElements.length; i++) {
            allSeasonsElements[i].classList.remove("season--selected");
        }
        var seasonSelectElement = document.querySelector(".season__select__tab[data-season-target='" + seasonTarget + "']");
        seasonSelectElement.classList.add("season--enable");
        var seasonEpList = document.querySelector(".season__list[data-season-number='" + seasonTarget + "']");
        seasonEpList.classList.add("season--selected");
    }
}
;
/**
 * manipulate the sun element responsible for displaying the details flap on the rod and makes it visible
 * @param tabTarget
 */
function selectDetailsFooterTab(tabTarget) {
    //check if the tab exists
    if (document.querySelector(".m-details-content-tab[data-tab-content='" + tabTarget + "']")) {
        //hide others tabs
        var allFooterTabs = document.getElementsByClassName("content--enable");
        for (var i = 0; i < allFooterTabs.length; i++) {
            allFooterTabs[i].classList.remove("content--enable");
        }
        var tabSelectElement = document.querySelector(".m-details-content-tab[data-tab-content='" + tabTarget + "']");
        tabSelectElement.classList.add("content--enable");
        scrollTabContent(tabTarget - 1);
    }
}
;
/**
 * Creates the scrolling animation of the details tab
 * @param indexTab
 */
function scrollTabContent(indexTab) {
    var ContainerElement = document.querySelector(".l-details-content-group");
    var widthContainer = ContainerElement.offsetWidth;
    var tabContentElements = document.getElementsByClassName("m-details-content-tab");
    var distanciaEsquerda = tabContentElements[indexTab].offsetLeft - tabContentElements[0].offsetLeft;
    Array.from(document.querySelectorAll(".m-details-content-tab")).forEach(function (tab) {
        tab.setAttribute("style", "transform: translateX(-" + distanciaEsquerda + "px)");
    });
}
;
//Event Listeners for click or touch
document.addEventListener('click', function (e) {
    var elementClicked = e.target;
    //click event on the episode in the list to show the details
    if (elementClicked.classList.contains('episode__header__title')) {
        var episodeParentItem = elementClicked.closest(".episode");
        if (episodeParentItem.classList.contains("episode--open")) {
            episodeParentItem.classList.remove("episode--open");
        }
        else {
            Array.from(document.querySelectorAll('.season__list__item')).forEach(function (item) {
                item.classList.remove("episode--open");
            });
            episodeParentItem.classList.add("episode--open");
        }
    }
    //click tab select season
    if (elementClicked.classList.contains('season__select__tab')) {
        var seasonTarget = elementClicked.getAttribute("data-season-target");
        if (!elementClicked.classList.contains("season--enable")) {
            var elements = document.getElementsByClassName("season__select__tab");
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove("season--enable");
            }
            elementClicked.classList.add("season--enable");
            selectSeason(seasonTarget);
        }
    }
    //click event in the tab details 
    if (elementClicked.classList.contains('details__tabs__tab')) {
        var tabTargetIndex = elementClicked.getAttribute("data-tab");
        if (elementClicked.classList.contains("tab--enable")) {
            elementClicked.classList.remove("tab--enable");
        }
        else {
            var elements = document.getElementsByClassName("details__tabs__tab");
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove("tab--enable");
            }
            elementClicked.classList.add("tab--enable");
            selectDetailsFooterTab(tabTargetIndex);
        }
    }
});
