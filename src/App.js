import React from 'react';

export const App = () => {
    const [posts, setPosts] = React.useState([]);
    //const [text, setText] = React.useState(" ");

    const addTicket = () => {
        let data = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value
        }
        
        fetch("http://localhost:3001/posts", {
              method: "POST",
              headers: {"Content-Type": "application/json; charset=UTF-8"},
              body: JSON.stringify(data)
              })
              .then( resp => resp.json() )
              .then( data => setPosts(posts.concat([data])));
    }

    function getTickets(){
        fetch("http://localhost:3001/posts")
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                setPosts(data); })
            .catch(error => console.log(error));
    }

    const deleteTicket = (id) => {
        fetch(`http://localhost:3001/posts/${id}`,
           { method: "DELETE" })
           .then( resp => resp.json() )
           .then( data => { console.log(data);
            setPosts( prevPosts => prevPosts.filter( elem => elem.id !== id));
           });
           console.log("Delete Function Has Executed");
    }

    const editTicket = (id) => {
        console.log("Ticket Has Been Edited");
    }

    React.useEffect(() => {    
        getTickets();
        }, []);

    return (
            <div className='posts'>
                <div className="new-ticket-box">
                <input id="title" type="text" defaultValue="" />
                <input id="author" type="text" defaultValue="" />
                <button className="btn btn-secondary" onClick={addTicket}>Add New Ticket</button>
                </div>
                <table className="table">
                <tbody>
                <tr className="thead-dark"><th>ID</th><th>Ticket Name</th><th>Ticket Author</th><th>Edit/Delte</th></tr>
                {posts.map((data, index) => (
                    <tr key={index}>
                    <td>{data.id}</td><td>{data.title}</td><td>{data.author}</td>
                    <td><button data-toggle="modal" data-target="#editModal" onClick={() => {editTicket(data.id)}}><i className="fas fa-edit"></i></button>
                    <button onClick={() => deleteTicket(data.id)}><i className="fas fa-trash"></i></button></td>
                   </tr>
                ))}
                </tbody>
                </table>
                  <div className="modal fade" id="editModal" tabIndex="-1">
                      <div class="modal-header">
                          <input id="editTitle" type="text" defaultValue="" />
                          <input id="editAuthor" type="text" defaultValue="" />
                      </div>
      
                      <div class="modal-footer">
                          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                          <button type="button" className="btn btn-primary">Save changes</button>
                      </div>
                  </div>
            </div>
    );
}

// export default App;