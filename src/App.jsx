import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import Dashboard from './pages/dashboard'
import ClientProfile from './pages/clientProfile'
import Dashboard from './pages/dashboard'
import { Router } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'


const data = {
    "leadId": [
        "NjAyMDkz"
    ],
    "Nome": [
        "Anabela"
    ],
    "Apelido": [
        "Sousa"
    ],
    "Telemóvel": [
        "+351 914 617 924"
    ],
    "Email": [
        "-----"
    ],
    "Classificação": [
        " Não qualificado "
    ],
    "Tipo de cliente": [
        " Vendedor;  "
    ],
    "Género": [
        " Feminino "
    ],
    "Fonte do contacto ": [
        " Conhecimento pessoal "
    ],
    " ": [
        ""
    ],
    "Data de aniversário": [
        "-----"
    ],
    "Notificação": [
        " Não "
    ],
    "Nº de Filhos": [
        "-----"
    ],
    "NIF": [
        "-----"
    ],
    "BI/CC": [
        "-----"
    ],
    "Nickname": [
        "-----"
    ],
    " Com consentimento tácito": [
        true
    ],
    " SMS": [
        true
    ],
    " Chamada": [
        true
    ],
    " Carta Postal": [
        true
    ],
    "id": [
        "PTC292089"
    ],
    "Consent": [
        "Consentimento tácito"
    ],
    "Note 1 name_": [
        "Cátia Pires"
    ],
    "Note 1 description": [
        "LG - rejeitou chamada."
    ],
    "Note 1 date": [
        "2025-11-14 14:27:39"
    ],
    "Note 2 name_": [
        "Cátia Pires"
    ],
    "Note 2 description": [
        "LG pede para ligar mais tarde"
    ],
    "Note 2 date": [
        "2025-11-14 11:48:01"
    ],
    "Note 3 name_": [
        "Cátia Pires"
    ],
    "Note 3 description": [
        "Devolveu chamada. Não quer comprar/ vender. Não quer newsletter."
    ],
    "Note 3 date": [
        "2020-08-13 12:10:47"
    ],
    "Note 4 name_": [
        "Cátia Pires"
    ],
    "Note 4 description": [
        "1 TCSS"
    ],
    "Note 4 date": [
        "2020-08-13 12:08:27"
    ],
    "Note 5 name_": [
        "Ana Margarida Costa"
    ],
    "Note 5 description": [
        "Casa vender Sequeira. Contacto passado pela Joana Costa make winers"
    ],
    "Note 5 date": [
        "2020-05-07 15:30:43"
    ],
    " Newsletter para campanhas de email": [
        ""
    ],
    "Imóveis de interesse 1 Estado": [
        ""
    ],
    "Imóveis de interesse 1 Fotografia": [
        ""
    ],
    "Imóveis de interesse 1 ZMID": [
        ""
    ],
    "Imóveis de interesse 1 Nickname do imóvel": [
        ""
    ],
    "Imóveis de interesse 1 Preço": [
        ""
    ],
    "Imóveis de interesse 1 Data registo": [
        ""
    ],
    "Angariacoes 1 pic": [
        ""
    ],
    "Angariacoes 1 title": [
        ""
    ],
    "Angariacoes 1 description": [
        ""
    ],
    "Note 6 name_": [
        ""
    ],
    "Note 6 description": [
        ""
    ],
    "Note 6 date": [
        ""
    ],
    "Note 7 name_": [
        ""
    ],
    "Note 7 description": [
        ""
    ],
    "Note 7 date": [
        ""
    ],
    "Note 8 name_": [
        ""
    ],
    "Note 8 description": [
        ""
    ],
    "Note 8 date": [
        ""
    ],
    "Bookmark 1": [
        ""
    ],
    "Família 1 id": [
        ""
    ],
    "Família 1 nome": [
        ""
    ],
    "Família 1 grau": [
        ""
    ],
    "Família 1 telefone": [
        ""
    ],
    "Família 1 email": [
        ""
    ],
    "Família 1 tipo": [
        ""
    ],
    "Família 2 id": [
        ""
    ],
    "Família 2 nome": [
        ""
    ],
    "Família 2 grau": [
        ""
    ],
    "Família 2 telefone": [
        ""
    ],
    "Família 2 email": [
        ""
    ],
    "Família 2 tipo": [
        ""
    ],
    "Família 3 id": [
        ""
    ],
    "Família 3 nome": [
        ""
    ],
    "Família 3 grau": [
        ""
    ],
    "Família 3 telefone": [
        ""
    ],
    "Família 3 email": [
        ""
    ],
    "Família 3 tipo": [
        ""
    ],
    "Angariacoes 2 pic": [
        ""
    ],
    "Angariacoes 2 title": [
        ""
    ],
    "Angariacoes 2 description": [
        ""
    ],
    "Note 9 name_": [
        ""
    ],
    "Note 9 description": [
        ""
    ],
    "Note 9 date": [
        ""
    ],
    "Note 10 name_": [
        ""
    ],
    "Note 10 description": [
        ""
    ],
    "Note 10 date": [
        ""
    ],
    "Visitas feitas 1 pic": [
        ""
    ],
    "Visitas feitas 1 title": [
        ""
    ],
    "Visitas feitas 1 description": [
        ""
    ],
    "Note 11 name_": [
        ""
    ],
    "Note 11 description": [
        ""
    ],
    "Note 11 date": [
        ""
    ],
    " Sem consentimento": [
        ""
    ],
    "Telefone": [
        ""
    ],
    "Descritivo": [
        ""
    ],
    "Propostas 1 ZMID": [
        ""
    ],
    "Propostas 1 Cod. Proposta": [
        ""
    ],
    "Propostas 1 Visita de origem": [
        ""
    ],
    "Propostas 1 Do consultor": [
        ""
    ],
    "Propostas 1 Tipo proposta": [
        ""
    ],
    "Propostas 1 Data inicio": [
        ""
    ],
    "Propostas 1 Última negociação": [
        ""
    ],
    "Propostas 1 Estado": [
        ""
    ],
    "Propostas 1 Valor": [
        ""
    ],
    "Imóveis de interesse 2 Estado": [
        ""
    ],
    "Imóveis de interesse 2 Fotografia": [
        ""
    ],
    "Imóveis de interesse 2 ZMID": [
        ""
    ],
    "Imóveis de interesse 2 Nickname do imóvel": [
        ""
    ],
    "Imóveis de interesse 2 Preço": [
        ""
    ],
    "Imóveis de interesse 2 Data registo": [
        ""
    ],
    "Note 12 name_": [
        ""
    ],
    "Note 12 description": [
        ""
    ],
    "Note 12 date": [
        ""
    ],
    "Note 13 name_": [
        ""
    ],
    "Note 13 description": [
        ""
    ],
    "Note 13 date": [
        ""
    ],
    "Note 14 name_": [
        ""
    ],
    "Note 14 description": [
        ""
    ],
    "Note 14 date": [
        ""
    ],
    "Note 15 name_": [
        ""
    ],
    "Note 15 description": [
        ""
    ],
    "Note 15 date": [
        ""
    ],
    "Note 16 name_": [
        ""
    ],
    "Note 16 description": [
        ""
    ],
    "Note 16 date": [
        ""
    ],
    "Sites imobiliários": [
        ""
    ],
    "Contacto": [
        ""
    ],
    " Com consentimento explícito": [
        ""
    ],
    "Família 4 id": [
        ""
    ],
    "Família 4 nome": [
        ""
    ],
    "Família 4 grau": [
        ""
    ],
    "Família 4 telefone": [
        ""
    ],
    "Família 4 email": [
        ""
    ],
    "Família 4 tipo": [
        ""
    ],
    " Cliente empresarial": [
        ""
    ],
    "Outra rede": [
        ""
    ],
    "Bookmark 2": [
        ""
    ],
    "Facebook": [
        ""
    ],
    "Imóveis de interesse 3 Estado": [
        ""
    ],
    "Imóveis de interesse 3 Fotografia": [
        ""
    ],
    "Imóveis de interesse 3 ZMID": [
        ""
    ],
    "Imóveis de interesse 3 Nickname do imóvel": [
        ""
    ],
    "Imóveis de interesse 3 Preço": [
        ""
    ],
    "Imóveis de interesse 3 Data registo": [
        ""
    ],
    "Imóveis de interesse 4 Estado": [
        ""
    ],
    "Imóveis de interesse 4 Fotografia": [
        ""
    ],
    "Imóveis de interesse 4 ZMID": [
        ""
    ],
    "Imóveis de interesse 4 Nickname do imóvel": [
        ""
    ],
    "Imóveis de interesse 4 Preço": [
        ""
    ],
    "Imóveis de interesse 4 Data registo": [
        ""
    ],
    "Angariacoes 3 pic": [
        ""
    ],
    "Angariacoes 3 title": [
        ""
    ],
    "Angariacoes 3 description": [
        ""
    ],
    "Angariacoes 4 pic": [
        ""
    ],
    "Angariacoes 4 title": [
        ""
    ],
    "Angariacoes 4 description": [
        ""
    ],
    "Visitas feitas 2 pic": [
        ""
    ],
    "Visitas feitas 2 title": [
        ""
    ],
    "Visitas feitas 2 description": [
        ""
    ],
    "Visitas feitas 3 pic": [
        ""
    ],
    "Visitas feitas 3 title": [
        ""
    ],
    "Visitas feitas 3 description": [
        ""
    ],
    "Visitas feitas 4 pic": [
        ""
    ],
    "Visitas feitas 4 title": [
        ""
    ],
    "Visitas feitas 4 description": [
        ""
    ],
    "Propostas 2 ZMID": [
        ""
    ],
    "Propostas 2 Cod. Proposta": [
        ""
    ],
    "Propostas 2 Visita de origem": [
        ""
    ],
    "Propostas 2 Do consultor": [
        ""
    ],
    "Propostas 2 Tipo proposta": [
        ""
    ],
    "Propostas 2 Data inicio": [
        ""
    ],
    "Propostas 2 Última negociação": [
        ""
    ],
    "Propostas 2 Estado": [
        ""
    ],
    "Propostas 2 Valor": [
        ""
    ],
    "Consultor": [
        ""
    ],
    "Linkedin": [
        ""
    ],
    "Note 17 name_": [
        ""
    ],
    "Note 17 description": [
        ""
    ],
    "Note 17 date": [
        ""
    ],
    "Note 18 name_": [
        ""
    ],
    "Note 18 description": [
        ""
    ],
    "Note 18 date": [
        ""
    ],
    "Note 19 name_": [
        ""
    ],
    "Note 19 description": [
        ""
    ],
    "Note 19 date": [
        ""
    ],
    "Note 20 name_": [
        ""
    ],
    "Note 20 description": [
        ""
    ],
    "Note 20 date": [
        ""
    ],
    "Note 21 name_": [
        ""
    ],
    "Note 21 description": [
        ""
    ],
    "Note 21 date": [
        ""
    ],
    "Note 22 name_": [
        ""
    ],
    "Note 22 description": [
        ""
    ],
    "Note 22 date": [
        ""
    ],
    "Note 23 name_": [
        ""
    ],
    "Note 23 description": [
        ""
    ],
    "Note 23 date": [
        ""
    ],
    "Note 24 name_": [
        ""
    ],
    "Note 24 description": [
        ""
    ],
    "Note 24 date": [
        ""
    ],
    "Note 25 name_": [
        ""
    ],
    "Note 25 description": [
        ""
    ],
    "Note 25 date": [
        ""
    ],
    "Note 26 name_": [
        ""
    ],
    "Note 26 description": [
        ""
    ],
    "Note 26 date": [
        ""
    ],
    "Note 27 name_": [
        ""
    ],
    "Note 27 description": [
        ""
    ],
    "Note 27 date": [
        ""
    ],
    "Note 28 name_": [
        ""
    ],
    "Note 28 description": [
        ""
    ],
    "Note 28 date": [
        ""
    ],
    "Note 29 name_": [
        ""
    ],
    "Note 29 description": [
        ""
    ],
    "Note 29 date": [
        ""
    ],
    "Note 30 name_": [
        ""
    ],
    "Note 30 description": [
        ""
    ],
    "Note 30 date": [
        ""
    ],
    "Note 31 name_": [
        ""
    ],
    "Note 31 description": [
        ""
    ],
    "Note 31 date": [
        ""
    ],
    "Note 32 name_": [
        ""
    ],
    "Note 32 description": [
        ""
    ],
    "Note 32 date": [
        ""
    ],
    "Note 33 name_": [
        ""
    ],
    "Note 33 description": [
        ""
    ],
    "Note 33 date": [
        ""
    ],
    "Note 34 name_": [
        ""
    ],
    "Note 34 description": [
        ""
    ],
    "Note 34 date": [
        ""
    ],
    "Angariacoes 5 pic": [
        ""
    ],
    "Angariacoes 5 title": [
        ""
    ],
    "Angariacoes 5 description": [
        ""
    ],
    "Angariacoes 6 pic": [
        ""
    ],
    "Angariacoes 6 title": [
        ""
    ],
    "Angariacoes 6 description": [
        ""
    ],
    "Angariacoes 7 pic": [
        ""
    ],
    "Angariacoes 7 title": [
        ""
    ],
    "Angariacoes 7 description": [
        ""
    ],
    "Angariacoes 8 pic": [
        ""
    ],
    "Angariacoes 8 title": [
        ""
    ],
    "Angariacoes 8 description": [
        ""
    ],
    "Lead": [
        ""
    ]
}

function App() {

  return (
    <>
    
    <Routes>
      <Route path='/profile/:profileCode' element={<><ClientProfile/></>}></Route>
      <Route exact path='/' element={<Dashboard />}></Route>
    </Routes>

      {/* <ClientProfile clientData={data} /> */}
    </>
  )
}

export default App
