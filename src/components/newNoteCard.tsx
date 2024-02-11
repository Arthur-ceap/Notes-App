import * as Dialog from '@radix-ui/react-dialog'
import {X} from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import {toast} from 'sonner'

interface NewNoteCardProps {
    onNoteCreated: (content: string) => void 
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({onNoteCreated}: NewNoteCardProps){

    const [shouldShowOnboarding, setShouldShowOnBoarding] = useState(true)
    const [content, setContent] = useState('')
    const [isRec,setIsRec] = useState(false)

    function handleStartEditor(){
        setShouldShowOnBoarding(false)
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>){
        setContent(event.target.value)

        if(event.target.value == ""){
            setShouldShowOnBoarding(true)
        }
    }

    function handleSaveNote(event: FormEvent){
        event.preventDefault

        onNoteCreated(content)
        setContent('')
        setShouldShowOnBoarding(true)
        toast.success('Nota criada com sucesso')

        if(content == ''){
            return
        }
    }
    
    function handleStartRecording(){

        const isSpeechRegognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

        if(!isSpeechRegognitionAPIAvailable){
            alert("Infelizmente o seu navegador não suporta a API de gravação")
            return
        }

        setIsRec(true)
        setShouldShowOnBoarding(false)

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new SpeechRecognitionAPI()

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) =>{
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')

            setContent(transcription)
        }

        speechRecognition.onerror = (event) =>{
            console.error(event)
        }

        speechRecognition.start()
    }

    function handleStopRecording(){
        setIsRec(false)

        if(speechRecognition != null){
            speechRecognition.stop() 
        }
    }
    return(
        <Dialog.Root>
            <Dialog.Trigger className='rounded-md flex flex-col bg-slate-700 p-5 gap-3 text-left hover:ring-2 hover: ring-slate-600 focus-visible:ring-2 outline-none focus-visible:ring-lime-400'>
                <span className='text-sm font-medium text-slate-200'>
                    Adicione uma nota
                </span>
                <p className='text-sm leading-6 text-slate-400'>
                    Grave uma nota em áudio que será convertida para texto automaticamente
                </p>
            </Dialog.Trigger>

            
            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/60'/>
                <Dialog.Content className=' overflow-hidden fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:w-full h-[68vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
                    <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                        <X className='size-5'/>
                    </Dialog.Close>

                    <form  className='flex-1 flex flex-col'>
                        <div className='flex flex-1 flex-col gap-3 p-5'>
                            <span className='text-sm font-medium text-slate-300'>Adicionar Nota</span>
                            {shouldShowOnboarding ? (
                                <p className='text-sm leading-6 text-slate-400'>Comece <button onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se prefirir <button onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button></p>
                            ) : (
                                <textarea value={content} autoFocus className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none' onChange={handleContentChanged}/>
                            )}
                        </div>

                        {isRec ? (
                            <button onClick={handleStopRecording} type="button" className='w-full flex  items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'>
                                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                                Gravando! (Clique para parar)
                            </button>
                        ):(
                            <button type="button" onClick={handleSaveNote} className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'>Salvar nota</button>
                        )}

                    </form>
                
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}