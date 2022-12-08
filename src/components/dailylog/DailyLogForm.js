import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

export const DailyLogForm = () => {
    const [colonies, setColonies] = useState([])
    const [filteredColonies, setFiltered] = useState([])
    const [colonyLogEntries, setColonyLogEntries] = useState([])
    const [newLogEntry, updateNewLogEntry] = useState({
                colonyId: 0,
                food: false,
                water: false,
                date: ""
        })
    
    let navigate = useNavigate()
    
    const localKittyUser = localStorage.getItem("kitty_user")
    const kittyUserObject = JSON.parse(localKittyUser)

    const getAllEntries = () => {
        fetch(`http://localhost:8088/colonyLogEntries?_expand=colony`)
            .then(res => res.json())
            .then((logArray) => {
                setColonyLogEntries(logArray)
            })
    }

    useEffect(
        () => {
            getAllEntries()
        },
        []
    )

    useEffect(
        () => {
            fetch(`http://localhost:8088/colonies`)
            .then(res => res.json())
            .then((colonyArr) => setColonies(colonyArr))
        },
        []
    )

    useEffect(
        () => {
            const currentUserColonies = colonies.filter(colony => {
                return colony.userId === kittyUserObject.id
            })
            setFiltered(currentUserColonies)
        },
        [colonies]
    )

    
    const handleSaveEntry = (e) => {
        e.preventDefault()

        const entryToSendToAPI = {
            userId: kittyUserObject.id,
            colonyId: newLogEntry.colonyId,
            food: newLogEntry.food,
            water: newLogEntry.water,
            date: newLogEntry.date
        }

        return fetch(`http://localhost:8088/colonyLogEntries`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(entryToSendToAPI)
        })
        .then(res => res.json())
        .then(() => {
            {getAllEntries()}
             })
        
    }

    return (
        <form className="newCatForm">
            <h2 className="catForm_title">New Daily Log Entry</h2>
            <fieldset>
                <div className="form-group">
                <label htmlFor="colony">Colony:</label>
                    <select required autoFocus className="colonyList" onChange={
                        (evt) => {
                            const copy = { ...newLogEntry }
                            copy.colonyId = parseInt(evt.target.value)
                            updateNewLogEntry(copy)
                        }
                    }
                    ><option name="colonyList" className="form-control" value="">Colony</option>
                        {filteredColonies.map(colony => {
                                return <option
                                    name="colonyList"
                                    className="form-control"
                                    value={colony.id}
                                    key={`location--${colony.id}`}
                                >{colony.nickname}</option>
                            }
                            )
                        }
                    </select>
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="food">Received Food</label>
                    <input type="checkbox" 
                        value={newLogEntry.food}
                        onChange={
                            (evt) => {
                                const copy = {...newLogEntry}
                                copy.food = evt.target.checked
                                updateNewLogEntry(copy)
                            }
                        } />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="water">Received Water</label>
                    <input type="checkbox" 
                        value={newLogEntry.water}
                        onChange={
                            (evt) => {
                                const copy = {...newLogEntry}
                                copy.water = evt.target.checked
                                updateNewLogEntry(copy)
                            }
                        } />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="date">Entry Date:</label>
                    <input
                        required autoFocus
                        type="date"
                        className="form-control"
                        placeholder="MM/DD/YYYY"
                        defaultValue={newLogEntry.date}
                        onChange={
                            (evt) => {
                                const copy = {...newLogEntry}
                                copy.date = evt.target.value
                                updateNewLogEntry(copy)
                            }
                        } />
                </div>
            </fieldset>
            <button 
            onClick = {(clickEvent) => handleSaveEntry(clickEvent)}
            className="btn btn-primary">
                Submit Entry
            </button>
        </form>
    )
}