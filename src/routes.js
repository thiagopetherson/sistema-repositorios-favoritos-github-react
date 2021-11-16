import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom' // Importando os Componentes do React Router Dom (Que usaremos para as rotas)


import Main from './pages/Main' // Importando o componente
import Repository from './pages/Repository' // Importando o componente


export default function Routes () {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Main} />
                <Route exact path="/repositorio/:repositorio" component={Repository} />
            </Switch>
        </BrowserRouter>
    )
}