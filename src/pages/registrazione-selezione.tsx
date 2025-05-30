import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface RegistrazioneSelezioneTipoProps {
  onSelectType?: (type: string) => void;
}

const RegistrazioneSelezione: React.FC<RegistrazioneSelezioneTipoProps> = ({ onSelectType }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    if (onSelectType) {
      onSelectType(type);
    }
  };

  return (
    <div className="registration-selection-container">
      <h1>Benvenuto su SOUNDMAP</h1>
      <p className="intro-text">
        Scegli il tipo di account che desideri creare per iniziare il tuo viaggio musicale.
        Ogni tipo di utente ha funzionalità specifiche per le proprie esigenze.
      </p>

      <div className="user-types-grid">
        <div 
          className={`user-type-card ${selectedType === 'artista' ? 'selected' : ''}`}
          onClick={() => handleTypeSelect('artista')}
        >
          <div className="card-icon">🎸</div>
          <h3>Artista</h3>
          <p>Sei un musicista o una band? Crea il tuo profilo artistico, carica la tua musica e connettiti con i fan.</p>
          <ul>
            <li>Carica e condividi la tua musica</li>
            <li>Crea il tuo territorio musicale</li>
            <li>Connettiti con fan e professionisti</li>
          </ul>
          <Link to="/registrazione" className="register-button">Registrati come Artista</Link>
        </div>

        <div 
          className={`user-type-card ${selectedType === 'professionista' ? 'selected' : ''}`}
          onClick={() => handleTypeSelect('professionista')}
        >
          <div className="card-icon">🎧</div>
          <h3>Professionista</h3>
          <p>Lavori nell'industria musicale? Crea il tuo profilo professionale e offri i tuoi servizi.</p>
          <ul>
            <li>Mostra le tue specializzazioni</li>
            <li>Offri i tuoi servizi agli artisti</li>
            <li>Costruisci il tuo network professionale</li>
          </ul>
          <Link to="/registrazione" className="register-button">Registrati come Professionista</Link>
        </div>

        <div 
          className={`user-type-card ${selectedType === 'locale' ? 'selected' : ''}`}
          onClick={() => handleTypeSelect('locale')}
        >
          <div className="card-icon">🏢</div>
          <h3>Locale / Venue</h3>
          <p>Gestisci un locale o uno spazio per eventi musicali? Crea il tuo profilo e promuovi i tuoi eventi.</p>
          <ul>
            <li>Promuovi il tuo locale sulla mappa</li>
            <li>Pubblica e gestisci eventi</li>
            <li>Connettiti con artisti e pubblico</li>
          </ul>
          <Link to="/registrazione" className="register-button">Registrati come Locale</Link>
        </div>

        <div 
          className={`user-type-card ${selectedType === 'ascoltatore' ? 'selected' : ''}`}
          onClick={() => handleTypeSelect('ascoltatore')}
        >
          <div className="card-icon">🎵</div>
          <h3>Ascoltatore</h3>
          <p>Sei un appassionato di musica? Crea il tuo profilo per scoprire nuovi artisti e scene musicali.</p>
          <ul>
            <li>Esplora la mappa musicale</li>
            <li>Segui artisti e scene</li>
            <li>Scopri eventi nella tua zona</li>
          </ul>
          <Link to="/registrazione" className="register-button">Registrati come Ascoltatore</Link>
        </div>
      </div>

      <div className="login-section">
        <p>Hai già un account? <Link to="/login">Accedi</Link></p>
      </div>
    </div>
  );
};

export default RegistrazioneSelezione;
