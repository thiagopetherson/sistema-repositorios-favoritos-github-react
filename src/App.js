import React from 'react'

import Routes from './routes'
import GlobalStyle from './styles/global' // Importando o Styled Component global
import { ToastContainer } from 'react-toastify' // Importando o container do React Toastify
import 'react-toastify/dist/ReactToastify.css'

function App () {
    return (
        <>
            <ToastContainer autoClose={4000} />
            <GlobalStyle />
            <Routes />
        </>
    )
}

export default App