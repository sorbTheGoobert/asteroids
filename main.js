const steroidsTheGame = document.getElementById("game");
const ctx = steroidsTheGame.getContext("2d");
const starAmount = Math.floor(Math.random() * 26) + 225;
const stars_location = new Array(starAmount);
let steroid_amount = 10;
let funnyMode_jesterArrows = false;
let funnyMode_wowTheyComeBack = false;
let funnyMode_neverDieMode = false;
let funnyMode_spinBot = false;
let funnyMode_debugMode = false;
let funnyMode_ruinTheFun = false;
let pulsed = false;
let gameLoop;
let lost = false;

const player = {
  size: 25,
  length: 30,
  xPos: (800 - 30) / 2,
  yPos: (600 - 25) / 2,
  hitbox_xPos: (800 - 30) / 2 - 8,
  hitbox_yPos: (800 - 25) / 2 - 8,
  hitbox_size: 16,
  vertical_velocity: 0,
  horizontal_velocity: 0,
  color: "white",
  keys: {
    a: false,
    w: false,
    d: false,
  },
  angle: 0,
  turning_speed: 0.075,
  projectile: [],
  points: 0,
  good_shot_mate: new Audio("./assets/BOTSOUNDINTENSIFIES.mp3"),
  GETOUT: new Audio("./assets/GETOUT.mp3"),
  draw: () => {
    ctx.save();
    ctx.fillStyle = player.color;
    ctx.strokeStyle = player.color;
    ctx.translate(player.xPos, player.yPos);
    ctx.rotate(player.angle);
    ctx.translate(-player.xPos, -player.yPos);
    ctx.beginPath();
    ctx.moveTo(player.xPos - player.length / 2, player.yPos - player.size / 2);
    ctx.lineTo(player.xPos + player.length / 2, player.yPos);
    ctx.lineTo(player.xPos - player.length / 2, player.yPos + player.size / 2);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    if (funnyMode_debugMode && !funnyMode_neverDieMode) {
      ctx.strokeStyle = "yellow";
      ctx.strokeRect(
        player.hitbox_xPos,
        player.hitbox_yPos,
        player.hitbox_size,
        player.hitbox_size
      );
    }
  },
  update: () => {
    if (player.keys.a) {
      player.angle -= player.turning_speed;
    }
    if (player.keys.d) {
      player.angle += player.turning_speed;
    }
    if (funnyMode_spinBot) player.angle += Math.random() * (2 * Math.PI);
    if (player.angle < 0) player.angle += 2 * Math.PI;
    if (player.angle > 2 * Math.PI) player.angle -= 2 * Math.PI;
    if (player.keys.w) {
      player.horizontal_velocity = Math.cos(player.angle) * 3;
      player.vertical_velocity = Math.sin(player.angle) * 3;
    }
    player.xPos += player.horizontal_velocity;
    player.yPos += player.vertical_velocity;
    player.hitbox_xPos = player.xPos - 8;
    player.hitbox_yPos = player.yPos - 8;
    if (player.xPos < 0) player.xPos += 800;
    if (player.xPos > 800) player.xPos -= 800;
    if (player.yPos < 0) player.yPos += 600;
    if (player.yPos > 600) player.yPos -= 600;
    player.vertical_velocity *= 0.99;
    player.horizontal_velocity *= 0.99;
    if (funnyMode_neverDieMode) return null;
    let hitSteroids = steroids.filter((elem) => {
      return (
        elem.xPos <= player.hitbox_xPos + player.hitbox_size &&
        elem.xPos + elem.size >= player.hitbox_xPos &&
        elem.yPos <= player.hitbox_yPos + player.hitbox_size &&
        elem.yPos + elem.size >= player.hitbox_yPos
      );
    });
    if (hitSteroids.length >= 1) {
      clearInterval(gameLoop);
      player.GETOUT.volume = 0.1;
      player.GETOUT.fastSeek(0.35);
      player.GETOUT.play();
      lost = true;
    }
  },
};

