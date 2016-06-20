// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// A rectangular box


// Constructor
function Element(x, y) {
  this.w = 50;
  this.h = 90;

  // Define a body
  var bd = new box2d.b2BodyDef();
  bd.type = box2d.b2BodyType.b2_dynamicBody;
  bd.position = scaleToWorld(x,y);

  // Define fixture #1
  var fd1 = new box2d.b2FixtureDef();
  // Fixture holds shape
  fd1.shape = new box2d.b2PolygonShape();
  fd1.shape.SetAsBox(scaleToWorld(this.w/2), scaleToWorld(this.h/2));
  fd1.density = 1.0;
  fd1.friction = 0.5;
  fd1.restitution = 0.2;

  // Create the body
  this.body = world.CreateBody(bd);
  // Attach the fixture
  this.body.CreateFixture(fd1);

  // Some additional stuff
//  this.body.SetLinearVelocity(new box2d.b2Vec2(random(-5, 5), random(-2, 5)));
  this.body.SetAngularVelocity(random(-2,2));

  // This function removes the particle from the box2d world
  this.killBody = function() {
    world.DestroyBody(this.body);
  }

  // Is the particle ready for deletion?
  this.done = function() {
    // Let's find the screen position of the particle
    var pos = scaleToPixels(this.body.GetPosition());
    // Is it off the bottom of the screen?
    if (pos.y > height+this.w*this.h) {
      this.killBody();
      return true;
    }
    return false;
  }
  
  this.getScore = function() {
    var pos = scaleToPixels(this.body.GetPosition());
    return (pos.y <= height * 0.8);
  }

  // Drawing the box
  this.display = function() {
    // Get the body's position
    var pos = scaleToPixels(this.body.GetPosition());
    // Get its angle of rotation
    var a = this.body.GetAngleRadians();
    
    // Draw it!
    imageMode(CENTER);
    push();
    translate(pos.x, pos.y);
    rotate(a);
    image(dlangManImg, 0, 0);
    pop();
  }
}