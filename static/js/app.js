//initial import
//use .json function to load in. It must have a function. 
d3.json("samples.json").then(function(data){ 

    //set loaded data to a variable
    var json = data;
    //spit into other variables
    var names = json.names;

    //can setup the dropdown here by using an arrow function
    names.forEach((n) => {
        d3.select("#selDataset").append("option").text(n); //works but throws a optionChanged is not defined error
    
    });

//home page 
function init() {
    var datasetDefault = json.samples.filter(sample => sample.id === "940")[0];

    //get a sample of top values
    var sample_values = datasetDefault.sample_values.slice(0,10).reverse();
    var ids = datasetDefault.otu_ids.slice(0,10).reverse();
    var labels = datasetDefault.otu_labels.slice(0,10).reverse();

    //bar chart
    var trace1 = {
        x: sample_values,
        y: ids.map(ids => `OTU ${ids}`),
        text: labels,
        type: "bar",
        orientation: "h"
    };

    var layout1 = {
        title: "Top OTUs found in Test Subject",
        xaxis: {title: "Sample Values"},
        yaxis: {title: "IDS"}
        //autosize: true
    };

    Plotly.newPlot("bar", [trace1], layout1);

    //bubble chart
    var trace2 = {
        x: ids,
        y: sample_values,
        text: labels,
        mode: 'markers',
        marker: {
            color: ids,
            size: sample_values
        }
    }

    var layout2 = {
        title: "Sample values of all OTU IDS of Test Subject",
        xaxis: { title: "OTU ID"},
        yaxis: { title: "Sample Values"},
    };

    Plotly.newPlot('bubble', [trace2], layout2);

    //fill out demographic information
    var demoInfo = json.metadata[0];
    Object.entries(demoInfo).forEach(
        ([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));
        
        
    //bonus: gauge 
    var defaultWash = json.metadata[0].wfreq;
    var gaugeInfo = [
        {
            value: defaultWash,
            title: {text: "<b>Wash Frequency per week</b>"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue"},
                bar: {color: "#fb4a83"},
                steps: [
                    { range: [0, 1], color: "fff5f0"},
                    { range: [1, 2], color: "#fee0d2"},
                    { range: [2, 3], color: "#fcbba1"},
                    { range: [3, 4], color: "#fc9272"},
                    { range: [4, 5], color: "#fb6a4a"},
                    { range: [5, 6], color: "#ef3b2c"},
                    { range: [6, 7], color: "#cb181d"},
                    { range: [7, 8], color: "#a50f15"},
                    { range: [8, 9], color: "#67000d"},
                ],
            }
        }
    ];
    Plotly.newPlot("gauge", gaugeInfo)
    //#fff5f0 #fee0d2 #fcbba1 #fc9272 #fb6a4a #ef3b2c #cb181d #a50f15 #67000d


//end of set up
}
//load up home paged
init();

//set up the change by selecting the dataset and passing in the changing plot function
d3.selectAll("#selDataset").on("change", newPlots);

//overarching function to restyle plots 
function newPlots() {

    //select dropdown
    var newDataset = d3.select("#selDataset");
    //get new user value
    var newValue = newDataset.property("value");

    //pass new value to search for the corresponding dataset
    var newInfo = json.samples.filter(sample => sample.id === newValue)[0];
    var newDemo = json.metadata.filter(sample => sample.id == newValue)[0];
    var newSampleValues = newInfo.sample_values.slice(0,10).reverse();
    var newIDs = newInfo.otu_ids.slice(0,10).reverse();
    //needed to change the ids into the desired y axis labels 
    var mappedIDS = newIDs.map(newIDs => `OTU ${newIDs}`)
    var newLabels = newInfo.otu_labels.slice(0,10).reverse();
    var newWash = newDemo.wfreq;

    //bonus: update gauge 
    Plotly.restyle("gauge", "value", [newWash]);

    console.log(newWash)
    //ids.map(ids => `OTU ${ids}`)
    //restyles
    Plotly.restyle("bar","x", [newSampleValues]);
    Plotly.restyle("bar", "y", [mappedIDS]);
    Plotly.restyle("bar", "text", [newLabels]);

    Plotly.restyle("bubble", "x", [newIDs]);
    Plotly.restyle("bubble", "y", [newSampleValues]);
    Plotly.restyle("bubble", "text", [newLabels]);
    Plotly.restyle("bubble", "marker.color", [newIDs]);
    Plotly.restyle("bubble", "marker.size", [newSampleValues]);

    //make sure everything is executed before this; otherwise it will not be recognized
    //reset demo panel
    d3.select("#sample-metadata").html("");
    //refill
    Object.entries(newDemo).forEach(
        ([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));      
    };

    

//connected to the initial load. keep everything inside this so that it will recognize the load    
});



