/*
Colin Brown
CIS602
 */

d3.json('https://raw.githubusercontent.com/colinjbrown/cis602hw/master/data/nodes.json').then(function (data) {

    var width = 600;
    var height = 600;
    var active = false;
    var svg = d3.select('#graph').append('svg').attr('width', width).attr('height', height);

    function reset() {
        $('#affinity').text('');
        $('#affinity2').text('');
        $('#node1').text('');
        $('#node2').text('');
        d3.selectAll('circle')
            .attr('cx', function (d) {
            return Math.floor((Math.random() * 200) + width / 2)
            })
            .attr('cy', function (d) {
                return Math.floor((Math.random() * 200) + height / 2)
            });
        //Since this design relies on distances it's important to reset all nodes on a full reset
        svg2.selectAll('circle').classed('not-active', true).classed('active2', false).classed('lowaff', false).classed('highaff', false).classed('midaff', false);
    }

    //Interaction 1 Starts here
    var startx, starty, relation;

    function started(input) {
        active = input;
        svg.select('.active').classed('not-active', true).classed('active', false);
        svg.selectAll('circle').classed('lowaff', false).classed('highaff', false).classed('midaff', false);
        startx = d3.event.x;
        starty = d3.event.y;
        relation = data[input];
        d3.select(this).classed('not-active', false).classed('active', true);
        $('#node1').text(input);
        svg.selectAll('circle.not-active').attr('class', function (d) {
            var affinity = relation[parseInt(d[1])];
            if (affinity < .5) {
                return 'not-active lowaff';
            } else if (affinity == .5) {
                return 'not-active midaff';
            }
            return 'not-active highaff';
        });
    }

    function dragged(input) {
        d_x = startx - d3.event.x;
        d_y = starty - d3.event.y;

        startx = d3.event.x;
        starty = d3.event.y;

        d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y);

        svg.selectAll('circle.not-active')
            .attr('cx', function (d) {
                var affinity = relation[parseInt(d[1])];
                if (affinity < .5) {
                    affinity = -affinity;
                } else if (affinity == .5) {
                    affinity = 0;
                }
                var move = (affinity * d_x) + parseInt(d3.select(this).attr('cx'));
                if (move > width || move < 0) {
                    return move > width ? width : 0;
                }
                return move;
            }).attr('cy', function (d) {
            var affinity = relation[parseInt(d[1])];
            if (affinity > .5) {
                affinity = -affinity;
            } else if (affinity == .5) {
                affinity = 0;
            }
            var move = (affinity * d_y) + parseInt(d3.select(this).attr('cy'));
            if (move > height || move < 0) {
                return move > height ? height : 0;
            }
            return move;
        });
    }

    function enddrag(input) {
        d3.select(this).classed('not-active', true).classed('active', false);
    }

    var circles = svg.selectAll('circle')
        .data(Object.keys(data))
        .enter()
        .append("circle")
        .attr('id', function (d) {
            return d;
        })
        .classed('not-active', true)
        .attr('cx', function (d) {
            return Math.floor((Math.random() * 200) + width / 2)
        })
        .attr('cy', function (d) {
            return Math.floor((Math.random() * 200) + height / 2)
        })
        .attr('r', 5)
        .call(d3.drag().on("start", started).on("drag", dragged))
        .on('mouseover', function (d) {
            if (active && d != active) {
                d3.select(this).style('fill', 'green');
                $('#affinity').text(relation[parseInt(d[1])]);
            }
        }).on('mouseout', function (d) {
            d3.select(this).style('fill', null);
        });

    $(function () {
        $("button").button();
        $("button, input, a").click(reset);
    });

    //Interaction 2 starts here
    var svg2 = d3.select('#graph').append('svg').attr('width', width).attr('height', height);

    var clicked = false;
    var relation2;
    var active2;
    var scaling_factor = .6;

    var circles2 = svg2.selectAll('circle')
        .data(Object.keys(data))
        .enter()
        .append("circle")
        .attr('id', function (d) {
            return d;
        })
        .classed('not-active', true)
        .attr('cx', function (d) {
            return Math.floor((Math.random() * 200) + width / 2)
        })
        .attr('cy', function (d) {
            return Math.floor((Math.random() * 200) + height / 2)
        })
        .attr('r', 5)
        .on('click', function (d) {

            svg2.selectAll('circle').classed('lowaff', false).classed('highaff', false).classed('midaff', false);
            d3.select('.active2').classed('active2', false).classed('not-active', true);

            if (!clicked || d != active2) {


                $('#node2').text(d);
                d3.select(this).classed('active2', true).classed('not-active', false).transition().duration(1000).attr('cx', width / 2).attr('cy', height / 2);
                relation2 = data[d];

                svg2.selectAll('circle.not-active').attr('class', function (d) {
                    var affinity = relation2[parseInt(d[1])];
                    if (affinity < .5) {
                        return 'not-active lowaff';
                    } else if (affinity == .5) {
                        return 'not-active midaff';
                    }
                    return 'not-active highaff';
                });


                x = parseInt(d3.select(this).attr('cx'));
                y = parseInt(d3.select(this).attr('cy'));

                //Generate random angles from 0 to 2 pi
                angles = Array.from({length: 10}, () => Math.random() * 2 * Math.PI);

                svg2.selectAll('circle.not-active').transition().duration(1000).attr('cx', function (d) {
                    var idx = parseInt(d[1]);
                    return x + (scaling_factor * (Math.cos(angles[idx]) * (width / 2) * (1 - relation2[idx])));
                }).attr('cy', function (d) {
                    var idx = parseInt(d[1]);
                    return y + (scaling_factor * (Math.sin(angles[idx]) * (height / 2) * (1 - relation2[idx])));
                });

                clicked = true;
                active2 = d;
            } else {
                clicked = false;
                active2 = null;
                reset();
            }

        }).on('mouseover', function (d) {
            if (clicked && !d3.select(this).classed('active2')) {
                d3.select(this).style('fill', 'green');
                $('#affinity2').text(relation2[parseInt(d[1])]);
            }
        }).on('mouseout', function (d) {
            d3.select(this).style('fill', null);
        });
    ;
});

