import React, { Component } from 'react';

const url = 'http://localhost:8080/api/1.0/todos/';

class GetAll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
        };

        this.get = this.get.bind(this)
    }

    get() {
        let currentComponent = this;
        fetch(url, {
            method: "GET",
            mode: "cors",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            if (data.status !== 200) {
                console.log("status:" + data.status);
                console.log("message:" + data.message);
            } else {
                console.log("Request successfull!");
                currentComponent.setState({todos: [
                    ...data.data
                ]});
            }
        })
    }

    render() {
      return (
          <div>
            <button type="button" onClick={this.get}>Get</button>
            {this.state.todos.length > 0 &&
                <table className="table">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Completed</th>
                    </tr>
                    {this.state.todos.map((todo, i) => {
                        return (
                            <tr key={i}>
                                <td>{todo.id}</td>
                                <td>{todo.title}</td>
                                <td>{todo.completed.toString()}</td>
                            </tr>
                        );
                    })}
                </table>
            }
          </div>
      );
    }
}


export default GetAll;