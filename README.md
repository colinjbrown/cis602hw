This just provides a couple of visual interactions on a group of 10 nodes using similarity metrics.

Interaction set #1 provides movement based interaction with groups of nodes where groups of nodes will form groups based on their similarities to each other by moving in certain directions based on how similar they are to the selected node.

The second interaction set just forms groupings based on radial distance from a point, a random angle is generated and x and y values are calculated based on this and then multiplied by a factor based on the similarity between the points.

To create a new set of data `python create_data.py` can be used.
