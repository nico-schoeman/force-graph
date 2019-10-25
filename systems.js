import { System } from "./node_modules/ecsy/build/ecsy.module.js";
import { Position, Velocity, Link } from "./components.js";

let repulsion = 1;
let attraction = 1;
let spring = 100;

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
                vector.scale(force);

                linkedNode.getComponent(Velocity).value.add(vector)
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
            let links = this.queries.links.results.reduce((linkResults, linkEntity) => {
                let link = linkEntity.getComponent(Link);
                if (node.id === link.from || node.id === link.to)
                linkResults.push(link);
                return linkResults;
            }, []);
            let otherLinkedNodesIds = links.map((link) => {
                return link.from !== node.id ? link.from : link.to;
            })
            let allLinkedNodesIds = [node.id, ...otherLinkedNodesIds];
            let allOtherNodes = this.queries.nodes.results.filter((otherNode) => {
                return !allLinkedNodesIds.includes(otherNode.id)
            });

            console.log(node, allOtherNodes);

            //TODO: repulse here
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