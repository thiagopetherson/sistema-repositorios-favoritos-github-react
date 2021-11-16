import React, { useState, useEffect } from 'react'; // Importando o React e os hook useState, useCallback e useEfefct

import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList, Alink } from './styles' // Importando o nosso componente do Styled Component
import api from '../../services/api' // importando o axios
import { FaArrowLeft } from 'react-icons/fa' // Importando ícones


// {decodeURIComponent(match.params.repositorio)}
export default function Repository ({match}) {

    const [repositorio, setRepositorio] = useState({}) // Estado do repositório (usamos objeto pq só iremos ter um repositório armazenado nesse estado)
    const [issues, setIssues] = useState([]) // Estado das issues do repositório acima
    const [loading, setLoading] = useState(true) // Estado do Loading
    const [page, setPage] = useState(1) // Estado que controla as páginas
    const [filters, setFilters] = useState([
        {state: 'all', label: 'Todas', active: true}, // Todos os repositórios
        {state: 'open', label: 'Abertos', active: false}, // Repositórios Abertos
        {state: 'closed', label: 'Fechados', active: false} // Repositórios fechados
    ]) // Estado que guarda as opçoes do filtro 
    const [filterIndex, setFilterIndex] = useState(0) // Esse estado guarda a opção que virá marcada por padrão no filtro



    // Buscar os dados do localStorage e setando no estado
    useEffect(()=> {
        
        // Função que faz uma requisições e pega os dados do repositório específico
        async function load () {
            /* repositório é o nome do parÂmetro que colocamos lá nas rotas */
            /* Usamops o decodeURIComponent pois ele decodifica a URI para o formato da rota*/
            const nomeRepo = decodeURIComponent(match.params.repositorio)
            
            // Aqui, usamos um Promisse pois vamos fazer duas requisições ao mesmo tempo e queremos retornar os dados das duas dentro de um array. 
            // Isso evita de ter que fazer duas requisições paralelas
            const [repositorioData, issuesData] = await Promise.all([
                // Na primeira requisição vem os dados dos repositórios especificados e na segunda pega as issues de cada repositório
                api.get(`/repos/${nomeRepo}`), // O resultado daqui irá para repositorioData
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: { // No params, fazemos um filtro que estamos dizendo para só buscar os "open" e paginamos em 5 por página (não é obrigatório usar esse params, mas daí viria tudão)
                        state: filters.find(f => f.active).state,
                        per_page: 5
                    }
                }) // O resultado daqui irá para issuesData 
            ])

            console.log(repositorioData.data)

             // Atualizando as states
             setRepositorio(repositorioData.data)
             setIssues(issuesData.data)
             setLoading(false)
        }

        load() // chamando a função

    }, [filters, match.params.repositorio]) // Passando os parâmetros que serão observador pelo useEffect


    // Para fazer a ação da paginação
    useEffect(()=> {
        
       async function loadIssue () {
            // Pegando o parâmetro da URL
            const nomeRepo = decodeURIComponent(match.params.repositorio)

            // Fazendo a requisição que busca as novas issues de acordo com a paginação
            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params:{
                    state: filters[filterIndex].state, // Mostrando o item do estado que estiver com o active igual a true
                    page: page, // Qual página será mostrada
                    per_page: 5, // Quantidade de itens por página
                }
            })

            setIssues(response.data) // Setando o estado das Issues com os dados (vindos conforme paginação)
       }

       loadIssue() // chamando a função

    }, [filterIndex, filters, match.params.repositorio, page])  // Passando os parâmetros que serão observador pelo useEffect

    // Função que é chamada quando clicamos em um dos botões da paginação
    const handlePage = (action) => {
        // Aqui definimos se estamos passando um página ou voltando uma página
        setPage(action == 'back' ? page - 1 : page + 1)
    }

    // Função que muda o filtro selecionado e faz uma requisição buscando de acordo com a opção do filtro
    const handleFilter = (index) => {
        setFilterIndex(index) // Setando o estado do filtro que muda a opção selecionada nos filtros
    }

    // Loading da página (enquanto o estado "loading" for true)
    if (loading) {
        return (
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        )
    }


    return (
        <Container>

            <BackButton to="/">
                <FaArrowLeft color="#000" size={30} />
            </BackButton>

            <Owner>
                <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login} />
                <h1>{repositorio.name}</h1>
                <p>{repositorio.description}</p>
                <Alink href={decodeURIComponent(repositorio.html_url)} target="_blank">
                    Acesse o Repositório no Github
                </Alink>                
            </Owner>

            <FilterList active={filterIndex}>
                {filters.map((filter, index) => (
                    <button type="button" key={filter.label} onClick={() => handleFilter(index)}>
                        {filter.label}
                    </button>
                ))}
            </FilterList>

            <IssuesList>
                {/* Map das issues */}
                {issues.map(issue => (
                    <li key={issue.id}>                        
                        <img src={issue.user.avatar_url} alt={issue.user.login} />
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>

                                {/* Map do label da issue */}
                                {issue.labels.map(label => (
                                    <span key={label.id}>{label.name}</span>
                                ))}

                            </strong>

                            <p>{issue.user.login}</p>
                        </div>
                    </li>    
                ))}
            </IssuesList>

            <PageActions>
                <button type="button" onClick={()=>handlePage('back')} disabled={page < 2}>Voltar</button>
                <button type="button" onClick={()=>handlePage('next')}>Próxima</button>
            </PageActions>
        </Container>      
    )
}