<template>
  <div id="canvas_container">
    <a class="button is-primary" v-on:click="highlightOne"> highlight </a>
    <a class="button is-primary" v-on:click="stopHighlight"> stop highlight </a>
    <div id="tooltip" :style="{'opacity':tooltip.opacity, 'left':tooltip.left, 'top':tooltip.top}" v-if="tooltip.element"> 
      Aeropuerto: {{tooltip.element.nombre}}<br/>
      País: {{tooltip.element.pais}}<br/>
      Distancia: {{tooltip.element.distance}}<br/> km
      vuelos contabilizados: {{tooltip.element.count}}<br/>
      Total de kilometros recorridos: {{tooltip.element.total_km}}<br/>
    </div>
  </div>


</template>

<script>
import * as d3 from "d3";
import * as d3zoom from "d3-zoom";
import * as d3brush from "d3-brush";
import { slugify } from "@/assets/libs/slugify.js";
// set the dimensions and margins of the graph
var margin = { top: 40, right: 150, bottom: 60, left: 30 },
  width = 900 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;
var z = d3
  .scaleSqrt()
  .domain([100, 15000])
  .range([1, 10]);

// Add a scale for bubble color
var myColor = d3
  .scaleOrdinal()
  .domain(["AS", "EU", "NA", "AF", "SA", "ES"])
  .range(d3.schemeTableau10);

// scales
var x = d3
  .scaleLinear()
  .domain([0, 340000])
  .range([0, width]);

/*var xScale={
  'total_km':x1,
  'kgFuelTotales':x2
}*/
var y = d3
  .scaleLinear()
  .domain([0, 180])
  .range([height, 0]);
  
let xAxis, yAxis=null
var dotcontainer
// Add brushing

var svg;
export default {
  props: {
    plotDataOriginal: {
      type: Array,
      default: []
    },
    mode: {
      type: String,
      default: "total_km"
    },
    highlightAirport: { // sync property
      type:String,
      default: ''
    }
  },
  watch: {
    plotDataOriginal(newValue, oldValue) {
      this.updatePlot();
    },
    mode(newValue, oldValue) {
      this.updatePlot();
    },
    highlightAirport(newValue,oldValue){
      console.log('detectado hightlihgt')
      if(newValue.length>0){
        this.highlightOne(newValue)        
        //this.$emit('update:highlightAirport','')
      }
      else{
        this.stopHighlight()
      }
    }
  },
  data() {
    return {
      tooltip:{
        left:0,
        opacity: 0,
        top:0,
        element:null
      }
    }
  },
  mounted() {
    window.d33=d3;
    this.initPlot();
  },
  methods: {
    initPlot() {
      // append the svg object to the body of the page
      
      svg = d3
        .select("#canvas_container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      var yAxis=svg.append("g").call(d3.axisLeft(y));

      // Add Y axis label:
      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -20)
        .text("Numero de vuelos")
        .attr("text-anchor", "start");

      // add the X gridlines
      svg
        .append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(
          make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        );

      // add the Y gridlines
      svg
        .append("g")
        .attr("class", "grid")
        .call(
          make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        );

      // gridlines in x axis function
      function make_x_gridlines() {
        return d3.axisBottom(x).ticks(19);
      }

      // gridlines in y axis function
      function make_y_gridlines() {
        return d3.axisLeft(y).ticks(10);
      }


      // ---------------------------//
      //       HIGHLIGHT GROUP      //
      // ---------------------------//

      // What to do when one group is hovered
      var highlight = function(d) {
        // reduce opacity of all groups
        d3.selectAll(".bubbles").style("opacity", 0.25);
        // expect the one that is hovered
        d3.selectAll("." + d).style("opacity", 1);
      };

      // And when it is not hovered anymore
      var noHighlight = function(d) {
        d3.selectAll(".bubbles").style("opacity", 1);
      };

      // Add legend: circles
      var valuesToShow = [1000, 5000, 10000];
      var xCircle = width + 50;
      var xLabel = width + 5;
      
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d, i) {
          return height - 100 - z(d) - i * 20;
        })
        .attr("r", function(d) {
          return z(d);
        })
        .style("fill", "none")
        .attr("stroke", "black");

      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr("x1", function(d) {
          return xCircle + z(d);
        })
        .attr("x2", xLabel)
        .attr("y1", function(d, i) {
          return height - 100 - z(d) - i * 20;
        })
        .attr("y2", function(d, i) {
          return height - 100 - z(d) - i * 20;
        })
        .attr("stroke", "black")
        .style("stroke-dasharray", "2,2");

      // Add legend: labels
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr("x", xLabel)
        .attr("y", function(d, i) {
          return height - 100 - z(d) - i * 20 - 5;
        })
        .text(function(d) {
          return d;
        })
        .style("font-size", 10)
        .attr("alignment-baseline", "middle");

      // Legend title
      svg
        .append("text")
        .attr("x", xCircle)
        .attr("y", height - 100 + 30)
        .text("distancia")
        .attr("text-anchor", "middle");

      // Add one dot in the legend for each name.
      var size = 20;
      var allgroups = ["AS", "EU", "NA", "AF", "SA", "ES"];


      svg
        .selectAll("myrect")
        .data(allgroups)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d, i) {
          return 10 + i * (size + 5);
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d) {
          return myColor(d);
        })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);