class Projectile {
  constructor(x, y, angle) {
    this.radius = 2;
    this.xPos = x;
    this.yPos = y;
    this.horizontal_velocity = Math.cos(angle) * 10;
    this.vertical_velocity = Math.sin(angle) * 10;
    this.color = "white";
    this.pew = new Audio("./assets/pew.mp3");
  }
  update = () => {
    this.xPos += this.horizontal_velocity;
    this.yPos += this.vertical_velocity;
    // let index = findProj();
    let index = player.projectile.indexOf(this);
    let hitSteroids = steroids.filter((elem) => {
      return (
        elem.xPos <= this.xPos + this.radius &&
        elem.xPos + elem.size >= this.xPos &&
        elem.yPos <= this.yPos + this.radius &&
        elem.yPos + elem.size >= this.yPos
      );
    });
    if (hitSteroids.length >= 1) {
      const steroidIndex = steroids.indexOf(hitSteroids[0]);
      if (!funnyMode_jesterArrows) removeElem(index, player.projectile);
      steroids[steroidIndex].xPos = Math.random() > 0.5 ? 800 : -50;
      steroids[steroidIndex].yPos = Math.random() > 0.5 ? 600 : -50;
      steroids[steroidIndex].horizontal_velocity =
        Math.sign(Math.random() - 0.5) * Math.random();
      steroids[steroidIndex].vertical_velocity =
        Math.sign(Math.random() - 0.5) * Math.random();
      steroids[steroidIndex].dann.volume = 0.1;
      steroids[steroidIndex].dann.fastSeek(0.42);
      steroids[steroidIndex].dann.play();
      player.points++;
      return null;
    }

    if (funnyMode_wowTheyComeBack) {
      if (this.xPos < 0) this.xPos += 800;
      if (this.xPos > 800) this.xPos -= 800;
      if (this.yPos < 0) this.yPos += 600;
      if (this.yPos > 600) this.yPos -= 600;
      return null;
    }

    if (
      this.xPos - this.radius > 800 ||
      this.xPos + this.radius < 0 ||
      this.yPos - this.radius > 600 ||
      this.yPos + this.radius < 0
    ) {
      removeElem(index, player.projectile);
    }
  };
  draw = () => {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.xPos, this.yPos, this.radius, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
    // ctx.fillRect(this.xPos, this.yPos, this.radius, this.radius)
  };
}

function removeElem(index, array) {
  if (index === null) {
    return null;
  }
  let temp = [];
  let pointer = array.length - 1;
  while (pointer !== index) {
    temp.push(array.pop());
    pointer--;
  }
  array.pop();
  while (temp.length) {
    array.push(temp.pop());
  }
  // if (index === null) {
  //   return null;
  // }
  // let temp = [];
  // let pointer = player.projectile.length - 1;
  // while (pointer !== index) {
  //   temp.push(player.projectile.pop());
  //   pointer--;
  // }
  // player.projectile.pop();
  // while (temp.length) {
  //   player.projectile.push(temp.pop());
  // }
}

window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyA":
      player.keys.a = true;
      break;
    case "KeyW":
      player.keys.w = true;
      break;
    case "KeyD":
      player.keys.d = true;
      break;
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyA":
      player.keys.a = false;
      break;
    case "KeyW":
      player.keys.w = false;
      break;
    case "KeyD":
      player.keys.d = false;
      break;
  }
});
window.addEventListener("keypress", (event) => {
  if (event.code === "Space") {
    if (lost) {
      lost = false;
      init();
      return null;
    }
    if (funnyMode_spinBot) {
      pulsed = true;
      player.good_shot_mate.fastSeek(0.1);
      player.good_shot_mate.play();
      return null;
    }
    player.projectile.push(
      new Projectile(player.xPos, player.yPos, player.angle)
    );
    player.projectile[player.projectile.length - 1].pew.volume = 0.1;
    player.projectile[player.projectile.length - 1].pew.fastSeek(0.2);
    player.projectile[player.projectile.length - 1].pew.play();
  } else {
    pulsed = false;
  }
});

class Steroid {
  constructor() {
    let seed = Math.random() > 0.5;
    if (seed) {
      this.xPos = Math.random() * 850 - 50;
    } else {
      if (Math.random() > 0.5) {
        this.xPos = -50;
      } else {
        this.xPos = 800;
      }
    }
    if (!seed) {
      this.yPos = Math.random() * 650 - 50;
    } else {
      if (Math.random() > 0.5) {
        this.yPos = -50;
      } else {
        this.yPos = 600;
      }
    }
    this.horizontal_velocity = Math.sign(Math.random() - 0.5) * Math.random(); // -10 - -5 - 5 - 10
    this.vertical_velocity = Math.sign(Math.random() - 0.5) * Math.random(); // -10 - -5 - 5 - 10
    this.size = 50;
    this.color = "grey";
    this.sprite = document.getElementById("steroid");
    this.dann = new Audio("./assets/bap.mp3");
  }
  update = () => {
    if (funnyMode_ruinTheFun) {
      player.points++;
      const random = Math.random() > 0.5;
      // this.xPos = random ? Math.random() * 850 - 50 : -50;
      // this.yPos = random ? -50 : Math.random() * 650 - 50;
      if (random) {
        this.xPos = Math.random() * 850 - 50;
      } else {
        if (Math.random() > 0.5) {
          this.xPos = -50;
        } else {
          this.xPos = 800;
        }
      }
      if (!random) {
        this.yPos = Math.random() * 650 - 50;
      } else {
        if (Math.random() > 0.5) {
          this.yPos = -50;
        } else {
          this.yPos = 600;
        }
      }
      this.horizontal_velocity = Math.sign(Math.random() - 0.5) * Math.random();
      this.vertical_velocity = Math.sign(Math.random() - 0.5) * Math.random();
    }
    this.xPos += this.horizontal_velocity;
    this.yPos += this.vertical_velocity;
    if (
      this.xPos > 800 ||
      this.xPos + this.size < 0 ||
      this.yPos > 600 ||
      this.yPos + this.size < 0
    ) {
      // this.xPos = Math.sign(Math.random() - 0.5) * 800;
      // this.yPos = Math.sign(Math.random() - 0.5) * 600;
      const random = Math.random() > 0.5;
      // this.xPos = random ? Math.random() * 850 - 50 : -50;
      // this.yPos = random ? -50 : Math.random() * 650 - 50;
      if (random) {
        this.xPos = Math.random() * 850 - 50;
      } else {
        if (Math.random() > 0.5) {
          this.xPos = -50;
        } else {
          this.xPos = 800;
        }
      }
      if (!random) {
        this.yPos = Math.random() * 650 - 50;
      } else {
        if (Math.random() > 0.5) {
          this.yPos = -50;
        } else {
          this.yPos = 600;
        }
      }
      this.horizontal_velocity = Math.sign(Math.random() - 0.5) * Math.random();
      this.vertical_velocity = Math.sign(Math.random() - 0.5) * Math.random();
    }
    // console.log(
    //   player.projectile.filter((elem) => {
    //     return (
    //       this.xPos <= elem.xPos + elem.radius &&
    //       this.xPos + this.size >= elem.xPos &&
    //       this.yPos <= elem.yPos + elem.radius &&
    //       this.yPos + this.size >= elem.yPos
    //     );
    //   })
    // );
  };
  draw = () => {
    if (!steroids.includes(this)) return null;
    ctx.drawImage(this.sprite, this.xPos - 10, this.yPos - 10, 70, 70);
    if (funnyMode_debugMode) {
      ctx.strokeStyle = "red";
      ctx.strokeRect(this.xPos, this.yPos, this.size, this.size);
    }
  };
}

