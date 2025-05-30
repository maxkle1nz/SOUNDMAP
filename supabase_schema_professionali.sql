-- Script SQL per aggiornare lo schema Supabase per la sezione PROFESSIONALI

-- Tabella per i professionisti
CREATE TABLE IF NOT EXISTS professionisti (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefono TEXT,
  citta TEXT NOT NULL,
  biografia TEXT,
  anni_esperienza INTEGER,
  verificato BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,1) DEFAULT 0.0,
  data_registrazione TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_aggiornamento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  immagine_profilo TEXT,
  instagram TEXT,
  website TEXT,
  linkedin TEXT
);

-- Tabella per i ruoli professionali
CREATE TABLE IF NOT EXISTS ruoli_professionali (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE
);

-- Tabella per le specializzazioni
CREATE TABLE IF NOT EXISTS specializzazioni (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE
);

-- Tabella per i generi musicali
CREATE TABLE IF NOT EXISTS generi_musicali (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE
);

-- Tabella di relazione molti-a-molti tra professionisti e ruoli
CREATE TABLE IF NOT EXISTS professionisti_ruoli (
  professionista_id UUID REFERENCES professionisti(id) ON DELETE CASCADE,
  ruolo_id INTEGER REFERENCES ruoli_professionali(id) ON DELETE CASCADE,
  PRIMARY KEY (professionista_id, ruolo_id)
);

-- Tabella di relazione molti-a-molti tra professionisti e specializzazioni
CREATE TABLE IF NOT EXISTS professionisti_specializzazioni (
  professionista_id UUID REFERENCES professionisti(id) ON DELETE CASCADE,
  specializzazione_id INTEGER REFERENCES specializzazioni(id) ON DELETE CASCADE,
  PRIMARY KEY (professionista_id, specializzazione_id)
);

-- Tabella di relazione molti-a-molti tra professionisti e generi musicali
CREATE TABLE IF NOT EXISTS professionisti_generi (
  professionista_id UUID REFERENCES professionisti(id) ON DELETE CASCADE,
  genere_id INTEGER REFERENCES generi_musicali(id) ON DELETE CASCADE,
  PRIMARY KEY (professionista_id, genere_id)
);

