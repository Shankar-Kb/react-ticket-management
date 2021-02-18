import React from 'react';

export const App = () => {
    const [posts, setPosts] = React.useState([]);
    //const [text, setText] = React.useState(" ");
    //const serverURL = "http://localhost:3001";
    const serverURL = "https://json-server-react-ticket-mgmt.herokuapp.com"

    const addTicket = () => {
        let data = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        editMode: false
        }
        
        fetch(`${serverURL}/posts`, {
              method: "POST",
              headers: {"Content-Type": "application/json; charset=UTF-8"},
              body: JSON.stringify(data)
              })
              .then( resp => resp.json() )
              .then( data => setPosts(posts.concat([data])));
        document.getElementById("addTicketForm").reset();
    }

    function getTickets(){
        fetch(`${serverURL}/posts`)
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                setPosts(data); })
            .catch(error => console.log(error));
    }

    const deleteTicket = (id) => {
        fetch(`${serverURL}/posts/${id}`,
           { method: "DELETE" })
           .then( resp => resp.json() )
           .then( data => { //console.log(data);
            setPosts( prevPosts => prevPosts.filter( elem => elem.id !== id ));
           });
           console.log("Delete Function Has Executed");
    }

    const editTicket = (index) => {
        setPosts(posts.map( (ele, idx) => {
            if(idx === index) ele.editMode = true;
            return ele;
         }));
    }

    const cancelEdit = (index) => {
        setPosts(posts.map( (ele, idx) => {
           if(idx === index) ele.editMode = false;
           return ele;
        }));
    }

    const confirmEdit = (index, id) => {
        let newTitleValue = document.getElementById("inputEditTitle").value;
        let newAuthorValue = document.getElementById("inputEditAuthor").value;
        let newData = {
            title: newTitleValue,
            author: newAuthorValue,
            id: id,
            editMode: false
        }
        fetch(`${serverURL}/${id}`,
           { method: "PUT",
             body: JSON.stringify(newData),
             headers: {"Content-Type": "application/json; charset=UTF-8"}
           })
           .then( resp => resp.json() )
           .then( data => { console.log("Ticket Has Been Updated Server Side") })

        setPosts(posts.map( (ele, idx) => {
           if(idx === index) {
               ele.title = newTitleValue;
               ele.author = newAuthorValue;
               ele.editMode = false;
           }
           return ele;
        }));
    }


    React.useEffect(() => {    
        getTickets();
        }, []);

    return (
            <div className='posts'>
                <form id="addTicketForm">
                <div className="input-group">
                <span className="input-group-text">Ticket Name</span>
                <input className="form-control" id="title" type="text" defaultValue="" />
                <span className="input-group-text">Ticket Author</span>
                <input className="form-control" id="author" type="text" defaultValue="" />
                </div>
                </form>
                <button className="btn btn-secondary" id="addNewTicket" onClick={addTicket}>Add New Ticket</button>
                
                <table className="table">
                <tbody>
                <tr className="thead-dark"><th>ID</th><th>Ticket Name</th><th>Ticket Author</th><th>Edit/Delte</th></tr>
                {posts.map((data, index) => (
                    <tr key={index}>
                    {data.editMode === false ?
                    <>
                    <td>{data.id}</td><td>{data.title}</td><td>{data.author}</td>
                    <td><button className="btn btn-secondary" onClick={() => {editTicket(index)}}><i className="fas fa-edit"></i></button>
                    <button className="btn btn-secondary" onClick={() => deleteTicket(data.id)}><i className="fas fa-trash"></i></button></td>
                    </>
                    :
                    <>
                    <td>{data.id}</td>
                    <td><input className="form-control" type="text" id="inputEditTitle" defaultValue={data.title} /></td>
                    <td><input className="form-control" type="text" id="inputEditAuthor" defaultValue={data.author} /></td>
                    <td>
					<button className="btn btn-secondary" onClick={ ()=>{cancelEdit(index)} }><i className="fas fa-times"></i></button>
					<button className="btn btn-secondary" onClick={ ()=>{confirmEdit(index, data.id)} }><i className="fas fa-check"></i></button></td>
                    </>
                     }
                    </tr>
                ))}
                </tbody>
                </table>
            </div>
    );
}

// export default App;