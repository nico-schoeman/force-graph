import { System, Not } from "./node_modules/ecsy/build/ecsy.module.js";
import { Position, Velocity, Anchor, Link } from "./components.js";
import Vector2 from "./vector2.js";

let repulsion = 10;
let attraction = 1;
let spring = 50;

export class AttractSystem extends System {
    execute (delta, time) {
        this.queries.links.results.forEach(linkEntity => {
            let link = linkEntity.getComponent(Link);
            let nodesLinked = this.queries.nodes.results.filter((node) => {return node.id === link.from || node.id === link.to});
            nodesLinked.forEach((linkedNode) => {
                let otherNode = nodesLinked.find((node) => {
                    return node.id !== linkedNode.id;
                });

                let linkedNodePosition = linkedNode.getComponent(Position);
                let otherNodePosition = otherNode.getComponent(Position);

                let distance = linkedNodePosition.value.distance(otherNodePosition.value);
                let proximity = Math.max(distance, 1);

                let force = attraction * (proximity - spring) / 100;
                let vector = otherNodePosition.value.subtract(linkedNodePosition.value);
                vector = vector.normalize();
                vector = vector.scale(force);

                let velocity = linkedNode.getMutableComponent(Velocity);
                velocity.value = velocity.value.add(vector)
            });
        });
    }
}
AttractSystem.queries = {
    nodes: {
        components: [Position, Velocity]
    },
    links: {
        components: [Link]
    }
};

export class RepulseSystem extends System {
    execute (delta, time) {
        this.queries.nodes.results.forEach((node) => {
            let allOtherNodes = this.queries.nodes.results.filter((otherNode) => {
                return otherNode.id !== node.id
            });

            let linkedNodePosition = node.getComponent(Position);
            let linkedNodeVelocity = node.getMutableComponent(Velocity);

            allOtherNodes.forEach((otherNode) => {
                let otherNodePosition = otherNode.getComponent(Position);
                let distance = linkedNodePosition.value.distance(otherNodePosition.value);
                let proximity = Math.max(distance, 1);

                let force = -repulsion / proximity;
                let vector = otherNodePosition.value.subtract(linkedNodePosition.value);
                vector = vector.normalize();
                vector = vector.scale(force);

                linkedNodeVelocity.value = linkedNodeVelocity.value.add(vector);
            })
        });
    }
}
RepulseSystem.queries = {
    nodes: {
        components: [Position, Velocity]
    },
    links: {
        components: [Link]
    }
}

export class MoveSystem extends System {
    execute (delta, time) {
        this.queries.nodes.results.forEach((node) => {
            let position = node.getMutableComponent(Position);
            let velocity = node.getMutableComponent(Velocity);
            position.value = position.value.add(velocity.value.scale(delta));
            velocity.value = velocity.value.scale(0);
        })
    }
}
MoveSystem.queries = {
    nodes: {
        components: [Position, Velocity, Not(Anchor)]
    },
    links: {
        components: [Link]
    }
}