-- Tabella per i servizi offerti dai professionisti
CREATE TABLE IF NOT EXISTS servizi_professionisti (
  id SERIAL PRIMARY KEY,
  professionista_id UUID REFERENCES professionisti(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descrizione TEXT,
  tariffa DECIMAL(10,2)
);

-- Inserimento dei ruoli professionali predefiniti
INSERT INTO ruoli_professionali (nome) VALUES
('Produttore'), ('DJ'), ('Manager'), ('Tecnico Audio'), ('Tecnico Luci'),
('PR & Marketing'), ('Legale'), ('Booking Agent'), ('Fotografo'), ('Videomaker'),
('Grafico'), ('Web Designer'), ('Social Media Manager'), ('Stylist'), ('Giornalista')
ON CONFLICT (nome) DO NOTHING;

-- Inserimento delle specializzazioni predefinite
INSERT INTO specializzazioni (nome) VALUES
('Mixing'), ('Mastering'), ('Produzione Elettronica'), ('Produzione Pop'),
('Produzione Hip-Hop'), ('Produzione Rock'), ('Live Sound'), ('Studio Recording'),
('Post-produzione'), ('Sound Design'), ('Booking Nazionale'), ('Booking Internazionale'),
('Diritto d''autore'), ('Contrattualistica'), ('Promozione Radio'), ('Promozione Digitale'),
('Ufficio Stampa'), ('Tour Management'), ('Artist Development'), ('Distribuzione')
ON CONFLICT (nome) DO NOTHING;

-- Inserimento dei generi musicali predefiniti
INSERT INTO generi_musicali (nome) VALUES
('Pop'), ('Rock'), ('Hip-Hop'), ('R&B'), ('Elettronica'), ('Dance'), ('Techno'),
('House'), ('Jazz'), ('Blues'), ('Folk'), ('Country'), ('Metal'), ('Punk'),
('Classica'), ('Indie'), ('Alternative'), ('Reggae'), ('Funk'), ('Soul'),
('Disco'), ('Ambient'), ('Trap'), ('Drill'), ('Afrobeat'), ('Latin')
ON CONFLICT (nome) DO NOTHING;

-- Creazione di una vista per facilitare le query sui professionisti con tutte le loro relazioni
CREATE OR REPLACE VIEW vista_professionisti AS
SELECT 
  p.id,
  p.nome,
  p.cognome,
  p.email,
  p.telefono,
  p.citta,
  p.biografia,
  p.anni_esperienza,
  p.verificato,
  p.rating,
  p.immagine_profilo,
  p.instagram,
  p.website,
  p.linkedin,
  array_agg(DISTINCT rp.nome) AS ruoli,
  array_agg(DISTINCT s.nome) AS specializzazioni,
  array_agg(DISTINCT g.nome) AS generi_musicali
FROM professionisti p
LEFT JOIN professionisti_ruoli pr ON p.id = pr.professionista_id
LEFT JOIN ruoli_professionali rp ON pr.ruolo_id = rp.id
LEFT JOIN professionisti_specializzazioni ps ON p.id = ps.professionista_id
LEFT JOIN specializzazioni s ON ps.specializzazione_id = s.id
LEFT JOIN professionisti_generi pg ON p.id = pg.professionista_id
LEFT JOIN generi_musicali g ON pg.genere_id = g.id
GROUP BY p.id;

-- Creazione di funzioni RPC per operazioni comuni

-- Funzione per registrare un nuovo professionista con tutte le sue relazioni
CREATE OR REPLACE FUNCTION registra_professionista(
  p_user_id UUID,
  p_nome TEXT,
  p_cognome TEXT,
  p_email TEXT,
  p_telefono TEXT,
  p_citta TEXT,
  p_biografia TEXT,
  p_anni_esperienza INTEGER,
  p_ruoli TEXT[],
  p_specializzazioni TEXT[],
  p_generi TEXT[],
  p_instagram TEXT,
  p_website TEXT,
  p_linkedin TEXT
) RETURNS UUID AS $$
DECLARE
  v_professionista_id UUID;
  v_ruolo_id INTEGER;
  v_specializzazione_id INTEGER;
  v_genere_id INTEGER;
  v_ruolo TEXT;
  v_specializzazione TEXT;
  v_genere TEXT;
BEGIN
  -- Inserimento del professionista
  INSERT INTO professionisti (
    user_id, nome, cognome, email, telefono, citta, biografia, 
    anni_esperienza, instagram, website, linkedin
  ) VALUES (
    p_user_id, p_nome, p_cognome, p_email, p_telefono, p_citta, p_biografia, 
    p_anni_esperienza, p_instagram, p_website, p_linkedin
  ) RETURNING id INTO v_professionista_id;
  
  -- Inserimento dei ruoli
  FOREACH v_ruolo IN ARRAY p_ruoli LOOP
    SELECT id INTO v_ruolo_id FROM ruoli_professionali WHERE nome = v_ruolo;
    IF v_ruolo_id IS NOT NULL THEN
      INSERT INTO professionisti_ruoli (professionista_id, ruolo_id)
      VALUES (v_professionista_id, v_ruolo_id);
    END IF;
  END LOOP;
  
  -- Inserimento delle specializzazioni
  FOREACH v_specializzazione IN ARRAY p_specializzazioni LOOP
    SELECT id INTO v_specializzazione_id FROM specializzazioni WHERE nome = v_specializzazione;
    IF v_specializzazione_id IS NOT NULL THEN
      INSERT INTO professionisti_specializzazioni (professionista_id, specializzazione_id)
      VALUES (v_professionista_id, v_specializzazione_id);
    END IF;
  END LOOP;
  
  -- Inserimento dei generi musicali
  FOREACH v_genere IN ARRAY p_generi LOOP
    SELECT id INTO v_genere_id FROM generi_musicali WHERE nome = v_genere;
    IF v_genere_id IS NOT NULL THEN
      INSERT INTO professionisti_generi (professionista_id, genere_id)
      VALUES (v_professionista_id, v_genere_id);
    END IF;
  END LOOP;
  
  RETURN v_professionista_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Creazione di policy di sicurezza per le tabelle
ALTER TABLE professionisti ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionisti_ruoli ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionisti_specializzazioni ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionisti_generi ENABLE ROW LEVEL SECURITY;
ALTER TABLE servizi_professionisti ENABLE ROW LEVEL SECURITY;

-- Policy per lettura pubblica dei professionisti
CREATE POLICY "Lettura pubblica professionisti" ON professionisti
  FOR SELECT USING (true);

-- Policy per modifica dei propri dati
CREATE POLICY "Modifica propri dati professionista" ON professionisti
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy per inserimento dei propri dati
CREATE POLICY "Inserimento propri dati professionista" ON professionisti
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy per eliminazione dei propri dati
CREATE POLICY "Eliminazione propri dati professionista" ON professionisti
  FOR DELETE USING (auth.uid() = user_id);

-- Creazione di trigger per aggiornare il timestamp di ultimo aggiornamento
CREATE OR REPLACE FUNCTION update_professionista_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ultimo_aggiornamento = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_professionista_timestamp
BEFORE UPDATE ON professionisti
FOR EACH ROW
EXECUTE FUNCTION update_professionista_timestamp();
