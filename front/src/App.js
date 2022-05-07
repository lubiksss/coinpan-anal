import {useEffect, useState} from "react";
import axios from "axios";

function App() {
    const [datas, setDatas] = useState([])
    const callApi = () => {
        axios.get("host.docker.internal:8080/coin").then(res => setDatas(res.data))
    }
    useEffect(() => {
        const interval = setInterval(() => {
            callApi()
        }, 5000);
        return () => {
            clearInterval(interval)
        }
    }, [])
    return (
        <div>
            <h1>코인판 동시접속 인원</h1>
            <hr/>
            <ul>
                {datas.slice(0, 10).map((data, index) =>
                    <li key={index}>{data.time}: {data.count}</li>
                )}
            </ul>
        </div>
    );
}

export default App

