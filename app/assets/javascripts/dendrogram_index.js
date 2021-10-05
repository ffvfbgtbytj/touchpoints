// https://observablehq.com/@d3/radial-dendrogram@197
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["flare.json",new URL("/admin/websites/dendrogram_json",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));

  main.variable(observer("chart")).define("chart", ["tree","d3","data","autoBox"], function(tree,d3,data,autoBox)
{
  const root = tree(d3.hierarchy(data)
      .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

  const svg = d3.select("svg");

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
      .attr("d", d3.linkRadial()
          .angle(d => d.x)
          .radius(d => d.y));

  svg.append("g")
    .selectAll("circle")
    .data(root.descendants())
    .join("circle")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `)
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5);

  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("text")
    .data(root.descendants())
    .join("text")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
        rotate(${d.x >= Math.PI ? 180 : 0})
      `)
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .text(d => d.data.name)
    .clone(true).lower()
      .attr("stroke", "white");

  return svg.attr("viewBox", autoBox).node();
}
);
  main.variable().define("autoBox", function(){return(
function autoBox() {
  document.body.appendChild(this);
  const {x, y, width, height} = this.getBBox();
  document.body.removeChild(this);
  return [x, y, width, height];
}
)});
  main.variable().define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("flare.json").json()
)});
  main.variable().define("width", function(){return(
975
)});
  main.variable().define("radius", ["width"], function(width){return(
width / 2
)});
  main.variable().define("tree", ["d3","radius"], function(d3,radius){return(
d3.cluster().size([2 * Math.PI, radius - 100])
)});
  return main;
}
