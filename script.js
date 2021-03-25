// async function getPlayers(variable) {
//     const response = await fetch(`https://www.balldontlie.io/api/v1/games?seasons[]=2020&team_ids[]=${variable}&page=2`);
//     const data = await response.json();
//     for (i=0; i<data.data.length; i++){
//         console.log(data.data[i]);
//     }    
// }

// getPlayers(28);

let playerArmLeft= document.getElementById("player-arm-left");
let playerArmRight=document.getElementById("player-arm-right");
let playerLegLeft=document.getElementById("player-leg-left");
let playerLegRight=document.getElementById("player-leg-right");
let playerBody=document.getElementById("player-body");
let playerBall=document.getElementById("player-ball");

let svgHeight = document.getElementById("height-svg");
let playerHeightFeet = document.querySelector(".feet");
let playerHeightInches = document.querySelector(".inches");
let playerWeight = document.querySelector(".weight");

async function getPlayerHeight(event){


    //destroys the leftover tooltip elements that are created by Materialize otherwise they will all build up.
    let removeTooltips = document.querySelectorAll(".material-tooltip");
        removeTooltips.forEach((ele)=>{
            ele.remove();
        })

    let dataSearch = document.querySelector("#player-search-result");    
    event.preventDefault(); //prevent 'submit' default action

    //Grabbing JSON file
    const searchBox = document.querySelector('input[name="name"]').value;
    const response = await fetch ("https://data.nba.net/data/10s/prod/v1/2020/players.json");
    const data = await response.json();
    
    let nbaOnly = data.league.standard;//targeting the proper nested array for NBA

    let searchedNames = nbaOnly.filter((playerName)=>{
        const regex = new RegExp(`^${searchBox}`,'gi');//Uses the searchbox name as the regex filter
        return playerName.firstName.match(regex) || playerName.lastName.match(regex); //Returns array that contains names that has user's search
    });
    
    //empty results if no characters present
    if(searchBox.length===0){
        searchedNames = [];
        dataSearch.innerHTML = '';
        playerHeightFeet.innerText="6";
        playerHeightInches.innerText="0";
        animateSvg(6,0); // resets svg animation to the default 6 feet
        document.querySelector(".modal-trigger").classList.add("disabled");
        
    }
    outputPlayerNames(searchedNames);
    
}

//Main search function that displays the searched player and bolds the searched characters
let outputPlayerNames = searchedNames =>{
    const searchBox = document.querySelector('input[name="name"]').value;
    if(searchedNames.length>0){        
        const outputHtml=searchedNames.map((name) =>{
            let playerFirstandLast = name.firstName+" "+name.lastName;
            let playerFirstandLastBold = boldSearch(playerFirstandLast,searchBox); //Applies the boldSearch function that contains the regex for case insensitivity and reutnrs bolded characters
            if(name.heightFeet!=="-"){ //prevents return of players with empty height data
                return '<a class="searched-players collection-item" data-position="right">'+playerFirstandLastBold+" - "+name.heightFeet+"'"+name.heightInches+"\""+'</a>'
            }
        });

       

        const finalOutput=outputHtml.join(''); //uses the , as selector in the array to turn into string
        // console.log(searchedNames);
        
        document.querySelector("#player-search-result").innerHTML=finalOutput;
            
        let playerVar=document.querySelectorAll(".searched-players");
        playerVar.forEach((ele,index)=>{ //adds event listeners to all the names in finalOutput            
           
            ele.addEventListener(`click`,()=>{clickedNames(searchedNames[index])})
            

            //Adds mouse over event listeners that add classes that allow player pictures. This prevents the continuous loading of every player's picture which can make the app very slow.
            ele.addEventListener('mouseenter', ()=>{
                ele.classList.toggle('tooltipped')
                ele.id="unique-player";
                createTooltip(searchedNames[index].personId); //passes the hovered over players id info so proper image is displayed                
            });

            ele.addEventListener('ontouchmove', ()=>{
                ele.classList.toggle('tooltipped')
                ele.id="unique-player";
                createTooltip(searchedNames[index].personId); //passes the hovered over players id info so proper image is displayed                
            });

            ele.addEventListener('mouseleave', ()=>{
                ele.classList.toggle('tooltipped');
                ele.removeAttribute('id');
            });
        });
    }
}

//Applies info into the info button to get more player information
function clickedNames (searchedNames){
    let playerFirstandLast = searchedNames.firstName+" "+searchedNames.lastName;
    document.querySelector(".modal-trigger").classList.remove("disabled");
    console.log("clicked"+" " + playerFirstandLast);
    console.log(parseInt(searchedNames.heightFeet)+parseInt(searchedNames.heightInches));
    animateSvg(parseInt(searchedNames.heightFeet),parseInt(searchedNames.heightInches));//converts the string height value to integer so it can math properly
    document.getElementById("modal-player-name").innerText=playerFirstandLast;
    document.getElementById("modal-player-info").innerText=playerFirstandLast+" is a "+""+searchedNames.heightFeet+"'"+searchedNames.heightInches+"\""+" "+searchedNames.weightPounds+" lbs "+searchedNames.teamSitesOnly.posFull+".";
    document.getElementById("modal-player-picture").src=`https://ak-static.cms.nba.com/wp-content/uploads/silos/nba/latest/440x700/${searchedNames.personId}.png`
}


