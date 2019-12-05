import { System, Not } from "./node_modules/ecsy/build/ecsy.module.js";
import { Position, Velocity, Anchor, Link } from "./components.js";
import Vector2 from "./vector2.js";

//TODO: better proximity calculation
//TODO: handle node inside node case
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

                let force = this.world.attraction * (proximity - this.world.spring) / 100;
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

            let nodePos = node.getComponent(Position);
            let nodeVel = node.getMutableComponent(Velocity);

            //top edge
            let topEdge = nodePos.value.y < 10 ? nodePos.value.y - 10 : 0;
            let vectorTop = this.calculateVector(nodePos.value, new Vector2(nodePos.value.x, topEdge));
            nodeVel.value = nodeVel.value.add(vectorTop);

            //bottom edge
            let bottomEdge = nodePos.value.y > this.world.height - 10 ? nodePos.value.y + 10 : this.world.height;
            let vectorBottom = this.calculateVector(nodePos.value, new Vector2(nodePos.value.x, bottomEdge));
            nodeVel.value = nodeVel.value.add(vectorBottom);

            //left edge
            let leftEdge = nodePos.value.x < 10 ? nodePos.value.x - 10 : 0;
            let vectorLeft = this.calculateVector(nodePos.value, new Vector2(leftEdge, nodePos.value.y));
            nodeVel.value = nodeVel.value.add(vectorLeft);

            //right edge
            let rightEdge = nodePos.value.x > this.world.width - 10 ? nodePos.value.x + 10 : this.world.width;
            let vectorRight = this.calculateVector(nodePos.value, new Vector2(rightEdge, nodePos.value.y));
            nodeVel.value = nodeVel.value.add(vectorRight);

            allOtherNodes.forEach((otherNode) => {
                let otherNodePosition = otherNode.getComponent(Position);
                let vector = this.calculateVector(nodePos.value, otherNodePosition.value);

                nodeVel.value = nodeVel.value.add(vector);
            })
        });
    }

    calculateVector (myPos, otherPos) {
        let distance = myPos.distance(otherPos);
        let proximity = Math.max(distance, 1);

        let force = -this.world.repulsion / proximity;
        let vector = otherPos.subtract(myPos);
        vector = vector.normalize();
        vector = vector.scale(force);

        return vector;
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