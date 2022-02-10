//definitions des variables
let svg = d3.select("svg");
let landscape = false;

//variables globales
let sourisY = 50;
let compteur = 0;
let valeurSpawn = 3000;
let timeBoule = 7000;
let vitesseMechant = -0.75;
let round = 0;
let valeurSpawnCouteau = 800;
let vitesseCouteau = 0.75;
let sizeCouteau = 16;

let palierScore = 30;

let intervalChangeRounds = setInterval(verifChangeRounds, 100);

let vies = 3;
let score = 0;
let game = true;
let laserActive = false;
let typeBonus = 0;
let typeActif = 0;

//tableaux
let joueur = [];
let couteaux = [];
let boules = [];
let mechants = [{x: 210,
    y: 50,
    stop: false,
    lanceBoule: 0,
    compteBoules:0
}];
let lasers =[];
let bonus = [];
let colorType = [{type:0,color:"fff11d"},
                {type:1,color:"f4ae36"},
                {type:2,color:"bb5a36"},
                {type:3,color:"c936f4"},
                {type:4,color:"f415ff"},
                {type:5,color:"fff11d"},
                {type:6,color:"f4ae36"},
                {type:7,color:"bb5a36"},
                {type:8,color:"c936f4"},
                {type:9,color:"0F0"},
            ]

let intervalSpawn = setInterval(spawnmechant, valeurSpawn);
let intervalBoules = setInterval(spawnBoule, timeBoule);
let intervalCouteau = setInterval(InterCouteau, 15);
let intervalSpawnCouteau = setInterval(spawnCouteaux,valeurSpawnCouteau);
let intervalLaser = setInterval(laser,0) ;
clearInterval(intervalLaser);
let intervalDecompteLaser = setInterval(compteurLaser,0);
clearInterval(intervalDecompteLaser);

let decompteLaser = 2000;
let TempDecompteLaser = decompteLaser;
let cooldownLaserRestant = 0;
let cooldownLaser = 20000;

//On dessine notre jeu


    //infos sur le score et les vies
d3.select(".container")
    .append("div")
    .attr("class","infos")
    .append("div")
    .attr("class","nbVies")
    .html(`Lives: ${vies}`) 
    .style("padding","1vw")
    .style("font-size","2rem");
d3.select(".infos")
    .append("div")
    .attr("class","nbScore")
    .html(`score: ${score}`) 
    .style("padding","1vw")
    .style("font-size","2rem");
d3.select(".infos")
    .append("div")
    .attr("class","nbRound")
    .html(`Round: ${round}`) 
    .style("padding","1vw")
    .style("font-size","2rem");
d3.select(".infos")
    .append("div")
    .attr("class","afficheLaser")
//création du joueur
svg.append("image")
    .attr('href', 'img/gentil.png')
    .attr('class', 'joueur')
    .attr("transform", `translate(6,50)`)
    .attr("width", "25")
    .attr("height", "25")
    .attr("x", "-7")
    .attr("y", "-10")



DessineRound();

setTimeout(function() {
    d3.select(".roundinfo").remove();
}, 10000);

window.addEventListener("load", function(event) {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        pause();
     
             d3.select(".modaleMobile").style("display","grid");
      }else{
        if ( window.innerWidth > window.innerHeight ) {
            landscape = true;
     
             
           } else {
             landscape = false;
             pause();
     
             d3.select(".modaleOrientation").style("display","grid");
           }
      }
      
    
  });

window.addEventListener("resize", function(){
    if ( window.innerWidth > window.innerHeight ) {
        landscape = true;

        d3.select(".modaleOrientation").style("display","none");
        
      } else {
        landscape = false;
        pause();

        d3.select(".modaleOrientation").style("display","grid");
      }
})

function DessineRound(){
    if (round == 0){
        d3.select(".rules")
        .append("div")
        .attr("class","training")
        .html(`<h2>training</h2>`)
        .style("color","white")
        .style("font-size","1.5rem")
        
    } else {
        d3.select("body")
        .append("div")
        .attr("class","roundinfo")
        .html(`Round: ${round}`)
        .style("position","absolute")
        .style("top","50%")
        .style("left","50%")
        .style("transform","translate(-50%,-50%)")
        .style("background-color","#414141aa")
        .style("padding","20px")
        .style("color","white")
        .style("font-size","2rem");
        if (round <= 1){
            d3.select(".training")
            .html(`<h2>Play !</h2>`)
        }
       
    }
}