//Function creates the player's tooltip headshot only when hovered over.
function createTooltip(playerId){
    var elems = document.querySelectorAll('.tooltipped');
    var options={
        enterDelay: 0,
        html:`<div class="player-hover-image-container"><img class="player-hover-image" src="https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${playerId}.png"></div>`
    };
    var instances = M.Tooltip.init(elems, options);
  
    var instance = M.Tooltip.getInstance(document.getElementById("unique-player"));
    instance.open();
  }

//Bolds the searched characters, regex makes it case insensitive and returns the original capitalization of the strings
function boldSearch(str, search){
    let caseInsensitiveRegex = new RegExp("("+search+")", "gi");
    return str.replace(caseInsensitiveRegex,'<b style="color:#424242">$1</b>');
}



//Disables player info button when user backspace or delete in search box
document.querySelector('input[name="name"]').addEventListener('keydown', (event)=>{
    const {key} = event;
    if(key=== "Backspace" || key === "Delete"){
        document.querySelector(".modal-trigger").classList.add("disabled");
    }
});

//Animates the svg based on the player height data. Uses GSAP.
function animateSvg (heightFeet,heightInches){
    let feetToInches=(heightFeet*12+(heightInches))/72;
    console.log(feetToInches);
    gsap.to("#Layer_1",{duration: 1, ease:"none", transformOrigin:"left bottom", scale:feetToInches});
    playerHeightFeet.innerText = heightFeet;
    playerHeightInches.innerText = heightInches;
}

window.odometerOptions = {
    // animation: 'count',
    format: 'dd',
    duration: 1000
};


var modalElems = document.querySelectorAll('.modal');
var options = {
    startingTop:"2%"
}
var instance = M.Modal.init(modalElems, options);

//"main" listener that runs the filter when user starts typing
document.querySelector('input[name="name"]').addEventListener('input', getPlayerHeight);

    //Attempting to animate different parts of SVG...failure
    // for(i=0; i<data.data.length; i++){
    //     let dataSearchCreate = document.createElement("p");
    //     dataSearch.appendChild(dataSearchCreate);
        
    //     if(data.data[i].height_feet != null){   
    //         let feetToInches=(data.data[i].height_feet*12+(data.data[i].height_inches))/72;
    //         let convertYScale = (feetToInches-(2*feetToInches))*7.5
    //         let weightToScale = data.data[i].weight_pounds/190;
    //         let weightToDisplace=data.data[i].weight_pounds/200;
    //         console.log(feetToInches);              
    //         dataSearchCreate.innerText= data.data[i].first_name + " " + data.data[i].last_name + " is " + data.data[i].height_feet + " foot " + data.data[i].height_inches + " inches " + "and plays for the " + data.data[i].team.full_name+".";
            
    //         // gsap.to(playerArmLeft, {duration: 1, ease:"none", transformOrigin:"top", scaleY:feetToInches});
    //         // // gsap.to(playerArmLeft, {duration: 1, ease:"none", transformOrigin:"center", scaleX:weightToScale});
    //         // gsap.to(playerArmRight, {duration: 1, ease:"none", transformOrigin:"top", scaleY:feetToInches});
    //         // // gsap.to(playerArmRight, {duration: 1, ease:"none", transformOrigin:"center", scaleX:weightToScale});
    //         // gsap.to(playerLegLeft, {duration: 1, ease:"none", transformOrigin:"top", scaleY:feetToInches});
    //         // gsap.to(playerLegRight, {duration: 1, ease:"none", transformOrigin:"top", scaleY:feetToInches});
    //         // // gsap.to("#player-body", {y:convertYScale, duration: 1.5});
    //         gsap.to("#Layer_1",{duration: 1, ease:"none", transformOrigin:"bottom", scaleY:feetToInches, scaleX:weightToScale});
    //         // gsap.to(svgHeight, { duration: 1, ease: "none", transformOrigin:"left bottom", scaleY:feetToInches, scaleX:weightToScale} );
    //         playerHeightFeet.innerText = data.data[i].height_feet;
    //         playerHeightInches.innerText = data.data[i].height_inches;
    //         playerWeight.innerText = data.data[i].weight_pounds;

    //     } else {
    //         dataSearchCreate.innerText= "There is no height data for " + data.data[i].first_name + " " + data.data[i].last_name
    //     }

    // } 