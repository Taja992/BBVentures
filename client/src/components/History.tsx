import {MyApi} from "../components/MyApi";

function History(){
    
    
    
    async function getAllBoards(){
        const response = await MyApi.api.boardList()
        console.log(response.data)
    }
    
    return <>
    
        <button onClick={getAllBoards}>this is a test button</button>
    
    </>
    
    
}

export default History