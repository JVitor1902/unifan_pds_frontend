"use client"
import { useEffect, useState, useRef, FormEvent } from "react";
import { FiTrash, FiEdit, FiCheck } from "react-icons/fi"
import { api } from "./api";

interface PerfilProps {
  id: string;
  descricao: string;
  criar_usuario: boolean;
  editar_usuario: boolean;
  excluir_usuario: boolean;
  ler_usuario: boolean;
}

export default function Perfil() {

  // Linkar os inputs
  const descricaoRef = useRef<HTMLInputElement | null>(null)
  const criar_usuarioRef = useRef<HTMLInputElement | null>(null)
  const editar_usuarioRef = useRef<HTMLInputElement | null>(null)
  const excluir_usuarioRef = useRef<HTMLInputElement | null>(null)
  const ler_usuarioRef = useRef<HTMLInputElement | null>(null)

  // Inicializa lista de tarefas da página como lista vazia
  const [perfis, setPerfil] = useState<PerfilProps[]>([])

  // Ao renderizar a página, chama a função "readTasks"
  useEffect(() => {
    readPerfil();
  }, [])

  // Busca as tarefas no banco de dados via API
  async function readPerfil() {
    try{
    const response = await api.get("/perfis")
    console.log(response.data)
    setPerfil(Array.isArray(response.data) ? response.data : [])
    }
    catch(error){
      console.error("Error fetching tasks:", error);
      setPerfil([])

    }
  }

  // Cria uma nova tarefa
  async function createPerfil(event: FormEvent) {
    event.preventDefault()
    const response = await api.post("/perfis", {
      descricao: descricaoRef.current?.value,
      criar_usuario: criar_usuarioRef,
      editar_usuario: editar_usuarioRef,
      excluir_usuario: excluir_usuarioRef,
      ler_usuario: ler_usuarioRef
    }) 
    setPerfil(allPerfil => [...allPerfil, response.data])
  }

  // Deleta uma tarefa
  async function deletePerfil(id: string){
    try{
      await api.delete("/perfis/" + id)
      const allPerfil = perfis.filter((perfil) => perfil.id !== id)
      setPerfil(allPerfil)
    }
    catch(err){
      alert(err)
    }
  }

  async function setPerfilDone(id:string) {
    try {
      await api.put("/perfis/" + id, {
        status: true,
      })
      const response = await api.get("/perfis")
      setPerfil(response.data)
    }
    catch(err){
      alert(err)
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-500 flex justify-center px-4">
      <main className="my-10 w-full lg:max-w-5xl">
        <section>
          <h1 className="text-4xl text-slate-200 font-medium text-center">Perfis</h1>

          <form className="flex flex-col my-6" onSubmit={createPerfil}>
          
            <label className="text-slate-200">Descrição do Perfil</label>
            <input type="text" className="w-full mb-5 p-2 rounded" ref={descricaoRef}/>
            
            <input type="submit" value={"Adicionar Perfil"} className="cursor-pointer w-full bg-slate-800 rounded font-medium text-slate-200 p-4" /> 
          </form>

        </section>
        <section className="mt-5 flex flex-col">

          {perfis.length > 0 ? (
          perfis.map((perfil) => (
            <article className="w-full bg-slate-200 text-slate-800 p-2 mb-4 rounded relative hover:bg-sky-300" key={perfil.id}>
              <p>{perfil.descricao}</p>
              <p>{perfil.criar_usuario.toString()}</p>
              <p>{perfil.editar_usuario.toString()}</p>
              <p>{perfil.excluir_usuario.toString()}</p>
              <p>{perfil.ler_usuario.toString()}</p>

              <button className="flex absolute right-10 -top-2 bg-green-600 w-7 h-7 items-center justify-center text-slate-200" onClick={() => setPerfilDone(perfil.id)}><FiCheck></FiCheck></button>

              <button className="flex absolute right-0 -top-2 bg-red-600 w-7 h-7 items-center justify-center text-slate-200" onClick={() => deletePerfil(perfil.id)}><FiTrash></FiTrash></button>
            </article>
          ))
        ) : (
             <p className="text-center text-gray-500">No perfis available</p>
        )}
        </section>
      </main>
    </div>
  );
}