//dessin des projetils et ennemies
//fonction qui actualise le DOM, elle est souvent appellée pour dessiner les nouveaux ennemies et nouveaux projectils créés. 
// la fonction actualise également le score et les vies.
function update_DOM() {

    svg
        .selectAll(".couteau")
        .data(couteaux)
        // .data(couteaux, d=> d.id)
        .enter()
        .append("image")
        .attr("class", "couteau")
        .attr("href", "img/couto.png")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", d => `${d.size}`)
        .attr("transform", d => `translate(${d.x}, ${d.y})`)
        .attr("height",d => `${d.size}`);

        svg.selectAll(".couteau").data(couteaux).exit()
        .remove(); 



    svg
        .selectAll(".mechant")
        .data(mechants)
        .enter()
        .append("image")
        .attr("class", "mechant")
        .attr("href", "img/mechant.png")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", "20")
        .attr("height", "20")
        .style('border',"solid");

        svg.selectAll(".mechant").data(mechants).exit()
        .remove(); 


    svg
    .selectAll(".boules")
    .data(boules)
    .enter()
    .append("circle")
    .attr("class", "boules")
    .attr("fill", "#F00")
    .attr("cx", "0")
    .attr("cy", "0")
    .attr("r", "5");

    svg.selectAll(".boules").data(boules).exit()
        .remove();


    svg
    .selectAll(".laser")
    .data(lasers)
    .enter()
    .append("rect")
    .attr("class", "laser")
    .attr("fill", "purple")
    .attr("x", "0")
    .attr("y", "0")
    .attr("width", `10`)
    .attr("height", "10");

    svg.selectAll(".laser").data(lasers).exit()
        .remove();
  

   svg
    .selectAll(".bonus")
    .data(bonus)
    .enter()
    .append("g")
    .attr("class","bonus")
    .html(d => `<circle fill='#${colorType[d.type].color}' cx='0' cy='0' r='10' /> <text x='-5' y='1' font-size='6'>Bonus ${typeBonus}</text>`);

    svg.selectAll(".bonus").data(bonus).exit()
        .remove();
    
    
    



    
    if (vies <= 1){
        d3.select(".nbVies")
        .html(`LIFE: ${vies}`);
    } else {
        d3.select(".nbVies")
    .html(`Lives: ${vies}`);
    }

    
    if ( score >= 4000){
        d3.select(".nbScore")
        .style("color","#0892D0")
        .style("background-color","#222")
    .html(`score: ${score}`);
    } else if ( score >= 2500){
        d3.select(".nbScore")
        .style("color","gold")
        .style("background-color","royalBlue")
    .html(`score: ${score}`);
    } else if (score >= 1500) {
        d3.select(".nbScore")
        .style("color","silver")
        .style("background-color","indigo")

    .html(`score: ${score}`);
    } else if ( score >= 400) {
        d3.select(".nbScore")
        .style("color","maroon")
        .style("background-color","ivory")
    .html(`score: ${score}`);
    } else {
        d3.select(".nbScore")
        .style("color","black")
        .style("background-color","teal")
    .html(`score: ${score}`);
    }


    if ( round == 0){
        d3.select(".nbRound")
    .html(`TRAINING`);
    } else {
        d3.select(".nbRound")
    .html(`Round: ${round}`);
    }

    if(laserActive==false){
        if(cooldownLaserRestant > 0){
            d3.select(".afficheLaser")
            .html(`Laser available in: ${cooldownLaserRestant/1000} secondes`)
        }else{
            d3.select(".afficheLaser")
        .html(`Laser available`)
        }
    
} 



    

    updateTransforms();

    // console.log("update DOM")


}
update_DOM();

// function bonusColor(t){
//     if (t == 0){
//         return "FFF"
//     } else if (){
//         return "000"
//     }
// }

//mise à jour de la position du joueur sur l'axe y
svg.on("mousemove", function (e) {

    if (game){

    
    let pointer = d3.pointer(e);
    joueur = {x:7,y:pointer[1]}
    // console.log("a")


    d3.selectAll('.joueur')
        .attr("transform", `translate(${joueur.x},${joueur.y})`)


    sourisY = pointer[1];

    }

});

//fonction laserrrr
svg.on("click", function () {
    if (game){
    if (laserActive == false){
        if (cooldownLaserRestant == 0){
            laserActive = true;
        console.log("laser")
    // clearInterval(intervalCouteau);
    clearInterval(intervalSpawnCouteau)
    intervalLaser = setInterval(laser,4);
    
    intervalDecompteLaser = setInterval(compteurLaser,((decompteLaser/100)));

    // clearInterval(intervalLaser);

    setTimeout(function() {
        clearInterval(intervalLaser);
        clearInterval(intervalDecompteLaser);
        intervalSpawnCouteau = setInterval(spawnCouteaux,valeurSpawnCouteau);
        TempDecompteLaser = decompteLaser;

        laserActive = false;
        cooldownLaserRestant = cooldownLaser;

    }, decompteLaser)
        }
    } else {
        console.log("Laser in cooldown")
    }



    }
});

