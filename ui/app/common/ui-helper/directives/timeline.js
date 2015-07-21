'use strict';

angular.module('bahmni.common.uiHelper')
    .directive('timeline', function () {
        var link = function ($scope, $element, $attrs) {
            var svg = d3.select('#'+ $attrs.id).append("svg").attr('width',100+'%' ).attr('height', 80);
            var elementDimensions = $element[0].getBoundingClientRect();
            var sortedDates = _.sortBy(_.pluck($scope.config.data, 'date'));
            var uniqueStates = _.uniq(_.pluck($scope.config.data, 'state'));
            var xMin = 25, xMax = elementDimensions.width-35;

            var timeScale = d3.time.scale()
                .domain([sortedDates[0], new Date()])
                .range([xMin,xMax]);

            var timeAxis = d3.svg.axis()
                .orient("bottom")
                .scale(timeScale)
                .tickFormat(d3.time.format("%_d %b%y"))
                .tickValues(sortedDates)
                .tickPadding(10);

            svg.append("g")
                .attr("class", "xaxis")
                .attr("transform", "translate(0.50,35)")
                .call(timeAxis)
                .selectAll("line")
                    .attr("y2", 14)
                    .attr("x2", 0)

            var colors = d3.scale.category10();

            var states = svg.selectAll('.states').data($scope.config.data);
            var stateGroup = states.enter().append("g").classed('states',true);
            stateGroup.append("rect");
            stateGroup.append("text");
            states.on("click", function(d) {
                alert(d.state);
            });
            states.select("rect")
                .attr('x', function(d) { return timeScale(d.date); })
                .attr('y', 9)
                .attr('height', 26)
                .attr('width', function(d) {
                    var number = xMax - timeScale(d.date);
                    console.log(number);
                    return  number})
                .attr('text', 'J')
                .style('fill', function(d) {return colors(_.indexOf(uniqueStates, d.state))});
            states.select("text")
                .attr('x', function(d) { return timeScale(d.date) + 10; })
                .attr('y', 27)
                .style('fill', '#FFFFFF')
                .text(function(d) { return d.state; });



            
            //Draw completed state
            if(!$scope.config.completed) {
                svg.append("polygon")
                    .attr("points", (xMax + "," + 9 + " " + (xMax+13) + "," + 22 + " " + xMax + "," + 35))
                    .attr("fill", colors(_.indexOf(uniqueStates, _.last($scope.config.data).state)));
            }


//            //Draw Legend
//            var legendContainer = d3.select('#'+ $attrs.id).append("div").classed("legend", true);
//            var legendItems = legendContainer.selectAll(".item").data(uniqueStates);
//            legendItems.enter().append("div").classed("item",true);
//            legendItems.style("background-color", function(d,i) { return colors(i)})
//                .text(function(d) { return d});
        };
        return {
            restrict: 'E',
            link: link,
            scope: {
                config: "="
            }
        };
    });
