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
    let dataSearch = document.querySelector("#player-search-result");    
        event.preventDefault(); //prevent 'submit' default action

    //Grabbing JSON file
    const searchBox = document.querySelector('input[name="name"]').value;
    const response = await fetch ("https://data.nba.net/data/10s/prod/v1/2020/players.json");
    const data = await response.json();
    
    let nbaOnly = data.league.standard;//targeting the proper nested array for NBA

    let searchedNames = nbaOnly.filter((playerName)=>{
        const regex = new RegExp(`^${searchBox}`,'gi');//Uses the searchbox name as the regex filter
        return playerName.firstName.match(regex) || playerName.lastName.match(regex);
    });
    
    //empty results if no characters present
    if(searchBox.length===0){
        searchedNames = [];
        dataSearch.innerHTML = '';
    }
    outputPlayerNames(searchedNames);
    
}

let outputPlayerNames = searchedNames =>{
    const searchBox = document.querySelector('input[name="name"]').value;
    if(searchedNames.length>0){
        const outputHtml=searchedNames.map((name) =>{
            let playerFirstandLast = name.firstName+" "+name.lastName;
            let playerFirstandLastBold = boldSearch(playerFirstandLast,searchBox);
            if(name.heightFeet!=="-"){ //prevents return of players with empty height data
            return '<p class="searched-players">'+playerFirstandLastBold+" - "+name.heightFeet+"'"+name.heightInches+"\""+'<p>'}})
            const finalOutput=outputHtml.join('');
            document.querySelector("#player-search-result").innerHTML=finalOutput;    
            let pVar=document.querySelectorAll(".searched-players");
            pVar.forEach((ele,index)=>{ //adds event listeners to all the names in finalOutput
            ele.addEventListener(`click`,function(){
                console.log("clicked"+" " + searchedNames[index].firstName+" "+searchedNames[index].lastName);
                console.log(parseInt(searchedNames[index].heightFeet)+parseInt(searchedNames[index].heightInches));
                animateSvg(parseInt(searchedNames[index].heightFeet),parseInt(searchedNames[index].heightInches));
            });
        });
    }   
}

//Bolds the searched characters, regex makes it case insensitive and returns the original capitalization of the strings
function boldSearch(str, search){
    let caseInsensitiveRegex = new RegExp("("+search+")", "gi");
    return str.replace(caseInsensitiveRegex,"<b>$1</b>");
}

document.querySelector('input[name="name"]').addEventListener('input', getPlayerHeight);

function animateSvg (heightFeet,heightInches){
    let feetToInches=(heightFeet*12+(heightInches))/72;
    console.log(feetToInches);
    // let convertYScale = (feetToInches-(2*feetToInches))*7.5
    gsap.to("#Layer_1",{duration: 1, ease:"none", transformOrigin:"left bottom", scale:feetToInches});
    playerHeightFeet.innerText = heightFeet;
    playerHeightInches.innerText = heightInches;
}

let number = "9234"

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


document.querySelector("#player-search").addEventListener("submit", getPlayerHeight);

window.odometerOptions = {
    animation: 'count',
    format: 'dd'
};