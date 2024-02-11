import { ChangeEvent, useState } from 'react'
import logo from './assets/Logo-nlw.svg'
import { NewNoteCard } from './components/newNoteCard'
import { NoteCard } from './components/note-card'

interface Note{
  id: string
  date: Date
  content: string
}

export function App() {

  const [search, setSearch] = useState('')

  const [notes, setNotes] = useState<Note[]>(() => {

    const notesOnStorage = localStorage.getItem('notes') 

    if(notesOnStorage){
      return JSON.parse(notesOnStorage)
    }
    return[]
  })

  function onNoteCreated(content: string){
    const newNote ={
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string){
    const notesArray = notes.filter(note => {
      return note.id != id
    })

    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray)) 
  }

  function handleSearch (event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value
    setSearch(query)
  }

  const filteredNotes = search != '' ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())):notes
 return (
  <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
    <img src={logo} alt="NLW Expert" />

    <form className='w-full '>
      <input onChange={handleSearch} type="text" placeholder='Busque suas notas...' className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'/>
    </form>

    <div className='h-px bg-slate-700'></div>

    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>

      <div className='rounded-md bg-slate-700 p-5 space-y-3'>

        <span className='text-sm font-medium text-slate-200'>Adicionar Nota</span>
        <p className='text-sm leading-6 text-slate-400'>Grave uma nota em áudio que será convertida para texto automaticamente.</p>
      </div>

      <NewNoteCard onNoteCreated={onNoteCreated}/>

      {filteredNotes.map(notes => {
        return <NoteCard key={notes.id} note = {notes} onNoteDeleted = {onNoteDeleted}/>
      })}
      
    </div>
  </div>
 )
}