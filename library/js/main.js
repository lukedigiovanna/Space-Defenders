//Written by Luke DiGiovanna
//controls the every screen and what they display. Also controls the functions of the game.
periods = "";//for loading screen "Loading..."
periodTimer = 0;//timer to control periods and length of loading screen
tipNumber = 0;
imagesElement = 0;

characterFade = 0;

img1=img2=img3=null;

function update() {
  if (!musicMute) music.play();
  else music.pause();
  //data saving stuff
  if (localStorage.maxRound) { //tests if max round has been made.
    if (round > localStorage.maxRound) {
      localStorage.maxRound = round;
    }
  } else localStorage.maxRound = 0;
  
  if (localStorage.maxScore) { //tests if max round has been made.
    if (score > localStorage.maxScore) {
      localStorage.maxScore = score;
    }
  } else localStorage.maxScore = 0;

  if (!localStorage.totalRounds) localStorage.totalRounds = 0;
  if (!localStorage.totalKilledEnemies) localStorage.totalKilledEnemies = 0;
  
  if (!localStorage.soundMute) localStorage.soundMute = 1;
  if (localStorage.soundMute == 0) soundMute = true;
  else soundMute = false;
  if (!localStorage.musicMute) localStorage.musicMute = 1;
  if (localStorage.musicMute == 0) musicMute = true;
  else musicMute = false;

  if (!localStorage.unlockedWizard) localStorage.unlockedWizard = 0;
  if (!localStorage.unlockedHealer) localStorage.unlockedHealer = 0;
  if (!localStorage.unlockedGod) localStorage.unlockedGod = 0;
  if (localStorage.unlockedWizard == 0) characters[1].unlocked = true;
  else characters[1].unlocked = true;
  if (localStorage.unlockedHealer == 0) characters[2].unlocked = true;
  else characters[2].unlocked = true;

  ctx.textBaseline="alphabetic";
  //main screen functions
  if (screen == "main") {
    if (buttonPosition > buttons.length-1) {
      buttonPosition = 0;
    } else if (buttonPosition < 0) {
      buttonPosition = buttons.length-1;
    }
    for (i = 0; i < buttons.length; i++) {
      buttons[i].borderColor = "white";
    }
    buttons[buttonPosition].borderColor = "black";
    if (selectionMade == true) {
      screen = buttons[buttonPosition].function;
      selectionMade = false;
    }
    //drawing graphics
    ctx.fillStyle="blue";
    ctx.fillRect(0,0,canv.width,canv.height);
    titleGradient = ctx.createLinearGradient(0,30,0,120);
    titleGradient.addColorStop(0,"black");
    titleGradient.addColorStop(1,"lime");
    ctx.fillStyle=titleGradient;
    ctx.shadowBlur=20;
    ctx.shadowColor="black";
    ctx.textAlign="center";
    ctx.font="bold 46px arcade";//66px future
    ctx.fillText("SPACE DEFENDERS", canv.width/2, 100);
    ctx.shadowBlur=0;

    for (i = 0; i < buttons.length; i++) {
      ctx.fillStyle="lightblue";
      ctx.fillRect(buttons[i].x-112,buttons[i].y,225,42);
      ctx.font="30px Impact";
      ctx.fillStyle="green";
      ctx.fillText(buttons[i].text,buttons[i].x,buttons[i].y+34);
      ctx.strokeStyle=buttons[i].borderColor;
      ctx.lineWidth="3";
      ctx.strokeRect(buttons[i].x-112,buttons[i].y,225,42);
    }
    mainTimer++;
    if (mainTimer == 1) {
      img1 = images[Math.floor(Math.random()*images.length)];
      img2 = images[Math.floor(Math.random()*images.length)];
      img3 = images[Math.floor(Math.random()*images.length)];
    }
    //drawing enemy graphics
    ctx.drawImage(img1,50,250,50,50);
    ctx.drawImage(img2,170,375,50,50);
    ctx.drawImage(img3,75,480,50,50);
    //drawing player graphic
    ctx.fillStyle="black";
    ctx.beginPath();
    ctx.moveTo(600,400);
    ctx.lineTo(550,550);
    ctx.lineTo(650,550);
    ctx.fill();
    ctx.fillStyle="red";
    ctx.fillRect(595,300,10,30);
    ctx.fillRect(595,200,10,30);
  }
  //character select stuff
  else if (screen == "character") {
    ctx.fillStyle="rgb(28, 122, 98)";
    ctx.fillRect(0,0,canv.width,canv.height);
    ctx.fillStyle="black";
    ctx.textAlign="center";
    ctx.font="42px arcade";
    ctx.fillText("CHARACTER SELECT",canv.width/2,100);
    ctx.font="120px Arial";
    ctx.textBaseline="middle";
    if (characterSelect >= characters.length) characterSelect = 0;
    else if (characterSelect < 0) characterSelect = characters.length-1;
    for (i = 0; i < characters.length; i++) {
      nextCharacter = characterSelect+i;
      if (nextCharacter >= characters.length) nextCharacter = nextCharacter - characters.length;
      x=y=0;
      switch (i) {
        case 0:
          x = canv.width/2;
          y = 550;
          break;
        case 1: 
          x = canv.width/2+220;
          y = 400;
          break;
        case 2:
          x = canv.width/2+110;
          y = 200;
          break;
        case 3:
          x = canv.width/2-110;
          y = 200;
          break;
        case 4:
          x = canv.width/2-220;
          y = 400;
      } 
      if (characters[nextCharacter].y > y+7 || characters[nextCharacter].y < y-7) characters[nextCharacter].y-=track(characters[nextCharacter].x,characters[nextCharacter].y,x,y,9).yv;
      if (characters[nextCharacter].x < x-7 || characters[nextCharacter].x > x+7)characters[nextCharacter].x-=track(characters[nextCharacter].x,characters[nextCharacter].y,x,y,12).xv;
      if (characters[nextCharacter].unlocked) {
        ctx.fillStyle=characters[nextCharacter].color;
        ctx.fillText(characters[nextCharacter].display,characters[nextCharacter].x,characters[nextCharacter].y);
      } else {
        ctx.fillStyle="gray";
        ctx.fillText("?",characters[nextCharacter].x,characters[nextCharacter].y);
      }
    }
    ctx.font="40px chunk";
    ctx.textBaseline="alphabetic";
    ctx.fillStyle="black";
    if (characters[characterSelect].unlocked) ctx.fillText(characters[characterSelect].name,canv.width/2,700);
    else ctx.fillText("🔒LOCKED🔒", canv.width/2,700);
    ctx.fillStyle="black";
    ctx.font="18px chunk";
    ctx.textAlign="left";
    if (characters[characterSelect].unlocked) drawText(characters[characterSelect].info,630,280,120,18);
    else drawText("🔒LOCKED🔒",630,280,120,18);
    if (startCharacterFade) characterFade+=0.01;
    ctx.fillStyle="rgba(0,0,0,"+characterFade+")";
    ctx.fillRect(0,0,canv.width,canv.height);
    if (characterFade >= 1) {
      screen = "loading";
      characterFade = 0;
      startCharacterFade = false;
    }
  }
  //loading screen stuffffff
  else if (screen == "loading") {
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);
    ctx.fillStyle="white";
    ctx.font="36px Impact";
    ctx.textAlign="center";
    periodTimer++;
    if (periodTimer % 20 == 0) periods+=".";
    if (periods.length > 3) periods = "";
    ctx.fillText("Loading"+periods,canv.width/2,250);
    ctx.beginPath();
    ctx.lineWidth="7";
    ctx.arc(canv.width/2,canv.height/2,40,0,(periodTimer/250)*2*Math.PI);
    ctx.stroke();
    if (periodTimer == 1) imagesElement = Math.floor(Math.random()*images.length); 
    ctx.drawImage(images[imagesElement],canv.width/2-20,canv.height/2-20,40,40);
    if (periodTimer == 1) tipNumber = Math.floor(Math.random()*tips.length);
    ctx.font="23px chunk";
    drawText(tips[tipNumber],canv.width/2,650,canv.width);
    if (periodTimer > 250) {
      periodTimer = 0;
      periods = ""
      screen = "game";
    }
  }
  //HOW TO PLAY stuff
  else if (screen == "howToPlay") {
    ctx.fillStyle="rgb(50,50,50)";
    ctx.fillRect(0,0,canv.width,canv.height);
    ctx.fillStyle="white";
    ctx.textAlign="center";
    ctx.font="45px future";
    ctx.fillText("HOW TO PLAY", canv.width/2, 100);
    ctx.fillStyle="lightgray";
    ctx.font="23px Arial";
    ctx.textAlign="left";
    drawText("Kill the enemy invaders by moving left and right (a and d) and shooting with the space bar. After each round you may visit the shop where you can buy powerups to help you defeat the enemies. Every round gets more difficult and will introduce harder and cooler enemies.", 60, 180, 630);
    ctx.font="26px Arial";
    ctx.textAlign="center";
    ctx.fillText("Press 'escape' to return to the main screen", canv.width/2, 700);
  }
  //settings stuff
  else if (screen == "settings") {
    ctx.fillStyle="rgb(50,50,50)";
    ctx.fillRect(0,0,canv.width,canv.height);
    ctx.textAlign="center";
    ctx.fillStyle="white";
    ctx.font="36px future";
    ctx.fillText("SETTINGS",canv.width/2,100);
    if (settingPosition < 0) settingPosition = 0;
    else if (settingPosition > settingButtons.length-1) settingPosition = settingButtons.length-1;
    for (i = 0; i < settingButtons.length; i++) {
      ctx.font="33px future";
      ctx.textBaseline="middle";
      ctx.fillStyle="black";
      ctx.fillText(settingButtons[i].text,settingButtons[i].x,settingButtons[i].y);
      ctx.strokeStyle="black";
      if (settingPosition == i) ctx.strokeStyle="white";
      ctx.strokeRect(settingButtons[i].x-125,settingButtons[i].y-23,250,46);
      if (settingButtons[i].enabled) {
        switch (settingButtons[i].function) {
          case "sound":
            if (localStorage.soundMute == 0) { 
              localStorage.soundMute = 1;
              sendMessage("Unmuted Sound");
            }
            else {
              localStorage.soundMute = 0;
              sendMessage("Muted Sound");
            }
            break;
          case "music":
            if (localStorage.musicMute == 0) { 
              localStorage.musicMute = 1;
              sendMessage("Unmuted Music");
            }
            else {
              localStorage.musicMute = 0;
              sendMessage("Muted Music");
            }
            break;
        }
        settingButtons[i].enabled = false;
      }
    }
    ctx.font="26px Arial";
    ctx.fillStyle="lightgray";
    ctx.textAlign="center";
    ctx.fillText("Press 'escape' to return to the main screen", canv.width/2, 700);
  }
  //settings stuff
  else if (screen == "statistics") {
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);
    ctx.fillStyle="lime";
    ctx.textAlign="center";
    ctx.font="45px future";
    ctx.fillText("STATISTICS", canv.width/2, 100);
    ctx.font="23px Impact";
    ctx.fillText("Press 'r' to reset your stats", canv.width/2, 140);

    ctx.textAlign="left";
    ctx.font="26px Cursive";
    ctx.fillText("Highest Round: "+localStorage.maxRound,60,200); 
    ctx.fillText("Highest Score: "+localStorage.maxScore,60,240);
    ctx.fillText("Total Enemies Killed: "+localStorage.totalKilledEnemies,60,280);
    ctx.fillText("Total Rounds Played: "+localStorage.totalRounds,60,320);
    ctx.font="26px Arial";
    ctx.fillStyle="lightgray";
    ctx.textAlign="center";
    ctx.fillText("Press 'escape' to return to the main screen", canv.width/2, 700);
  }
  //update notes stuff
  else if (screen == "updateNotes") {
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);
    ctx.fillStyle="lime";
    ctx.textAlign="center";
    ctx.font="45px Impact";
    ctx.fillText("Update/Patch Notes", canv.width/2, 100);
    ctx.font="23px Impact";
    ctx.fillText("For version "+version, canv.width/2, 140);

    ctx.textAlign="left";
    ctx.fontStyle="white";
    ctx.font="18px Arial";
    //NOTES FOR VERSION 1.3
    ctx.fillText(" * Various bug fixes",50,200);
    ctx.fillText(" * Many, many balance changes to items, shooting, and enemies ",50,223);
    ctx.fillText(" * Implemented the settings tab", 50, 246);
    ctx.fillText(" * Much smoother gameplay",50,269);
    ctx.fillText(" * Added a character select",50,292);
    ctx.fillText(" * Added reusables",50,315);
    ctx.fillText(" * New boss / boss round",50,338);
    ctx.fillText(" * Many new and cooler enemies",50,361);
    ctx.fillText(" * Changed how the double gunner shoots",50,384);
    ctx.fillText(" * Added critical hits to enemies",50,407);
    ctx.fillText(" * Reveal hitboxes by pressing CTRL+SHIFT+H",50,430);
    ctx.fillText(" * Balanced some rounds and added some more",50,453);
    ctx.fillText(" * Visual updates to some screens",50,476);
    ctx.fillText(" * Reveal advanced information by pressing CTRL+SHIFT+X",50,499);
    ctx.fillText(" * More than 20 new items",50,522);
    ctx.fillText(" * Added 'luck' stat",50,545);
    ctx.fillText(" * Changed the minijet skin",50,568);
    //ctx.fillText("* ",50,568);
    ctx.font="26px Arial";
    ctx.fillStyle="lightgray";
    ctx.textAlign="center";
    ctx.fillText("Press 'escape' to return to the main screen", canv.width/2, 700);
  }
  //death screen functions
  else if (screen == "death") {
    ctx.textAlign="center";
    ctx.font="60px Impact";
    ctx.fillStyle="blue";
    ctx.fillText("Your fortress was destroyed!",canv.width/2,140);
    ctx.strokeStyle="lightgray";
    ctx.strokeText("Your fortress was destroyed!",canv.width/2,140);
    //--final statistic results--
    ctx.textAlign="left";
    ctx.font="36px Impact";
    ctx.fillStyle="rgb(123, 126, 132)";
    ctx.strokeStyle="black";
    ctx.fillText("Final Score: "+score,225,275);
    ctx.strokeText("Final Score: "+score,225,275);
    ctx.fillText("Total Enemies Killed: "+tEnemies,225,325);
    ctx.strokeText("Total Enemies Killed: "+tEnemies,225,325);
    ctx.fillText("Final Round: "+round,225,375);
    ctx.strokeText("Final Round: "+round,225,375);
    //information to return to menu
    ctx.fillStyle="black";
    ctx.font="26px Arial";
    ctx.textAlign="center";
    ctx.fillText("Press 'escape' to return to the main menu",canv.width/2,710);
    //drawing player graphic
    ctx.fillStyle="red";
    ctx.beginPath();
    ctx.moveTo(600,350);
    ctx.lineTo(550,500);
    ctx.lineTo(650,500);
    ctx.fill();
    ctx.fillStyle="blue";
    ctx.fillRect(595,275,10,30);
    ctx.fillRect(595,175,10,30);
  }
  //shop screen functions
  else if (screen == "shop") {
    ctx.fillStyle="lightgray";
    ctx.fillRect(0,0,canv.width,canv.height);
    ctx.strokeStyle="blue";
    ctx.fillStyle="rgb(252, 224, 5)";
    ctx.textAlign="center";
    ctx.font="60px Cursive";
    ctx.fillText("SHOP", canv.width/2, 100);
    ctx.lineWidth="2";
    ctx.strokeText("SHOP", canv.width/2, 100);
    ctx.fillStyle="black";
    ctx.font="26px Arial";
    ctx.fillText("Press 'escape' to return to the game", canv.width/2, 700);
    ctx.fillStyle="green";
    ctx.textAlign="left";
    ctx.fillText("Money: $"+money,30,175);
    ctx.fillStyle="blue";
    ctx.textAlign="center";
    ctx.font="22px Arial";
    if (shuffled) {
      ctx.strokeStyle="black";
      ctx.beginPath();
      ctx.moveTo(canv.width/2-150,222);
      ctx.lineTo(canv.width/2+150,222);
      ctx.stroke();
    }
    ctx.fillText("Press 's' to Shuffle Items ($25)",canv.width/2,230);
    ctx.strokeStyle="black";
    ctx.strokeRect(canv.width/2-325,250,200,200);
    ctx.strokeRect(canv.width/2-100,250,200,200);
    ctx.strokeRect(canv.width/2+125,250,200,200);

    if (selection > 2) {
      selection = 2;
    } else if (selection < 0) {
      selection = 0;
    }
    ctx.strokeStyle="blue";
    ctx.lineWidth="4";
    switch(selection) {
      case 0:
        ctx.strokeRect(canv.width/2-325,250,200,200);
        break;
      case 1:
        ctx.strokeRect(canv.width/2-100,250,200,200);
        break;
      case 2:
        ctx.strokeRect(canv.width/2+125,250,200,200);
    }
    levelItems = 0;
    for (i = 0; i < items.length; i++) { //loops through all the items 
      if (items[i].level <= level && !items[i].consumable) {//if at or above level then adds it to the length
        levelItems++;
      }
    }
    shopTimer++; //to make sure this only happens once
    if (shopTimer == 1 || shuffled && shopTimer == 5 || shuffled && shopTimer == 10 || shuffled && shopTimer == 15) {
      if (purchasedItems.length <= levelItems-3) {
          item1 = Math.floor(Math.random()*items.length);
          item2 = Math.floor(Math.random()*items.length);
          item3 = Math.floor(Math.random()*items.length);
          while (item1 == item2 || item2 == item3 || item1 == item3 || items[item1].bought || items[item2].bought || items[item3].bought || item1 == 0 ||item2 == 0 || item3 == 0 || items[item1].level > level || items[item2].level > level || items[item3].level > level || items[item1].consumable || items[item2].consumable || items[item3].consumable) {
            item1 = Math.floor(Math.random()*items.length);
            item2 = Math.floor(Math.random()*items.length);
            item3 = Math.floor(Math.random()*items.length);
          }
      } else if (purchasedItems.length <= levelItems-2) {
          item1 = Math.floor(Math.random()*items.length);
          item2 = Math.floor(Math.random()*items.length);
          while (item1 == item2 || items[item1].bought == true || items[item2].bought == true || item1 == 0 || item2 == 0 || items[item1].level > level || items[item2].level > level || items[item1].consumable || items[item2].consumable) {
            item1 = Math.floor(Math.random()*items.length);
            item2 = Math.floor(Math.random()*items.length);
          }
         item3 = 0;
      } else if (purchasedItems.length <= levelItems-1) {
        item1 = Math.floor(Math.random()*items.length);
        while (items[item1].bought == true || item1 == 0 || items[item1].level > level || items[item1].consumable){
          item1 = Math.floor(Math.random()*items.length);
        }
        item2 = 0;
        item3 = 0;
      } 
    } 
  

    ctx.textAlign="center";
    ctx.fillStyle="black";
    //set name displays
    ctx.fillText(items[item1].displayName, canv.width/2-225, 325, 190);
    ctx.fillText(items[item2].displayName, canv.width/2, 325, 190);
    ctx.fillText(items[item3].displayName, canv.width/2+225, 325, 190);
    //set lores
    ctx.fillStyle="rgb(100,100,100)";
    ctx.font="15px Arial";
    drawText(items[item1].lore, canv.width/2-225,355, 190, 15);
    drawText(items[item2].lore, canv.width/2, 355, 190, 15);
    drawText(items[item3].lore, canv.width/2+225, 355, 190, 15);

    //set prices and price colors
    ctx.font="23px Arial";
    items[item1].priceColor = "green";
    items[item2].priceColor = "green";
    items[item3].priceColor = "green";
    if (items[item1].price > money) {
      items[item1].priceColor="red";
    }
    if (items[item2].price > money) {
      items[item2].priceColor="red";
    }
    if (items[item3].price > money) {
      items[item3].priceColor="red";
    }
    ctx.fillStyle=items[item1].priceColor;
    ctx.textAlign="center";
    ctx.fillText("$"+items[item1].price, canv.width/2-225,400, 190);
    ctx.fillStyle=items[item2].priceColor;
    ctx.fillText("$"+items[item2].price, canv.width/2, 400, 190);
    ctx.fillStyle=items[item3].priceColor;
    ctx.fillText("$"+items[item3].price, canv.width/2+225, 400, 190);

    ctx.font="bold";
    ctx.fillStyle="green";
    ctx.textAlign="center";
    if (items[item1].bought == true) {
      ctx.fillText("$ Bought $", canv.width/2-225,290); 
    }
    if (items[item2].bought == true) {
      ctx.fillText("$ Bought $", canv.width/2,290); 
    }
    if (items[item3].bought == true) {
      ctx.fillText("$ Bought $", canv.width/2+225,290); 
    }

    ctx.fillStyle="red";
    ctx.font="bold 23px Arial";
    ctx.textAlign="left";
    ctx.fillText("Consumables: ",75,525);
    ctx.fillText("Reusables: ",75,600);
    ctx.strokeStyle="black";
    ctx.lineWidth="2";
    ctx.strokeRect(130,532,45,45);
    ctx.strokeRect(185,532,45,45);
    ctx.strokeRect(240,532,45,45);
    ctx.strokeRect(130,607,45,45);
    ctx.strokeRect(185,607,45,45);
    ctx.strokeRect(240,607,45,45);
    for (i = 0; i < consumables.length; i++) {
      ctx.fillStyle=consumables[i].color;
      ctx.font="28px Arial";
      ctx.textAlign="center";
      switch (i) {
        case 0:
          ctx.fillText(consumables[i].display,152.5,566);
          break;
        case 1:
          ctx.fillText(consumables[i].display,207.5,566);
          break;
        case 2:
          ctx.fillText(consumables[i].display,262.5,566);
      }
    }
    for (i = 0; i < reusables.length; i++) {
      ctx.fillStyle=reusables[i].color;
      ctx.font="28px Arial";
      ctx.textAlign="center";
      switch (i) {
        case 0:
          ctx.fillText(reusables[i].symbol,152.5,641);
          break;
        case 1:
          ctx.fillText(reusables[i].symbol,207.5,641);
          break;
        case 2:
          ctx.fillText(reusables[i].symbol,262.5,641);
      } 
    }
  }
  //game screen functions
  else if (screen == "game") {
    if (pause == false) {
      ctx.fillStyle="black";
      ctx.fillRect(0,0,canv.width,canv.height);
      //stars
      for (i = 0; i < stars.length; i++) {
        stars[i].x+=stars[i].xv;
        if (stars[i].x > canv.width) stars[i].x = -300;
        if (stars[i].y < -300) stars[i].y = canv.height;
        ctx.fillStyle=stars[i].color;
        ctx.strokeStyle="white";
        ctx.lineWidth="0.1";
        ctx.beginPath();
        ctx.arc(stars[i].x,stars[i].y,stars[i].size,0,2*Math.PI);
        ctx.fill();
      }
      //redzone
      redzoneColor += redzoneIncrement;
      if (redzoneColor > 230) {
        redzoneIncrement = -1; //pulse down
      } else if (redzoneColor < 150) {
        redzoneIncrement = 1; //pulse up
      }

      ctx.fillStyle="rgb("+redzoneColor+",0,0)";
      ctx.fillRect(0,680,canv.width,70); //redzone drawing

      //player graphic
      ctx.fillStyle="red";
      ctx.beginPath();
      ctx.moveTo(px,py);
      ctx.lineTo(px-pSize/3,py+pSize);
      ctx.lineTo(px+pSize/3,py+pSize);
      ctx.fill();
      hitbox(px-pSize/3,py,(pSize*2)/3,pSize);//x,y,sx,sy

      //player movements
      px-=rv;//increases/decreases based on what value the left and right velocities are set in the function, keyPush and keyNotPush
      px+=lv;
      if (px < 0) { //enables ship to loop from one side to the other
        px = canv.width; //loop from left side
      } else if (px > canv.width) {
        px = 0; //loop from right side
      }

      if (rBreak == true) { //breaks
        rv = 0;
      }  
      if (lBreak == true) {
        lv = 0;
      }

      //guider stuff
      if (guider) {
        ctx.fillStyle="white";
        ctx.fillRect(px-1.5,py-20,3,15);//for guider
        ctx.fillRect(px-1.5,py-60,3,15);
        ctx.fillRect(px-1.5,py-100,3,15);
        ctx.fillRect(px-1.5,py-140,3,15);
        ctx.fillRect(px-1.5,py-180,3,15);
      }
      //stuff for the iron wall
      if (ironWall) {
        ctx.fillStyle="silver";
        ctx.fillRect(0,560,canv.width,30);
        //drawing the wall graphic
        ctx.strokeStyle="black";
        ctx.lineWidth="2";
        y1 = 575;
        y2 = 590;
        for (x = 0; x < canv.width; x+=20) {
          if (y1 == 575) {
            y1 = 560;
            y2 = 575;
          } else {
            y1 = 575;
            y2 = 590;
          }
          ctx.beginPath();
          ctx.moveTo(x,y1);
          ctx.lineTo(x,y2);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(0,575);
        ctx.lineTo(canv.width,575);
        ctx.stroke();
      
        //drawing the health bar
        ironWallHealthPercent = ironWallHealth/ironWallMaxHealth;
        ctx.fillStyle="silver";
        ctx.fillRect(canv.width/2-120,90,ironWallHealthPercent*240,30);
        ctx.strokeStyle="white";
        ctx.lineWidth="2";
        ctx.strokeRect(canv.width/2-120,90,240,30);
        ctx.fillStyle="white";
        ctx.font="13px Arial";
        ctx.textAlign="left";
        ctx.fillText(ironWallHealth,canv.width/2+125,101);
        ctx.fillText(ironWallMaxHealth,canv.width/2+125,120);
        ctx.beginPath();
        ctx.moveTo(canv.width/2+125,105);
        ctx.lineTo(canv.width/2+140,105);
        ctx.stroke();

        if (ironWallHealth <= 0) {
          ironWall = false;
        }
      }

      for (i = 0; i < moneybags.length; i++) {
        destroyThis = false;
        moneybag = moneybags[i];
        moneybag.age-=0.5;
        moneybag.size = moneybag.value/4;
        if (moneybag.size > 125) moneybag.size = 125;
        if (moneybag.size < 25) moneybag.size = 25;
        if (Math.sqrt(moneybag.age)/Math.round(Math.sqrt(moneybag.age)) == 1) 
          break;
        else ctx.drawImage(moneybagImage,moneybag.x-(moneybag.size/2),moneybag.y-(moneybag.size/2),moneybag.size,moneybag.size);
      }
      //boss graphics and behaviors
      for (i = 0; i < bosses.length; i++) {
        boss = bosses[i];
        boss.y+=boss.yv;
        boss.x+=boss.xv;
        ctx.drawImage(boss.img,boss.x-(boss.width/2),boss.y-(boss.height/2),boss.width,boss.height);
        ctx.fillStyle="rgb(25, 91, 196)";
        boss.healthPercent = boss.health/boss.maxHealth;
        ctx.fillRect(canv.width/2-130,700,260*boss.healthPercent,30)
        ctx.strokeStyle="white";
        ctx.lineWidth="3";
        ctx.strokeRect(canv.width/2-130,700,260,30);
        if (boss.type == "babymother") {
          destroyThis = false;
          if (boss.stage == 2) boss.img = babymotherBroke;
          if (boss.y > boss.stop && boss.stage == 1) boss.yv = 0;
          else if (boss.y > boss.stop && boss.stage == 2) boss.yv = 0.05;
          color = "rgb("+Math.round(Math.random()*105+200)+","+Math.round(Math.random()*55+80)+",0)";
          if (boss.leftJetHealth > 0) particles.push({x:boss.x-(boss.width/2)+Math.random()*35+13,y:boss.y-(boss.height/2)+37-(Math.random()*35),size:Math.random()*2+2,color:color,age:0,lifeSpan:Math.random()*60+40});
          if (boss.rightJetHealth > 0) particles.push({x:boss.x+(boss.width/2)-Math.random()*35-13,y:boss.y-(boss.height/2)+37-(Math.random()*35),size:Math.random()*2+2,color:color,age:0,lifeSpan:Math.random()*60+40});
          if (boss.yv < 0.1) {
            for (j = 0; j < stars.length; j++) {
              if (boss.stage == 1) stars[j].y-=5;
              else if (boss.stage == 2) stars[j].y-=13;
            }
          }
          ctx.fillStyle="black";
          ctx.beginPath();
          ctx.arc(boss.x,boss.y,10,0,2*Math.PI);
          ctx.fill();
          boss.shootWait++;
          if (boss.shootWait == boss.shootSpeed/2 && boss.yv < 0.2) {
            bullets.push({x:boss.x-(boss.width/5.5), y: boss.y+(boss.height/2.8), yv: -8, xv: 0, bulletStrength: boss.bulletPower, size: 6, type:"regular", color: "red", homing: false, slow: false, age: 0,owner:"enemy"});
            bullets.push({x:boss.x+(boss.width/5.5), y: boss.y+(boss.height/2.8), yv: -8, xv: 0, bulletStrength: boss.bulletPower, size: 6, type:"regular", color: "red", homing: false, slow: false, age: 0,owner:"enemy"});
            shootSound.play();
          } else if (boss.shootWait >= boss.shootSpeed && boss.yv < 0.2) {
            bullets.push({x:boss.x-(boss.width/2.85),y:boss.y+(boss.height/16),yv:-8,xv:0,bulletStrength:boss.bulletPower,size:6,type:"regular",color:"red",homing:false,slow:false,age:0,owner:"enemy"});
            bullets.push({x:boss.x+(boss.width/2.85),y:boss.y+(boss.height/16),yv:-8,xv:0,bulletStrength:boss.bulletPower,size:6,type:"regular",color:"red",homing:false,slow:false,age:0,owner:"enemy"});
            shootSound.play();
            boss.shootWait = 0;
          }
          if (Math.random() < 0.008 && boss.stage == 1) {
            enemies.push({type:"hawker",x:boss.x+(Math.random()*20-10),y:boss.y+(boss.height/6),size:20, xv:0, yv:1, score:100,value:1,health:150,healthPercent:1,maxHealth:150, damage:20, age: 0, image:hawkerImage,frozenImage:frozenHawkerImage,slowed: false});
            totalRoundEnemies--;
          }  
          for (j = 0; j < bullets.length; j++) {
            bullet = bullets[j];
            if (boss.stage == 1) {
              if (bullet.x+(bullet.size/4) < boss.x+(boss.width/10) && bullet.x-(bullet.size/4) > boss.x-(boss.width/10) && bullet.y+(bullet.size/2) < boss.y+(boss.height/3.5) && bullet.y-(bullet.size/2) > boss.y-(boss.height/14)) {
                boss.health-=bullet.bulletStrength;
                bullets.splice(j,1);
              }
            } else if (boss.stage == 2) {
              if (boss.leftJetHealth > 0) {
                if (bullet.x+(bullet.size/4) < boss.x-(boss.width/2)+(boss.width/5) && bullet.x-(bullet.size/4) > boss.x-(boss.width/2) && bullet.y+(bullet.size/2) < boss.y+(boss.height/2) && bullet.y-(bullet.size/2) > boss.y+((boss.height/2)+(boss.height/5))) {
                  boss.leftJetHealth-=bullet.bulletStrength;
                  boss.health-=bullet.bulletStrength;
                }
              }
              if (boss.rightJetHealth > 0) {
                console.log("Jets!");
              }
            }
          }
          if (boss.health <= boss.maxHealth/2) {
            boss.stage = 2;
            boss.shootSpeed = 150;
          } 
          if (boss.health <= 0) {
            totalRoundEnemies++;
            reward = Math.round(Math.random()*1000)+500;
            sendMessage("Rewarded "+reward+"$ for killing the baby mother ship!");
            money+=reward;
            destroyThis = true;
          }
          if (boss.y+(boss.height/2) > 680) {
            health-=0.1;
          }
          if (boss.stage == 1) hitbox(boss.x-(boss.width/10),boss.y+(boss.height/14),boss.width/5,boss.height/5);
          else {
            hitbox(boss.x-(boss.width/2),boss.y-(boss.height/2),boss.width/5,boss.height/5);
            hitbox(boss.x+(boss.width/2),boss.y-(boss.height/2),-boss.width/5,boss.height/5);
          }
          if (destroyThis) bosses.splice(i,1);
        }
      }
      //enemy graphics and behaviors
      for (i = 0; i < enemies.length; i++) {
        destroyThis = false;
        enemies[i].age++;
        if (enemies[i].x < 0) {
          enemies[i].x = 0;
        } else if (enemies[i].x > canv.width) {
          enemies[i].x = canv.width;
        }
        ctx.fillStyle=enemies[i].color;
        if (freeze) {
          enemies[i].y -= enemies[i].yv;
          enemies[i].x -= enemies[i].xv;
          if (enemies[i].type == "fighter") {
            enemies[i].shootSpeed = -999999999;//makes it take very long before it can shoot again
          }
        } 
        //drawing the enemies
        if (!freeze && enemies[i].type != "splitter" && enemies[i].type != "aimless" && enemies[i].type != "bug")  ctx.drawImage(enemies[i].image,enemies[i].x-enemies[i].size,enemies[i].y-enemies[i].size,enemies[i].size*2,enemies[i].size*2);
        else if (!freeze && enemies[i].type == "aimless") {
          drawRotatedImage(enemies[i].image,enemies[i].x-enemies[i].size,enemies[i].y-enemies[i].size,enemies[i].size*2,enemies[i].size*2,enemies[i].age);
        }
        if (freeze && enemies[i].type != "splitter" && enemies[i].type != "bug") ctx.drawImage(enemies[i].frozenImage,enemies[i].x-enemies[i].size,enemies[i].y-enemies[i].size,enemies[i].size*2,enemies[i].size*2);

        if (!freeze && enemies[i].type == "splitter") ctx.drawImage(enemies[i].image, enemies[i].x-enemies[i].size*1.35,enemies[i].y-enemies[i].size,enemies[i].size*2.7,enemies[i].size*1.5);
        if (enemies[i].type == "bug") {
          if (!freeze) {
            enemies[i].xv = Math.cos(enemies[i].age/20) * 2;
            drawRotatedImage(enemies[i].image,enemies[i].x-enemies[i].size*1.34,enemies[i].y-enemies[i].size,enemies[i].size*2.7,enemies[i].size*1.5,lookAtVelocity(enemies[i].xv,enemies[i].yv));
          }
          else if (freeze) drawRotatedImage(enemies[i].frozenImage,enemies[i].x-enemies[i].size*1.34,enemies[i].y-enemies[i].size,enemies[i].size*2.7,enemies[i].size*1.5,lookAtVelocity(enemies[i].xv,enemies[i].yv)); 
        }
        //health bar
        ctx.fillStyle="rgb(175,0,0)";
        enemies[i].healthPercent = enemies[i].health/enemies[i].maxHealth;
        ctx.fillRect(enemies[i].x-enemies[i].size,enemies[i].y-enemies[i].size-10, enemies[i].size*2*enemies[i].healthPercent, 5);
        ctx.strokeStyle="gray";
        ctx.lineWidth="2";
        ctx.strokeRect(enemies[i].x-enemies[i].size,enemies[i].y-enemies[i].size-10, enemies[i].size*2, 5);
         
        enemies[i].y+=enemies[i].yv;
        enemies[i].x+=enemies[i].xv;

        //stuff for the fighter
        if (enemies[i].type == "fighter") {
          if (enemies[i].y >= 400+enemies[i].stopOffset) {
            enemies[i].y = 400+enemies[i].stopOffset;
            if (enemies[i].shootSpeed > 100) {
              bullets.push({x: enemies[i].x-2, y: enemies[i].y+enemies[i].size-3, yv: -10, xv: 0, bulletStrength: enemies[i].damage, size: 6, type:"regular", color: "red", owner:"enemy"});
              shootSound.play();
              enemies[i].shootSpeed = 0;
            }
          }
          enemies[i].shootSpeed++;
        }
        //stuff for aimless
        if (enemies[i].type == "aimless" && enemies[i].x > enemies[i].initialX+enemies[i].width ||  enemies[i].x < enemies[i].initialX-enemies[i].width) {
          enemies[i].xv *= -1;
        }
        //stuff for teleporter
        if (enemies[i].type == "teleporter") {
          if (Math.random() < 0.25) particles.push({x:enemies[i].x,y:enemies[i].y,color:"magenta",size:4,age:0,lifeSpan:30/*Given in "ticks"*/});
          if (Math.random()<0.008) { 
            enemies[i].targetX = Math.random()*canv.width;
          }  
          if (enemies[i].x < enemies[i].targetX) enemies[i].x += 9;
          if (enemies[i].x > enemies[i].targetX) enemies[i].x -= 9;
        }
        //stuff for sucker
        if (enemies[i].type == "sucker") {
          if (enemies[i].y >= enemies[i].stop) {
            enemies[i].y = enemies[i].stop;
            enemies[i].tubeLeng+=0.5;
            if (enemies[i].y + enemies[i].tubeLeng + enemies[i].size >= 680) {
              enemies[i].tubeLeng = 680 - enemies[i].y - enemies[i].size;
              health-=0.2;
              particles.push({x:Math.random()*(enemies[i].size/2)-enemies[i].size,y:Math.random()*20+660,color:"white",size:5,age:0,lifeSpan:99999});
              if (680-enemies[i].suckLeng > enemies[i].y+enemies[i].size) enemies[i].suckLeng+=0.5;
            }
          }
          ctx.fillStyle="rgb("+redzoneColor+",0,0)";
          ctx.fillRect(enemies[i].x-enemies[i].size/2,680-enemies[i].suckLeng,enemies[i].size,enemies[i].suckLeng);
          ctx.strokeStyle = "white";
          ctx.beginPath();
          ctx.moveTo(enemies[i].x-enemies[i].size/2,enemies[i].y+enemies[i].size);
          ctx.lineTo(enemies[i].x-enemies[i].size/2,enemies[i].y+enemies[i].size+enemies[i].tubeLeng);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(enemies[i].x+enemies[i].size/2,enemies[i].y+enemies[i].size);
          ctx.lineTo(enemies[i].x+enemies[i].size/2,enemies[i].y+enemies[i].size+enemies[i].tubeLeng);
          ctx.stroke();
        }
        //enemy bouncing off walls
        if (enemies[i].x > canv.width || enemies[i].x < 0) {
          enemies[i].xv *= -1;
        } 
        //gets rid of enemeies that run into the redzone
        if (enemies[i].y + enemies[i].size/2 > 680) {
          health-=enemies[i].damage*dmgDeflection;
          totalRoundEnemies++;
          if (enemies[i].type == "splitter") totalRoundEnemies+=2;
          destroyThis = true;
        }
        if (ironWall && enemies[i].y+enemies[i].size/2 > 560) {
          ironWallHealth-=enemies[i].damage/2*dmgDeflection;
          totalRoundEnemies++;
          destroyThis = true;
        }
        //PLAYER COLLISION WITH ENEMY (ONLY IF POINTY SHIPS IS ACTIVE
        if (pointyShip && enemies[i].y + enemies[i].size > py && enemies[i].y-enemies[i].size < py + pSize && px+(pSize/2) > enemies[i].x-enemies[i].size && px-(pSize/2) < enemies[i].x+enemies[i].size) 
          enemies[i].health-=round/4;
        //destroy enemy if less or equal to 0 health
        if (enemies[i].health <= 0) {
          score += enemies[i].score;
          money += enemies[i].value*moneyMultiplier;
          if (enemies[i].type == "bomb") health-=enemies[i].damage;
          if (enemies[i].type == "splitter") {
            enemies.push({type:"split",x:enemies[i].x,y:enemies[i].y,size:27, xv:-0.5, yv:0.85, score:200,value:10,health:150,healthPercent:1,maxHealth:150, damage: 7, color: "brown", image:splitImage, frozenImage:frozenSplitImage});
            enemies.push({type:"split",x:enemies[i].x,y:enemies[i].y,size:27, xv:0.5, yv:0.85, score:200,value:10,health:150,healthPercent:1,maxHealth:150, damage: 7, color: "brown", image:splitImage, frozenImage:frozenSplitImage});
          }
          if (Math.random() < 0.01+(luck/10)/*percent chance*/ && consumables.length < 3) {
            consumableType = Math.floor(Math.random()*possibleConsumables.length); 
            fallingConsumables.push({x:enemies[i].x,y:enemies[i].y,type:possibleConsumables[consumableType].type,display:possibleConsumables[consumableType].display,color:possibleConsumables[consumableType].color,pulse:150,pulseIncrement:5, health: 50,radius:17, xv: 0, yv: 1});//summon the ting
          }
          destroyThis = true;
          totalRoundEnemies++;
          tEnemies++;
          localStorage.totalKilledEnemies++;
        }
        if (showInfo) {
          ctx.fillStyle="red";
          ctx.font="9px Arial";
          ctx.fillText(Math.round(enemies[i].health)+"/"+enemies[i].maxHealth,enemies[i].x+enemies[i].size+5,enemies[i].y-enemies[i].size-4);
          ctx.fillText("Dmg: "+enemies[i].damage,enemies[i].x-enemies[i].size,enemies[i].y-enemies[i].size-16);
        }
        hitbox(enemies[i].x-enemies[i].size/7,enemies[i].y,(enemies[i].size*2)/7,enemies[i].size);
        hitbox(enemies[i].x-enemies[i].size,enemies[i].y-enemies[i].size+5,enemies[i].size*2,enemies[i].size*2);
        if (destroyThis) enemies.splice(i,1);
      }  
      //stuff for lazer
      if (lazer && lazerShooting) {
        ctx.strokeStyle="red";
        ctx.lineWidth="4";
        previousX=previousY=0;
        yChange = 0;
        xChange = 0;
        x=px;
        y=py;
        homingAdd = 0;
        while (y > 0) {
          previousX = x;
          previousY = y;
          yChange = 15;
          xChange = Math.random()*6-3;
          x+=xChange;
          y-=yChange;
          if (x > px+3) {
            x = px+3;
          } else if (x < px-3) {
            x = px-3;
          }
          for (i = 0; i < enemies.length; i++) {
            if (x - 5 < enemies[i].x + enemies[i].size && x + 5 > enemies[i].x-enemies[i].size && y - 3 > enemies[i].y-enemies[i].size && y+3 < enemies[i].y+enemies[i].size) {
              enemies[i].health-=bulletPower/10;
              if (enemies[i].health < 0) {
                enemies[i].health = 0;
              }
            }
          }
          ctx.beginPath();
          ctx.moveTo(previousX,previousY);
          ctx.lineTo(x,y);
          ctx.stroke();
        }
      } 
      //bullets graphics and behaviors
      for (i = 0; i < bullets.length; i++) {
        destroyThis = false;
        if (chocolateMilk && bullets[i].owner == "player") bullets[i].color = "rgb(122, 104, 41)";
        
        if (bullets[i].age == 0 && Math.random() < 0.2+luck && slowShot && bullets[i].type != "fireball" && bullets[i].owner == "player") {
          bullets[i].slow = true;
          bullets[i].color = "gray";
        }

        if (homing == true && bullets[i].owner == "player" && bullets[i].type != "shard") {
          bullets[i].homing = true;
          bullets[i].color = "purple";
        } else if (homing == false) bullets[i].homing = false;

        //all the boomerang movements
        if (boomerang && bullets[i].y < py && bullets[i].owner == "player") bullets[i].yv-=0.1;
        if (boomerang && bullets[i].x > px+3 && bullets[i].owner == "player") bullets[i].xv-=0.05;
        else if (boomerang && bullets[i].x < px-3 && bullets[i].owner == "player") bullets[i].xv+=0.05;

        if (wealthpower) {
          wealthDmg = (Math.sqrt(money)/2)*bulletPowerMultiplier*-1;
        }

        ctx.fillStyle=bullets[i].color;
        bullets[i].y-=bullets[i].yv;
        bullets[i].x+=bullets[i].xv;
        ctx.strokeStyle="red";
        ctx.lineWidth="1";
        if (bloodSoaked && bullets[i].type == "regular" && bullets[i].owner == "player") {
          ctx.save();
          ctx.beginPath();
          ctx.translate(bullets[i].x+bullets[i].size/2,bullets[i].y+bullets[i].size/2/2);
          ctx.rotate(lookAtVelocity(bullets[i].xv,bullets[i].yv) * Math.PI/180 * -1);
          ctx.strokeRect(-bullets[i].size/2,-bullets[i].size,bullets[i].size,bullets[i].size*2);
          ctx.restore();
        }
        else if (bloodSoaked && bullets[i].type != "knife" && bullets[i].owner == "player") {
          ctx.beginPath();
          ctx.arc(bullets[i].x,bullets[i].y,bullets[i].size,0,2*Math.PI);
          ctx.stroke();
        }
        //normal bullets
        if (bullets[i].type == "regular") {
          ctx.save();
          ctx.beginPath();
          ctx.translate(bullets[i].x+bullets[i].size/2,bullets[i].y+bullets[i].size/2/2);
          ctx.rotate(lookAtVelocity(bullets[i].xv,bullets[i].yv) * Math.PI/180 * -1);
          ctx.fillRect(-bullets[i].size/2,-bullets[i].size,bullets[i].size,bullets[i].size*2);
          ctx.restore();
        } 
        //circular bullets
        else if (bullets[i].type == "bomb" || bullets[i].type == "shard" || bullets[i].type == "shotgun" || bullets[i].type == "fireball") {
          ctx.beginPath();
          ctx.arc(bullets[i].x, bullets[i].y, bullets[i].size, 0, 2*Math.PI);
          ctx.fill();
        }
        //knives
        else if (bullets[i].type == "knife") {
          drawRotatedImage(knifeImage,bullets[i].x,bullets[i].y,bullets[i].size*1.5,bullets[i].size*4,lookAtVelocity(bullets[i].xv,bullets[i].yv));
        }

        if (bullets[i].type == "fireball") {
          bullets[i].xv += bullets[i].acceleration;
          if (Math.random() < 0.1) particles.push({x:bullets[i].x+Math.random()*20-10,y:bullets[i].y+bullets[i].size*1.8,color:"rgba(255, 153, 0, 0.75)",size:Math.random()*3+1,age:0,lifeSpan:Math.random()*20+20});
          if (bullets[i].x > bullets[i].originalX) {
            bullets[i].xv = -10;
          }
        }
        closest = 0;
        distance = 0;
        for (j = 0; j < enemies.length; j++) {
          distance = Math.sqrt((enemies[j].x-bullets[i].x)*(enemies[j].x-bullets[i].x)+(enemies[j].y-bullets[i].y)*(enemies[j].y-bullets[i].y));
          closestDistance = Math.sqrt((enemies[closest].x-bullets[i].x)*(enemies[closest].x-bullets[i].x)+(enemies[closest].y-bullets[i].y)*(enemies[closest].y-bullets[i].y));
          if (j != closest && distance < closestDistance) closest = j;
        }
        if (enemies.length > 0) {
          if (bullets[i].homing == true && bullets[i].x > enemies[closest].x-250 && bullets[i].x < enemies[closest].x+250 && bullets[i].y > enemies[closest].y-250 && bullets[i].y < enemies[closest].y+250) {//is bullet a homing and within 250 pixels of the enemy
            bullets[i].xv-=track(bullets[i].x,bullets[i].y,enemies[closest].x,enemies[closest].y,10).xv;
          }
        }
        for (j = 0; j < enemies.length; j++) { //j will be the element of the enemy array
          //BULLET COLLISION WITH ENEMY
          if (bullets[i].y - bullets[i].size < enemies[j].y + enemies[j].size && bullets[i].y + bullets[i].size > enemies[j].y - enemies[j].size && bullets[i].x - bullets[i].size < enemies[j].x + enemies[j].size && bullets[i].x + bullets[i].size > enemies[j].x-enemies[j].size && bullets[i].owner != "enemy") {
            enemies[j].health-=bullets[i].bulletStrength;
            if (bullets[i].owner == "player") enemies[j].health-=wealthDmg;
            if (bullets[i].slow && !enemies[j].slowed) {
              enemies[j].yv*=0.6;
              enemies[j].slowed = true;
            } 
            if (enemies[j].health < 0) enemies[j].health = 0;
            //crit stuff
            if (bullets[i].x-bullets[i].size < enemies[j].x + enemies[j].size/7 && bullets[i].x + bullets[i].size > enemies[j].x - enemies[j].size/7 && Math.random() < critChance) {
              enemies[j].health-=(bullets[i].bulletStrength*critDamage);
              for (k = 0; k < Math.ceil(Math.random()*2)+2; k++) {              
                particles.push({x:enemies[j].x+(Math.random()*enemies[j].size*2)-enemies[j].size,y:enemies[j].y+(Math.random()*enemies[j].size*2)-enemies[j].size,age:0,size:3,lifeSpan:Math.random()*20+20,color:["white","yellow","aqua"][Math.floor(Math.random()*3)]});
              }
            }
            if (bullets[i].type == "knife") enemies[j].health-=bullets[i].bulletStrength;
            if (bullets[i].type == "bomb") {
              for (k = 0; k < 8; k++) {
                bullets.push({x:bullets[i].x,y:bullets[i].y,yv:Math.random()*20-10,xv:Math.random()*20-10,bulletStrength:10,size:4,type:"shard",color:"white"})
              }
            }
            destroyThis = true; //sets to destroy bullet at the end.
            break;//breaks to stop bazookas from summoning too many shards and to only affect one enemy
          }
        }
        bullets[i].age+=0.5;
        if (wiggly && bullets[i].owner == "player" && !bullets[i].side && bullets[i].type != "fireball") {
          bullets[i].xv = (Math.cos(bullets[i].age) * 8);
        }

        if (bullets[i].y < 0 || bullets[i].side && bullets[i].x < 0 || bullets[i].side && bullets[i].x > canv.width) destroyThis = true; //gets rid of bullets that go too far off the map
        if (bullets[i].x < 0 && !bullets[i].side || bullets[i].x > canv.width && !bullets[i].side) bullets[i].xv *= -1;
        if (bullets[i].y > 680 && bullets[i].owner == "enemy") {
          health -= bullets[i].bulletStrength*dmgDeflection;
          destroyThis = true;
        } else if (bullets[i].y > canv.height) destroyThis = true;

        if (ironWall && bullets[i].y > 560 && bullets[i].owner == "enemy") {
          ironWallHealth-=bullets[i].bulletStrength*dmgDeflection;
          destroyThis = true;
        }
        hitbox(bullets[i].x-(bullets[i].size/2),bullets[i].y-bullets[i].size,bullets[i].size,bullets[i].size*2);
        if (destroyThis) {
          bullets.splice(i,1);
        }
      }
      for (i = 0; i < shields.length; i++) {
        shield = shields[i];
        ctx.strokeStyle="white";
        ctx.lineWidth=4;
        shield.x+=shield.xv;
        shield.y+=shield.yv;
        if (shield.x > canv.width || shield.x < 0) shield.xv*=-1;
        if (shield.y > canv.height || shield.y < 0) shield.yv*=-1;
        ctx.beginPath();
        ctx.arc(shield.x,shield.y+shield.width+10,shield.width,1.4*Math.PI,1.6*Math.PI);
        ctx.stroke();
      }
      if (shielding) {
        if (shieldTime > 0) {
          shieldTime--;
          ctx.strokeStyle="white";
          ctx.lineWidth=4;
          ctx.beginPath();
          ctx.arc(px,py+50,60,1.4*Math.PI,1.6*Math.PI);
          ctx.stroke();
        }
      }
      //falling consumable stuff
      for (i = 0; i < fallingConsumables.length; i++) {
        destroyThis = false;
        for (j = 0; j < bullets.length; j++) {
          if (bullets[j].y - bullets[j].size < fallingConsumables[i].y-9 + fallingConsumables[i].radius && bullets[j].y + bullets[j].size > fallingConsumables[i].y - fallingConsumables[i].radius && bullets[j].x - bullets[j].size < fallingConsumables[i].x + fallingConsumables[i].radius && bullets[j].x + bullets[j].size > fallingConsumables[i].x-fallingConsumables[i].radius && bullets[j].owner != "enemy") {
            fallingConsumables[i].health-=25;
            fallingConsumables[i].radius = 17 + (50 - fallingConsumables[i].health)/7; 
            bullets.splice(j,1);
          }
        }
        fallingConsumables[i].y+=fallingConsumables[i].yv;
        fallingConsumables[i].x+=fallingConsumables[i].xv;
        ctx.fillStyle=fallingConsumables[i].color;
        ctx.font="23px Arial";
        ctx.textAlign="center";
        ctx.fillText(fallingConsumables[i].display, fallingConsumables[i].x, fallingConsumables[i].y);
        if (fallingConsumables[i].pulse > 250) {
          fallingConsumables[i].pulseIncrement = -5;
        } else if (fallingConsumables[i].pulse < 100) {
          fallingConsumables[i].pulseIncrement = 5;
        }

        if (fallingConsumables[i].y > 690) {
          destroyThis = true;
        } else if (fallingConsumables[i].y > 680) {
          fallingConsumables[i].radius+=1;
        }  

        if (fallingConsumables[i].health <= 0 && fallingConsumables[i].radius != 0) {
          fallingConsumables[i].radius++;
        }
        if (fallingConsumables[i].radius >= 30) {
          fallingConsumables[i].radius = 0;
        }
        if (fallingConsumables[i].radius == 0 && fallingConsumables[i].health <= 0) {
          //all the maths
          targetX = 0;
          targetY = 290;
          switch (consumables.length) {
            case 0:
              targetX = 23;
              break;
            case 1:
              targetX = 68;
              break;
            case 2:
              targetX = 113;
          }
          xDisp = fallingConsumables[i].x - targetX;
          yDisp = fallingConsumables[i].y - targetY;
          radians = Math.atan(xDisp/yDisp);
          if (radians < 0) {
            radians*=-1;
          }
          netVelocity = 8;
          fallingConsumables[i].yv = Math.cos(radians)*netVelocity;
          if (fallingConsumables[i].y > targetY) {
            fallingConsumables[i].yv *= -1;
          }
          fallingConsumables[i].xv = Math.sin(radians)*netVelocity;
          if (fallingConsumables[i].x > targetX) {
            fallingConsumables[i].xv *= -1;
          }
          if (fallingConsumables[i].x <= targetX + 7 && fallingConsumables[i].y >= targetY - 7 || fallingConsumables[i].x <= targetX - 7 && fallingConsumables[i].y >= targetY + 7) {
            consumables.push({type:fallingConsumables[i].type,display:fallingConsumables[i].display,color:fallingConsumables[i].color});
            destroyThis = true;
          }
        }
      
        fallingConsumables[i].pulse+=fallingConsumables[i].pulseIncrement;
        ctx.strokeStyle="rgb(0,"+fallingConsumables[i].pulse+",0)";
        ctx.lineWidth="3";
        ctx.beginPath();
        ctx.arc(fallingConsumables[i].x,fallingConsumables[i].y-9,fallingConsumables[i].radius,0,2*Math.PI);
        ctx.stroke();
        if (destroyThis) fallingConsumables.splice(i,1);
      }
      //buddy stuff
      for (i = 0; i < buddies.length; i++) { //x:px,y:py,shootSpeed:500,shootWait:0,size:10,type:"buddy_one",color:"blue", shape:"triangle"
        //drawing the buddy
        ctx.fillStyle=buddies[i].color;
        if (buddies[i].shape == "triangle") {
          ctx.beginPath();
          ctx.moveTo(buddies[i].x,buddies[i].y);
          ctx.lineTo(buddies[i].x-buddies[i].size/3,buddies[i].y+buddies[i].size);
          ctx.lineTo(buddies[i].x+buddies[i].size/3,buddies[i].y+buddies[i].size);
          ctx.fill();
        }
        furthest = 0;
        for (j = 0; j < enemies.length; j++) {
          if (enemies[j].y > enemies[furthest].y && enemies[j].y < 500) {
            furthest = j;
          }
        }
        if (enemies.length < 1) furthest = -1;
        if (buddies[i].shape == "sentry") {
          if (furthest > -1) {
            if (enemies[furthest].y > buddies[i].y-(buddies[i].size*2)) {
              if (enemies.length > 1) {
                for (j = 0; j < enemies.length; j++) {
                  if (enemies[j].y > enemies[furthest].y && enemies[j].y < buddies[i].y-(buddies[i].size*2)) {
                    furthest = j;
                  }
                }
              } else {
                furthest = -1
              }
            }
          }
          if (enemies.length > 0 && furthest > -1) buddies[i].sentryAngle = lookAtPosition(buddies[i].x,buddies[i].y,enemies[furthest].x,enemies[furthest].y);
          ctx.drawImage(sentryBodyImage,buddies[i].x-buddies[i].size,buddies[i].y-buddies[i].size,buddies[i].size*2,buddies[i].size);
          drawRotatedImage(sentryBarrelImage,buddies[i].x-(buddies[i].size*0.14),buddies[i].y-(buddies[i].size*1.8),buddies[i].size*0.28,buddies[i].size,buddies[i].sentryAngle,1);
          ctx.restore();
        }
        if (enemies.length > 0 && buddies[i].type == "buddy_one") {
          if (buddies[i].x < enemies[furthest].x) buddies[i].x+=buddies[i].speed;
          if (buddies[i].x > enemies[furthest].x) buddies[i].x-=buddies[i].speed;
        }
        buddies[i].shootWait++;
        if (buddies[i].shootWait >= buddies[i].shootSpeed) {
          buddies[i].shootWait = 0;
          if (enemies.length > 0) {
            if (buddies[i].x > enemies[furthest].x-enemies[furthest].size && buddies[i].x < enemies[furthest].x+enemies[furthest].size && buddies[i].type == "buddy_one") {
              bullets.push({x: buddies[i].x-3, y: buddies[i].y, yv: 10, xv: 0, bulletStrength: 30 * (round/8), size: 6, type:"regular", color: "blue", homing: false, slow: false, age: 0, owner:"buddy"});
              shootSound.play();
            } else if (buddies[i].shape == "sentry" && furthest > -1) {
              bullets.push({x: buddies[i].x-3, y: buddies[i].y-(buddies[i].size), yv: track(buddies[i].x,buddies[i].y-buddies[i].size,enemies[furthest].x,enemies[furthest].y,18).yv, xv: -track(buddies[i].x,buddies[i].y,enemies[furthest].x,enemies[furthest].y,18).xv, bulletStrength: 25 * (round/8), size: 6, type:"regular", color: "blue", homing: false, slow: false, age: 0, owner:"buddy"});
              shootSound.play();
            }
          }
        }
      }
      for (i = 0; i < particles.length; i++) {
        ctx.fillStyle=particles[i].color;
        ctx.beginPath();
        ctx.arc(particles[i].x,particles[i].y,particles[i].size,0,2*Math.PI);
        ctx.fill();
        particles[i].age++;
        if (particles[i].age >= particles[i].lifeSpan) particles.splice(i,1);
      }
      for (i = 0; i < decoys.length; i++) {
        decoys[i].x+=decoys[i].xv;
        decoys[i].y+=decoys[i].yv;
        decoys[i].xv+=decoys[i].xa;
        if (decoys[i].y < decoys[i].yStop) decoys[i].yv = 0;
        if (decoys[i].xv > 3 && decoys[i].y > decoys[i].yStop) {
          decoys[i].xv*=-1;
          decoys[i].xa+=0.1;
        } else if (decoys[i].xv > 3) {
          decoys[i].xv = 0;
          decoys[i].xa = 0;
        }

        for (j = 0; j < enemies.length; j++) {
          if (!decoyChanges[j]) {
            if (enemies[j].x < decoys[i].x) xChange = -1 * ((Math.random()*30)+30);
            else if (enemies[j].x > decoys[i].x) xChange = (Math.random()*30)+30;
            if (enemies[j].y < decoys[i].y) yChange = (Math.random()*10)+30;
            else if (enemies[j].y > decoys[i].y) yChange = -1 * ((Math.random()*10)+30);
            decoyChanges.push({xChange:xChange,yChange:yChange});
          }

          enemies[j].x += track(decoys[i].x+decoyChanges[j].xChange,decoys[i].y+decoyChanges[j].yChange,enemies[j].x,enemies[j].y,2).xv;
          enemies[j].y += track(decoys[i].x+decoyChanges[j].xChange,decoys[i].y+decoyChanges[j].yChange,enemies[j].x,enemies[j].y,2).yv;
        }
        if (Math.random() < 0.1) particles.push({x:decoys[i].x+Math.random()*20-10,y:decoys[i].y+(Math.random()*40)-10,color:"rgba(255, 255, 255, 0.75)",size:Math.random()*3+1,age:0,lifeSpan:Math.random()*20+20});
        if (Math.random() < 0.05) shootSound.play();
        ctx.fillStyle="gray";
        ctx.fillRect(decoys[i].x,decoys[i].y,10,20);
        decoys[i].age++;
        if (decoys[i].age >= decoys[i].lifeSpan) {
          decoyChanges.splice(0,decoyChanges.length); 
          decoys.splice(i,1);
        } 
      }
      //behavior for orbiter
      counter++;
      scale = counter/25;
      for (i = 0; i < orbiters.length; i++) {
        orbiters[i].x = px + Math.sin(scale) * 40;
        orbiters[i].y = py+15 + Math.cos(scale) * 40;
        ctx.fillStyle="aqua";
        ctx.beginPath();
        ctx.arc(orbiters[i].x, orbiters[i].y, orbiters[i].radius, 0, 2*Math.PI);
        ctx.fill();

        for (j = 0; j < enemies.length; j++) {
          if (orbiters[i].x < enemies[j].x+enemies[j].size && orbiters[i].x > enemies[j].x-enemies[j].size && orbiters[i].y < enemies[j].y+enemies[j].size && orbiters[i].y > enemies[j].y-enemies[j].size) {
            enemies[j].health-=10;
          }
        }
      }

      ctx.fillStyle="lime";
      ctx.font="23px Arial";
      ctx.textAlign="left";
      scoreAdd = (score-scoreDisplay)*0.05;
      if (scoreAdd < 2) 
        scoreAdd = 2;
      if (score > scoreDisplay) 
        scoreDisplay+=scoreAdd;      
      else if (score < scoreDisplay) 
        scoreDisplay = score;
      
      scoreDisplay = Math.round(scoreDisplay);
      enemiesLeft = roundEnemies-totalRoundEnemies;
      ctx.fillText("Score: "+scoreDisplay, 10, 30);
      ctx.fillText("Money: $"+money, 10, 60);
      ctx.fillText("Enemies: "+enemiesLeft, 10,90);
      ctx.fillText("Weapon: "+shootMode,10,120);

      //weapon above and weapon below
      ctx.font="15px Arial";
      upWeapon = weaponPosition+1;
      downWeapon = weaponPosition-1;

      if (unlockedWeapons[upWeapon] != undefined) 
        ctx.fillText(unlockedWeapons[upWeapon],95,102);
      if (unlockedWeapons[downWeapon] != undefined) 
        ctx.fillText(unlockedWeapons[downWeapon],95,137);

      if (weaponPosition > unlockedWeapons.length-1) { //to check if your actual weapon position is beyond or below what is allowed and for it to stop.
        weaponPosition = unlockedWeapons.length-1;
      } else if (weaponPosition < 0) {
        weaponPosition = 0;
      }
      shootMode = unlockedWeapons[weaponPosition];

      //consumable display
      ctx.font="23px Arial";
      ctx.fillText("Consumables:",10,250);
      ctx.lineWidth="1.5";
      ctx.strokeStyle="lime";
      ctx.strokeRect(20,270,35,35);
      ctx.strokeRect(65,270,35,35);
      ctx.strokeRect(110,270,35,35);
      ctx.font="10px Arial";
      ctx.fillText("1",23,281);
      ctx.fillText("2",68,281);
      ctx.fillText("3",113,281);
      ctx.font="15px Arial";
      for (i = 0; i < consumables.length; i++) {
        if (i == 0) {
          ctx.fillStyle=consumables[i].color;
          ctx.fillText(consumables[i].display,30.5,295);
        }
        if (i == 1) {
          ctx.fillStyle=consumables[i].color;
          ctx.fillText(consumables[i].display,75.5,295);
        }
        if (i == 2) {
          ctx.fillStyle=consumables[i].color;
          ctx.fillText(consumables[i].display,120.5,295);
        }
      }

      //Item display
      ctx.font="23px Arial";
      ctx.fillStyle="lime";
      ctx.fillText("Reusable Items:",10,350);
      ctx.lineWidth=1.5;
      ctx.strokeStyle="lime";
      ctx.strokeRect(20,370,35,35);
      ctx.strokeRect(65,370,35,35);
      ctx.strokeRect(110,370,35,35);
      ctx.font="10px Arial";
      ctx.fillText("Q",23,381);
      ctx.fillText("W",68,381);
      ctx.fillText("E",113,381);
      for (i = 0; i < reusables.length; i++) {
        ctx.fillStyle=reusables[i].color;
        ctx.font="20px Arial";
        ctx.textAlign="center";
        switch (i) {
          case 0:
            ctx.fillText(reusables[i].symbol,39,397.5);
            break;
          case 1:
            ctx.fillText(reusables[i].symbol,84,397.5);
            break;
          case 2:
            ctx.fillText(reusables[i].symbol,129,397.5);
            break;
        }
        if (reusables[i].timer < reusables[i].maxTimer) {
          switch (i) {
            case 0:
              drawCircularProgress(39,390,12,reusables[i].timer/reusables[i].maxTimer,"rgba(128,128,255,0.8)");
              break;
            case 1:
              drawCircularProgress(84,390,12,reusables[i].timer/reusables[i].maxTimer,"rgba(128,128,255,0.8)");
              break;
            case 2:
              drawCircularProgress(129,390,12,reusables[i].timer/reusables[i].maxTimer,"rgba(128,128,255,0.8)");
              break;
          }
        }
      }

      //-----health bar-----
      if (health > maxHealth) health = maxHealth;
      else if (health < 0) health = 0;
      
      healthAdd = (health-smoothHealth)*0.05;
      if (healthAdd > -0.1 && healthAdd < 0) healthAdd = -0.1;
      smoothHealth+=healthAdd;
      healthPercent = smoothHealth/maxHealth;
      smoothHealthText = Math.round(smoothHealth);
      realHealthPercent = health/maxHealth;
      ctx.fillStyle="yellow";
      ctx.fillRect(canv.width/2-120,40,realHealthPercent*240-1,30)
      ctx.fillStyle="rgb(104, 0, 0)";
      ctx.fillRect(canv.width/2-120,40,healthPercent*240,30);
      ctx.strokeStyle="white";
      ctx.lineWidth="2";
      ctx.strokeRect(canv.width/2-120,40,240,30);
      ctx.fillStyle="white";
      ctx.font="13px Arial";
      ctx.textAlign="center";
      ctx.fillText(smoothHealthText,canv.width/2+125+ctx.measureText(maxHealth).width/2,51);
      ctx.fillText(maxHealth,canv.width/2+125+ctx.measureText(maxHealth).width/2,70);
      ctx.beginPath();
      ctx.moveTo(canv.width/2+125,55);
      ctx.lineTo(canv.width/2+125+ctx.measureText(maxHealth).width,55);
      ctx.stroke();
      if (lives > 1) {
        ctx.fillStyle="red";
        ctx.font="bold 18px Arial";
        ctx.fillText(lives+"x",canv.width/2+150+ctx.measureText(maxHealth).width/2,60);
      }

      //partial round control
      if (raColor > 355) {
        raIncrement = -2;
      } else if (raColor < 1) {
        raIncrement = 2;
      }
      raColor+=raIncrement;
      ctx.fillStyle="rgb("+raColor+",0,0)";
      ctx.font="26px Arial";
      ctx.textAlign="center";
      ctx.fillText("Round "+round, canv.width/2, 150);

      if (round >= 25) level = 6;
      else if (round >= 20) level = 5;
      else if (round >= 15) level = 4;
      else if (round >= 10) level = 3;
      else if (round >= 5) level = 2;
      else if (round >= 0) level = 1;

      if (totalRoundEnemies >= roundEnemies) {
        shopAvailable = true;
        ctx.fillStyle="red";
        ctx.textAlign="center";
        if (nextRoundTimer <= 0) {
          roundCont = true;
        }
        ctx.font="26px Arial";
        ctx.fillText("Do you want to go to the shop? ("+nextRoundTimer+"s)", canv.width/2, 250);
        ctx.fillText("Yes (y) No (n)",canv.width/2,275);
        ctx.fillStyle="lime";
        ctx.font="23px Arial";
        ctx.textAlign="left";
        ctx.fillText("Money: $"+money+" +$"+roundMoney, 10, 60);

        endRoundTimer++;
        if (endRoundTimer == 1) {
          money += roundMoney;
        } 
        if (roundCont == true) {
          round++;
          totalRoundEnemies = 0;
          summonedRoundEnemies = 0;
          nextRoundTimer = 10;
          endRoundTimer = 0;
          roundCont = false;
          shopAvailable = false;
          shuffled = false;
        }
      }
      //for tripple money multiplier
      if (moneyOn == true) {
        ctx.fillStyle="green"
        ctx.font="46px Cursive";
        ctx.textAlign="center";
        ctx.fillText("x3 $",canv.width/2,350);
      }
      //method for resetting the game (when you run out of lives)
      if (smoothHealth < 0.5) {
        lives--;
        if (lives > 0) {
          health = maxHealth/4;
          smoothHealth = 1;
          totalRoundEnemies+=enemies.length;
          enemies.splice(0,enemies.length);
          bibleShake = true;
        }
      }
      if (lives < 1) {
        screen = "death";
        dead = true;
      }
      if (bibleShake) {
        ctx.drawImage(bibleImage,canv.width/2-100,200,200,300);
        
        bibleTimer+=20;
        if (bibleTimer > 2000) {
          bibleTimer = 0;
          bibleShake = false;
        }
      }
      if (shootSpeed < 50) shootSpeed = 50;
      gameTimer++;
    } 
    else if (pause == true) {//ending for pause if statement
      ctx.font="bold 45px Cursive";
      ctx.fillStyle="lime";
      ctx.textAlign="center";
      ctx.fillText("PAUSE GAME", canv.width/2, 150);
      ctx.font="bold 33px Cursive";
      ctx.fillText(":::Current Stats:::", canv.width/2, 200); //total enemies killed, round, regeneration, bullet power, movement speed, shoot speed
      ctx.textAlign="left";
      ctx.font="28px Cursive";
      ctx.fillText("Enemies Killed: "+tEnemies,canv.width/2-200,250,190);
      ctx.fillText("Round: "+round,canv.width/2+15, 250, 190);
      ctx.fillText("Regeneration: "+regeneration,canv.width/2-200, 285, 190);
      ctx.fillText("Bullet Power: "+(Math.round(bulletPower*10))/10, canv.width/2+15, 285, 190);
      ctx.fillText("Movement Speed: "+movementSpeed, canv.width/2-200, 315, 190);
      ctx.fillText("Shoot Speed: "+shootSpeed, canv.width/2+15, 315, 190);
   
      if (pauseSelection > 1) {
        pauseSelection = 0;
      } else if (pauseSelection < 0) {
        pauseSelection = 1;
      }
      ctx.fillStyle="rgb(40, 56, 33)";
      if (pauseSelection == 0) {
        ctx.fillRect(canv.width/2-90,360,180,35);
        ctx.fillStyle="black";
        ctx.fillRect(canv.width/2-90,410,180,35);
      } else if (pauseSelection == 1) {
        ctx.fillRect(canv.width/2-90,410,180,35);
        ctx.fillStyle="black";
        ctx.fillRect(canv.width/2-90,360,180,35);
      }
      ctx.strokeStyle="lime";
      ctx.textAlign="center"
      ctx.font="23px Cursive";
      ctx.lineWidth="3";
      ctx.fillStyle="lime";
      ctx.strokeRect(canv.width/2-90,360,180,35);
      ctx.fillText("Resume", canv.width/2, 385);
      ctx.strokeRect(canv.width/2-90,410,180,35);
      ctx.fillText("Quit", canv.width/2, 435);
      purchasedItemsList = "";
      for (i = 0; i < purchasedItems.length; i++) {
        purchasedItemsList = purchasedItemsList+purchasedItems[i].displayName+", ";
      } 
      if (purchasedItems.length == 0) {
        purchasedItemsList = "None";
      }
      drawText("Bought Items: "+purchasedItemsList, canv.width/2, 475, canv.width);
    }
  } //end of game loop
  popup = false;
  for (i = 0; i < popups.length; i++) {
    popup = true;
    offset = i*15;
    ctx.fillStyle="black";
    ctx.fillRect(canv.width/2-250+offset,canv.width/2-140+offset,500,280);
    ctx.strokeStyle = "white";
    ctx.lineWidth = "5";
    ctx.strokeRect(canv.width/2-250+offset,canv.width/2-140+offset,500,280);
    ctx.fillStyle="lime";
    ctx.textAlign="center";
    ctx.font="23px Monospace";
    drawText(popups[i].text,canv.width/2+offset,canv.width/2-50+offset,500);
    ctx.fillStyle="white";
    ctx.lineWidth = "3";
    ctx.strokeRect(canv.width/2-30+offset,canv.width/2+80+offset,60,40);
    ctx.fillText("OK",canv.width/2+offset,canv.width/2+105+offset);
  }
  ctx.fillStyle="red";
  ctx.textAlign="center";
  ctx.font="bold 28px Arial";
  ctx.fillText(message,canv.width/2,200);

  ctx.fillStyle="white";
  ctx.textAlign="right";
  ctx.font="23px Arial";
  if (showInfo) {
    ctx.fillText("FPS: "+fps,canv.width-15,40);
    ctx.fillText("x: "+Math.round(px),canv.width-15,65);
    ctx.fillText("Browser: "+browser,canv.width-15,90,150);
    ctx.fillText(version,canv.width-15,740);
  }
  fpsTickTimer++;
  ctx.textAlign="left";
}
specialNum = random(0,50);

bibleShake = false;
bibleTimer = 0;
function hitbox(x,y,sx,sy) {
  if (showHitbox) {
    ctx.strokeStyle="white";
    ctx.lineWidth="1";
    ctx.strokeRect(x,y,sx,sy);
  }
}
function random(lowerNum,upperNum,round = false) {
  do {
    if (lowerNum > 0) {
      number = Math.random()*upperNum+(upperNum-lowerNum);
      if (number > upperNum) number-=lowerNum;
    } else if (lowerNum < 0 && upperNum < 0) {
      number = Math.random()*upperNum-(upperNum-lowerNum);
      if (number > upperNum) number+=lowerNum;
    } else if (lowerNum == 0) {
      number = Math.random()*upperNum;
    } else if (upperNum == 0) {
      number = Math.random()*lowerNum;
    } else if (lowerNum < 0 && upperNum > 0) {
      number = Math.random()*upperNum*2+lowerNum;
    }
  } while (number > upperNum || number < lowerNum);
  if (round) number = Math.round(number);
  return number;
}

fps = 0;
fpsTickTimer = 0;
setInterval(function(){
  fps = fpsTickTimer*5;
  fpsTickTimer = 0;
},200);
