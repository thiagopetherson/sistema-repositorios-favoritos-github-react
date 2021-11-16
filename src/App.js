import React from 'react'

import Routes from './routes'
import GlobalStyle from './styles/global' // Importando o Styled Component global

function App () {
    return (
        <>
            <GlobalStyle />
            <Routes />
        </>
    )
}

export default App