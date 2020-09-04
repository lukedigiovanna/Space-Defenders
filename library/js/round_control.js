//Written by Luke DiGiovanna
//Controls the rounds and summoning enemies.
setInterval(function() {//for countdown of automatic round change
  if (totalRoundEnemies >= roundEnemies && !pause) {
    nextRoundTimer--;
  }
},1000);

function summon() { //method for summoning enemies
    y=x=0; 
    fleetSize = 1; 
    fleetSize = Math.ceil(Math.random()*possibleFleetSize);

    while (fleetSize+summonedRoundEnemies > roundEnemies) {
      fleetSize--;
    }
    elementEnemy = Math.floor(Math.random()*possibleEnemies.length);
    if (possibleEnemies[elementEnemy] == "arrowhead" && round < 10 || possibleEnemies[elementEnemy] == "fighter" && round < 10) fleetSize = 1
    if (possibleEnemies[elementEnemy] == "sucker" && round < 15) fleetSize = 1;
    if (summonedRoundEnemies < roundEnemies && screen == "game" && pause == false && freeze == false) {
      for (i = fleetSize; i >= 1; i--) {
        x = Math.ceil(Math.random() * canv.width);
        for (j = 0; j < enemies.length; j++) {
          while (y <= enemies[j].y+enemies[j].size*2 && y >= enemies[j].y-enemies[j].size*2 && x <= enemies[j].x+enemies[j].size*3 && x >= enemies[j].x-enemies[j].size*3) {
            x++;
          }
        }
        if (x > 725) {
          x = Math.ceil(Math.random() * canv.width);
        }
        switch (possibleEnemies[elementEnemy]) {
          case "hawker":
            enemies.push({type:"hawker",x:x,y:y,size:25, xv:0, yv:1, score:100,value:1,health:100,healthPercent:1,maxHealth:100, damage:20, age: 0, image:hawkerImage,frozenImage:frozenHawkerImage,slowed: false});
            break;
          case "minijet":
            enemies.push({type:"minijet",x:x,y:y,size:15, xv:0, yv:1.4, score:150,value:2,health:75,healthPercent:1,maxHealth:75, damage:15, age:0, image:minijetImage,frozenImage:frozenMinijetImage,slowed: false});
            break;
          case "arrowhead":
            enemies.push({type:"arrowhead",x:x,y:y,size:25, xv:0, yv:1.35, score:200,value:5,health:150,healthPercent:1,maxHealth:150, damage:25, age:0, image:arrowheadImage,frozenImage:frozenArrowheadImage,slowed: false});
            break;
          case "fighter":
            stopOffset = Math.ceil(Math.random()*60)-30; 
            enemies.push({type:"fighter",x:x,y:y,size:20,xv:0,yv:1,score:400,value:10,health:250,healthPercent:1,maxHealth:250, damage:3, age:0, shootSpeed: 0, stopOffset: stopOffset,image:fighterImage,frozenImage:frozenFighterImage,slowed: false});
            break;
          case "aimless":
            width = Math.ceil(Math.random()*30)+30;
            enemies.push({type:"aimless",x:x,y:y,age:0,size:15,xv:0.75,yv:1.35,score:500,value:10,health:100,healthPercent:1,maxHealth:100,damage:10,age:0,width:width,initialX: x, image:aimlessImage, frozenImage:frozenAimlessImage,slowed: false});
            break;
          case "splitter":
            enemies.push({type:"splitter",x:x,y:y,size:40, xv:0, yv:0.75, score:800,value:25,health:400,healthPercent:1,maxHealth:400,damage:40,age:0,image:splitterImage, frozenImage:frozenSplitterImage,slowed: false});
            summonedRoundEnemies+=2;
            break;
          case "super_hawker":
            enemies.push({type:"super_hawker",x:x,y:y,size:30, xv:0,yv:1,score:950,value:40,health:900,healthPercent:1,maxHealth:900,damage:60,age:0,image:superHawkerImage,frozenImage:frozenHawkerImage});
            break;
          case "teleporter":
            enemies.push({type:"teleporter",x:x,y:y,size:25, xv:0, yv:1, score:500,value:35,health:600,healthPercent:1,maxHealth:600, damage:30, age:0,targetX:x,image:teleporterImage,frozenImage:frozenTeleporterImage,slowed: false});
            break;
          case "steel":
            enemies.push({type:"steel",x:x,y:y,size:60, xv:0, yv:0.6, score:1250,value:60,health:3000,healthPercent:1,maxHealth:3000, damage:150, age: 0, image:steelImage,frozenImage:frozenSteelImage,slowed:false});
            break;
          case "sucker":
            enemies.push({type:"sucker",x:x,y:y,size:25, xv:0, yv:1, score:400,value:15,health:500,healthPercent:1,maxHealth:500, damage:0.5, age: 0, image:suckerImage,frozenImage:frozenSuckerImage,slowed: false, stop:Math.random()*100+400,tubeLeng:0,suckLeng:0});
            break;
          case "bug":
            enemies.push({type:"bug",x:x,y:y,size:15,xv:1,yv:1,score:150,value:3,health:60,healthPercent:1,maxHealth:60, damage:10, age: 0, image:[blueBug,greenBug,yellowBug][Math.floor(Math.random()*3)],frozenImage:frozenBug,slowed: false});
            break;
          case "survivors":
            enemies.push({type:"survivors",x:x,y:y,size:30,xv:0,yv:0.9,score:-100,value:-5,health:10,healthPercent:1,maxHealth:10,damage:-10,age:0,image:survivorsImage,frozenImage:survivorsImage});
            break;
          case "bomb":
            enemies.push({type:"bomb",x:y,y:x-140,size:20,xv:0.8,yv:0,score:-250,value:-25,health:10,healthPercent:1,maxHealth:10,damage:25,age:0,image:bombImage,frozenImage:bombImage});
            break;
        }

        //bosses
        if (boss == "babymother" && !bossSummoned) {
          bossSummoned = true;
          bosses.push({type:"babymother",stage:1,x:canv.width/2,y:-150,xv:0,yv:0.4,width:300,height:300,health:2500,maxHealth:2500,healthPercent:1,damage:5,stop:250,shootSpeed:200,shootWait:0,bulletPower:1,img:babymotherImage,leftJetHealth:675,rightJetHealth:675});
        }

        summonedRoundEnemies++;
      }
    }
    setTimeout(function(){summon()},summonWait);
}

