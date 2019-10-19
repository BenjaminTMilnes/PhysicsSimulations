

class Pendulum {
    constructor(position = zz, amplitude = 30, length = 300, mass = 10, gravitationalFieldStrength = 10) {

        /* The position of the pendulum is the pivot point. The amplitude is the maximum value for theta that the pendulum reaches, and also the value 
        of theta that it starts at. Tau is the torque on the pendulum, and alpha, omega, and theta are rotational kinematic variables. */

        this.position = position;
        this.amplitude = amplitude;

        this.tau = 0;
        this.alpha = 0;
        this.omega = 0;
        this.theta = amplitude;

        this.length = length;
        this.mass = mass;

        this.gravitationalFieldStrength = gravitationalFieldStrength;
    }

    get momentOfInertia() {
        return this.mass * this.length * this.length;
    }

    get weight() {
        return v2(0, 1).times(this.mass * this.gravitationalFieldStrength);
    }

    get u() {
        return v2(0, 1).rotate(this.theta);
    }

    get n() {
        return this.u.n;
    }

    get e1() {
        return this.position;
    }

    get e2() {
        return this.e1.add(this.u.times(this.length));
    }

    update(time, timeDelta) {
        /* All of the updates to the pendulum's kinematic variables are done here. 
        It's possible to simulate a pendulum oscillating at small angles by just varying theta sinusoidally with time.
        However, it's more interesting to consider the forces acting on the pendulum, and derive the changes to the kinematic variables from those.*/

        var forcePerpendicular = this.weight.m * sin(Math.abs(this.theta));

        /* Tau is the torque on the pendulum. */

        this.tau = forcePerpendicular * this.length * Math.sign(this.theta) * -1;
        this.alpha = this.tau / this.momentOfInertia;
        this.omega += this.alpha * timeDelta / 10;
        this.theta += this.omega * timeDelta / 10;
    }

    draw(graphics) {
        graphics.drawPath([this.e1.add(this.n.times(2)), this.e2.add(this.n.times(2)), this.e2.add(this.n.times(-2)), this.e1.add(this.n.times(-2)), this.e1.add(this.n.times(2))], "hsla(220, 80%, 60%, 0.2)", "none", 0)
        graphics.drawCircle(this.e2, this.mass * 2, "hsla(350, 80%, 60%)")
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

        /* Create the pendulum object and set its amplitude, length, and mass to random values. */

        this.pendulum = new Pendulum(centre, randomNumberWithinRange(10, 179), randomNumberWithinRange(50, 200), randomNumberWithinRange(5, 20));

        this.elements.push(this.pendulum);
    }

    update(timeDelta) {
        super.update(timeDelta);

        this.elements.forEach(e => e.update(this.time, timeDelta));
    }

    draw() {
        this.graphics.clear(this.width, this.height, "#FFFFFF");

        this.elements.forEach(e => { e.draw(this.graphics); });
    }
}

var app = new App("appCanvas");