const steroids = [];

function drawGUI() {
  ctx.fillStyle = "white";
  ctx.fillText(player.points, 10, 10);
}

function drawStars(firstTime) {
  firstTime = firstTime || false;
  ctx.fillStyle = "white";
  if (firstTime) {
    for (let stars = 1; stars <= starAmount; stars++) {
      stars_location[stars] = {
        xPos: Math.random() * 850 - 50,
        yPos: Math.random() * 650 - 50,
      };
      ctx.beginPath();
      ctx.arc(
        stars_location[stars].xPos,
        stars_location[stars].yPos,
        1,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.closePath();
    }
    return null;
  }
  for (let stars = 1; stars <= starAmount; stars++) {
    ctx.beginPath();
    ctx.arc(
      stars_location[stars].xPos,
      stars_location[stars].yPos,
      1,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.closePath();
  }
}

function drawAimbotShots() {
  if (funnyMode_spinBot && pulsed) {
    player.points++;
    steroids.forEach((elem) => {
      player.points++;
      const random = Math.random() > 0.5;
      ctx.beginPath();
      ctx.strokeStyle = "yellow";
      ctx.moveTo(player.xPos, player.yPos);
      ctx.lineTo(elem.xPos + elem.size / 2, elem.yPos + elem.size / 2);
      ctx.stroke();
      elem.xPos = random ? Math.random() * 850 - 50 : -50;
      elem.yPos = random ? -50 : Math.random() * 650 - 50;
      elem.horizontal_velocity = Math.sign(Math.random() - 0.5) * Math.random();
      elem.vertical_velocity = Math.sign(Math.random() - 0.5) * Math.random();
      elem.dann.volume = 0.1;
      elem.dann.fastSeek(0.42);
      elem.dann.play();
    });
  }
}

function init() {
  player.size = 25;
  player.length = 30;
  player.xPos = (800 - 30) / 2;
  player.yPos = (600 - 25) / 2;
  player.horizontal_velocity = 0;
  player.vertical_velocity = 0;
  player.angle = Math.floor(Math.random() * 5) * 0.5 * Math.PI;
  player.points = 0;
  if (funnyMode_spinBot) {
    player.turning_speed = 0;
  }
  while (player.projectile.length) {
    player.projectile.pop();
  }
  while (steroids.length) {
    steroids.pop();
  }
  ctx.clearRect(0, 0, 800, 600);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 600);
  drawStars(true);
  player.draw();
  for (let i = 0; i < steroid_amount; i++) {
    steroids.push(new Steroid());
  }
  ctx.font = "24px bepbop";
  ctx.textBaseline = "top";
  ctx.textAlign = "start";
  drawGUI();
  gameLoop = setInterval(requestAnimationFrame, 1000 / 60, update);
}
function update() {
  ctx.clearRect(0, 0, 800, 600);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 600);
  drawStars();
  while (steroid_amount > steroids.length) {
    steroids.push(new Steroid());
  }
  while (steroid_amount < steroids.length) {
    steroids.pop();
  }
  steroids.forEach((elem) => {
    elem.update();
    elem.draw();
  });
  drawAimbotShots();
  player.update();
  player.draw();
  for (let index = 0; index < player.projectile.length; index++) {
    // console.log('hi')
    player.projectile[index].update();
    if (player.projectile[index] !== undefined) {
      player.projectile[index].draw();
    }
  }
  drawGUI();
  pulsed = false;
}

window.onload = init();
