double = 1;
function shoot() {
    //shooting behavior
    modifiedShootSpeed = 0;
    if (shooting && !pause) {
      if (!soundMute) 
        shootSound.play();
      type = "regular";
      if (knife && Math.random() < 0.1+luck) type = "knife";
      if (shootMode == "Single") {
        bullets.push({x: px-3, y: py, yv: bulletSpeed, xv: 0, bulletStrength: bulletPower, size: bulletSize, type:type, color: "blue", homing: false, slow: false, age: 0,owner:"player"});
        modifiedShootSpeed = shootSpeed;
      } else if (shootMode == "Double") {
        double*=-1;
        if (double == -1) bullets.push({x: px+4, y: py, yv: bulletSpeed, xv: 0, bulletStrength: bulletPower*0.75, size: bulletSize, type:type, color: "blue", homing: false, slow: false, age: 0,owner:"player"});
        if (double == 1) bullets.push({x: px-10, y: py, yv: bulletSpeed, xv: 0, bulletStrength: bulletPower*0.75, size: bulletSize, type:type, color: "blue", homing: false, slow: false, age: 0,owner:"player"});
        modifiedShootSpeed = (shootSpeed + shootSpeed/4)/2;
      } else if (shootMode == "Triple Shot") {
        bullets.push({x: px-3, y: py, yv: bulletSpeed, xv: 0.75, bulletStrength: bulletPower*0.75, size: bulletSize, type:type, color: "blue", homing: false, age: 0, slow: false,owner:"player"});
        bullets.push({x: px-3, y: py, yv: bulletSpeed, xv: 0, bulletStrength: bulletPower*0.75, size: bulletSize, type:type, color: "blue", homing: false, age: 0, slow: false,owner:"player"});
        bullets.push({x: px-3, y: py, yv: bulletSpeed, xv: -0.75, bulletStrength: bulletPower*0.75, size: bulletSize, type:type, color: "blue", homing: false, age: 0, slow: false,owner:"player"});
        modifiedShootSpeed = shootSpeed + shootSpeed/3.25;
      } else if (shootMode == "Five Shot") {
        bullets.push({x: px-3, y: py, yv: bulletSpeed, xv: 1, bulletStrength: bulletPower*0.75, size: bulletSize, type:type, color: "blue", homing: false, slow: false, age: 0,owner:"player"});
        bullets.push({x: px-3, y: py, yv: bulletSpeed, xv: -1, bulletStrength: bulletPower*0.75, size: bulletSize, type:type, color: "blue", homing: false, slow: false, age: 0,owner:"player"});
        bullets.push({x: px-3, y: py, yv: bulletSpeed, xv: 0.5, bulletStrength: bulletPower*0.75, size: bulletSize, type:type, color: "blue", homing: false, slow: false, age: 0,owner:"player"});
        bullets.push({x: px-3, y: py, yv: bulletSpeed, xv: -0.5, bulletStrength: bulletPower*0.75, size: bulletSize, type:type, color: "blue", homing: false, slow: false, age: 0,owner:"player"});
        bullets.push({x: px-3, y: py, yv: bulletSpeed, xv: 0, bulletStrength: bulletPower*0.75, size: bulletSize, type:type, color: "blue", homing: false, slow: false, age: 0,owner:"player"});
        modifiedShootSpeed = shootSpeed + shootSpeed/1.5;
      } else if (shootMode == "Bazooka") {
        bullets.push({x: px-3, y: py, yv: bulletSpeed/1.43, xv: 0, bulletStrength: bulletPower*6, size: bulletSize*3.3, type:"bomb", color: "blue", homing: false, slow: false, age: 0,owner:"player"});
        modifiedShootSpeed = shootSpeed + shootSpeed/0.4;
      } else if (shootMode == "Shotgun") {
        for (i = 0; i < 8; i++) {
          xv = Math.random()*2-1;
          xv/=3.5;
          yDisp = Math.random()*11-5.5;
          bullets.push({x: px-3, y: py+yDisp, yv: bulletSpeed, xv: xv, bulletStrength: bulletPower/2, size: bulletSize/2, type:"shotgun", color: "blue", homing: false, slow: false, age: 0,owner:"player"});
        }
        modifiedShootSpeed = shootSpeed + shootSpeed/0.8;
      }

      if (sideGunners) {
        if (Math.random() > 0.5+luck) {
          bullets.push({x: px, y: py, yv: 0, xv: 10, bulletStrength: bulletPower*0.5, size: bulletSize, type:"shard", color: "blue", homing: false, slow: false, side: true, age: 0,owner:"player"});
          bullets.push({x: px, y: py, yv: 0, xv: -10, bulletStrength: bulletPower*0.5, size: bulletSize, type:"shard", color: "blue", homing: false, slow: false, side: true, age: 0,owner:"player"});
        }
      }

      setTimeout(function(){shoot();},modifiedShootSpeed);
      shootControl();
    }
}

function shootControl() {
  shootWait+=10;

  if (shootWait < modifiedShootSpeed) 
    setTimeout(function(){shootControl();},10); 
  if (shootWait >= modifiedShootSpeed) 
    shootWait = 0;
}