///// ZOOM & BRUSH BLOCK
      var brush = d3brush.brush() // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChartBrush.bind(this)) 
      
      svg.append("g")
      .attr("class", "brush")
      .call(brush);
      var idleTimeout
      function idled() { idleTimeout = null; }

      function updateChartBrush() {
        let extent = d3.event.selection
        console.log(extent)
        // If no selection, back to initial coordinate. Otherwise, update X Y axis domain
        if(!extent){
          if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
          x.domain([0, d3.max(this.plotDataOriginal, d => d[this.mode])]);
          y.domain([0, 180])
        }else{
          x.domain([ x.invert(extent[0][0]), x.invert(extent[1][0]) ])
          y.domain([ y.invert(extent[1][1]), y.invert(extent[0][1]) ])
          svg.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }
         // Update axis and circle position
        xAxis.transition().duration(1000).call(d3.axisBottom(x))
        yAxis.transition().duration(1000).call(d3.axisLeft(y))
        svg
          .selectAll("circle.bubbles")
          .transition().duration(1000)
          .attr("cx",  (d)=> { return x(d[this.mode]) } )
          .attr("cy",  (d)=>{ return  y(d.count) } )
      }

// END OF ZOOM&BRUSH

    ///////////////////////ñññññññññññññññññññññññññññññ
      // Add labels beside legend dots
      svg
        .selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
        .attr("x", xCircle + size * 0.8)
        .attr("y", function(d, i) {
          return i * (size + 5) + size / 2;
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d) {
          return myColor(d);
        })
        .text(function(d) {
          return d;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);
      dotcontainer=svg
        .append("g")
    }, // fin init plot

    /**********UPDATE ***********************************/
    updatePlot() {
      console.log("updatePlot");   

      d3.selectAll('.xaxis').remove()

      x.domain([0, d3.max(this.plotDataOriginal, d => d[this.mode])]);
      console.log(d3.max(this.plotDataOriginal, d => d[this.mode]))
      xAxis=svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .classed('xaxis',true)
        .call(d3.axisBottom(x).ticks(19));

      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 50)
        .text(this.mode)
        .classed('xaxis',true)      
         
      // ---------------------------//
      //       CIRCLES              //
      // ---------------------------//
      // Add dots
      
        let updateSection= dotcontainer.selectAll(".bubbles")
        .data(this.plotDataOriginal,d => d['iata'])

        let enterSection= updateSection.enter()
        .append("circle")
        .attr("class", function(d) {
          return "bubbles " + d.continente + " " + d.nombre_slug;
        })
        .attr("r", function(d) {
          return z(d.distance);
        })
        .style("fill", function(d) {
          return myColor(d.continente);
        })        // -3- Trigger the functions for hover
        .on("mouseover", this.tshowTooltip)
        .on("mousemove", this.moveTooltip)
        .on("mouseleave", this.hideTooltip)
        
        updateSection.merge(enterSection)
        .transition().duration(1000).attr("cx", (d)=> {
          return x(d[this.mode]);
        })
        .attr("cy", function(d) {
          return y(d.count);
        })
      //.on("mouseover", highlightThis)
      //.on("mouseleave", noHighlightThis);

      // ---------------------------//
      //       LEGEND              //
      // ---------------------------//
    },

    highlightOne(name) {
      d3.selectAll(".bubbles").style("opacity", 0.25);
      // expect the one that is hovered
      console.log(name)
      d3.select(name)
        .style("opacity", 1)
        .classed("blink", true);
    },
    stopHighlight() {
      d3.selectAll(".bubbles").style("opacity", 1);
      // expect the one that is hovered
      d3.select(".blink")
        .style("opacity", 1)
        .classed("blink", false);
    },
    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    showTooltip (d) {
      this.tooltip.element=d
      this.tooltip.opacity=1
      this.tooltip.left=d3.event.x + 30 + "px"
      this.tooltip.top=d3.event.y + 30 + "px"
      d3.selectAll(".bubbles").style("opacity", 0.25);  
    },
    moveTooltip (d) {
      this.tooltip.element=d
      this.tooltip.opacity=1
      this.tooltip.left=d3.event.x + 30 + "px"
      this.tooltip.top=d3.event.y + 30 + "px"
    },
    hideTooltip (d) {
      this.tooltip.opacity=0
      d3.selectAll(".bubbles").style("opacity", 1);
    }
  } // method
};
</script>

<style>
#canvas_container {
  background: white;
}
.bubbles {
  stroke-width: 1px;
  stroke: rgba(0, 0, 0, 0.2);
  opacity: 1;
}
.bubbles:hover {
  stroke: black;
}
.tooltip {
  position: absolute;
  z-index: 1000;
  text-align: left;
  pointer-events: none;
}

.grid line {
  stroke: lightgrey;
  stroke-opacity: 0.7;
  shape-rendering: crispEdges;
}

@keyframes blink {
  100%,
  0% {
    opacity: 1;
    stroke: rgba(1, 0, 0, 0.5);
    r: unset;
  }
  20% {
    r: 20px;
  }
  60% {
    opacity: 0;
  }
}

.blink {
  animation: blink 1s infinite;
}
#tooltip{
  background-color:black;
  border-radius: 5px;
  background-color:black;
  padding:10px;
  color:white;
  opacity:0;
  transition: all 0.2s;
  position:fixed;
  z-index:10000;
  pointer-events: none;
}

</style>
