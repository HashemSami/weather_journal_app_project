/* Global Variables */
const state = {
  apiKey: "b7565bd085b41c485453b2fffedceb58",
  apiCall: (key, zip, country) => fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},${country}&units=metric&appid=${key}`),
  generateDate: () => {
    let d = new Date();
    return d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
  }
};

// add the click event
addEvent = () => {
  const button = document.querySelector("#generate");

  button.addEventListener("click", () => sendData());
};

// this function will get data from :
// user input, server data, weather API data
// then update the UI
const sendData = async () => {
  try {
    const [zip, country, feelings] = getUserInput();
    const weatherData = await fetchWeatherData(zip, country);

    if (weatherData.cod && (weatherData.cod == "400" || weatherData.cod == "404")) {
      alert(weatherData.message + "... Please make sure to type the correct Zipcode and Country code");
    } else {
      const date = state.generateDate();
      const temp = weatherData.main.temp;

      await addDataToServer(temp, date, feelings);

      await updateUI();
    }
  } catch (e) {
    console.log(e.message);
  }
};

const getUserInput = () => {
  const zipcode = document.querySelector("#zip").value;
  const countryCode = document.querySelector("#country").value;
  const feelings = document.querySelector("#feelings").value;

  return [zipcode, countryCode, feelings];
};

const fetchWeatherData = async (zip, country) => {
  try {
    const res = await state.apiCall(state.apiKey, zip, country);
    const data = await res.json();
    return data;
  } catch (e) {
    alert(e);
  }
};

const fetchServerData = async () => {
  try {
    const res = await fetch("/get-server-data");
    const data = await res.json();
    return data;
  } catch (e) {
    alert(e);
  }
};

const addDataToServer = async (temp, date, feelings) => {
  try {
    return await fetch("/add-user-data", {
      method: "POST",
      body: JSON.stringify({
        temp,
        date,
        feelings
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  } catch (e) {
    alert(e);
  }
};

const updateUI = async () => {
  const serverData = await fetchServerData();
  const { temp, date, feelings } = serverData;

  const dateElement = document.querySelector("#date");
  const tempElement = document.querySelector("#temp");
  const contentElement = document.querySelector("#content");

  dateElement.innerHTML = `Date is: ${date}`;
  tempElement.innerHTML = `Temperature is: ${temp} &#8451;`;
  contentElement.innerHTML = `your feeling: ${feelings ? feelings : "You didn't want to tell us about your feelings..."}`;
};

addEvent();
