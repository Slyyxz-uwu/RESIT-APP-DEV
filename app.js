/*/ Created by: Kinga Kloskowska
2209820
/*/

var markerCollection = new Map()

//This is where the map can be found
const mapNav = document.getElementById('map-nav');
const mapPage = document.getElementById('map-page');
mapNav.root = mapPage;

//Setting up of the map 
const myMap = document.getElementById("map");
var map = L.map('map');

//Configuring the specific view of the map
map.setView([20,  -50], 2);

var cities2 = L.layerGroup([])
var overlayMaps = {
    ".": cities2
};

var layerControl = L.control.layers(overlayMaps).addTo(map);

//Opening street map 
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    //Opening street map copyright
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Resizing map to counter ionic-leaflet issue
const resize = new ResizeObserver(() => {
    map.invalidateSize();
}, 12);
resize.observe(myMap);

//Fetching the data from NASA API
async function apiResponse(){

    url = "https://eonet.gsfc.nasa.gov/api/v3/events?limit=20"
    
    const response = await fetch(url)
    const json = await response.json();
    createMarker(json);
    //console.log(json["events"][0])
    }
    //This function also fetches data with the difference of user input retrevied
    async function fetchData(userInputvalue){

        url = "https://eonet.gsfc.nasa.gov/api/v3/events?category="+userInputvalue
        
        const response = await fetch(url)
        const json = await response.json();
        createMarker(json);
        //console.log(json["events"][0])
        }

    //Here the gathered API data is being used to create markers visible on the map
    function createMarker(jsonObj){
        //element.setAttribute("class", "democlass");
        let charObjArray = jsonObj; 

        testing = [];
        for(a = 1; a <= 20; a++){
            //console.log(markerCollection)
            testingVariable = charObjArray.events[a].geometry[0].coordinates
            //console.log(testingVariable[0]+" "+testingVariable[1])
            var marker = L.marker([testingVariable[1],testingVariable[0]]).addTo(map);
            testing.push(marker)
            markerCollection.set(a, [testingVariable[1],testingVariable[0], document.getElementById("user-input").value])
            //markerCollection[markerCollection.length] = [testingVariable[1],testingVariable[0], "lakeParameter"]
            
        } 
        // Here I simply added the layer control to be able to hide and show markers at different times as per user request
        var cities = L.layerGroup(testing)
        cities.addTo(map);
        layerControl.addOverlay(cities, document.getElementById("user-input").value);


    }

    //Gathering user input from landing page and uses it to fetch specific keyword data from fetchData() function above 
    function searchButton(){

    var userInput = document.getElementById("user-input").value

    //console.log(userInput)
     url = "https://eonet.gsfc.nasa.gov/api/v3/events?limit=5&category="+userInput

    if (userInput == "seaLakeIce" || userInput == "severeStorms" ||  
        userInput == "volcanoes" || userInput == "wildfires") {
        //console.log("defined")
        fetchData(userInput)
        
    }

    else {
        apiResponse()
        //console.log("undefined")
    }
}


//Save input and output from the user through local storage and view in the settings tab
const saveTextLocal = document.getElementById('save-button');
const storageInput = document.getElementById('user-input');
const textOutput = document.getElementById('search-output');
const getTextLocal = document.getElementById('save-button');

const storedLocalInput = localStorage.getItem('user-input');
saveTextLocal.addEventListener('click', saveToLocalStorage);
getTextLocal.addEventListener('click', getLocalStorage);

//This function retrieves user input data from the landing page and stores it locally 
function saveToLocalStorage(){
    localStorage.setItem('user-input', storageInput.value);
    console.log("Saved to Local text");
}
//As the button gets pressed and the local data is saved, this function showcases the exact phrase that was saved below
function getLocalStorage(){
    const localData = localStorage.getItem('user-input');
    const displaySearch = document.getElementById("search-output");
    displaySearch.innerText =  "Your most recent search:\xa0" + storedLocalInput;
}