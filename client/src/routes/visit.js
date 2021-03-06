import React from 'react';
import '../CSS/profil.css';
import { Icon } from '@iconify/react';
import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";
import {Link} from "react-router-dom";
import { Navigate } from "react-router-dom";

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function parseJSON(response) {
  return response.json();
}

class Follow extends React.Component{
  constructor(props){
    super(props);
  }

  followSomeone(){
    this.props.handleChange();
  }

  render(){
    return(
        <button id="btnFollow" onClick={() => this.followSomeone()}>
          <Icon icon="heroicons-solid:user-add"/>
        </button>
    );
  }
}

class Unfollow extends React.Component{
  constructor(props){
    super(props);
  }

  followSomeone(){
    this.props.handleChange();
  }

  render(){
    return(
        <button id="btnFollow" onClick={() => this.followSomeone()}>
          <Icon icon="eva:person-remove-fill" />
        </button>
    );
  }
}

class ProfilHead extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    console.log("profil head ", this.props.follow);
    let btnAfficher = <Follow pseudo={this.props.pseudo} handleChange = {this.props.handleFollow}/>;
    if(this.props.follow == true){
      btnAfficher = <Unfollow pseudo={this.props.pseudo} handleChange = {this.props.handleFollow}/>;
    }
    const cld = new Cloudinary({
      cloud: {
        cloudName: "hzcpqfz4w"//process.env.CLOUD_NAME
      }
    });
    var urlpdp = this.props.pseudo+"_pdp";
    const myImage = cld.image(urlpdp);
    return(
      <header className="profilHead section">
        <div key={this.props.idx} className="profilePic" alt="photo de profil">
          <AdvancedImage cldImg={myImage} />
        </div>
        <h3>{this.props.pseudo}</h3>
        {btnAfficher}
        <p>{this.props.bio}</p>
      </header>
    );
  }
}

class Publication extends React.Component {
  render(){
    const cld = new Cloudinary({
      cloud: {
        cloudName: "hzcpqfz4w"//process.env.CLOUD_NAME
      }
    });

    const myImage = cld.image(this.props.photo);
    let lienPublication = "/publication?pseudo="+this.props.pseudo.trim()+"&type=visit&publicationname="+this.props.photo.trim();
    return(
      <div key={this.props.idx} className="publication">
        <Link to={lienPublication}><AdvancedImage cldImg={myImage} /></Link>
      </div>
    );
  }
}

class ProfilContent extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    let tabPublication = this.props.content.reverse();
    let divPubli = <section className='aucunePubli'>
                      <div className='iconPasDePubli'><Icon icon="ep:picture-rounded"/></div>
                      <h3>Aucune publication</h3>
                    </section>;
    if(tabPublication.length > 0){
        divPubli = tabPublication.map((elt, idx) =>
        <Publication photo = {elt.publication_image} idx = {elt.publication_id} pseudo = {this.props.pseudo}/> );
    }
      

    return(
      <section className="section profilContent">
          <section className="galerie">
            <div className='maGalerie'>
              <h3>Galerie</h3>
            </div>
            {divPubli}
          </section>
        </section>
    );
  }
}

class Profil extends React.Component{
  constructor(props){
    super(props);
    var pseudo = "example";
    const queryParams = new URLSearchParams(window.location.search);
    pseudo = queryParams.get('pseudo');    
    this.state = {
      pseudo: pseudo,
      follow: false,
      data: [], 
      visiteur: "", 
      bio: ""
    };

    this.handleFollow = this.handleFollow.bind(this);
  }

  handleFollow(){
    var following = this.state.follow;
    var pseudo = this.state.pseudo;
    var data = this.state.data;
    var visiteur = this.state.visiteur;
    this.setState({follow: !following, pseudo: pseudo, data: data, visiteur: visiteur});
    let chemin = [
      '/follow/'+following+'-'+this.state.pseudo+'-'+this.state.visiteur
    ];
    Promise.all(chemin.map(url =>
      fetch(url)
      .then(checkStatus)  // check the response of our APIs
      .catch(error => console.log('There was a problem!', error))
    ))

    function checkStatus(response) {
      if (response.ok) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(new Error(response.statusText));
      }
    }
  }
  
  componentDidMount(){
    const tokenString = localStorage.getItem('token');
    var temp = JSON.parse(tokenString);
    temp = temp.token;
    let chemin = [
      "/publicationsofuserpseudo/"+this.state.pseudo, 
      '/pseudouser/'+temp, 
      '/biouser/'+this.state.pseudo   
    ];

    Promise.all(chemin.map(url =>
      fetch(url)
      .then(checkStatus)  // check the response of our APIs
      .then(parseJSON)    // parse it to Json
      .catch(error => console.log('There was a problem!', error))
    ))
    .then(data => {
      // assign to requested URL as define in array with array index.
      if(data[1].length == 0){
        localStorage.removeItem('token');
        window.location.reload(false);
      }
      
      var pseudoActuel = this.state.pseudo.trim();
      var datas = [];

      if(data[0].length > 0){
        datas = data[0];
      }
      console.log(data);
      
      this.setState({
        pseudo: pseudoActuel,
        data: datas.reverse(), 
        follow: false, 
        visiteur: data[1][0].utilisateur_pseudo.trim(), 
        bio: data[2][0].utilisateur_bio.trim()
      })

      if(this.state.pseudo == this.state.visiteur){
        return;
      }


      chemin = [
        "/followinguser/"+this.state.pseudo+'.'+this.state.visiteur     
      ];
      Promise.all(chemin.map(url =>
        fetch(url)
        .then(checkStatus)  // check the response of our APIs
        .then(parseJSON)    // parse it to Json
        .catch(error => console.log('There was a problem!', error))
      ))
      .then(data => {
        // assign to requested URL as define in array with array index.
        var following = data[0].length > 0;
       
        this.setState({
          ... this.state,
          follow: following
        })
      })
    })
  }

  render(){
    if(this.state.pseudo == this.state.visiteur){
      return (
        <Navigate to="/profil" />
      );
    }
    return (
      <div className="profil page">
        <ProfilHead pseudo = {this.state.pseudo} follow = {this.state.follow} visitor = {this.state.visiteur} handleFollow = {this.handleFollow} bio = {this.state.bio}/>
        <ProfilContent content = {this.state.data} pseudo = {this.state.pseudo}/>
      </div>
    );
  }
}

export default Profil;
