const steroids = document.getElementById("game");
const ctx = steroids.getContext("2d");

const player = {
  size: 25,
  length: 30,
  xPos: (800 - 25) / 2,
  yPos: (600 - 25) / 2,
  vertical_velocity: 0,
  horizontal_velocity: 0,
  color: "white",
  keys: {
    a: false,
    w: false,
    d: false,
  },
  angle: 0,
  turning_speed: 0.1,
  projectile: [],
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
  },
  update: () => {
    if (player.keys.a) {
      player.angle -= player.turning_speed;
    }
    if (player.keys.d) {
      player.angle += player.turning_speed;
    }
    if (player.angle < 0) player.angle += 2 * Math.PI;
    if (player.angle > 2 * Math.PI) player.angle -= 2 * Math.PI;
    if (player.keys.w) {
      player.horizontal_velocity = Math.cos(player.angle) * 5;
      player.vertical_velocity = Math.sin(player.angle) * 5;
    }
    player.xPos += player.horizontal_velocity;
    player.yPos += player.vertical_velocity;
    if (player.xPos < 0) player.xPos += 800;
    if (player.xPos > 800) player.xPos -= 800;
    if (player.yPos < 0) player.yPos += 600;
    if (player.yPos > 600) player.yPos -= 600;
    player.vertical_velocity *= 0.99;
    player.horizontal_velocity *= 0.99;
  },
};

class Projectile {
  constructor(x, y, angle) {
    this.radius = 5;
    this.xPos = x;
    this.yPos = y;
    this.horizontal_velocity = Math.cos(angle) * 5;
    this.vertical_velocity = Math.sin(angle) * 5;
    this.color = "yellow";
  }
  update = () => {
    this.xPos += this.horizontal_velocity;
    this.yPos += this.vertical_velocity;
    const index = findProj();
    if (index !== null) {
      console.log("STOP")
      let temp = [];
      let pointer = player.projectile.length - 1;
      while (pointer !== index) {
        temp.push(player.projectile.pop());
      }
      player.projectile.pop();
      while (temp.length) {
        player.projectile.push(temp.pop());
      }
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
  }
}

function findProj() {
  for (i = 0; i < player.projectile.length; i++) {
    if (
      player.projectile[i].xPos - player.projectile[i].radius > 800 ||
      player.projectile[i].xPos + player.projectile[i].radius < 0 ||
      player.projectile[i].yPos - player.projectile[i].radius > 600 ||
      player.projectile[i].yPos + player.projectile[i].radius < 0
    ) {
      return i;
    }
  }
  return null;
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
  if (event.code === "Space")
    player.projectile.push(
      new Projectile(player.xPos, player.yPos, player.angle)
    );
});

function init() {
  ctx.clearRect(0, 0, 800, 600);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 600);
  player.draw();
  setInterval(requestAnimationFrame, 1000 / 60, update);
}
function update() {
  ctx.clearRect(0, 0, 800, 600);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 600);
  player.update();
  player.draw();
  for(let index = 0; index < player.projectile.length; index++){
    // console.log('hi')
    player.projectile[index].update();
    player.projectile[index].draw();
  }
}

window.onload = init();
