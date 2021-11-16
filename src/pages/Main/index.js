import React, { useState, useCallback, useEffect } from 'react'; // Importando o React e os hook useState e useCallback
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'; // Importando a biblioteca de ícones (fa é de fontawesome)
import { Container, Form, SubmitButton, List, DeleteButton } from './styles'; // Importando os Componentes do Styled Components
import { Link } from 'react-router-dom' // Importando o Link do React Router Dom

import api from '../../services/api' // importando o axios


export default function Main(){

  const [newRepo, setNewRepo] = useState('') // Estado que guarda os dados que são digitados no input
  const [repositorios, setRepositorios] = useState([]) // Estado que guardará os repositórios oriundos da requisição na API do Github
  const [loading, setLoading] = useState(false) // Estado do Loading
  const [alert, setAlert] = useState(null) // Estado do Alerta

  // Buscar os dados do localStorage e setando no estado
  useEffect(()=> {
    // Pegando os dados do localStorage
    const repoStorage = localStorage.getItem('repositorios');
    // Se tiver algo no localStorage
    if (repoStorage) {
      // Setando o estado
      setRepositorios(JSON.parse(repoStorage))
    }

  }, [])

  // Salvar Alterações (Salvando a lista no localStorage) Pegando do estado e colocando no localStorage
  useEffect(()=> {
    // Pegando os dados do estado e setando no localStorage
    localStorage.setItem('repositorios', JSON.stringify(repositorios))
  }, [repositorios])


  // Função que é chamada quando digitamos no input, então vamos setando o estado 
  const handleInputChange = (event) => {
    setNewRepo(event.target.value)
    setAlert(null)
  }
  

  // Fazendo um callback (quando algum estado for atualizado, então chamaremos esse callback)
  const handleSubmit = useCallback ((event) => {

    event.preventDefault()

    // Função que é chamada quando submitamos o form
    // Fazemos de forma assincrona, por ser uma requisição e tem a possibilidade de demorar, etc..
    async function submit () {     

      setLoading(true) // Habilitando o loading
      
      try {

        // Vendo se o campo veio vazio
        if (newRepo == "") {
          throw new Error('Você Precisa Indicar um Repositório')
        }

        // Verificando se existe algum repositório na lista que seja igual ao buscado (se sim, não buscar)
        const hasRepos = repositorios.find(repo => repo.name == newRepo)

        // Vendo se o campo veio vazio
        if (hasRepos) {
          throw new Error('Repositório Duplicado')
        }


        // Fazendo a requisição na API
        const response = await api.get(`repos/${newRepo}`)

        // Vamos pegar só alguns dados do retorno da requisição
        const data = {
          name: response.data.full_name
        }

        setRepositorios([...repositorios, data]) // Vai armazenar o que já tem no estado junto com os dados que vem da requisição
        setNewRepo('') // Limpando o campo       

      } catch (error) {
        setAlert(true)
        console.log(error)
      } finally {
        setLoading(false) // Desabilitando o loading
      }
      
    }    

    submit()

  }, [newRepo, repositorios])

  // Fazendo um callback com a função de apagar um repositório da lista
  const handleDelete = useCallback ((repoName) => {
    
    // Procurando na lista de tem algum repositório com esse nome (usamemos o filter do JS)
    const find = repositorios.filter(r => r.name !== repoName); // Só devolverá os repositórios com nome diferente do que está em repoName
    setRepositorios(find)
   
  }, [repositorios])  


  return(
    <Container>
      
      <h1>
        <FaGithub size={25}/>
        Meus Repositorios
      </h1>

      <Form onSubmit={handleSubmit} error={alert}>
        <input type="text" placeholder="Adicionar Repositorios" value={newRepo} onChange={handleInputChange} />

        <SubmitButton Loading={loading ? 1 : 0}>

          {loading ? (
            <FaSpinner color="#FFF" size={14} />
          ) : (
            <FaPlus color="#FFF" size={14}/>
          )}
          
        </SubmitButton>

      </Form>

      <List>
         {repositorios.map(repo => (
           <li key={repo.name}>
             <span>
             <DeleteButton onClick={()=> handleDelete(repo.name) }>
                <FaTrash size={14}/>
             </DeleteButton>  
             {repo.name}
             </span>
             <Link to={`/repositorio/${encodeURIComponent(repo.name)}`} >
               <FaBars size={20}/>
             </Link>
           </li>
         ))} 
      </List>

    </Container>
  )
}