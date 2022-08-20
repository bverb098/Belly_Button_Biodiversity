var dataPath = "../../samples.json"
d3.json(dataPath).then((samples) => {
   console.log(samples) 

   // Populate dropdown menu with subject id
   var subjectDropdown = d3.select("#selSubject")
   samples.names.forEach(name => {
      var subjectOption = subjectDropdown.append("option").text(name)
   });

   // Update dashboard when id is selected from dropdown menu
   subjectDropdown.on("change",updateDash)
   // Set varible for bar chart filter
   var otuFilter = d3.select("#filterBar")
   // otuFilter.on("change",buildChart)
   // Function to update dashboard based on dropdown selection
   function updateDash() {
      //variable of test subject id
      var currentSubject = parseInt(subjectDropdown.property("value"))
      //updating card with demophraphic info
      var infoCard = d3.select("#demInfo")
      infoCard.selectAll("li").remove()
      var metaData = samples.metadata
      var subjectInfo = metaData.filter(sample=> {
         return  sample.id === currentSubject
      });
      console.log("Subject Info: ", subjectInfo)
      Object.entries(subjectInfo[0]).forEach(([key,value]) => {
         var itemText = `${key}: ${value}`
         var listItem = infoCard.select("ul").append("li").text(itemText) 
      });
      //create bar chart
      var barChart = d3.select("#barChart")
      var subjectSamples = samples.samples
      console.log("subject samples: ", subjectSamples)
      var currentSubjectSample = subjectSamples.filter(sample => {
         return sample.id == currentSubject
      });
      currentSubjectSample = currentSubjectSample[0]
      console.log("Current Subject Sample: ", currentSubjectSample)
      // var otuFilterValue = parseInt(otuFilter.property("value"));
      // var sliceFilter = otuFilterValue - 1
      var xValues = currentSubjectSample.sample_values.slice(0,9).reverse()
      var yValues = currentSubjectSample.otu_ids.slice(0,9).map(id => {
         return String(`OTU ${id}`)
      }).reverse();
      var hoverText = currentSubjectSample.otu_labels.slice(0,9).reverse()
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
         title: `OTUs present in test subject ${currentSubject}`
      };             

      var traceData=[trace1]

      Plotly.newPlot("barChart",traceData,layout)
   };
});
