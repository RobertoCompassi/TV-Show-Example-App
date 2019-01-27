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
window.onload = function(){
    //executes the loadShowTvDetails() function when the DOM tree is ready
    loadShowTvDetails();
}

/**
 * executes HTTP request using Fetch API for TV show details
 */
function loadShowTvDetails() : void{
    let urlData = "https://sample-api-78c77.firebaseio.com/tv-shows/SHOW123.json";
    fetch(urlData, { headers: { "Content-Type": "application/json; charset=utf-8" }})
    .then(res => res.json())
    .then(response => {
        bindShowDetails(response);
    })
    .catch(err => {
        console.log(err)
        document.querySelector("body").innerHTML = "<div class='erro-load'>Unable to load show, please try again later.</div>";
    });
}
/**
 * Execute http request using Fetch API to get the list of episodes
 */
function loadListEpisodes() : void{
    let urlData = "https://sample-api-78c77.firebaseio.com/episodes/SHOW123.json";
    fetch(urlData, { headers: { "Content-Type": "application/json; charset=utf-8" }})
    .then(res => res.json())
    .then(response => {
         bindSessionEpisodesList(response);
    })
    .catch(err => {
        console.log(err)
        document.querySelector("body").innerHTML = "<div class='erro-load'>Unable to load show, please try again later.</div>";
    });
};
/**
 * binds the showDetails object in the html document
 * @param showDetails 
 */
function bindShowDetails(showDetails : any) : void{
    if(showDetails != undefined && showDetails != null){
        //set background tv show
        document.getElementById("main").setAttribute("style", `background-image: url("${showDetails.Images.Background}")`);
        
        //get tv show details header element
        let headerDetails = document.querySelector(".main__header__details");

        //Title 
        document.querySelector(".main__header__title").textContent = showDetails.Title;

        //Genres
        showDetails.Genres.forEach(function (genre, index) {
            let headerDetailsItemGenre = document.createElement("span");
            headerDetailsItemGenre.setAttribute("class","main__header__details__item genre");
            headerDetailsItemGenre.textContent = genre.Title;
            headerDetails.appendChild(headerDetailsItemGenre);
        });

        //Year
        let headerDetailsItemYear = document.createElement("span");
        headerDetailsItemYear.setAttribute("class","main__header__details__item year")
        headerDetailsItemYear.textContent = showDetails.Year;
        headerDetails.appendChild(headerDetailsItemYear);

        //Synopsis
        document.querySelector(".m-general-synopsis p").textContent = showDetails.Synopsis;

        //Main Cast
        if(showDetails.Cast && showDetails.Cast.length > 0){ 
            let mainCastList = document.querySelector("#main-cast");
            showDetails.Cast.forEach(function (cast, index) {
                let actorItem = document.createElement("li");
                actorItem.setAttribute("class","cast__actor");
                actorItem.textContent = cast.Name;
                mainCastList.appendChild(actorItem);
            });
        }else{
            document.querySelector("#main-cast").textContent = "Not available Cast Information";
        }

        document.querySelector(".l-wrapper").setAttribute("style","opacity: 1");
        loadListEpisodes();
    }
};
/**
 * binds the episode list, organizing by season
 * @param episodesData 
 */
function bindSessionEpisodesList(episodesData : any) : void{

    if(episodesData != null && episodesData != undefined){
        for(let episode of episodesData){
            try{
                //var episode  = episodesData[i];
                if(episode != null || episode != undefined){
                    //console.log(episode);

                    //set img element with episode image 
                    let episodeImg = document.createElement("div");
                    episodeImg.setAttribute("style", `background-image: url(${episode.Image})`);
                    episodeImg.setAttribute("class", "episode__details__thumb");

                    let progressBar = document.createElement("div");
                    progressBar.setAttribute("class", "episode__details__thumb__progress");
                    progressBar.innerHTML = "<span class='episode__details__thumb__progress__bar'></span>"

                    episodeImg.appendChild(progressBar);

                    //set ep title line
                    let episodeHeader =  document.createElement("div");
                    episodeHeader.classList.add("episode__header");
                    episodeHeader.innerHTML = `<p class="episode__header__title">${episode.EpisodeNumber} ${episode.Title}</p>`;
                    episodeHeader.innerHTML += `<button class="btn--play episode__header__btn__play" arial-label="Play"></button>`;

                    let episodeDetails = document.createElement("div");
                    episodeDetails.classList.add("episode__details");
                    
                    let episodeSynopsis = document.createElement("p");
                    episodeSynopsis.textContent = episode.Synopsis;
                    episodeSynopsis.classList.add("episode__details__synopsis");

                    //build details episode
                    episodeDetails.appendChild(episodeImg);
                    episodeDetails.appendChild(episodeSynopsis);

                    //build and insert the item in the episode list
                    //parent container item episode in list
                    let episodeItem = document.createElement("li");
                    episodeItem.setAttribute("data-season", episode.SeasonNumber);
                    episodeItem.setAttribute("data-id", episode.ID);
                    episodeItem.classList.add("season__list__item");
                    episodeItem.classList.add("episode");
                    episodeItem.appendChild(episodeHeader);
                    episodeItem.appendChild(episodeDetails);

                    pushEpisodeInList(episodeItem);
                }
            }catch(ex){
                //show error ep item
                console.log(ex);
            }
        }

        selectSeason(1);
        document.getElementById("seasonsContainer").setAttribute("style","transform: translateX(-100%);")
    }
};

