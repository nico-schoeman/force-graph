import { World, Entity } from "./node_modules/ecsy/build/ecsy.module.js";
import { Position, Velocity, Link, Anchor } from "./components.js";
import {
    AttractSystem,
    RepulseSystem,
    MoveSystem
} from "./systems.js";
import Vector2 from "./vector2.js";

export function force_graph (width = window.innerWidth, height = window.innerHeight, constrainInsideEdges = true) {
    this.world = new World();
    this.world.constrainInsideEdges = constrainInsideEdges;
    this.world.width = width;
    this.world.height = height;
    this.world.repulsion = 10;
    this.world.attraction = 1;
    this.world.spring = 50;

    this.world
        .registerSystem(AttractSystem)
        .registerSystem(RepulseSystem)
        .registerSystem(MoveSystem);

    function animate() {
        var time = performance.now();
        var delta = time - lastTime;
        this.world.execute(delta, time);
        lastTime = time;
        requestAnimationFrame(animate.bind(this));
    }

    var lastTime = performance.now();
    animate.bind(this)();
    this.world.createEntity(); //Random entity to index properly
}

force_graph.prototype.addNode = async function() {
    let node = await this.world
        .createEntity()
        .addComponent(Position, {
            value: new Vector2(
                ((Math.random()-0.5)*0.1) + (window.innerWidth / 2),
                ((Math.random()-0.5)*0.1) + (window.innerHeight / 2)
            )
        })
        .addComponent(Velocity);
    return node;
}

force_graph.prototype.addLink = async function(fromNode, toNode) {
    let link = await this.world
        .createEntity()
        .addComponent(Link, { from: fromNode.id, to: toNode.id });
    return link;
}

Entity.prototype.makeAnchor = function() {
    this.addComponent(Anchor);
    return this;
}

force_graph.prototype.anchorNode = async function(node) {
    node.addComponent(Anchor);
    return node;
}