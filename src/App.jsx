import { useState } from 'react'
import './App.css'
import APIForm from './Components/APIForm'
import Gallery from './Components/Gallery'

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  });

  const [currentImage, setCurrentImage] = useState("");
  const [prevImages, setPrevImages] = useState([]);

  // Assembles the query string from the (possibly defaulted) inputs and fires the API call.
  const makeQuery = (queryInputs) => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let url_starter = "https://";
    let fullURL = url_starter + queryInputs.url;

    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${queryInputs.format}&width=${queryInputs.width}&height=${queryInputs.height}&no_cookie_banners=${queryInputs.no_cookie_banners}&no_ads=${queryInputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;

    callAPI(query).catch(console.error);
  };

  // Makes the async fetch call and stores the resulting screenshot.
  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    console.log(json);

    if (!json.url) {
      alert(
        "Sorry, we couldn't take a screenshot of that site. Double-check your URL (no https:// needed) and your other inputs, then try again."
      );
    } else {
      setCurrentImage(json.url);
      setPrevImages((images) => [...images, json.url]);
      reset();
    }
  };

  // Clears the form inputs after a successful query.
  const reset = () => {
    setInputs({
      url: "",
      format: "",
      no_ads: "",
      no_cookie_banners: "",
      width: "",
      height: "",
    });
  };

  const submitForm = () => {
    let defaultValues = {
      format: "jpeg",
      no_ads: "true",
      no_cookie_banners: "true",
      width: "1920",
      height: "1080",
    };

    if (inputs.url === "") {
      alert("Please enter a URL before taking your screenshot!");
    } else {
      const updatedInputs = { ...inputs };
      for (const [key, value] of Object.entries(inputs)) {
        if (value == "") {
          updatedInputs[key] = defaultValues[key];
        }
      }
      setInputs(updatedInputs);
      makeQuery(updatedInputs);
    }
  };

  return (
    <div className="whole-page">
      <h1>Build Your Own Screenshot! 📸</h1>

      <APIForm
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}
      />
      <br></br>

      {currentImage ? (
        <img
          className="screenshot"
          src={currentImage}
          alt="Screenshot returned"
        />
      ) : (
        <div> </div>
      )}

      <div className="container">
        <h3> Current Query Status: </h3>
        <p>
          https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY
          <br></br>
          &url={inputs.url} <br></br>
          &format={inputs.format} <br></br>
          &width={inputs.width}
          <br></br>
          &height={inputs.height}
          <br></br>
          &no_cookie_banners={inputs.no_cookie_banners}
          <br></br>
          &no_ads={inputs.no_ads}
          <br></br>
        </p>
      </div>

      <br></br>

      <div className="container">
        <Gallery images={prevImages} />
      </div>
    </div>
  );
}

export default App
