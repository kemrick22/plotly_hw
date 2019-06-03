function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  const metaRoute = "/metadata/" + sample;

  d3.json(metaRoute).then(function (response) {
    var age = response.AGE;
    var bbtype = response.BBTYPE;
    var ethnicity = response.ETHNICITY;
    var gender = response.GENDER;
    var location = response.LOCATION;
    var wfreq = response.WFREQ;
      
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.selectAll('.metadata').remove()
    d3.select('#sample-metadata').append("p").classed("metadata", true).text("Age: "+ age)
    d3.select('#sample-metadata').append("p").classed("metadata", true).text("BB Type: "+ bbtype)
    d3.select('#sample-metadata').append("p").classed("metadata", true).text("Ethnicity: "+ ethnicity)
    d3.select('#sample-metadata').append("p").classed("metadata", true).text("Gender: "+ gender)
    d3.select('#sample-metadata').append("p").classed("metadata", true).text("Location: "+ location)
    d3.select('#sample-metadata').append("p").classed("metadata", true).text("WFREQ: "+ wfreq)
    d3.select('#sample-metadata').append("p").classed("metadata", true).text("Sample: "+ sample)
;})
 }

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  const dataRoute = "/samples/" + sample;
  
  d3.json(dataRoute).then(function (response) {
    var otu_ids = response.otu_ids;
    var otu_labels = response.otu_labels;
    var sample_values = response.sample_values;


    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x:otu_ids,
      y:sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
      }
    };
    var data = [trace1];
    Plotly.newPlot('bubble', data);

    // @TODO: Build a Pie Chart
    var trace2 = {
      values:sample_values.slice(0,10),
      labels:otu_ids.slice(0,10),
      text: otu_labels.slice(0,10),
      type: 'pie'
    };
    var data = [trace2];
    Plotly.newPlot('pie', data);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  })}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
