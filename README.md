## Create the force graph base
```javascript
let forceGraph = createForceGraph();
```

## Add nodes to the force graph
```javascript
let node = await addNode();
```

## Link two nodes
```javascript
let node1 = await addNode();
let node2 = await addNode();
let link = await addLink(node1, node2);
```

## Set a node to be anchored
```javascript
let node = await addNode();
anchorNode(node);
```