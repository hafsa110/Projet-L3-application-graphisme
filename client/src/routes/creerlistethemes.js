import React from 'react';
import '../CSS/inscription.css';
import { Icon } from '@iconify/react';
import {Link} from "react-router-dom";

class CreerListeThemes extends React.Component{
    constructor(props) {
        super(props);
        this.state = {nom:'',icon:'empty'};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
    const value = event.target.value;
    this.setState({
        // ...this.state c pour garder les 2 autres pas modifiés
        ...this.state,
        [event.target.name]: value
    });
    }

    handleSubmit= async () => {
        const lien="/listthemes/creer/user1-"+this.state.nom+"-"+this.state.icon;
        const response = await fetch(lien);
    }

    render(){
        return (
        <div className="page page_inscription">
            <div className="section title">
                <h2>Créer une liste de thèmes</h2>
            </div>
            <div className="section">
                <div className="subSection">
                <label>
                    <h3>Nom :</h3>
                </label>
                <input type="text" name="nom" value={this.state.nom} onChange={this.handleChange} />
                </div>
                <div className="subSection">
                <label>
                    <h3>Icon :</h3>
                </label>
                <input type="text" name="icon" value={this.state.icon} onChange={this.handleChange} />
                </div>
                <div className="subSection">
                    <button onClick={this.handleSubmit}>
                        <Icon icon="akar-icons:check-box-fill" />
                    </button>
                </div>
            </div>
        </div>
        );
    }
}

export default CreerListeThemes;