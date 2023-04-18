// Global variables for the physical objects and gravity
let objects = [];
let gravity;

// Basic p5.js sketch setup
function setup() {
  createCanvas(640, 480);
  frameRate(60);

  // Define gravity
  gravity = createVector(0, 0.1);
}

// Physical object class
class PhysicalObject {
  constructor(x, y, vx, vy) {
    this.position = createVector(x, y);
    this.velocity = createVector(vx, vy);
    this.acceleration = createVector();
    this.radius = 10;
  }

  // Update position, velocity, and acceleration
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  // Apply force
  applyForce(force) {
    this.acceleration.add(force);
  }

  // Display object
  display() {
    fill(255);
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }

  // Check collision with another object
  checkCollision(other) {
    let distance = this.position.dist(other.position);
    let minDistance = this.radius + other.radius;

    // Circle-to-circle collision detection
    if (distance < minDistance) {
      let collisionNormal = p5.Vector.sub(this.position, other.position).normalize();
      let overlap = minDistance - distance;

      // Push objects apart to resolve collision
      this.position.add(p5.Vector.mult(collisionNormal, overlap / 2));
      other.position.sub(p5.Vector.mult(collisionNormal, overlap / 2));

      // Calculate collision response (basic elastic collision)
      let relativeVelocity = p5.Vector.sub(this.velocity, other.velocity);
      let impulse = relativeVelocity.dot(collisionNormal);
      if (impulse > 0) {
        return;
      }

      let impulseVector = p5.Vector.mult(collisionNormal, impulse);
      this.velocity.sub(impulseVector);
      other.velocity.add(impulseVector);
    }
  }
}

// Main loop
function draw() {
  background(0);

  // Update and display all objects
  for (let i = 0; i < objects.length; i++) {
    let objA = objects[i];

    objA.applyForce(gravity);
    objA.update();
    objA.display();

    // Check for collisions with other objects
    for (let j = i + 1; j < objects.length; j++) {
      let objB = objects[j];
      objA.checkCollision(objB);
    }

    // Check for collisions with canvas edges
    if (objA.position.y > height - objA.radius || objA.position.y < objA.radius) {
      objA.velocity.y *= -1;
    }
    if (objA.position.x > width - objA.radius || objA.position.x < objA.radius) {
      objA.velocity.x *= -1;
    }
  }
}

// Mouse interaction
function mousePressed() {
  // Create multiple objects with random initial velocities
  let numObjects = 1;
  for (let i = 0; i < numObjects; i++) {
    let randomAngle = random(0, 2 * PI);
    let randomSpeed = random(2, 6);
    let vx = cos(randomAngle) * randomSpeed;
    let vy = sin(randomAngle) * randomSpeed;
    let newObject = new PhysicalObject(mouseX, mouseY, vx, vy);
    objects.push(newObject);
  }
}
