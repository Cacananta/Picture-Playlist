import React, { Component } from 'react';
import Clarifai from 'clarifai';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clarifaiKey: 'b152ab226db545d7ae11f33a8756cda5',
      mashapeKey: '8T7epZZomNmshvkB0xHh8YgIgUhnp1mbZ8RjsnqijKFCpgCBCc',
      imageInput: "",
      wordQuery: "",
      songInfo: '',
    }
    this.getImageDetails = this.getImageDetails.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getMusicTerms = this.getMusicTerms.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
  }

  // componentDidMount() {

  //   /* Use Clarifai to grab models */
  //   this.getImageDetails().then((imageDetails) => {
  //     console.log(imageDetails);

  //     /* After, querying for words associated with an image, query those top 5 terms for songs */
  //     this.getMusicTerms();
  //   });
  // }

  getImageDetails(input = this.state.imageInput) {

    //instantiate a new Clarifai app passing in your api key.
    const app = new Clarifai.App({ apiKey: this.state.clarifaiKey });

    // predict the contents of an image by passing in a url
    return new Promise((res, rej) => {
      app.models.predict(Clarifai.GENERAL_MODEL, input)
        .then((response) => {
          res(response);
          this.setState({ wordQuery: response.outputs[0].data.concepts[0].name });
        })
        .catch(err => rej(err));
    });

  }

  getMusicTerms() {
    // this.state.wordQuery ? 
    var query = this.state.wordQuery;
    return new Promise((res, rej) => {
      axios({
        method: 'get',
        url: 'https://musixmatchcom-musixmatch.p.mashape.com/wsr/1.1/track.search?f_has_lyrics=1&page=1&page_size=5&q_track=' + query + '&s_track_rating=desc',
        headers: {
          'X-Mashape-Key': `${this.state.mashapeKey}`,
          'accept': 'application/json'
        }
      }).then((response) => {
        res(response)
      }).catch(err => console.log(err));
    })
  }

  handleClick() {
    var input = document.getElementById("imageInput").value;
    this.setState({
      imageInput: input
    })
    this.getImageDetails(input).then((response) => {
      document.getElementById("imageInput").value = "";
      this.getMusicTerms().then((response) => {
        this.setState({
          songInfo: {
            artist: response.data[0].artist_name,
            track: response.data[0].track_name
          }
        })
      })
    })
  }

  buttonClick(e) {
    var input = e.target.src; 
    this.setState({
      imageInput: input
    })
    this.getImageDetails(input).then((response) => {
      document.getElementById("imageInput").value = "";
      this.getMusicTerms().then((response) => {
        this.setState({
          songInfo: {
            artist: response.data[0].artist_name,
            track: response.data[0].track_name
          }
        })
      })
    })
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>What you see is what you hear</h2>
        </div>

        <input id="imageInput" type="text"></input>
        <button onClick={this.handleClick}>Search Image</button>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {this.state.songInfo ? 
              <h1> {this.state.songInfo.artist} : "{this.state.songInfo.track}"</h1>
              :
              <h1></h1>}
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 my-2">
              <img alt="picture" onClick={this.buttonClick} className="presets" src="http://img.taste.com.au/MudZOM3z/taste/2016/11/french-fries-87711-1.jpeg" id="http://img.taste.com.au/MudZOM3z/taste/2016/11/french-fries-87711-1.jpeg" height="300px" width=" 300px"/>
            </div>
            <div className="col-md-4 my-2">
            <img alt="picture" onClick={this.buttonClick} className="presets" src="https://battleforliberty.com/wp-content/uploads/2017/06/beer-793x526.jpg" height="300px" width=" 300px"/>
            </div>
            <div className="col-md-4 my-2">
            <img alt="picture" onClick={this.buttonClick} className="presets" src="https://static.politico.com/92/3a/9e7a997c42868d2f8892e08cdfa5/150831-denali-ap-1160.jpg" height="300px" width=" 300px"/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 my-2">
            <img alt="picture" onClick={this.buttonClick} className="presets" src="https://cdn.images.express.co.uk/img/dynamic/galleries/x701/146831.jpg" height="300px" width=" 300px"/>
            </div>
            <div className="col-md-4 my-2">
            <img alt="picture" onClick={this.buttonClick} className="presets" src="https://static.seattletimes.com/wp-content/uploads/2017/07/7b4c85c2-6687-11e7-8665-356bf84600f6-780x520.jpg" height="300px" width=" 300px"/>
            </div>
            <div className="col-md-4 my-2">
            <img alt="picture" onClick={this.buttonClick} className="presets" src="http://wwwcdn.skyandtelescope.com/wp-content/uploads/Saturn-June-13_2017-Chris-Go_ST.jpg" height="300px" width=" 300px"/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 my-2">
            <img alt="picture" onClick={this.buttonClick} className="presets" src="http://cdn.cnn.com/cnnnext/dam/assets/161212113238-waves-tease-super-tease.jpg" height="300px" width=" 300px"/>
            </div>
            <div className="col-md-4 my-2">
            <img alt="picture" onClick={this.buttonClick} className="presets" src="http://ripleylibrary.com/wp-content/uploads/2016/11/635842109151760353-santa.jpg" height="300px" width=" 300px"/>
            </div>
            <div className="col-md-4 my-2">
            <img alt="picture" onClick={this.buttonClick} className="presets" src="https://www.scientificamerican.com/sciam/cache/file/AB921605-B94F-4D2A-A1798DD43488550D_source.jpg" height="300px" width=" 300px"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
