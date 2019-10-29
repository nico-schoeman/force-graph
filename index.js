import {
    World,
    System,
    TagComponent
} from "./node_modules/ecsy/build/ecsy.module.js";
import { Position, Velocity, Link, Anchor } from "./components.js";
import {
    AttractSystem,
    RepulseSystem,
    MoveSystem,
    RenderSystem
} from "./systems.js";
import Vector2 from "./vector2.js";

let canvas = document.querySelector("canvas");
let canvasWidth = (canvas.width = window.innerWidth);
let canvasHeight = (canvas.height = window.innerHeight);
let ctx = canvas.getContext("2d");

let world = new World();
world
    .registerSystem(AttractSystem)
    .registerSystem(RepulseSystem)
    .registerSystem(MoveSystem)
    .registerSystem(RenderSystem);

async function addNode() {
    let node = await world
        .createEntity()
        .addComponent(Position, {
            value: new Vector2(
                ((Math.random()-0.5)*0.1) + (canvasWidth / 2),
                ((Math.random()-0.5)*0.1) + (canvasHeight / 2)
            )
        })
        .addComponent(Velocity);
    return node;
}

async function addLink(fromNode, toNode) {
    let link = await world
        .createEntity()
        .addComponent(Link, { from: fromNode, to: toNode });
    return link;
}

async function setup() {
    world.createEntity(); //Random entity to index properly
    let node1 = await addNode();
    let node2 = await addNode();
    let link1 = await addLink(node1.id, node2.id);

    let node3 = await addNode();
    let node4 = await addNode();
    let link2 = await addLink(node3.id, node4.id);

    let link3 = await addLink(node1.id, node3.id);

    let node5 = await addNode();
    let node6 = await addNode();
    let link4 = await addLink(node2.id, node5.id);
    let link5 = await addLink(node2.id, node6.id);

    let node7 = await addNode();
    let link6 = await addLink(node1.id, node7.id);

    node1.addComponent(Anchor);
    //console.log(node1, node2, node3, node4);
}
setup();

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