import React from 'react';
import "./css/Grafica1.css"
import * as d3 from 'd3';
import dataFile from '../../data/muestra100'

class Grafica1 extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.drawChart();
    }

    drawChart = () => {

        let node = this.node;
        function draw() {
            var margin = {top: 20, right: 20, bottom: 30, left: 100},
                width = 800 - margin.left - margin.right,
                height = 350 - margin.top - margin.bottom;

            var div = d3.select(node).append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            var x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);

            var y = d3.scaleLinear()
                .range([height, 0]);

            var svg = d3.select(node).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            dataFile.forEach(function (data) {
                data.valorContrato = data.records[0].releases[0].contracts[0].valueWithTax.amount;
                data.noContrato = data.records[0].compiledRelease.contracts[0].id;
            });

            x.domain(
                dataFile.map(function (d) {
                        return d.noContrato;
                    }
                )
            );
            y.domain([0, d3.max(dataFile, function (d) {
                return d.valorContrato;
            })]);
            svg.selectAll("dot")
                .data(dataFile)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 3)
                .attr("cx", function(d) { return x(d.noContrato); })
                .attr("cy", function(d) { return y(d.valorContrato); })
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html("Contrato: "+d.noContrato +"<br/>"
                        +"Monto: "+ d.valorContrato)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

           // add the x Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // add the y Axis
            svg.append("g")
                .call(d3.axisLeft(y));

        }
        //window.addEventListener('resize', draw);
        draw();
    }

    render() {
        return (
            <div ref={node=> this.node=node}>
            </div>

        );
    }
}

export default Grafica1;