setInterval(() => {
    if (cooldownLaserRestant > 0){
        cooldownLaserRestant -= 1000;
    }
}, 1000);


function compteurLaser(){
    
   
    TempDecompteLaser -= (decompteLaser/100);
    if((TempDecompteLaser/1000) > 1){ a = `${TempDecompteLaser/1000} secondes` } else { a ="Less than a second"};
    // console.log(`${a} seconds of laser remaining.`)
    d3.select(".afficheLaser")
    .html(`${a} of laser remaining.`)

}

function laser(){
    // console.log("LASERRR");
    lasers.push({
        x: 12.5,
        y: sourisY
        
    })


    // console.log(couteaux)

    

    update_DOM();

}

setInterval(function () {

    if (game){
        lasers.forEach(d => {
            d.x += 5;
    
            lasers = lasers.filter(d => (d.x < 200));
        });
    }
    
    

}, 4);

window.addEventListener("keypress", function() {
    if((event.keyCode === 32) || (event.key === "p") || (event.key === "P") || (event.key === "Escape")){
        console.log("GAME PAUSED")
       
        
            if (game == true){

                pause();
    
            } else if ((game == false) && (landscape == true)){
               unpause();
            
            }
        
    }
  });

  function pause(){
    game = false
            clearInterval(intervalSpawn);
            clearInterval(intervalBoules);
            clearInterval(intervalCouteau);
            clearInterval(intervalSpawnCouteau);
            clearInterval(intervalLaser);
            clearInterval(intervalDecompteLaser);

            clearInterval(intervalChangeRounds);
       
            

            d3.select(".modalePause")
                .style("display","flex");
  }

  function unpause(){
    game = true
    intervalSpawn = setInterval(spawnmechant, valeurSpawn);
    intervalBoules = setInterval(spawnBoule, timeBoule);
    intervalCouteau = setInterval(InterCouteau, 15);
    intervalSpawnCouteau = setInterval(spawnCouteaux,valeurSpawnCouteau);
    intervalLaser = setInterval(laser,0) ;
    clearInterval(intervalLaser);
    intervalDecompteLaser = setInterval(compteurLaser,0);
    clearInterval(intervalDecompteLaser);

    intervalChangeRounds = setInterval(verifChangeRounds, 100);

    d3.select(".modalePause")
        .style("display","none");
  }

    
// setInterval(() => {
//     if (tempDecompteRounds < 150){
//         tempDecompteRounds = 10000;
//     }
//     if (decompteRounds < 150){
//         decompteRounds = 10000;
//     }
// }, 100);

function suppressionDansTableau(tableau, critere) {
    let suppression=false;
    for (let i=tableau.length-1; i>=0; i-- ) {
        if (critere(tableau[i])) {
            tableau.splice(i,1);
            suppression=true;
        }
    }
    return suppression;
}


//Fonction appellée souvent pour actualier la position des dessins d'ennemies et projectils en fonction de leurs nouvelles coordonnées dans le tableau.
function updateTransforms() {
    // console.log("update transforms")

    svg
        .selectAll(".couteau")
        .attr("transform", d => `translate(${d.x}, ${d.y})`)
        .attr("size", d => `width="${d.size}"`)
        .attr("size", d => `height="${d.size}"`);

    svg
        .selectAll(".mechant")
        .attr("transform", d => `translate(${d.x}, ${d.y})`);

    svg
    .selectAll(".boules")
    .attr("transform", d => `translate(${d.x}, ${d.y})`);

    svg
    .selectAll(".laser")
    .attr("transform", d => `translate(${d.x}, ${d.y})`);

    svg
    .selectAll(".bonus")
    .attr("transform", d => `translate(${d.x}, ${d.y})`);
}


//fonction qui determine la "distance parcourue"(le nombre à ajouter à la valeure x de chaque couteau dans le tableau) à chaque interval par un couteau. (l'interval est determiné plus bas)
function deplacecouteau(c) {
    c.x += vitesseCouteau;

}