/**
 * binds the episode to the correct season on the screen
 * @param episodeItem 
 */
function pushEpisodeInList(episodeItem : any) : void{
    
    let seasonSelected = parseInt(episodeItem.getAttribute("data-season"));
    //console.log("Ep seasson number: " + seasonSelected);

    //try find season list, else create new list season and insert in list
    if(document.querySelector('ul[data-season-number="'+ seasonSelected +'"]') != null){
        let ul  = document.querySelector('ul[data-season-number="'+ seasonSelected +'"]');
        ul.appendChild(episodeItem);

    }else{
        //get seasons list container parent
        let seasonsContainer = document.getElementById('seasonsContainer');

        //get the selector of seasons controls parent
        let seasonSelectedElement = document.getElementById("seasonSelect");
        
        //create a selector to show only episodes of the selected season
        let liSeasonTab = document.createElement("li");
        liSeasonTab.setAttribute("class", "season__select__tab");
        liSeasonTab.setAttribute("data-season-target", seasonSelected.toString());
        liSeasonTab.textContent = "T" + seasonSelected;
        seasonSelectedElement.appendChild(liSeasonTab);
        
        //set the episode in the list
        let ul = document.createElement("ul");
        ul.setAttribute("data-season-number", seasonSelected.toString());
        ul.setAttribute("class", "season__list");
        ul.appendChild(episodeItem);

        seasonsContainer.appendChild(ul);
    }
};

/**
 * manipulate the DOM element responsible for displaying the selected season
 * @param seasonTarget 
 */
function selectSeason(seasonTarget : any) : void{
    //check if the season exists
    if(document.querySelector(".season__select__tab[data-season-target='"+ seasonTarget +"']")){

        //hide others seasons
        let allSeasonsElements = document.getElementsByClassName("season--selected");
        for(let i = 0; i < allSeasonsElements.length; i++){
            allSeasonsElements[i].classList.remove("season--selected");
        }

        let seasonSelectElement = document.querySelector(".season__select__tab[data-season-target='"+ seasonTarget +"']");
        seasonSelectElement.classList.add("season--enable");

        let seasonEpList = document.querySelector(".season__list[data-season-number='"+seasonTarget+"']");
        seasonEpList.classList.add("season--selected");
    }
};
/**
 * manipulate the sun element responsible for displaying the details flap on the rod and makes it visible
 * @param tabTarget 
 */
function selectDetailsFooterTab(tabTarget : any) : void{
    //check if the tab exists
    if(document.querySelector(".m-details-content-tab[data-tab-content='"+ tabTarget +"']")){

        //hide others tabs
        let allFooterTabs = document.getElementsByClassName("content--enable");
        for(let i = 0; i < allFooterTabs.length; i++){
            allFooterTabs[i].classList.remove("content--enable");
        }

        let tabSelectElement = document.querySelector(".m-details-content-tab[data-tab-content='"+ tabTarget +"']");
        tabSelectElement.classList.add("content--enable");
        scrollTabContent(tabTarget - 1);
    }
};
/**
 * Creates the scrolling animation of the details tab
 * @param indexTab 
 */
function scrollTabContent(indexTab : any) : void{
    let ContainerElement  = <HTMLElement> document.querySelector(".l-details-content-group");
    let widthContainer : number = ContainerElement.offsetWidth; 
    let tabContentElements : any =  document.getElementsByClassName("m-details-content-tab");
    let distanciaEsquerda = tabContentElements[indexTab].offsetLeft - tabContentElements[0].offsetLeft;
    
    Array.from(document.querySelectorAll(".m-details-content-tab")).forEach((tab) => {
        tab.setAttribute("style", `transform: translateX(-${distanciaEsquerda}px)`);
    });
};

//Event Listeners for click or touch
document.addEventListener('click',function(e){

    let elementClicked : Element = (<Element>e.target);

    //click event on the episode in the list to show the details
    if(elementClicked.classList.contains('episode__header__title')){
        let episodeParentItem : Element | null = elementClicked.closest(".episode");
        if(episodeParentItem.classList.contains("episode--open")){
            episodeParentItem.classList.remove("episode--open");
        }else{
            Array.from(document.querySelectorAll('.season__list__item')).forEach((item) => {
                item.classList.remove("episode--open");
            });
            episodeParentItem.classList.add("episode--open");
        }
    }  

    //click tab select season
    if(elementClicked.classList.contains('season__select__tab')){
        let seasonTarget = elementClicked.getAttribute("data-season-target");
        if(!elementClicked.classList.contains("season--enable")){
            let elements = document.getElementsByClassName("season__select__tab");
            for(let i = 0; i < elements.length; i++){
                elements[i].classList.remove("season--enable");
            }
            elementClicked.classList.add("season--enable");
            selectSeason(seasonTarget);
        }
    }

    //click event in the tab details 
    if(elementClicked.classList.contains('details__tabs__tab')){
        
        let tabTargetIndex = elementClicked.getAttribute("data-tab");
        if(elementClicked.classList.contains("tab--enable")){
            elementClicked.classList.remove("tab--enable");
        }else{
            let elements = document.getElementsByClassName("details__tabs__tab");
            for(let i = 0; i < elements.length; i++){
                elements[i].classList.remove("tab--enable");
            }
            elementClicked.classList.add("tab--enable");
            selectDetailsFooterTab(tabTargetIndex);
        }
    }
 });
