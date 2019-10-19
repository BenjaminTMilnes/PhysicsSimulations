
class Particle {
    constructor(position = zz) {
        /* Give the particle standard mechanical properties. */

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

/* A function that returns a random number within a given range is always useful. */

function randomNumberWithinRange(lowerLimit, upperLimit) {
    return Math.random() * (upperLimit - lowerLimit) + lowerLimit;
}

class App extends Application {
    constructor(canvasId) {
        super(canvasId);

        this.resolutionFactor = 2;

        this.canvasSizingHeight = "fixed";
        this.fixedHeight = 400;

        this.elements = [];
    }

    initialise() {
        super.initialise();

        this.graphics = new GraphicsContext(this.context);

        var centre = v2(this.width / 4, this.height / 4);

        /* Create three particles and add them to the list of elements. */

        var particle1 = new Particle();
        var particle2 = new Particle();
        var particle3 = new Particle();

        var w = Math.min(200, this.width / 8);

        particle1.mass = randomNumberWithinRange(5, 20);
        particle1.position = centre.add(v2(-w, 0));

        particle2.mass = randomNumberWithinRange(5, 20);
        particle2.position = centre.add(v2(w, 0));

        particle3.mass = randomNumberWithinRange(1, 10);
        particle3.position = centre.add(v2(randomNumberWithinRange(- w * 1.5, w * 1.5), randomNumberWithinRange(- w, w)));
        particle3.velocity = v2(randomNumberWithinRange(-0.1, 0.1), randomNumberWithinRange(-0.1, 0.1));

        this.elements.push(particle1);
        this.elements.push(particle2);
        this.elements.push(particle3);
    }

    update(timeDelta) {
        super.update(timeDelta);

        /* The force due to gravity on each particle is calculated here.
           g is a constant to tune the speed at which the simulation appears to run. */

        var g = 1 / 10;

        for (var i = 0; i < this.elements.length; i++) {

            /* The first two particles are fixed, so no need to calculate the force on them. */
            if (i < 2) {
                continue;
            }

            var e1 = this.elements[i];
            var f = zz;

            for (var j = 0; j < this.elements.length; j++) {
                if (i != j) {
                    var e2 = this.elements[j];

                    /* Use Newton's Law of Gravitation to calculate the force on particle i due to particle j. */

                    var m1 = e1.mass;
                    var m2 = e2.mass;
                    var r = from(e1.position).to(e2.position).m;
                    var u = from(e1.position).to(e2.position).u;
                    var fm = (g * m1 * m2) / (r * r);

                    /* Sum the forces due to gravity. */
                    f = f.add(u.times(fm));
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