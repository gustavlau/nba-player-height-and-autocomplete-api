// async function getPlayers(variable) {
//     const response = await fetch(`https://www.balldontlie.io/api/v1/games?seasons[]=2020&team_ids[]=${variable}&page=2`);
//     const data = await response.json();
//     for (i=0; i<data.data.length; i++){
//         console.log(data.data[i]);
//     }    
// }

// getPlayers(28);

let svgHeight = document.getElementById("height-svg");
let playerHeightFeet = document.querySelector(".feet");
let playerHeightInches = document.querySelector(".inches");
let playerWeight = document.querySelector(".weight");
async function getPlayerHeight(event){
    let dataSearch = document.querySelector("#player-search-result");    
    while(dataSearch.firstChild){ //clears old search area when new search is made
        dataSearch.removeChild(dataSearch.firstChild);               
    }
    event.preventDefault(); //prevent 'submit' default action
    const name = document.querySelector('input[name="name"]').value;
    const response = await fetch (`https://www.balldontlie.io/api/v1/players?search=${name}&per_page=100`);
    const data = await response.json();
    console.log(data);
    for(i=0; i<data.data.length; i++){
        let dataSearchCreate = document.createElement("p");
        dataSearch.appendChild(dataSearchCreate);
        if(data.data[i].height_feet != null){   
            let feetToInches=(data.data[i].height_feet*12+(data.data[i].height_inches))/72;
            let weightToScale = data.data[i].weight_pounds/190;
            console.log(feetToInches);              
            dataSearchCreate.innerText= data.data[i].first_name + " " + data.data[i].last_name + " is " + data.data[i].height_feet + " foot " + data.data[i].height_inches + " inches " + "and plays for the " + data.data[i].team.full_name+".";
            gsap.to(svgHeight, { duration: 1, ease: "none", transformOrigin:"left bottom", scaleY:feetToInches, scaleX:weightToScale} );
            playerHeightFeet.innerText = data.data[i].height_feet;
            playerHeightInches.innerText = data.data[i].height_inches;
            playerWeight.innerText = data.data[i].weight_pounds;
        } else {
            dataSearchCreate.innerText= "There is no height data for " + data.data[i].first_name + " " + data.data[i].last_name
        }

    }    
}

document.querySelector("#player-search").addEventListener("submit", getPlayerHeight);

// async function fetchAllPages(url) {
//     const data = [];
//     const name = document.querySelector('input[name="name"]').value;

//     do {
//         // let response = fetch(url);
//         const response = await fetch (`https://www.balldontlie.io/api/v1/players?search=${name}&per_page=100`);
//         url = response.next;
//         data.push(...response.results);
//     } while ( url );

//     return data;
// }

window.odometerOptions = {
    animation: 'count',
    format: 'dd'
};


