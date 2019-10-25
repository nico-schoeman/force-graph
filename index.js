//import { World, System, TagComponent } from "https://ecsy.io/build/ecsy.module.js";
import {
    World,
    System,
    TagComponent
} from "./node_modules/ecsy/build/ecsy.module.js";
import { Position, Velocity, Link } from "./components.js";
import { AttractSystem, RepulseSystem } from "./systems.js";
import Vector2 from "./vector2.js";

let canvas = document.querySelector("canvas");
let canvasWidth = (canvas.width = window.innerWidth);
let canvasHeight = (canvas.height = window.innerHeight);
let ctx = canvas.getContext("2d");

let world = new World();
world.registerSystem(AttractSystem).registerSystem(RepulseSystem);

async function addNode() {
    let node = await world
        .createEntity()
        .addComponent(Position, {
            value: new Vector2(Math.random() * 10, Math.random() * 10)
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

    console.log(node1, node2, node3, node4);
    // console.log(node2);
    // console.log(link);
    // console.log(world.entityManager._entities[2]);
}
setup();

setInterval(() => {
    world.execute();
}, 3 * 1000);
