// angular.module('d3directives', ['d3'])
//   .directive('d3-visualization', ['$window', 'd3Factory', function($window, d3Factory) {
//     return {
//       restrict: 'EA',
//       scope: {},

//       link: function(scope, element, attrs) {
//         d3Factory.d3().then(function(d3) {
//           let margin = parseInt(attrs.margin) || 20,
//               barHeight = parseInt(attrs.barHeight) || 20,
//               barPadding = parseInt(attrs.barPadding) || 5;

//           let svg = d3.select(ele[0])
//             .append('svg')
//             .style('width', '100%');

//             window.onresize = () => {
//               scope.$apply();
//             };

//             scope.data = [{name: 'Pizza Hospital', blood: {opos: 15, oneg: 5, apos: 18, aneg: 8, bpos:17, bneg: 7, abpos: 16, abneg: 6}}];

//             scope.$watch(function() {
//               return angular.element($window)[0].innerWidth;
//             }, function() { 
//               scope.render(scope.data);
//             });

//           scope.render = (data) => {
//             svg.selectAll('*').remove();

//             if(!data) return;

//             let width = d3.select(ele[0]).node().offsetWidth - margin,
//                 height = scope.data.length * (barHeight + barPadding),
//                 color = d3.scale.category20(),
//                 xScale = d3.scale.linear()
//                   .domain([0, d3.max(data, function(d) {
//                     return d.score;
//                   })])
//                   .range([0, width]);

//             svg.attr('height', height);

//             svg.selectAll('rect')
//               .data(data)
//               .enter()
//                 .append('rect')
//                 .attr('height', barHeight)
//                 .attr('width', 140)
//                 .attr('x', Math.round(margin/2))
//                 .attr('y', function(d, i) {
//                   return i * (barHeight + barPadding);
//                 })
//                 .attr('fill', function(d) { return color(d.blood.opos); })
//                 .transition()
//                   .duration(1000)
//                   .attr('width', function(d) {
//                     return xScale(d.score);
//                   });
//           }
//         })
//       }
//     }
//   }
// ]);