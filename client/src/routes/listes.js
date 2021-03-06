import React from 'react';
import '../CSS/listes.css';
import { Icon } from '@iconify/react';
import {Link} from "react-router-dom";

class Liste extends React.Component{
  render(){
    const tabListeTheme = this.props.listeTheme;
    const tabListePalette = this.props.listePalette;
    let divListe = "";
    if(this.props.istheme){
      if(this.props.listeTheme.length > 0){
        divListe = Object.keys(tabListeTheme).map((keyName, i)  => (
          <Link to={"/profil/listethemes?idlist="+tabListeTheme[keyName].tl_id+"&nomlist="+tabListeTheme[keyName].tl_nom.trim()+"&icon="+(tabListeTheme[keyName].tl_icon == null ? "emojione-monotone:sparkles" : tabListeTheme[keyName].tl_icon.trim())} key= {i} onClick={this.props.changeTab} className="iconlist">
            <Icon icon={tabListeTheme[keyName].tl_icon == null ? "emojione-monotone:sparkles" : tabListeTheme[keyName].tl_icon.trim()} />
            <p>{tabListeTheme[keyName].tl_nom.trim()}</p>
          </Link>
      ))
      }else{
        divListe = <p>Il n'y a rien :( crée ta première liste theme!</p>
      }
    }else{
      if(this.props.listePalette.length > 0){
        divListe = Object.keys(tabListePalette).map((keyName, i)  => (
          <Link to={"/profil/listepalettes?idlist="+tabListePalette[keyName].pl_id+"&nomlist="+tabListePalette[keyName].pl_nom.trim()+"&icon="+(tabListePalette[keyName].pl_icon == null ? "emojione-monotone:sparkles" : tabListePalette[keyName].pl_icon.trim())} key= {i} onClick={this.props.changeTab} className="iconlist">
            <Icon icon={tabListePalette[keyName].pl_icon == null ? "emojione-monotone:sparkles" : tabListePalette[keyName].pl_icon.trim()} />
            <p>{tabListePalette[keyName].pl_nom.trim()}</p>
          </Link>
      ))
      }else{
        divListe = <p className="empty">Il n'y a rien :( crée ta première liste palette!</p>
      }
    }
    let titre = <h3>Mes thèmes</h3>;
    if(!this.props.istheme){
      titre = <h3>Mes palettes</h3>;
    }

    return (
      <div className="liste_paletteTheme">
        {titre}
        {divListe}
      </div>

    );
  }
}

class ThemesAndPalettes extends React.Component{
  constructor(props) {
    super(props);
    const queryParams = new URLSearchParams(window.location.search);
    const type = queryParams.get('type');
    var isTheme = true;
    if(type != "themes"){
      isTheme = false;
    }
    this.state = {
      displayThemes: isTheme,
      listeTheme:  [],
      listePalette:  []
    }
  }

  componentDidMount(){
    const tokenString = localStorage.getItem('token');
    var temp = JSON.parse(tokenString);
    temp = temp.token;
    const chemin = [
        "/listesthemes/"+temp,
        "/listespalettes/"+temp
    ];

      Promise.all(chemin.map(url =>
        fetch(url)
            .then(checkStatus)  // check the response of our APIs
            .then(parseJSON)    // parse it to Json
            .catch(error => console.log('There was a problem!', error))
    ))
        .then(data => {
            // assign to requested URL as define in array with array index.
            if(data.length == 0){
              localStorage.removeItem('token');
              window.location.reload(false);
            }
            const data_theme = data[0];
            const data_palette = data[1];
            this.setState({
              listeTheme: data_theme,
              listePalette: data_palette,
            })
        })

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
  }

  handleClick = () => {
    var newCategory = !this.state.displayThemes;
    this.setState({displayThemes: newCategory});

  }

  render(){
    var lien = this.state.displayThemes ? "/profil/listethemes/creer" : "/profil/listepalettes/creer" ;
    return (
      <section className="page page_listes">
        <Liste listeTheme={this.state.listeTheme} listePalette={this.state.listePalette} istheme={this.state.displayThemes}/>
        <Link className="addBtn"to={lien}>Ajouter liste</Link>
        <button className="btnGetRandomArt btnCategorie" onClick={() => this.handleClick()}>Changer de catégorie</button>
      </section>
    );
  }
}

  export default ThemesAndPalettes;
