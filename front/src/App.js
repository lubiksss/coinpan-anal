import {useEffect, useState} from "react";
import axios from "axios";

function App() {
    const [time, setTime] = useState("")
    const [concurrentNumber, setConcurrentNumber] = useState("loading...")
    const [data, setData] = useState([])
    const callApi = async () => {
        return await axios.get("http://localhost:8080/coin")
    }
    useEffect(() => {
        setInterval(async () => {
            const data = await callApi()
            setTime(data.data.time)
            setConcurrentNumber(data.data.count)
            setData(currentArray => [`${data.data.time}: ${data.data.count}`, ...currentArray]);
        }, 10000)
    }, [])
    return (
        <div>
            <h1>코인판 동시접속 인원</h1>
            <h2>{time}: {concurrentNumber}</h2>
            <br/>
            {data.map((item, index) => <li key={index}>{item}</li>)}
        </div>
    );
}

export default App

