

class Particle {
    constructor(position = zz) {
        // Give the particle standard mechanical properties.

        this.mass = 10;

        this.force = zz;
        this.acceleration = zz;
        this.velocity = zz;
        this.position = position;

        this.path = [];
    }

    update(time, timeDelta) {
        this.path.push(this.position.add(zz));

        this.acceleration = this.force.times(1 / this.mass);
        this.velocity = this.velocity.add(this.acceleration.times(timeDelta));
        this.position = this.position.add(this.velocity.times(timeDelta));
    }

    draw(graphics) {
        graphics.drawPath(this.path, "none", "hsla(220, 80%, 60%, 0.2)");
        graphics.drawCircle(this.position, this.mass * 2, "hsla(350, 80%, 60%)")
    }
}

// A function that returns a random number within a given range is always useful.

function randomNumberWithinRange(lowerLimit, upperLimit) {
    return Math.random() * (upperLimit - lowerLimit) + lowerLimit;
}

class App extends Application {
    constructor(canvasId) {
        super(canvasId);

        this.resolutionFactor = 2;

        this.elements = [];

        // Create three particles and add them to the list of elements.
        // The particle that isn't fixed is given a random position on the canvas.

        this.elements.push(new Particle(v2(300, 300)));
        this.elements.push(new Particle(v2(700, 300)));
        this.elements.push(new Particle(v2(randomNumberWithinRange(200, 800), randomNumberWithinRange(100, 500))));

        // Randomise the masses of the particles and the velocity of the particle that isn't fixed.

        this.elements[0].mass = randomNumberWithinRange(5, 20);
        this.elements[1].mass = randomNumberWithinRange(5, 20);
        this.elements[2].mass = randomNumberWithinRange(1, 10);
        this.elements[2].velocity = v2(randomNumberWithinRange(-0.1, 0.1), randomNumberWithinRange(-0.1, 0.1));
    }

    initialise() {
        super.initialise();

        this.graphics = new GraphicsContext(this.context);
    }

    update(timeDelta) {
        super.update(timeDelta);

        // The force due to gravity on each particle is calculated here.
        // g is a constant to tune the speed at which the simulation appears to run.

        var g = 1 / 10;

        for (var i = 0; i < this.elements.length; i++) {

            // The first two particles are fixed, so no need to calculate the force on them.
            if (i < 2) {
                continue;
            }

            var e1 = this.elements[i];
            var f = zz;

            for (var j = 0; j < this.elements.length; j++) {
                if (i != j) {
                    var e2 = this.elements[j];

                    // Use Newton's Law of Gravitation to calculate the force on particle i due to particle j.

                    var m1 = e1.mass;
                    var m2 = e2.mass;
                    var r = from(e1.position).to(e2.position).m;
                    var u = from(e1.position).to(e2.position).u;
                    var fm = (g * m1 * m2) / (r * r);

                    // fm is the magnitude of the gravitational force.
                    // When two particles are close, this simulation can produce a problem where particles suddenly gain a huge amount of kinetic energy.
                    // To mask this effect, place an upper limit on the magnitude of the force.
                    // This will only come into effect when two particles are very close.

                    fm = Math.min(fm, 10);

                    // Similarly, place a lower limit on the range of the force.

                    if (r > 2) {
                        // Sum the forces due to gravity.
                        f = f.add(u.times(fm));
                    }
                }
            }

            e1.force = f;
        }

        this.elements.forEach(e => e.update(this.time, timeDelta));
    }

    draw() {
        this.graphics.clear(this.width, this.height, "#FFFFFF");

        this.elements.forEach(e => {
            e.draw(this.graphics);
        });
    }
}

var app = new App("appCanvas");