// fonction similaire à deplacecouteau. determine la distance parcourue par les mechants.
function mouvementMechant() {

if (game){
    mechants.forEach(d=>{        
         
            d.x += -0.5;
        
        //on test si un mechant à touché la zone du joueur
        plageMechant(d);


        //on appelle la fonction qui supprime des objets du tableau en fonction d'une condition. La condition est determinée par la fonction distance.
        if (suppressionDansTableau(couteaux , couteau => 
            suppressionDansTableau(mechants, mechant => distance(couteau, mechant) < (sizeCouteau*0.75)))){  
            // test de collision 
        
       
            update_DOM();

            //on augmente le score pour chaque ennemie eliminé
            score += 10;

        
        
        // console.log("touche")
        } 

        if (suppressionDansTableau(lasers , laser => 
            suppressionDansTableau(mechants, mechant => distance(laser, mechant) < 20))){  
            // test de collision 
        
       


            update_DOM();

            //on augmente le score pour chaque ennemie eliminé
            score += 10;

        
        
        // console.log("touche")
        } 

        if (suppressionDansTableau(lasers , laser => 
            suppressionDansTableau(boules, boule => distance(laser, boule) < 20))){  
            // test de collision 
        
       


            update_DOM();

            //on augmente le score pour chaque ennemie eliminé
            

        
        
        // console.log("touche")
        } 

        if (suppressionDansTableauType(bonus , bonu => distance(bonu, joueur ) < 30) ) {

            update_DOM();
            // console.log("BONUUUUUS")
            // console.log(`${typeActif}`)

            utiliseBonus(typeActif);
            

    } else {
    //On met à jours les coordonnées
    updateTransforms();
    // console.log("pas touche")

}
        
        if (suppressionDansTableau(boules , boule => distance(boule, joueur ) < 12)) {

                update_DOM();
                console.log("Ouch !")
                vies --;

                if (vies == 0){
                    gameOver();
                }

        } else {
        //On met à jours les coordonnées
        updateTransforms();
        // console.log("pas touche")

}
        
    })
}    
    
}


// on supprime un objet du tableau s'il ne repond pas au critere.
function suppressionDansTableau(tableau, critere) {
    let suppression=false;
    for (let i=tableau.length-1; i>=0; i-- ) {
        if (critere(tableau[i])) {
            tableau.splice(i,1);
            suppression=true;
        }
    }
    return suppression;
}

function suppressionDansTableauType(tableau, critere) {
    let suppression=false;
    for (let i=tableau.length-1; i>=0; i-- ) {
        if (critere(tableau[i])) {
            typeActif = tableau[i].type;
            tableau.splice(i,1);
            suppression= true;
            
        }
    }
    return suppression;

}


//test de collision entre les ennemies et la zone du joueur 
function plageMechant(c){
    // if (suppressionDansTableau(mechants, mechant => distance(mechant, 25) <= 25)){
    //     console.log("pouet")
    // }
    if (c.x <= 25){


        vies --;
        svg.append("image")
            .attr("href","img/mechant.png")
            .attr("x",c.x)
            .attr("y",c.y)
            .attr("width", "20")
            .attr("height", "20");
        
        // c.stop = true;
        mechants.splice(c.id,1);

        if (vies == 0){
            gameOver();
        }
        
    }
}

function distance(a, b) {
    let dx=a.x-b.x;
    let dy=a.y-b.y;
    return Math.sqrt(dx*dx+dy*dy);

}

function gameOver(){
    let GOcontent = document.querySelector(".gOcache").innerHTML;

    update_DOM();
    pause();
    d3.select(".modalePause").html("")
    .append("h1")
    .html("Game Over")

    d3.select(".modalePause").append("div").attr("class","gO").html(GOcontent)

    d3.select(".yourscore").html(`Your score: ${score}`)

    // document.location.reload();

    d3.select(".boutonRejouer").on("click", function () {
        document.location.reload();
    })
    
    

    
}








function spawnmechant() {
    ranY = Math.floor((Math.random() * 135) + 5);

    mechants.push({
        x: 210,
        y: ranY,
        stop: false,
        lanceBoule:0 ,
        compteBoules:0
    })
    update_DOM();

}

//suppression des images qui n'ont pas de correspondance dans le tableau


