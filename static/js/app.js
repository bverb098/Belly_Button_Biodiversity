const dataPath = "../../samples.json";

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
}

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
         // color: xValues
      }
   };
   var layout = {
      title: `OTUs present in test subject ${currentSubjectId}`
   };             

   var traceData=[trace1]

   Plotly.newPlot("bubbleChart",traceData,layout)
};

function updateGuage (demographicInfo,subjectDropdown) {
   var currentSubjectId = subjectDropdown.property("value")
   var subjectInfo = demographicInfo.filter(sample=> {
      return  sample.id == currentSubjectId
   });
   var guageValue = subjectInfo[0].wfreq
   console.log("wash frequency: ", guageValue)

   var trace1 = {
      type: "indicator",
      mode:"guage+number",
      value: guageValue,
      title: {
         align: "center",
         text: "Belly Button Washing Frequency"
      },
      guage: {
         axis: {range:[null,9], tickwidth:1},
         bar: { color: "darkblue" },
         shape: "angular",
         steps: [
            {range: [1-2], color:"rgb(250, 250, 110)"},
            {range: [2-3], color:"rgb(181, 232, 119)"},
            {range: [3-4], color:"rgb(119, 209, 131)"},
            {range: [4-5], color:"rgb(63, 183, 141)"},
            {range: [5-6], color:"rgb(0, 156, 143)"},
            {range: [6-7], color:"rgb(0, 127, 134)"},
            {range: [7-8], color:"rgb(28, 99, 115)"},
            {range: [8-9], color:"rgb(42, 72, 88)"}
   
         ]
      },
   }

   var layout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
    };

   guageData=[trace1]

   Plotly.newPlot("washGuage",guageData,layout)

};

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
