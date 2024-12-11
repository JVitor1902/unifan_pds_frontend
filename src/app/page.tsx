"use client"
import { useEffect, useState, useRef, FormEvent } from "react";
import { FiTrash, FiEdit, FiCheck } from "react-icons/fi"
import { api } from "./api";

interface UsuarioProps {
  id: string;
  matricula: string;
  perfil_id: string;
}

export default function Usuario() {

  // Linkar os inputs
  const matriculaRef = useRef<HTMLInputElement | null>(null)
  // Inicializa lista de tarefas da página como lista vazia
  const [usuarios, setUsuario] = useState<UsuarioProps[]>([])

  // Ao renderizar a página, chama a função "readTasks"
  useEffect(() => {
    readUsuario();
  }, [])

  // Busca as tarefas no banco de dados via API
  async function readUsuario() {
    try{
    const response = await api.get("/usuarios")
    console.log(response.data)
    setUsuario(Array.isArray(response.data) ? response.data : [])
    }
    catch(error){
      console.error("Error fetching tasks:", error);
      setUsuario([])

    }
  }

  // Cria uma nova tarefa
  async function createUsuario(event: FormEvent) {
    event.preventDefault()
    const response = await api.post("/usuarios", {
      descricao: matriculaRef.current?.value,
    }) 
    setUsuario(allUsuario => [...allUsuario, response.data])
  }

  // Deleta uma tarefa
  async function deleteUsuario(id: string){
    try{
      await api.delete("/usuarios/" + id)
      const allUsuario= usuarios.filter((usuario) => usuario.id !== id)
      setUsuario(allUsuario)
    }
    catch(err){
      alert(err)
    }
  }

  async function setUsuarioDone(id:string) {
    try {
      await api.put("/usuarios/" + id, {
        status: true,
      })
      const response = await api.get("/usuarios")
      setUsuario(response.data)
    }
    catch(err){
      alert(err)
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-500 flex justify-center px-4">
      <main className="my-10 w-full lg:max-w-5xl">
        <section>
          <h1 className="text-4xl text-slate-200 font-medium text-center">Usuários</h1> 

          <form className="flex flex-col my-6" onSubmit={createUsuario}>
          
            <label className="text-slate-200">Matricula do Usuário</label>
            <input type="text" className="w-full mb-5 p-2 rounded" ref={matriculaRef}/>
            
            <input type="submit" value={"Adicionar Usuário"} className="cursor-pointer w-full bg-slate-800 rounded font-medium text-slate-200 p-4" /> 
          </form>

        </section>
        <section className="mt-5 flex flex-col">

          {usuarios.length > 0 ? (
          usuarios.map((usuario) => (
            <article className="w-full bg-slate-200 text-slate-800 p-2 mb-4 rounded relative hover:bg-sky-300" key={usuario.id}>
              <p>{usuario.matricula}</p>
              
              <button className="flex absolute right-10 -top-2 bg-green-600 w-7 h-7 items-center justify-center text-slate-200" onClick={() => setUsuarioDone(usuario.id)}><FiCheck></FiCheck></button>

              <button className="flex absolute right-0 -top-2 bg-red-600 w-7 h-7 items-center justify-center text-slate-200" onClick={() => deleteUsuario(usuario.id)}><FiTrash></FiTrash></button>
            </article>
          ))
        ) : (
             <p className="text-center text-gray-500">No usuarios available</p>
        )}
        </section>
      </main>
    </div>
  );
}