function utiliseBonus(t){
    
    if ((t ==0) || ( t == 5)){
        vitesseCouteau = vitesseCouteau * 1.12
        d3.select(".training").html("Last bonus: <br> knives speed <span>++</span>");
    }else if ((t ==1) || ( t == 6)){
        valeurSpawnCouteau = valeurSpawnCouteau * 0.92;
        clearInterval(intervalSpawnCouteau);
        intervalSpawnCouteau = setInterval(spawnCouteaux, valeurSpawnCouteau);
        d3.select(".training").html("Last bonus: <br> knives spawn rate <span>++</span>");
    } else if ((t ==2) || ( t == 7)) {
        sizeCouteau = sizeCouteau * 1.08;
        update_DOM();
        d3.select(".training").html("Last bonus: <br> knives size <span>++</span>");
    } else if ((t ==3) || ( t == 8)){
        d3.select(".training").html("Last bonus: <br> Laser cooldown --");
        if (cooldownLaser > 2001){
            cooldownLaser = cooldownLaser - 2000;
            if ((cooldownLaserRestant - 2000) > 0){
                cooldownLaserRestant -= 2000;
            } else {
                cooldownLaserRestant = 0;
            }
        } else {

            console.log("Laser cooldown fully upgraded ;)")
        }
        
        
    } else if (t == 4){
        d3.select(".training").html("Last bonus: <br> Laser duration <span>++</span>");
        decompteLaser += 1000
    } else if (t == 9){
        d3.select(".training").html("Last bonus: <br> Life <span>++</span>");
        vies ++;
    }
}





//interval de déplacement de couteaux. suppression des couteaux sortis de l'écran
function InterCouteau() {
    if (game){

    
    couteaux.forEach(deplacecouteau);


    couteaux = couteaux.filter(d => (d.x < 180));

    update_DOM();
    }
};



function spawnBoule(){


    if (game){
    mechants.forEach(d=>{      
        
        if (d.x > 125){

        
         
        d.lanceBoule = Math.random();

        if ((d.lanceBoule >= 0.7) && (d.compteBoules < 2)){
            boules.push({
                x: d.x,
                y: d.y,
            })
            d.compteBoules ++;
        }  
    }

    });

    }
    
}



setInterval(() => {
    if (game){
        boules.forEach(d=>{
        d.x += -3
    })
    }
    
}, 15);


setInterval(() => {
    if (game){
         bonus.forEach(d=>{
        d.x += -(1 + d.speed);
    })
    }
   
}, 30);


//interval de création de nouveau projectil
function spawnCouteaux(){
    if (game){
    couteaux.push({
       
        id: compteur,
        x: 12.5,
        y: sourisY,
        size: sizeCouteau,        
    })


    // console.log(couteaux)

    compteur++

    update_DOM();
}
}

update_DOM();

//interval de déplacement des annemies. Toutes les 5ms on augmente la valeur x de tous les objets du tableau Mechants
setInterval(mouvementMechant, 5);



function spawnBonus(){
    typeBonus = Math.floor(Math.random() * 10);
    bonus.push({type: typeBonus,x:210,y:(Math.floor((Math.random() * 135) + 5)),speed: Math.floor(Math.random() * 3)});
}





function compteurRounds(){

    if (game){

    
    if (tempDecompteRounds > 200){
        tempDecompteRounds -= 100;
    } else {
        tempDecompteRounds = decompteRounds;
    }

    // console.log(tempDecompteRounds)

}
    
    
}

function verifChangeRounds(){

    if (round == 0){
        if (score >= palierScore){
            palierScore = 70;
            changeRounds();
        }
        
    } else if (round == 1) {
        if (score >= palierScore){
            palierScore = 130;
            changeRounds();
        }

    } else if (round == 2) {
        if (score >= palierScore){
            palierScore = 200;
            changeRounds();
        }

    }else if ( round < 5){
        if (score >= palierScore){
            palierScore += 220 ;
            changeRounds();
        }
        
    } else {
        if (score >= palierScore){
            palierScore += 400;
            changeRounds();
        }

    }
    
}


// Toutes les 10s. L'interval pour faire apparaitre un ennemie est diminué.
function changeRounds() {

    if(game){

        if (round == 0){
            valeurSpawn = valeurSpawn - 1000
        } else if ( (round > 0) && (round < 6)) {
            valeurSpawn = valeurSpawn * 0.85
        } else if ( (round > 6) && (round < 9)) {
            valeurSpawn = valeurSpawn * 0.9
        }else if (round > 9) {
            valeurSpawn = valeurSpawn * 0.98
        }

        
        timeBoule = timeBoule * 0.7;
        // console.log(`round ${round}`);
        // alert(`round ${round}`)
        clearInterval(intervalSpawn);
        intervalSpawn = setInterval(spawnmechant, valeurSpawn);
        clearInterval(intervalBoules);
        intervalBoules = setInterval(spawnBoule, timeBoule);

        round++

        DessineRound();

        spawnBonus();
        

        setTimeout(function() {
            d3.select(".roundinfo").transition().duration(500).style("opacity","0");
            setTimeout(() => {
                d3.select(".roundinfo").remove();
            }, 500);
        }, 750)
    
    }

};



