// Dropdown List
function optionChanged() {
  d3.json("samples.json").then(function (data) {

    // Select all names
    var name_list = data.names;
    var selected = d3.selectAll("#selDataset");

    // Populate drop down menu
    name_list.forEach(value => {
      selected.append("option")
        .text(value)
        .attr("value", function () {
          return value;
        });
    });
  });

  // Save variable
  var chosen = d3.select("#selDataset").node().value;

  // Call function to automatically create graphs when option is selected
  create_graphs(chosen);

}

// Call the optionChanged function
optionChanged();



function create_graphs(chosen) {

  d3.json("samples.json").then(function (data) {
    var samples = data.samples;
    var metadata = data.metadata;

    // Data for the demographic information
    metadata.forEach(function (row) {
      if (row.id == parseInt(chosen)) {
        d3.select("#sample-metadata").html("");
        var subject_info = Object.entries(row)
        subject_info.forEach((row) => {
          d3.selectAll("#sample-metadata")
            .append("div")
            .data(row)
            .text(`- ${row[0]}: ${row[1]}`)
        });
      }
    });

    // Bar plot for top 10 OTUs found in the individual
    samples.forEach(function (sample_row) {
      if (sample_row.id === chosen) {

        var otu_ids = sample_row.otu_ids;
        var otu_labels = sample_row.otu_labels;
        var sample_values = sample_row.sample_values;

        var trace1 = [{
          x: sample_values.slice(0, 10),
          y: otu_ids.map(id => String(`OTU ${id}`)),
          type: "bar",
          orientation: "h",
          text: otu_labels,
          transforms: [{
            type: 'sort',
            target: 'y',
            order: 'descending'
          }],
        }];

        var layout1 = {
          title: `Results for Test Subject No. ${chosen}`,
          yaxis: { autorange: true },
          xaxis: { autorange: true }
        };

        Plotly.newPlot("bar", trace1, layout1);


        // Bubble chart for each sample

        var trace2 = [{
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          type: "scatter",
          mode: 'markers',
          marker: {
            size: sample_values,
            color: otu_ids
          },
          transforms: [{
            type: 'sort',
            target: 'y',
            order: 'descending'
          }],
        }];

        var layout2 = {
          yaxis: {
            autorange: true,
          },
          xaxis: {
            title: `OTU ID`,
            autorange: true,
          },
        };

        Plotly.newPlot("bubble", trace2, layout2);

      }
    });
  });
};