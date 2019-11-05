import { World } from "./node_modules/ecsy/build/ecsy.module.js";
import { Position, Velocity, Link, Anchor } from "./components.js";
import {
    AttractSystem,
    RepulseSystem,
    MoveSystem
} from "./systems.js";
import Vector2 from "./vector2.js";

export function createForceGraph () {
    let world = new World();
    world
        .registerSystem(AttractSystem)
        .registerSystem(RepulseSystem)
        .registerSystem(MoveSystem);

    function animate() {
        var time = performance.now();
        var delta = time - lastTime;
        world.execute(delta, time);
        lastTime = time;
        requestAnimationFrame(animate);
    }

    var lastTime = performance.now();
    animate();

    window.world = world;
    window.world.createEntity(); //Random entity to index properly
    return window.world;
}

export async function addNode() {
    let node = await window.world
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

export async function addLink(fromNode, toNode) {
    let link = await window.world
        .createEntity()
        .addComponent(Link, { from: fromNode.id, to: toNode.id });
    return link;
}

export async function anchorNode (node) {
    node.addComponent(Anchor);
    return node;
}