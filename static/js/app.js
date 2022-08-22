const dataPath = "../../data/samples.json";

//update demographic info card
function updateDemographicInfo(demographicInfo, subjectDropdown) {
   var currentSubjectId = subjectDropdown.property("value")
   console.log("current subject: ", currentSubjectId)
   var infoCard = d3.select("#demInfo")
   infoCard.selectAll("li").remove()    
   
   var subjectInfo = demographicInfo.filter(sample=> {
      return  sample.id == currentSubjectId
   });
   console.log("Subject Info: ", subjectInfo)
   Object.entries(subjectInfo[0]).forEach(([key,value]) => {
      var itemText = `${key}: ${value}`
      var listItem = infoCard.select("ul").append("li").text(itemText) 
   });
};

//update bar chart
function updateBarChart(chartData, subjectDropdown) {
   var currentSubjectId = subjectDropdown.property("value")
   var currentSubjectSample = chartData.filter(sample => {
      return sample.id == currentSubjectId
   });
   currentSubjectSample=currentSubjectSample[0]
   console.log("subjectId samples for chart: ", currentSubjectSample) 
   var xValues = currentSubjectSample.sample_values.slice(0,10).reverse()
   var yValues = currentSubjectSample.otu_ids.slice(0,10).map(id => {
      return String(`OTU ${id}`)
   }).reverse();
   var hoverText = currentSubjectSample.otu_labels.slice(0,10).reverse()
   console.log("x: ", xValues)
   console.log("y: ", yValues)
   console.log("hover: ", hoverText)

   var trace1 = {
      x: xValues,
      y: yValues,
      text: hoverText,
      type: 'bar',
      orientation: 'h'
   };
   var layout = {
      title: `OTUs present in test subject ${currentSubjectId}`
   };             

   var traceData=[trace1]

   Plotly.newPlot("barChart",traceData,layout)
};

// update bubble chart
function updateBubbleChart (chartData, subjectDropdown) {
   var currentSubjectId = subjectDropdown.property("value")
   var currentSubjectSample = chartData.filter(sample => {
      return sample.id == currentSubjectId
   });
   currentSubjectSample=currentSubjectSample[0]
   console.log("subjectId samples for chart: ", currentSubjectSample) 
   var xValues = currentSubjectSample.otu_ids
   var yValues = currentSubjectSample.sample_values
   var hoverText = currentSubjectSample.otu_labels

   var trace1 = {
      x: xValues,
      y: yValues,
      text: hoverText,
      mode: 'markers',
      marker: {
         size: yValues,
         color: xValues,
         colorscale: "YlGnBu"
      }
   };
   var layout = {
      title: `OTUs present in test subject ${currentSubjectId}`
   };             

   var traceData=[trace1]

   Plotly.newPlot("bubbleChart",traceData,layout)
};


// update gauge
function updateGuage (demographicInfo,subjectDropdown) {
   var currentSubjectId = subjectDropdown.property("value")
   var subjectInfo = demographicInfo.filter(sample=> {
      return  sample.id == currentSubjectId
   });
   var guageValue = subjectInfo[0].wfreq
   console.log("wash frequency: ", guageValue)

   var data = [
      {
      type: "indicator",
      mode: "gauge+number",
      value: guageValue,
      title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
      gauge: {
         axis: { range: [null, 9], showticklabels:true, nticks:10},
         bar: {thickness:0.5, color:"blue"},
         bgcolor: "white",
         borderwidth: 2,
         bordercolor: "gray",
         steps: [
            {range: [0,1], color:"rgb(249, 203, 203)",line:{width:1}},
            {range: [1,2], color:"rgb(255, 201, 190)",line:{width:1}},
            {range: [2,3], color:"rgb(255, 202, 175)",line:{width:1}},
            {range: [3,4], color:"rgb(255, 205, 158)",line:{width:1}},
            {range: [4,5], color:"rgb(253, 210, 143)",line:{width:1}},
            {range: [5,6], color:"rgb(238, 217, 131)",line:{width:1}},
            {range: [6,7], color:"rgb(216, 224, 125)",line:{width:1}},
            {range: [7,8], color:"rgb(186, 232, 128)",line:{width:1}},
            {range: [8,9], color:"rgb(147, 240, 140)",line:{width:1}}
         ],
      },
      }
   ];
 
 var layout = {
   // width: 400,
   // height: 300,
   paper_bgcolor: "white",
   font: { color: "black", family: "Arial" }
 };
 
 Plotly.newPlot('washGuage', data, layout);
};

// call fall the functions to create the dashboard
function initDash(subjectIds, demographicInfo, chartData, subjectDropdown) {

   // call the updateDemographicInfo function to create the demographic info card 
   updateDemographicInfo(demographicInfo, subjectDropdown)

   // create bar chart
   updateBarChart(chartData, subjectDropdown)

   // create bubble chart
   updateBubbleChart(chartData, subjectDropdown)

   // create guage
   updateGuage(demographicInfo, subjectDropdown)
};

// read the json, create the dropdown menu, set d3 events, call function to create dash
d3.json(dataPath).then((samples) => {
   //create variables containing data from json needed for different parts of the dash
   const subjectIds = samples.names
   const demographicInfo = samples.metadata
   const chartData = samples.samples

   console.log("whole json: ", samples) 
   console.log("metadata: ", demographicInfo)
   console.log("samples: ", chartData)

   // Populate dropdown menu with subject ids
   var subjectDropdown = d3.select("#selSubject")
   subjectIds.forEach(name => {
      var subjectOption = subjectDropdown.append("option").text(name)
   });

   
   // call the initDash function to create the dashboard when landing on the page
   initDash(subjectIds, demographicInfo, chartData, subjectDropdown)

   // Update dashboard when id is selected from dropdown menu
   subjectDropdown.on("change", function() {
      initDash(subjectIds, demographicInfo, chartData, subjectDropdown)
   });
});