function roundControl() {
  switch (round) {
    case "development": //case for testing stuff
      money = 999999;
      roundMoney = 9999;
      possibleFleetSize = 1;
      roundEnemies = 609;
      possibleEnemies = ["sucker"];
      //possibleEnemies =["hawker", "minijet", "arrowhead", "fighter", "aimless", "splitter", "super_hawker", "teleporter", "steel"];
      summonWait = 3000;
      roundEnemies = 100;
      shootSpeed = 25;
      break;
    case 1:
      roundMoney = 10;
      possibleFleetSize = 1;
      possibleEnemies = ["hawker"];
      // possibleEnemies = ["survivors"];
      summonWait = Math.ceil(Math.random()*2000)+4000;
      roundEnemies = 5;
      break;
    case 2:
      roundMoney = 20;
      summonWait = Math.ceil(Math.random()*2500)+3000;
      possibleFleetSize = 1;
      possibleEnemies = ["hawker", "hawker", "minijet"];//in order to make it less likely to get newer enemies, add more of the enemies you want
      break;
    case 3:
      roundMoney = 30;
      summonWait = Math.ceil(Math.random()*3000)+2000;
      possibleEnemies = ["hawker", "minijet"];
      roundEnemies = 6;
      break;
    case 4:
      roundMoney = 40;
      summonWait = Math.ceil(Math.random()*3000)+2000;
      possibleFleetSize = 2;
      possibleEnemies = ["bug"];
      roundEnemies = 8;
      break;
    case 5:
      roundMoney = 50;
      summonWait = Math.ceil(Math.random()*2500)+2500;
      possibleFleetSize = 2;
      possibleEnemies = ["hawker", "hawker", "minijet", "arrowhead"];
      roundEnemies = 12;
      break;
    case 6:
      roundMoney = 75;
      summonWait = Math.ceil(Math.random()*2000)+2500;
      possibleEnemies = ["hawker", "minijet", "arrowhead", "minijet"];
      break;
    case 7:
      roundMoney = 150;
      summonWait = Math.ceil(Math.random()*1500)+2500;
      possibleEnemies = ["hawker", "minijet", "arrowhead", "arrowhead"];
      roundEnemies = 15;
      break;
    case 8:
      roundMoney = 200;
      summonWait = Math.ceil(Math.random()*2000)+2000;
      possibleFleetSize = 2;
      possibleEnemies = ["hawker", "minijet", "arrowhead", "fighter", "minijet", "hawker"]; //fighters stop and shoot
      break;
    case 9:
      roundMoney = 400;
      summonWait = Math.ceil(Math.random()*2000)+2000;
      possibleEnemies = ["minijet", "arrowhead", "hawker", "fighter", "hawker","minijet"];
      break;
    case 10:
      roundMoney = 450;
      summonWait = Math.ceil(Math.random()*2000)+1500;
      possibleEnemies =["arrowhead", "fighter","bug"];
      roundEnemies = 20;
      break;
    case 11:
      roundMoney = 500;
      summonWait = Math.ceil(Math.random()*1000)+2000;
      possibleEnemies = ["bug","sucker","bomb","sucker"];
      roundEnemies = 20;
      break;
    case 12:
      possibleFleetSize = 3;
      roundMoney = 550;
      summonWait =Math.ceil(Math.random()*1500)+2000;
      possibleEnemies = ["fighter", "aimless", "arrowhead", "minijet", "arrowhead"];
      roundEnemies = 25;
      break;
    case 13:
      roundMoney = 600;
      summonWait = Math.ceil(Math.random()*1000)+1000;
      possibleEnemies = ["aimless","minijet","sucker","survivors"];
      break;
    case 14:
      roundMoney = 650;
      summonWait = Math.ceil(Math.random()*2000)+1500;
      possibleEnemies = ["fighter", "aimless", "arrowhead", "splitter","bomb","survivors"];
      break;
    case 15:
      roundMoney = 750;
      summonWait = Math.ceil(Math.random()*2000)+1500;
      possibleEnemies = ["fighter"]
      possibleFleetSize = 3;
      break;
    case 16:
      roundMoney = 775;
      summonWait = Math.ceil(Math.random()*1000)+1000;
      possibleEnemies = ["aimless", "fighter","sucker","bomb"];
      roundEnemies = 40;
      break;
    case 17:
      roundMoney = 850;
      possibleFleetSize = 5;
      summonWait = Math.ceil(Math.random()*500)+500;
      possibleEnemies = ["hawker", "aimless", "minijet","bug"];
      roundEnemies = 75;
      break;
    case 18:
      roundMoney = 900;
      possibleFleetSize = 3;
      roundEnemies = 90;
      summonWait = Math.ceil(Math.random()*1500)+1500;
      possibleEnemies = ["splitter"];
      break; 
    case 19:
      roundMoney = 1000;
      possibleFleetSize = 4;
      roundEnemies = 100;
      summonWait = Math.ceil(Math.random()*2000)+500;
      possibleEnemies = ["hawker","super_hawker"];
      break;
    case 20:
      roundMoney = 1200;
      roundEnemies = 1;//609 means boss
      possibleFleetSize = 1;
      possibleEnemies = [];
      boss = "babymother";
      break;
    case 21:
      roundMoney = 1400;
      roundEnemies = 200;
      possibleFleetSize = 4;
      summonWait = Math.ceil(Math.random()*1500)+1500;
      possibleEnemies = ["teleporter", "super_hawker", "fighter"];
      break;
    case 50:
      roundMoney = 30000;
      possibleFleetSize = 1;
      roundEnemies = 250;
      summonWait = 1000;
      possibleEnemies = ["hawker", "aimless", "minijet", "arrowhead", "fighter", "splitter","super_hawker"];
      break;
    case 51:
      roundEnemies = 100;
      summonWait = 1000;
      possibleFleetSize = 1;
      possibleEnemies = ["steel"];
  }
}