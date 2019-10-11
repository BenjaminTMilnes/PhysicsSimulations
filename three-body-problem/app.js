

class Particle {
    constructor(position = zz) {
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

function randomNumberWithinRange(lowerLimit, upperLimit) {
    return Math.random() * (upperLimit - lowerLimit) + lowerLimit;
}

class App extends Application {
    constructor(canvasId) {
        super(canvasId);

        this.resolutionFactor = 2;

        this.elements = [];

        this.elements.push(new Particle(v2(300, 500)));
        this.elements.push(new Particle(v2(700, 500)));
        this.elements.push(new Particle(v2(400, 400)));

        this.elements[0].mass = randomNumberWithinRange(5, 20);
        this.elements[1].mass = randomNumberWithinRange(5, 20);
        this.elements[2].velocity = v2(randomNumberWithinRange(-0.1, 0.1), randomNumberWithinRange(-0.1, 0.1));
    }

    initialise() {
        super.initialise();

        this.graphics = new GraphicsContext(this.context);
    }

    update(timeDelta) {
        super.update(timeDelta);

        var g = 1 / 1000;

        for (var i = 0; i < this.elements.length; i++) {
            if (i < 2) {
                continue;
            }
            var e1 = this.elements[i];
            var f = zz;

            for (var j = 0; j < this.elements.length; j++) {
                if (i != j) {
                    var e2 = this.elements[j];

                    var m1 = e1.mass;
                    var m2 = e2.mass;
                    var r = from(e1.position).to(e2.position).m;
                    var u = from(e1.position).to(e2.position).u;

                    f = f.add(u.times((g * m1 * m2) / (r * r)));
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